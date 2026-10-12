import React from '../reactRuntime.js';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronRight, FileText, RotateCcw, Search, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchPatients } from '../api/patientApi.js';
import { Button, Card, EmptyState, Field, LoadingLine, PageHeader, SearchBox } from '../components/UI.jsx';
import { formatDate, formatDateTime } from '../components/ReportDocument.jsx';

export default function Reports() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let current = true;
    searchPatients('').then((items) => { if (current) setPatients(items); }).catch((reason) => { if (current) setError(reason.message || 'Could not load patients.'); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, []);
  const filtered = useMemo(() => patients.filter((patient) => {
    const matchesQuery = `${patient.id} ${patient.name} ${patient.mobile || ''} ${patient.gender}`.toLowerCase().includes(query.toLowerCase());
    const matchesDate = !date || (patient.registeredAt || '').slice(0, 10) === date;
    return matchesQuery && matchesDate;
  }), [patients, query, date]);
  function clearFilters() { setQuery(''); setDate(''); setError(''); }

  return (
    <div className="reports-page">
      <PageHeader eyebrow="WORKSPACE  /  PATIENTS & REPORTS" title="Patients & reports" description="Find a patient record, then review the reports linked to it." action={<Link to="/add-test"><Button icon={FileText}>Create report</Button></Link>} />
      <div className="reports-overview-strip"><div className="reports-overview-icon"><UsersRound size={19} /></div><div><span className="eyebrow">PATIENT INDEX</span><strong>{loading ? '—' : patients.length.toLocaleString()} <span>records</span></strong></div><span className="overview-divider" /><div className="overview-detail"><span>Patient context first</span><small>Every report remains linked to its patient.</small></div><span className="overview-decoration mono">PT / INDEX</span></div>
      <Card className="patient-table-card"><div className="patient-table-toolbar"><div><h2>All patients</h2><p>Search by patient ID, name, or mobile number.</p></div><div className="patient-filter-controls"><SearchBox value={query} onChange={setQuery} placeholder="Search patient records…" ariaLabel="Search patients by code, name or mobile" /><label className="date-filter" aria-label="Filter by registration date"><CalendarDays size={15} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><Button variant="ghost" size="sm" icon={RotateCcw} onClick={clearFilters}>Reset</Button></div></div>
        {error && <div className="table-error"><span>{error}</span><Button size="sm" variant="secondary" onClick={() => { setLoading(true); searchPatients('').then(setPatients).catch((reason) => setError(reason.message)).finally(() => setLoading(false)); }}>Retry</Button></div>}
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Patient</th><th>Age / gender</th><th>Mobile</th><th>Registered</th><th><span className="sr-only">Open report history</span></th></tr></thead><tbody>
          {loading ? <tr><td colSpan="5"><LoadingLine label="Loading patient records…" /></td></tr> : filtered.map((patient, index) => <tr key={patient.id}><td><div className="patient-cell"><span className={`patient-row-avatar avatar-${index % 5}`}>{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{patient.name}</strong><small className="mono">{patient.id}</small></span></div></td><td><span className="demographic-cell">{patient.age} yrs <i>·</i> {patient.gender}</span></td><td className="mono mobile-number">{patient.mobile || '—'}</td><td><span className="date-cell">{formatDate(patient.registeredAt)}<small>{formatDateTime(patient.registeredAt).split(' · ')[1] || ''}</small></span></td><td className="table-action"><Link to={`/patients/${patient.id}/reports`} className="open-history">View reports <ChevronRight size={15} /></Link></td></tr>)}
        </tbody></table></div>
        {!loading && filtered.length === 0 && <EmptyState icon={Search} title="No patients found" description={query || date ? 'Try a different search or clear the filters to see all patient records.' : 'Patient records will appear here when registered.'} action={(query || date) && <Button size="sm" variant="secondary" onClick={clearFilters}>Clear search</Button>} />}
        <div className="table-footer"><span>Showing <strong>{loading ? '—' : filtered.length}</strong> of <strong>{loading ? '—' : patients.length}</strong> patients</span><span className="table-footer-note"><span className="connection-dot" /> Records are linked to saved reports</span></div>
      </Card>
      <div className="reports-help-row"><span><FileText size={15} /> Search results are limited to patient context; open a record to see its history.</span><Link to="/add-test">Register a patient <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}
