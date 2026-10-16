import React from '../reactRuntime.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, FileCheck2, FileText, Plus, Printer, Search, X } from 'lucide-react';
import { registerPatient, searchPatients } from '../api/patientApi.js';
import { createReport, downloadReportPdf } from '../api/reportApi.js';
import { getTestConfiguration, searchTests } from '../api/testApi.js';
import { apiConfig } from '../api/apiRoutes.js';
import ReportDocument from '../components/ReportDocument.jsx';
import { Badge, Button, Card, EmptyState, Field, InlineNotice, LoadingLine, PageHeader, SelectInput, TextInput } from '../components/UI.jsx';
import { savePdfBlob } from '../components/download.js';

function localDateTimeValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AddTest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patientMode, setPatientMode] = useState('existing');
  const [patientQuery, setPatientQuery] = useState('');
  const [patientMatches, setPatientMatches] = useState([]);
  const [patientLoading, setPatientLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDraft, setPatientDraft] = useState({ name: '', age: '', gender: '', mobile: '', registeredAt: localDateTimeValue() });
  const [patientDraftChanged, setPatientDraftChanged] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testQuery, setTestQuery] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [loadingTestId, setLoadingTestId] = useState('');
  const [activeTestId, setActiveTestId] = useState('');
  const [resultValues, setResultValues] = useState({});
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedReport, setSavedReport] = useState(null);
  const [savedPatient, setSavedPatient] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [createdPatient, setCreatedPatient] = useState(null);
  const savingGuard = useRef(false);

  useEffect(() => {
    let current = true;
    setPatientLoading(true);
    searchPatients(patientQuery).then((items) => { if (current) setPatientMatches(items.slice(0, 6)); }).catch((error) => { if (current) setRequestError(error.message); }).finally(() => { if (current) setPatientLoading(false); });
    return () => { current = false; };
  }, [patientQuery]);

  useEffect(() => {
    let current = true;
    setTestsLoading(true);
    searchTests(testQuery).then((items) => { if (current) setAvailableTests(items); }).catch((error) => { if (current) setRequestError(error.message); }).finally(() => { if (current) setTestsLoading(false); });
    return () => { current = false; };
  }, [testQuery]);

  const activeTest = selectedTests.find((test) => test.id === activeTestId) || selectedTests[0];
  const patientForm = patientMode === 'existing' && selectedPatient ? selectedPatient : patientDraft;
  const isDirty = !savedReport && (patientDraftChanged || selectedTests.length > 0 || Object.values(resultValues).some((testResults) => Object.values(testResults).some((value) => String(value).trim() !== '')));

  useEffect(() => {
    if (!isDirty) return undefined;
    const message = 'Leave this report? Your unsaved changes will be discarded.';
    const warnBeforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
    const guardInternalLink = (event) => {
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest('a[href], button[aria-label="Log out"]');
      if (!target) return;
      if (target.matches('button[aria-label="Log out"]')) {
        if (!window.confirm(message)) { event.preventDefault(); event.stopPropagation(); }
        return;
      }
      const destination = new URL(target.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      if (!window.confirm(message)) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    document.addEventListener('click', guardInternalLink, true);
    return () => {
      window.removeEventListener('beforeunload', warnBeforeUnload);
      document.removeEventListener('click', guardInternalLink, true);
    };
  }, [isDirty]);

  function navigateAway(path) {
    if (!isDirty || window.confirm('Leave this report? Your unsaved changes will be discarded.')) navigate(path);
  }
  const previewReport = useMemo(() => ({
    id: savedReport?.id || 'PREVIEW', patientId: selectedPatient?.id || createdPatient?.id || 'Assigned by gateway on save',
    reportDate: new Date().toISOString(), status: 'Draft preview', createdBy: user?.name || 'Laboratory',
    tests: selectedTests.map((test) => ({ ...test, testId: test.id, testName: test.name, results: test.parameters.map((parameter) => ({ ...parameter, value: resultValues[test.id]?.[parameter.id] ?? '' })) })),
  }), [savedReport, selectedPatient, createdPatient, selectedTests, resultValues, user]);

  function updatePatientField(field, value) {
    setPatientDraft((current) => ({ ...current, [field]: value }));
    setPatientDraftChanged(true);
    setErrors((current) => ({ ...current, [`patient.${field}`]: '' }));
  }

  function chooseMode(mode) {
    if (mode === patientMode) return;
    if (isDirty && !window.confirm('Change patient selection? Unsaved report changes will be kept on this screen, but the patient context may change.')) return;
    setPatientMode(mode);
    setErrors({});
    setRequestError('');
    setSelectedPatient(null);
    setCreatedPatient(null);
    if (mode === 'new') {
      setPatientDraft({ name: '', age: '', gender: '', mobile: '', registeredAt: localDateTimeValue() });
      setPatientDraftChanged(false);
    }
  }

  function selectPatient(patient) {
    if (patientDraftChanged && !window.confirm('Replace the unsaved patient details with this saved patient record?')) return;
    setSelectedPatient(patient);
    setPatientDraft({ ...patient });
    setPatientDraftChanged(false);
    setPatientQuery(`${patient.name} · ${patient.id}`);
    setErrors((current) => ({ ...current, patient: '' }));
  }

  async function addTest(test) {
    setRequestError('');
    if (selectedTests.some((item) => item.id === test.id)) return;
    setLoadingTestId(test.id);
    try {
      const configuredTest = await getTestConfiguration(test);
      if (!configuredTest.parameters.length) throw new Error(`No parameters are configured for ${test.name}.`);
      setSelectedTests((current) => current.some((item) => item.id === configuredTest.id) ? current : [...current, configuredTest]);
      setActiveTestId(configuredTest.id);
      setResultValues((current) => ({ ...current, [configuredTest.id]: current[configuredTest.id] || {} }));
    } catch (error) {
      setRequestError(error.message || `Could not load parameters for ${test.name}.`);
    } finally { setLoadingTestId(''); }
  }

  function removeTest(testId) {
    const remaining = selectedTests.filter((item) => item.id !== testId);
    setSelectedTests(remaining);
    if (activeTestId === testId) setActiveTestId(remaining[0]?.id || '');
  }

  function setResult(testId, parameterId, value) {
    setResultValues((current) => ({ ...current, [testId]: { ...(current[testId] || {}), [parameterId]: value } }));
    setErrors((current) => ({ ...current, [`result.${testId}.${parameterId}`]: '' }));
  }

  function validate() {
    const next = {};
    const person = patientMode === 'existing' ? selectedPatient : patientDraft;
    if (patientMode === 'existing' && !selectedPatient) next.patient = 'Choose a patient from the search results.';
    if (patientMode === 'new') {
      if (!person.name?.trim()) next['patient.name'] = 'Patient name is required.';
      if (person.age === '' || !Number.isFinite(Number(person.age)) || Number(person.age) < 0 || Number(person.age) > 120) next['patient.age'] = 'Enter an age from 0 to 120.';
      if (!person.gender) next['patient.gender'] = 'Select a gender.';
      if (person.mobile && !/^\d{10}$/.test(person.mobile)) next['patient.mobile'] = 'Enter a 10-digit mobile number.';
      if (!person.registeredAt || Number.isNaN(new Date(person.registeredAt).getTime())) next['patient.registeredAt'] = 'Enter a valid registration date and time.';
    }
    if (!selectedTests.length) next.tests = 'Select at least one test.';
    selectedTests.forEach((test) => test.parameters.forEach((parameter) => {
      const value = resultValues[test.id]?.[parameter.id] ?? '';
      if (String(value).trim() === '') next[`result.${test.id}.${parameter.id}`] = 'A result is required.';
      else if (parameter.type === 'numeric' && !Number.isFinite(Number(value))) next[`result.${test.id}.${parameter.id}`] = 'Enter a numeric result.';
    }));
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function saveReport() {
    if (savingGuard.current || !validate()) return false;
    savingGuard.current = true;
    setSaving(true);
    setRequestError('');
    try {
      let patient = patientMode === 'existing' ? selectedPatient : (createdPatient || null);
      if (patientMode === 'new' && !patient) {
        patient = await registerPatient({ ...patientDraft, age: Number(patientDraft.age), registeredAt: new Date(patientDraft.registeredAt).toISOString() });
        setCreatedPatient(patient);
        setPatientDraft((current) => ({ ...current, id: patient.id }));
        setPatientDraftChanged(false);
      }
      const payload = {
        patientId: patient.id,
        tests: selectedTests.map((test) => ({ testId: test.id, testName: test.name, category: test.category, sample: test.sample, results: test.parameters.map((parameter) => ({ ...parameter, value: resultValues[test.id]?.[parameter.id] ?? '' })) })),
      };
      const saved = await createReport(payload);
      setSavedPatient(patient);
      setSavedReport(saved);
      setPreviewOpen(false);
      return true;
    } catch (error) {
      setRequestError(error.message || 'The report could not be saved. Your entries are still here.');
      return false;
    } finally {
      savingGuard.current = false;
      setSaving(false);
    }
  }

  async function handlePdf(reportId) {
    setPdfLoading(true);
    setRequestError('');
    try {
      const blob = await downloadReportPdf(reportId);
      await savePdfBlob(blob, `${reportId}.pdf`);
    } catch (error) {
      setRequestError(error.message || 'PDF retrieval failed. Please try again.');
    } finally { setPdfLoading(false); }
  }

  const currentPatient = savedPatient || selectedPatient || createdPatient;

  return (
    <div className="workflow-page">
      <PageHeader eyebrow="WORKSPACE  /  NEW REPORT" title={savedReport ? 'Report saved' : 'Create a report'} description={savedReport ? (apiConfig.mockMode ? 'The report is saved to this demo workspace.' : 'The report was saved by the laboratory gateway.') : 'Register a patient, select assays, and capture results in one record.'} back={{ label: 'Patients & reports', onClick: () => navigateAway('/reports') }} />
      {savedReport ? <Card className="save-confirm-card"><span className="success-orb"><CheckCircle2 size={25} /></span><span className="eyebrow">SAVE CONFIRMED</span><h2>Report ready for review</h2><p><strong>{savedPatient?.name}</strong><span className="mono"> · {savedPatient?.id}</span></p><div className="save-confirm-id"><span>REPORT ID</span><strong className="mono">{savedReport.id}</strong><Badge tone="green" dot>Saved</Badge></div><div className="save-confirm-actions"><Button onClick={() => navigate(`/reports/${savedReport.id}`)} icon={FileText}>Open report</Button><Button variant="secondary" disabled={pdfLoading} onClick={() => handlePdf(savedReport.id)} icon={Download}>{pdfLoading ? 'Preparing PDF…' : 'Download PDF'}</Button><Button variant="ghost" onClick={() => navigate('/reports')}>Back to patients</Button></div></Card> : <>
        <div className="workflow-steps"><div className="workflow-step workflow-step-active"><span>01</span><div><strong>Patient</strong><small>Identify the record</small></div></div><span className="step-line" /><div className={`workflow-step ${selectedTests.length ? 'workflow-step-active' : ''}`}><span>02</span><div><strong>Assays & results</strong><small>Capture test values</small></div></div><span className="step-line" /><div className={`workflow-step ${previewOpen ? 'workflow-step-active' : ''}`}><span>03</span><div><strong>Review</strong><small>Preview and save</small></div></div></div>
        {requestError && <InlineNotice tone="error" onDismiss={() => setRequestError('')}>{requestError}</InlineNotice>}
        <div className="addtest-layout">
          <div className="addtest-main">
            <Card className="workflow-card patient-card"><div className="workflow-card-heading"><div><span className="section-index">01</span><div><h2>Patient details</h2><p>Confirm who this report belongs to.</p></div></div><Badge tone={patientMode === 'existing' && selectedPatient ? 'green' : 'neutral'} dot>{patientMode === 'existing' && selectedPatient ? 'Patient selected' : 'Required'}</Badge></div>
              <div className="choice-tabs" role="tablist" aria-label="Patient type"><button type="button" className={patientMode === 'existing' ? 'choice-tab active' : 'choice-tab'} onClick={() => chooseMode('existing')} role="tab" aria-selected={patientMode === 'existing'}>Existing patient</button><button type="button" className={patientMode === 'new' ? 'choice-tab active' : 'choice-tab'} onClick={() => chooseMode('new')} role="tab" aria-selected={patientMode === 'new'}>New patient <span className="choice-plus">+</span></button></div>
              {patientMode === 'existing' && <div className="existing-search"><Field label="Find patient" id="patient-search" hint="Search by patient code, name, or mobile number." error={errors.patient}><TextInput id="patient-search" icon={Search} placeholder="e.g. PT-240031 or Amara Okafor" value={patientQuery} onChange={(event) => { setPatientQuery(event.target.value); setSelectedPatient(null); }} autoComplete="off" /></Field>{patientQuery && !selectedPatient && <div className="patient-match-list">{patientLoading ? <LoadingLine label="Searching patient records…" /> : patientMatches.length ? patientMatches.map((patient) => <button type="button" className="patient-match" key={patient.id} onClick={() => selectPatient(patient)}><span className="match-avatar">{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{patient.name}</strong><small><span className="mono">{patient.id}</span> <i>·</i> {patient.age} yrs <i>·</i> {patient.gender}</small></span><ArrowRight size={15} /></button>) : <div className="match-empty">No patient matches. Try a code, full name, or phone number.</div>}</div>}{selectedPatient && <div className="selected-patient-note"><Check size={15} /><span><strong>{selectedPatient.name}</strong> selected — saved details are loaded below.</span><button className="text-button" type="button" onClick={() => { setSelectedPatient(null); setPatientQuery(''); }}>Change</button></div>}</div>}
              {patientMode === 'new' && <div className="generated-id-note"><span className="id-spark">ID</span><span><strong>Patient code assigned on registration</strong><small>The gateway generates a patient code after the record is saved.</small></span></div>}
              {(patientMode === 'new' || selectedPatient) && <div className="form-grid patient-fields"><Field label="Patient name" id="patient-name" required={patientMode === 'new'} error={errors['patient.name']}><TextInput id="patient-name" value={patientForm.name || ''} disabled={patientMode === 'existing'} placeholder="Full name" onChange={(event) => updatePatientField('name', event.target.value)} /></Field><Field label="Age" id="patient-age" required={patientMode === 'new'} error={errors['patient.age']}><TextInput id="patient-age" type="number" min="0" max="120" value={patientForm.age ?? ''} disabled={patientMode === 'existing'} placeholder="Years" onChange={(event) => updatePatientField('age', event.target.value)} /></Field><Field label="Gender" id="patient-gender" required={patientMode === 'new'} error={errors['patient.gender']}><SelectInput id="patient-gender" value={patientForm.gender || ''} disabled={patientMode === 'existing'} onChange={(event) => updatePatientField('gender', event.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></SelectInput></Field><Field label="Mobile number" id="patient-mobile" hint="Optional · 10 digits if entered" error={errors['patient.mobile']}><TextInput id="patient-mobile" inputMode="numeric" maxLength="10" value={patientForm.mobile || ''} disabled={patientMode === 'existing'} placeholder="10-digit number" onChange={(event) => updatePatientField('mobile', event.target.value.replace(/\D/g, ''))} /></Field><Field label="Registration date & time" id="patient-registered" error={errors['patient.registeredAt']}><TextInput id="patient-registered" type="datetime-local" value={patientMode === 'new' ? patientDraft.registeredAt : localDateTimeValue(new Date(selectedPatient.registeredAt))} disabled={patientMode === 'existing'} onChange={(event) => updatePatientField('registeredAt', event.target.value)} /></Field></div>}
            </Card>

            <Card className="workflow-card test-card"><div className="workflow-card-heading"><div><span className="section-index">02</span><div><h2>Choose tests</h2><p>Search the configured catalogue and add one or more assays.</p></div></div><Badge tone={selectedTests.length ? 'teal' : 'neutral'}>{selectedTests.length} selected</Badge></div>
              <div className="assay-search"><Field label="Search available tests" id="test-search"><TextInput id="test-search" icon={Search} placeholder="Test name or ID" value={testQuery} onChange={(event) => setTestQuery(event.target.value)} /></Field></div>
              <div className="assay-picker">{testsLoading ? <LoadingLine label="Loading tests from the catalogue…" /> : availableTests.filter((test) => !selectedTests.some((selected) => selected.id === test.id)).length ? availableTests.filter((test) => !selectedTests.some((selected) => selected.id === test.id)).map((test) => <button key={test.id} type="button" className="assay-option" disabled={loadingTestId === test.id} onClick={() => addTest(test)}><span className="assay-icon"><FileCheck2 size={17} /></span><span className="assay-option-copy"><strong>{test.name}</strong><small><span className="mono">{test.id}</span><i>·</i>{test.category}<i>·</i>{Array.isArray(test.parameters) && test.parameters.length ? `${test.parameters.length} parameters` : 'Parameters load on selection'}</small></span><span className="assay-turnaround">{loadingTestId === test.id ? 'Loading…' : test.turnaround || 'Configured'}</span><span className="assay-add"><Plus size={16} /></span></button>) : <div className="match-empty">{availableTests.length ? 'All matching tests are already selected.' : 'No tests match this search.'}</div>}</div>
              {errors.tests && <span className="field-message error-message"><X size={13} />{errors.tests}</span>}
              {selectedTests.length > 0 && <div className="selected-assays"><div className="selected-assays-head"><span>SELECTED ASSAYS</span><span className="mono">{selectedTests.length.toString().padStart(2, '0')}</span></div><div className="assay-tabs" role="tablist" aria-label="Selected test results">{selectedTests.map((test) => <div className={`assay-tab ${activeTestId === test.id ? 'assay-tab-active' : ''}`} key={test.id}><button type="button" role="tab" aria-selected={activeTestId === test.id} onClick={() => setActiveTestId(test.id)}><span className="assay-tab-dot" />{test.name}</button><button className="assay-remove" type="button" aria-label={`Remove ${test.name}`} onClick={() => removeTest(test.id)}><X size={13} /></button></div>)}</div>
                {activeTest && <div className="results-entry"><div className="results-entry-head"><div><span className="eyebrow mono">{activeTest.id} · {activeTest.category}</span><h3>{activeTest.name}</h3><p>{activeTest.sample} <i>·</i> {activeTest.turnaround}</p></div><Badge tone="teal">{activeTest.parameters.length} parameters</Badge></div><div className="parameter-table"><div className="parameter-row parameter-head"><span>Parameter</span><span>Result</span><span>Unit</span><span>Reference</span></div>{activeTest.parameters.map((parameter) => { const value = resultValues[activeTest.id]?.[parameter.id] ?? ''; const fieldError = errors[`result.${activeTest.id}.${parameter.id}`]; return <div className={`parameter-row ${fieldError ? 'parameter-row-error' : ''}`} key={parameter.id}><div className="parameter-label"><strong>{parameter.name}</strong>{parameter.interpretation && <small>{parameter.interpretation}</small>}{fieldError && <span className="inline-field-error">{fieldError}</span>}</div><div className="parameter-input">{parameter.type === 'qualitative' ? <SelectInput aria-label={`${parameter.name} result`} value={value} onChange={(event) => setResult(activeTest.id, parameter.id, event.target.value)}><option value="">Select result</option>{(parameter.options || []).map((option) => <option key={option}>{option}</option>)}</SelectInput> : <input aria-label={`${parameter.name} result`} className="input result-input" inputMode="decimal" value={value} placeholder="Enter value" onChange={(event) => setResult(activeTest.id, parameter.id, event.target.value)} />}</div><span className="parameter-unit">{parameter.unit || '—'}</span><span className="parameter-range">{parameter.type === 'numeric' ? `${parameter.min ?? '—'} – ${parameter.max ?? '—'}` : (parameter.options || []).slice(0, 2).join(' / ')}</span></div>; })}</div><div className="range-snapshot-note"><ActivityIcon /><span>Reference ranges are saved as a snapshot with this report.</span></div></div>}
              </div>}
            </Card>
            <div className="form-actions"><Button variant="ghost" onClick={() => navigateAway('/reports')}><ArrowLeft size={15} /> Cancel</Button><span className="form-action-note">Your entries stay on this screen if saving fails.</span><Button variant="secondary" disabled={!selectedTests.length} onClick={() => { if (validate()) setPreviewOpen(true); }} icon={FileText}>Preview report</Button><Button disabled={saving} onClick={saveReport}>{saving ? 'Saving report…' : 'Save report'}{!saving && <ArrowRight size={16} />}</Button></div>
          </div>
          <aside className="addtest-aside"><Card className="aside-summary"><div className="aside-summary-head"><span className="aside-summary-icon"><FileText size={16} /></span><div><strong>Report summary</strong><small>Live as you work</small></div></div><div className="summary-divider" /><div className="summary-row"><span>Patient</span><strong>{currentPatient?.name || (patientMode === 'new' ? patientDraft.name || 'New patient' : 'Not selected')}</strong></div><div className="summary-row"><span>Patient code</span><strong className="mono">{currentPatient?.id || 'Assigned on save'}</strong></div><div className="summary-row"><span>Tests selected</span><strong>{selectedTests.length.toString().padStart(2, '0')}</strong></div><div className="summary-assay-list">{selectedTests.length ? selectedTests.map((test) => <span key={test.id}><i />{test.name}</span>) : <span className="summary-empty">Assays will appear here</span>}</div><div className="summary-callout"><span><CheckCircle2 size={15} /></span><p>Each report preserves the exact reference ranges used at entry.</p></div></Card><Card className="aside-help"><span className="eyebrow">WORKFLOW NOTE</span><h3>Keep the record together.</h3><p>Patient details, assay values, and reference snapshots travel as one report.</p><span className="aside-step">CLEARLINE <i>·</i> 01</span></Card></aside>
        </div>
      </>}
      {previewOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false); }}><section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title"><header className="preview-modal-head"><div><span className="eyebrow">UNSAVED REPORT</span><h2 id="preview-title">Review before saving</h2></div><button className="icon-button" aria-label="Close preview" onClick={() => setPreviewOpen(false)}><X size={18} /></button></header><div className="preview-demo-note"><span className="demo-beacon" />Preview only — this report has not been saved yet.</div><div className="preview-document-wrap"><ReportDocument report={previewReport} patient={{ ...(patientMode === 'existing' ? selectedPatient : patientDraft), id: selectedPatient?.id || createdPatient?.id || 'Assigned on save' }} /></div><footer className="preview-modal-actions"><Button variant="ghost" onClick={() => setPreviewOpen(false)}>Continue editing</Button><span /><Button variant="secondary" onClick={() => window.print()} icon={Printer}>Print preview</Button><Button disabled={saving} onClick={saveReport}>{saving ? 'Saving…' : 'Save report'}<ArrowRight size={15} /></Button></footer></section></div>}
    </div>
  );
}

function ActivityIcon() { return <span className="range-note-icon"><CheckCircle2 size={14} /></span>; }
