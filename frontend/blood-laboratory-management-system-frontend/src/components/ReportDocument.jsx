import React from '../reactRuntime.js';
import { Badge } from './UI.jsx';

export function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function ReportDocument({ report, patient, compact = false }) {
  if (!report) return null;
  return (
    <article className={`report-document ${compact ? 'report-document-compact' : ''}`}>
      <div className="report-paper-head"><div><span className="eyebrow">CLEARLINE LAB · DIAGNOSTICS</span><h2>Laboratory report</h2><p>Verified results for clinical review</p></div><div className="report-paper-meta"><span>REPORT NUMBER</span><strong className="mono">{report.id}</strong><span>{formatDateTime(report.reportDate)}</span></div></div>
      <div className="report-patient-block"><span className="eyebrow">PATIENT</span><div className="report-patient-main"><div><h3>{patient?.name || 'Patient'}</h3><p className="mono">{patient?.id || report.patientId}</p></div><div><span>Age</span><strong>{patient?.age ?? '—'} yrs</strong></div><div><span>Gender</span><strong>{patient?.gender || '—'}</strong></div><div><span>Registered</span><strong>{formatDate(patient?.registeredAt)}</strong></div></div></div>
      {(report.tests || []).map((test) => <section className="report-test-block" key={`${test.testId}-${test.testName}`}><div className="report-test-head"><div><span className="eyebrow mono">{test.testId}</span><h3>{test.testName}</h3></div><span className="report-sample">{test.sample || 'Sample recorded'}</span></div><div className="report-results"><div className="report-result-row report-result-heading"><span>Parameter</span><span>Result</span><span>Reference interval</span><span>Unit</span></div>{(test.results || []).map((result) => {
        const range = result.type === 'numeric' ? `${result.min ?? '—'} – ${result.max ?? '—'}` : (result.options || []).join(' / ') || '—';
        const displayValue = result.value === '' || result.value == null ? '—' : result.value;
        const outside = result.type === 'numeric' && result.value !== '' && ((result.min != null && Number(result.value) < Number(result.min)) || (result.max != null && Number(result.value) > Number(result.max)));
        return <div className="report-result-row" key={result.id || result.name}><span className="result-name">{result.name}{result.interpretation && <small>{result.interpretation}</small>}</span><strong className={outside ? 'result-outside' : ''}>{displayValue}{outside && <Badge tone="amber">Review</Badge>}</strong><span className="result-reference">{range}</span><span className="result-unit">{result.unit || '—'}</span></div>;
      })}</div></section>)}
      <div className="report-paper-foot"><span>Results should be interpreted in the context of clinical findings.</span><span>Authorized by <strong>{report.createdBy || 'Laboratory'}</strong></span></div>
    </article>
  );
}
