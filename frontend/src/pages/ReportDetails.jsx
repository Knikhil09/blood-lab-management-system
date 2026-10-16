import React from '../reactRuntime.js';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Download, FilePenLine, Printer, Save, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPatient } from '../api/patientApi.js';
import { downloadReportPdf, getReport, updateReport } from '../api/reportApi.js';
import { Badge, Button, Card, InlineNotice, LoadingLine, PageHeader, SelectInput } from '../components/UI.jsx';
import ReportDocument, { formatDateTime } from '../components/ReportDocument.jsx';
import { savePdfBlob } from '../components/download.js';

export default function ReportDetails() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [draftTests, setDraftTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setLoading(true); setError(''); setSuccess('');
    try {
      const detail = await getReport(reportId);
      setReport(detail);
      setDraftTests(detail.tests.map((test) => ({ ...test, results: test.results.map((result) => ({ ...result })) })));
      const person = detail.patient || await getPatient(detail.patientId);
      setPatient(person);
    } catch (reason) { setError(reason.message || 'Could not load this report.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [reportId]);

  function changeResult(testIndex, resultIndex, value) {
    setDraftTests((current) => current.map((test, index) => index !== testIndex ? test : ({ ...test, results: test.results.map((result, itemIndex) => itemIndex === resultIndex ? { ...result, value } : result) })));
  }

  async function saveChanges() {
    if (!report || saving) return;
    for (const test of draftTests) for (const result of test.results) {
      if (String(result.value ?? '').trim() === '') { setError(`${result.name} is required.`); return; }
      if (result.type === 'numeric' && !Number.isFinite(Number(result.value))) { setError(`${result.name} must be numeric.`); return; }
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const saved = await updateReport(report.id, { patientId: report.patientId, tests: draftTests });
      setReport({ ...saved, patient });
      setDraftTests(saved.tests.map((test) => ({ ...test, results: test.results.map((result) => ({ ...result })) })));
      setEditing(false);
      setSuccess('Report changes were saved.');
    } catch (reason) { setError(reason.message || 'The report could not be updated. Your edits are still here.'); }
    finally { setSaving(false); }
  }

  async function handleDownload() {
    if (!report || downloading) return;
    setDownloading(true); setError('');
    try { const blob = await downloadReportPdf(report.id); await savePdfBlob(blob, `${report.id}.pdf`); }
    catch (reason) { setError(reason.message || 'PDF retrieval failed. Please try again.'); }
    finally { setDownloading(false); }
  }

  const displayedReport = editing ? { ...report, tests: draftTests } : report;
  return (
    <div className="report-detail-page">
      <PageHeader eyebrow="REPORT RECORD  /  DETAILS" title={loading ? 'Report details' : 'Laboratory report'} description={report ? `${report.id} · ${formatDateTime(report.reportDate)}` : 'Review saved patient results and reference ranges.'} back={{ label: patient?.name ? 'Patient history' : 'All patients', onClick: () => navigate(patient ? `/patients/${patient.id}/reports` : '/reports') }} action={!loading && report && <div className="report-action-bar">{editing ? <><Button variant="ghost" onClick={() => { setDraftTests(report.tests); setEditing(false); setError(''); }}><X size={15} /> Cancel edit</Button><Button disabled={saving} onClick={saveChanges} icon={Save}>{saving ? 'Saving…' : 'Save changes'}</Button></> : <><Button variant="secondary" onClick={() => window.print()} icon={Printer}>Print</Button><Button variant="secondary" disabled={downloading} onClick={handleDownload} icon={Download}>{downloading ? 'Preparing PDF…' : 'Download PDF'}</Button><Button onClick={() => { setDraftTests(report.tests.map((test) => ({ ...test, results: test.results.map((result) => ({ ...result })) }))); setEditing(true); setSuccess(''); }} icon={FilePenLine}>Edit report</Button></>}</div>} />
      {error && <InlineNotice tone="error" onDismiss={() => setError('')}>{error}</InlineNotice>}{success && <InlineNotice tone="success" onDismiss={() => setSuccess('')}>{success}</InlineNotice>}
      {loading ? <Card className="report-loading-card"><LoadingLine label="Loading saved report…" /></Card> : !report ? <Card className="report-notfound"><span className="eyebrow">RECORD UNAVAILABLE</span><h2>This report could not be opened.</h2><p>It may have been removed or the identifier may be incorrect.</p><Link to="/reports"><Button variant="secondary"><ArrowLeft size={15} />Back to patients</Button></Link></Card> : <>
        <Card className="report-context-card"><span className="report-context-icon"><FilePenLine size={18} /></span><div className="report-context-main"><span className="eyebrow">PATIENT CONTEXT</span><strong>{patient?.name || 'Patient'}</strong><span className="mono">{patient?.id || report.patientId} <i>·</i> {patient?.age ?? '—'} yrs <i>·</i> {patient?.gender || '—'}</span></div><div className="report-context-divider" /><div className="report-context-info"><span>Report ID</span><strong className="mono">{report.id}</strong></div><div className="report-context-info"><span>Saved</span><strong>{formatDateTime(report.reportDate)}</strong></div><Badge tone={report.status === 'Verified' ? 'green' : 'amber'} dot>{report.status || 'Saved'}</Badge><Link className="context-open" to={`/patients/${report.patientId}/reports`}>Patient history <ArrowLeft size={13} /></Link></Card>
        {editing && <div className="edit-notice"><span><FilePenLine size={15} />Editing <strong>{patient?.name}</strong> · <span className="mono">{report.id}</span></span><span>Stored reference ranges remain unchanged.</span></div>}
        <Card className="report-document-card"><div className="report-document-toolbar"><div><span className="eyebrow">{editing ? 'EDIT MODE' : 'SAVED SNAPSHOT'}</span><p>{editing ? 'Update permitted result values, then save changes.' : 'Reference intervals below are the values saved with this report.'}</p></div>{!editing && <Badge tone="green" dot>{report.tests.length} {report.tests.length === 1 ? 'test' : 'tests'}</Badge>}</div>
          {editing ? <EditableReport tests={draftTests} onChange={changeResult} /> : <ReportDocument report={report} patient={patient} />}
        </Card>
        <div className="report-detail-footer"><Link to={`/patients/${report.patientId}/reports`}><ArrowLeft size={14} /> Back to patient history</Link><span>Record <strong className="mono">{report.id}</strong> <i>·</i> Saved ranges are immutable snapshots</span></div>
      </>}
    </div>
  );
}

function EditableReport({ tests, onChange }) {
  return <article className="report-document edit-report-document"><div className="report-paper-head"><div><span className="eyebrow">CLEARLINE LAB · DIAGNOSTICS</span><h2>Laboratory report</h2><p>Result editing · Reference snapshots remain fixed</p></div><div className="report-paper-meta"><span>REPORT NUMBER</span><strong className="mono">Editing</strong></div></div>{tests.map((test, testIndex) => <section className="report-test-block" key={test.testId}><div className="report-test-head"><div><span className="eyebrow mono">{test.testId}</span><h3>{test.testName}</h3></div><span className="report-sample">{test.sample || 'Sample recorded'}</span></div><div className="report-results">{test.results.map((result, resultIndex) => <div className="edit-result-row" key={result.id || result.name}><div><strong>{result.name}</strong><small>Reference: {result.type === 'numeric' ? `${result.min ?? '—'} – ${result.max ?? '—'} ${result.unit || ''}` : (result.options || []).join(' / ')}</small></div>{result.type === 'qualitative' ? <SelectInput aria-label={`${result.name} result`} value={result.value || ''} onChange={(event) => onChange(testIndex, resultIndex, event.target.value)}><option value="">Select</option>{(result.options || []).map((option) => <option key={option}>{option}</option>)}</SelectInput> : <input className="input result-input" aria-label={`${result.name} result`} value={result.value || ''} inputMode="decimal" onChange={(event) => onChange(testIndex, resultIndex, event.target.value)} />}<span className="parameter-unit">{result.unit || '—'}</span></div>)}</div></section>)}</article>;
}
