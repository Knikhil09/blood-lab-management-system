import React from '../reactRuntime.js';
import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, Beaker, CirclePlus, Clock3, FileCheck2, FileText, FlaskConical, Plus, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import { apiConfig } from '../api/apiRoutes.js';
import { getRecentReports } from '../api/reportApi.js';
import { searchPatients } from '../api/patientApi.js';
import { Button, Card, EmptyState, InlineNotice, PageHeader, Badge } from '../components/UI.jsx';
import { formatDateTime } from '../components/ReportDocument.jsx';

const quickActions = [
  { to: '/add-test', label: 'Create a new report', description: 'Register a patient and enter results', icon: Beaker, tone: 'teal' },
  { to: '/reports', label: 'Find a patient', description: 'Search patient records and report history', icon: UsersRound, tone: 'plum' },
  { to: '/update-values', label: 'Review reference values', description: 'Manage configured assay parameters', icon: Activity, tone: 'ochre' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  useEffect(() => {
    let current = true;
    setLoading(true);
    setLoadError('');
    Promise.all([getRecentReports(), searchPatients('')]).then(([recent, patients]) => {
      if (!current) return;
      setReports(recent.slice(0, 4));
      setPatientCount(patients.length);
    }).catch((error) => { if (current) setLoadError(error.message || 'Dashboard data could not be loaded.'); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [reloadKey]);

  const verifiedCount = reports.filter((report) => report.status === 'Verified').length;
  return (
    <div className="dashboard-page">
      <PageHeader eyebrow={`LAB OPERATIONS  /  ${today.toUpperCase()}`} title={`Good morning, ${user?.name?.split(/\s+/)[0] || 'there'}`} description="A clear view of today’s work, all in one place." action={<Link to="/add-test"><Button icon={Plus}>New report</Button></Link>} />
      {loadError && <InlineNotice tone="error" onDismiss={() => setLoadError('')}>{loadError} <button type="button" className="text-button" onClick={() => setReloadKey((value) => value + 1)}>Retry</button></InlineNotice>}
      <div className="dashboard-intro"><div><span className="intro-rule" /><span>{apiConfig.mockMode ? 'Today at Northfield Lab · demo' : 'Today at your laboratory'}</span></div><span className="mono intro-date">{new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date())}</span></div>
      <section className="metric-row" aria-label="Laboratory summary">
        <Card className="metric-card metric-card-primary"><div className="metric-top"><span>Patients on file</span><span className="metric-icon"><UsersRound size={17} /></span></div><div className="metric-value">{loading ? '—' : patientCount.toLocaleString()}<span className="metric-unit">records</span></div><div className="metric-foot"><span className="metric-note">{apiConfig.mockMode ? 'Sample workspace' : 'Returned by gateway'}</span><span className="metric-trend neutral">{apiConfig.mockMode ? 'Demo data' : 'Gateway data'}</span></div></Card>
        <Card className="metric-card"><div className="metric-top"><span>Recent reports</span><span className="metric-icon metric-icon-lilac"><FileText size={17} /></span></div><div className="metric-value">{loading ? '—' : reports.length}<span className="metric-unit">shown</span></div><div className="metric-foot"><span className="metric-note">{apiConfig.mockMode ? 'Sample report activity' : 'Latest gateway activity'}</span><span className="metric-trend neutral">{apiConfig.mockMode ? 'Demo records' : 'Recent results'}</span></div></Card>
        <Card className="metric-card"><div className="metric-top"><span>Verified</span><span className="metric-icon metric-icon-green"><FileCheck2 size={17} /></span></div><div className="metric-value">{loading ? '—' : verifiedCount}<span className="metric-unit">reports</span></div><div className="metric-foot"><span className="metric-note">{apiConfig.mockMode ? 'Sample report status' : 'Returned report statuses'}</span><Badge tone="green" dot>{apiConfig.mockMode ? 'Sample data' : 'API data'}</Badge></div></Card>
        <Card className="metric-card metric-card-quiet"><div className="metric-top"><span>Average turnaround</span><span className="metric-icon metric-icon-amber"><Clock3 size={17} /></span></div><div className="metric-value">{apiConfig.mockMode ? '3.2' : '—'}<span className="metric-unit">{apiConfig.mockMode ? 'hours' : 'unavailable'}</span></div><div className="metric-foot"><span className="metric-note">{apiConfig.mockMode ? 'Synthetic demo metric' : 'Not supplied by report API'}</span><span className="metric-trend neutral"><Activity size={13} /> {apiConfig.mockMode ? 'Demo only' : '—'}</span></div></Card>
      </section>
      <section className="dashboard-lower">
        <div className="quick-workspace"><div className="section-kicker"><span className="kicker-number">01</span><span>START A WORKFLOW</span></div><div className="quick-actions-list">{quickActions.map(({ to, label, description, icon: Icon, tone }, index) => <Link to={to} className={`quick-action quick-action-${tone}`} key={to}><span className="quick-action-icon"><Icon size={19} /></span><span className="quick-action-copy"><small>0{index + 1} <i>·</i> WORKSPACE</small><strong>{label}</strong><span>{description}</span></span><ArrowUpRight size={17} className="quick-arrow" /></Link>)}</div><div className="quick-workspace-foot"><SparkleIcon /><span>Each report keeps its own record of the values used at the time.</span></div></div>
        <Card className="activity-card"><div className="activity-head"><div><div className="section-kicker"><span className="kicker-number">02</span><span>RECENT ACTIVITY</span></div><h2>Reports, recently</h2></div><Link to="/reports" className="subtle-link">View all <ArrowUpRight size={14} /></Link></div>
          {loading ? <div className="activity-loading"><span className="spin-dot" /> Loading recent reports…</div> : reports.length ? <div className="activity-list">{reports.map((report, index) => <Link to={`/reports/${report.id}`} className="activity-item" key={report.id}><span className={`activity-marker ${index % 2 ? 'activity-marker-alt' : ''}`}><FileText size={15} /></span><span className="activity-copy"><strong>{report.tests.map((test) => test.testName).join(', ')}</strong><span>{report.patient?.name || report.patientName || 'Patient record'} <i>·</i> <span className="mono">{report.patientId}</span></span></span><span className="activity-meta"><Badge tone={report.status === 'Verified' ? 'green' : 'amber'} dot>{report.status}</Badge><small>{formatDateTime(report.reportDate)}</small></span></Link>)}</div> : <EmptyState icon={FileText} title="No reports yet" description="Create a report to see recent activity here." action={<Link to="/add-test"><Button size="sm" icon={CirclePlus}>Create report</Button></Link>} />}
          <div className="activity-bottom"><span className="activity-status"><span /> {apiConfig.mockMode ? 'Sample activity shown' : 'Recent API data'}</span><Link to="/reports" className="arrow-action">Browse reports <ArrowUpRight size={14} /></Link></div>
        </Card>
      </section>
      <div className="dashboard-bottom-note"><FlaskConical size={15} /><span>Keep patient context and saved result ranges together for a complete record.</span><Link to="/add-test">Start a report <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}

function SparkleIcon() { return <span className="sparkle-icon"><Activity size={14} /></span>; }
