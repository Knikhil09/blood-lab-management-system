import React from '../reactRuntime.js';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, FileText, Plus, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPatient } from '../api/patientApi.js';
import { getPatientReports } from '../api/reportApi.js';
import { Badge, Button, Card, EmptyState, InlineNotice, LoadingLine, PageHeader } from '../components/UI.jsx';
import { formatDateTime } from '../components/ReportDocument.jsx';

export default function PatientReports() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => {
    setLoading(true); setError('');
    Promise.all([getPatient(patientId), getPatientReports(patientId)]).then(([person, history]) => {
      setPatient(person);
      setReports(history.slice().sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)));
    }).catch((reason) => setError(reason.message || 'Could not load this patient history.')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [patientId]);

  return (
    <div className="patient-history-page">
      <PageHeader eyebrow="PATIENT RECORD  /  REPORT HISTORY" title={loading ? 'Patient history' : (patient?.name || 'Patient history')} description="Saved reports linked to this patient record." back={{ label: 'All patients', onClick: () => navigate('/reports') }} action={<Link to="/add-test"><Button icon={Plus}>New report</Button></Link>} />
      {error && <InlineNotice tone="error">{error} <button className="text-button" onClick={load}>Retry</button></InlineNotice>}
      {loading ? <Card className="patient-profile-card"><LoadingLine label="Loading patient and report history…" /></Card> : patient && <Card className="patient-profile-card"><span className="profile-monogram">{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div className="profile-main"><span className="eyebrow">PATIENT PROFILE</span><h2>{patient.name}</h2><span className="profile-id mono">{patient.id}</span></div><span className="profile-divider" /><div className="profile-item"><span>Age / gender</span><strong>{patient.age} yrs <i>·</i> {patient.gender}</strong></div><div className="profile-item"><span>Mobile</span><strong className="mono">{patient.mobile || '—'}</strong></div><div className="profile-item"><span>Registered</span><strong>{formatDateTime(patient.registeredAt)}</strong></div><span className="profile-report-count"><strong>{reports.length.toString().padStart(2, '0')}</strong><span>reports</span></span></Card>}
      <Card className="history-card"><div className="history-card-head"><div><span className="eyebrow">PATIENT HISTORY</span><h2>Reports</h2><p>Most recent first · reference ranges preserved as saved.</p></div><Badge tone="neutral">{reports.length} {reports.length === 1 ? 'report' : 'reports'}</Badge></div>
        {loading ? <LoadingLine label="Loading reports…" /> : reports.length ? <div className="history-list">{reports.map((report, index) => <Link to={`/reports/${report.id}`} className="history-row" key={report.id}><span className={`history-icon ${index === 0 ? 'history-icon-latest' : ''}`}><FileText size={17} /></span><span className="history-report-main"><span className="history-report-id mono">{report.id} <i>·</i> {formatDateTime(report.reportDate)}</span><strong>{report.tests.map((test) => test.testName).join(' + ')}</strong><small>{report.tests.length} {report.tests.length === 1 ? 'test' : 'tests'} <i>·</i> {report.tests.reduce((total, test) => total + test.results.length, 0)} parameters</small></span><Badge tone={report.status === 'Verified' ? 'green' : 'amber'} dot>{report.status || 'Saved'}</Badge><ArrowUpRight size={16} className="history-open" /></Link>)}</div> : <EmptyState icon={UserRound} title="No reports on file" description="Saved reports for this patient will appear here." action={<Link to="/add-test"><Button size="sm" icon={Plus}>Create a report</Button></Link>} />}
      </Card>
      <div className="history-footnote"><span><ArrowLeft size={14} /> This view is scoped to one patient record.</span><Link to="/reports">Back to all patients <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}
