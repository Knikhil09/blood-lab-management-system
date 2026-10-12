import { demoPatients, demoReports, demoTests, demoUser } from '../data/demoData.js';

const STORE_KEY = 'clearline-demo-data-v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
const wait = (ms = 240) => new Promise((resolve) => window.setTimeout(resolve, ms));

function readStore() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* fall back to the synthetic seed */ }
  return { patients: clone(demoPatients), reports: clone(demoReports), tests: clone(demoTests) };
}

function saveStore(store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* demo still works for this session */ }
}

function findPatient(store, patientId) {
  return store.patients.find((patient) => patient.id === patientId);
}

async function renderReportPdf(report, patient) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  let y = 22;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(25, 77, 74);
  pdf.text('CLEARLINE LAB', margin, y);
  y += 8;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(92, 107, 107);
  pdf.text('DEMO REPORT · SYNTHETIC DATA · NOT FOR CLINICAL USE', margin, y);
  y += 10;
  pdf.setDrawColor(219, 228, 223);
  pdf.line(margin, y, 192, y);
  y += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(28, 44, 43);
  pdf.text(`Patient: ${patient?.name || 'Unknown'}  ·  ${patient?.id || report.patientId}`, margin, y);
  y += 6;
  pdf.text(`Age / gender: ${patient?.age ?? '—'} / ${patient?.gender || '—'}`, margin, y);
  y += 6;
  pdf.text(`Report: ${report.id}  ·  ${new Date(report.reportDate).toLocaleString()}`, margin, y);
  for (const test of report.tests || []) {
    y += 12;
    if (y > 265) { pdf.addPage(); y = 20; }
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 77, 74);
    pdf.text(`${test.testName}  (${test.testId})`, margin, y);
    y += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(28, 44, 43);
    for (const result of test.results || []) {
      if (y > 270) { pdf.addPage(); y = 20; }
      const range = result.type === 'numeric' ? `${result.min ?? '—'}–${result.max ?? '—'} ${result.unit || ''}` : (result.options || []).join(' / ');
      const displayValue = result.value === '' || result.value == null ? '—' : result.value;
      pdf.text(`${result.name}: ${displayValue} ${result.unit || ''}   Reference: ${range}`, margin + 2, y);
      y += 6;
    }
  }
  y = Math.min(y + 12, 280);
  pdf.setTextColor(112, 122, 120);
  pdf.setFontSize(8);
  pdf.text('Demonstration only. This sample is not a medical record or diagnostic result.', margin, y);
  return pdf.output('blob');
}

export async function mockRequest(path, { method = 'GET', body, query = {}, responseType } = {}) {
  await wait();
  const store = readStore();
  const cleanPath = path.split('?')[0];
  const idFrom = (pattern) => cleanPath.match(pattern)?.[1];

  if (cleanPath.endsWith('/auth/login') && method === 'POST') {
    const { username, password } = body || {};
    if (!username?.trim() || !password) throw Object.assign(new Error('Enter your email and password.'), { status: 400 });
    if (username.toLowerCase() !== 'lab@clearline.test' || password !== 'Clearline123!') {
      throw Object.assign(new Error('That email and password do not match our demo account.'), { status: 401 });
    }
    return { user: clone(demoUser), token: null, demo: true };
  }
  if (cleanPath.endsWith('/auth/logout') && method === 'POST') return null;

  const patientReportsId = idFrom(/\/patients\/([^/]+)\/reports$/);
  if (patientReportsId) {
    return store.reports.filter((item) => item.patientId === decodeURIComponent(patientReportsId)).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)).map(clone);
  }

  if (cleanPath.endsWith('/reports') && method === 'POST') {
    const report = { ...clone(body), id: `RPT-${String(Date.now()).slice(-6)}`, reportDate: new Date().toISOString(), status: 'Verified', createdBy: demoUser.name };
    store.reports = [report, ...store.reports];
    if (body.patient?.isNew) {
      const { isNew, ...patient } = body.patient;
      store.patients = [{ ...patient, id: `PT-${String(Date.now()).slice(-6)}`, registeredAt: patient.registeredAt || new Date().toISOString() }, ...store.patients];
      report.patientId = store.patients[0].id;
    }
    saveStore(store);
    return clone(report);
  }
  if (cleanPath.endsWith('/reports') && method === 'GET') {
    return store.reports.slice().sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)).map((report) => ({ ...clone(report), patient: clone(findPatient(store, report.patientId)) }));
  }

  const pdfId = idFrom(/\/reports\/([^/]+)\/pdf$/);
  if (pdfId && responseType === 'blob') {
    const report = store.reports.find((item) => item.id === decodeURIComponent(pdfId));
    if (!report) throw Object.assign(new Error('Report not found.'), { status: 404 });
    return renderReportPdf(report, findPatient(store, report.patientId));
  }

  const reportId = idFrom(/\/reports\/([^/]+)$/);
  if (reportId && method === 'GET') {
    const report = store.reports.find((item) => item.id === decodeURIComponent(reportId));
    if (!report) throw Object.assign(new Error('Report not found.'), { status: 404 });
    return { ...clone(report), patient: clone(findPatient(store, report.patientId)) };
  }
  if (reportId && method === 'PUT') {
    const index = store.reports.findIndex((item) => item.id === decodeURIComponent(reportId));
    if (index < 0) throw Object.assign(new Error('Report not found.'), { status: 404 });
    if (body.patientId && body.patientId !== store.reports[index].patientId) throw Object.assign(new Error('A report cannot be reassigned to another patient.'), { status: 403 });
    store.reports[index] = { ...store.reports[index], ...clone(body), patientId: store.reports[index].patientId };
    saveStore(store);
    return clone(store.reports[index]);
  }

  if (cleanPath.endsWith('/patients') && method === 'GET') {
    const term = String(query.query || '').toLowerCase();
    return store.patients.filter((patient) => !term || `${patient.id} ${patient.name} ${patient.mobile}`.toLowerCase().includes(term)).map(clone);
  }
  if (cleanPath.endsWith('/patients') && method === 'POST') {
    if (!body?.name || body?.age === undefined || body?.age === null || body?.age === '' || !body?.gender) throw Object.assign(new Error('Patient name, age, and gender are required.'), { status: 400 });
    const patient = { ...clone(body), id: `PT-${String(Date.now()).slice(-6)}`, registeredAt: body.registeredAt || new Date().toISOString() };
    delete patient.isNew;
    store.patients.unshift(patient);
    saveStore(store);
    return clone(patient);
  }
  const patientId = idFrom(/\/patients\/([^/]+)$/);
  if (patientId && method === 'GET') {
    const patient = findPatient(store, decodeURIComponent(patientId));
    if (!patient) throw Object.assign(new Error('Patient not found.'), { status: 404 });
    return clone(patient);
  }

  if (cleanPath.endsWith('/tests') && method === 'GET') {
    const term = String(query.query || '').toLowerCase();
    return store.tests.filter((test) => !term || `${test.id} ${test.name} ${test.category}`.toLowerCase().includes(term)).map(clone);
  }
  const parametersId = idFrom(/\/tests\/([^/]+)\/parameters$/);
  if (parametersId && method === 'GET') {
    const test = store.tests.find((item) => item.id === decodeURIComponent(parametersId));
    if (!test) throw Object.assign(new Error('Test not found.'), { status: 404 });
    return clone(test.parameters);
  }
  if (parametersId && method === 'PUT') {
    const test = store.tests.find((item) => item.id === decodeURIComponent(parametersId));
    if (!test) throw Object.assign(new Error('Test not found.'), { status: 404 });
    test.parameters = clone(body.parameters || []);
    saveStore(store);
    return clone(test);
  }

  throw Object.assign(new Error('Demo endpoint not found. Check the configured gateway route mapping.'), { status: 404 });
}
