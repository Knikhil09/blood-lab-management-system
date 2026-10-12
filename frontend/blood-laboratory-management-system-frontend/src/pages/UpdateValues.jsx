import React from '../reactRuntime.js';
import { useEffect, useState } from 'react';
import { Activity, Check, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { searchTests, updateTestParameters } from '../api/testApi.js';
import { Badge, Button, Card, EmptyState, Field, InlineNotice, LoadingLine, PageHeader, SelectInput, TextInput } from '../components/UI.jsx';

export default function UpdateValues() {
  const [query, setQuery] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [draft, setDraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    let current = true;
    setLoading(true);
    searchTests(query).then((items) => { if (current) setTests(items); }).catch((reason) => { if (current) setError(reason.message || 'Unable to load tests.'); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [query]);

  function select(test) {
    setSelectedTest(test);
    setDraft(test.parameters.map((parameter) => ({ ...parameter })));
    setError(''); setSuccess('');
  }

  function updateField(parameterId, field, value) {
    setDraft((current) => current.map((parameter) => parameter.id !== parameterId ? parameter : ({ ...parameter, [field]: value })));
    setError(''); setSuccess('');
  }

  async function save() {
    if (!selectedTest || saving) return;
    for (const parameter of draft) {
      if (parameter.type === 'numeric') {
        const min = parameter.min === '' || parameter.min == null ? null : Number(parameter.min);
        const max = parameter.max === '' || parameter.max == null ? null : Number(parameter.max);
        if ((min != null && !Number.isFinite(min)) || (max != null && !Number.isFinite(max))) { setError(`${parameter.name}: limits must be valid numbers.`); return; }
        if (min != null && max != null && min > max) { setError(`${parameter.name}: the lower reference limit cannot exceed the upper limit.`); return; }
      } else if (!parameter.options?.length || parameter.options.some((value) => !String(value).trim())) {
        setError(`${parameter.name}: add at least one qualitative reference choice.`); return;
      }
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const saved = await updateTestParameters(selectedTest.id, draft);
      setSelectedTest(saved);
      setDraft(saved.parameters.map((parameter) => ({ ...parameter })));
      setTests((current) => current.map((test) => test.id === saved.id ? saved : test));
      setSuccess('Reference values saved. Existing reports keep their saved snapshots.');
    } catch (reason) { setError(reason.message || 'Changes could not be saved. Your edits are still here.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="values-page">
      <PageHeader eyebrow="LABORATORY  /  CONFIGURATION" title="Reference values" description="Manage assay parameters and the ranges applied to new reports." />
      {error && <InlineNotice tone="error" onDismiss={() => setError('')}>{error}</InlineNotice>}{success && <InlineNotice tone="success" onDismiss={() => setSuccess('')}>{success}</InlineNotice>}
      <div className="values-notice"><span className="values-notice-icon"><Activity size={16} /></span><p><strong>Historical reports stay as saved.</strong> Updating a reference value here applies to future reports; an existing report keeps its original reference-range snapshot.</p><span className="eyebrow mono">SNAPSHOT / ON</span></div>
      <div className="values-layout"><Card className="test-catalog-card"><div className="catalog-head"><span className="catalog-icon"><SlidersHorizontal size={17} /></span><div><h2>Test catalogue</h2><p>Choose a test to manage its parameters.</p></div></div><div className="catalog-search"><TextInput id="test-catalog-search" icon={Search} aria-label="Search tests by ID or name" placeholder="Search by test ID or name" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="catalog-list">{loading ? <LoadingLine label="Loading test catalogue…" /> : tests.length ? tests.map((test) => <button type="button" className={`catalog-test ${selectedTest?.id === test.id ? 'catalog-test-active' : ''}`} key={test.id} onClick={() => select(test)}><span className="catalog-test-mark"><Activity size={15} /></span><span className="catalog-test-copy"><strong>{test.name}</strong><small><span className="mono">{test.id}</span><i>·</i>{test.category}</small></span><ChevronRight size={15} /></button>) : <EmptyState icon={Search} title="No tests match" description="Try a different test name or ID." />}</div><div className="catalog-foot"><span>{tests.length} configured tests</span><span className="catalog-dot" /></div></Card>
        <Card className="parameter-config-card">{selectedTest ? <><div className="parameter-config-head"><div><span className="eyebrow mono">{selectedTest.id}  /  {selectedTest.category}</span><h2>{selectedTest.name}</h2><p>{selectedTest.parameters.length} configured {selectedTest.parameters.length === 1 ? 'parameter' : 'parameters'}</p></div><Badge tone="teal" dot>Selected test</Badge></div><div className="parameter-config-help"><span>Changes apply to new reports only.</span><span className="mono">REFERENCE SET / ACTIVE</span></div><div className="config-parameters">{draft.map((parameter, index) => <section className="config-parameter" key={parameter.id}><div className="config-parameter-title"><span className="parameter-ordinal">{String(index + 1).padStart(2, '0')}</span><div><h3>{parameter.name}</h3><span className="mono">{parameter.unit || 'NO UNIT'} <i>·</i> {parameter.type === 'numeric' ? 'NUMERIC' : 'QUALITATIVE'}</span></div><Badge tone={parameter.type === 'numeric' ? 'neutral' : 'ochre'}>{parameter.type === 'numeric' ? 'Numeric' : 'Qualitative'}</Badge></div>{parameter.type === 'numeric' ? <div className="numeric-limits"><Field label="Lower reference limit" id={`${parameter.id}-min`} hint="Optional if no lower limit applies."><TextInput id={`${parameter.id}-min`} type="number" step="any" value={parameter.min ?? ''} placeholder="Not set" onChange={(event) => updateField(parameter.id, 'min', event.target.value)} /></Field><span className="range-divider">to</span><Field label="Upper reference limit" id={`${parameter.id}-max`} hint="Optional if no upper limit applies."><TextInput id={`${parameter.id}-max`} type="number" step="any" value={parameter.max ?? ''} placeholder="Not set" onChange={(event) => updateField(parameter.id, 'max', event.target.value)} /></Field></div> : <Field label="Qualitative reference choices" id={`${parameter.id}-options`} hint="Choose the result options shown during entry."><div className="qualitative-options">{(parameter.options || []).map((option, optionIndex) => <span className="qual-option" key={`${option}-${optionIndex}`}>{option}<button type="button" aria-label={`Remove ${option}`} onClick={() => updateField(parameter.id, 'options', parameter.options.filter((_, indexValue) => indexValue !== optionIndex))}>×</button></span>)}<div className="qual-option-add"><input aria-label={`Add ${parameter.name} option`} placeholder="Add option…" onKeyDown={(event) => { if (event.key === 'Enter' && event.currentTarget.value.trim()) { event.preventDefault(); updateField(parameter.id, 'options', [...(parameter.options || []), event.currentTarget.value.trim()]); event.currentTarget.value = ''; } }} /><span>Enter</span></div></div></Field>}</section>)}</div><div className="config-save-bar"><span><Check size={14} /> Changes need an explicit save.</span><Button disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save reference values'}</Button></div></> : <div className="config-empty"><span className="config-empty-icon"><SlidersHorizontal size={19} /></span><span className="eyebrow">TEST CONFIGURATION</span><h2>Select a test</h2><p>Choose a test from the catalogue to view and edit configured parameters.</p></div>}</Card></div>
      <div className="values-footer-note"><span>Backend authorization controls who can change laboratory configuration.</span><span className="mono">CHANGES ARE AUDITABLE BY THE SERVICE</span></div>
    </div>
  );
}
