import assert from 'node:assert/strict';

const values = new Map();
globalThis.window = {
  setTimeout: globalThis.setTimeout.bind(globalThis),
  atob: (value) => Buffer.from(value, 'base64').toString('binary'),
  btoa: (value) => Buffer.from(value, 'binary').toString('base64'),
};
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: (key) => values.delete(key),
};

const { mockRequest } = await import('../src/api/mockApi.js');
const ok = (path, options) => mockRequest(path, options);

const session = await ok('/api/auth/login', { method: 'POST', body: { username: 'lab@clearline.test', password: 'Clearline123!' } });
assert.equal(session.demo, true);
assert.equal(session.user.name, 'Maya Chen');
await assert.rejects(() => ok('/api/auth/login', { method: 'POST', body: { username: 'lab@clearline.test', password: 'wrong' } }), (error) => error.status === 401);

const matches = await ok('/api/patients', { query: { query: 'Amara' } });
assert.equal(matches.length, 1);
assert.equal(matches[0].id, 'PT-240031');
const history = await ok('/api/patients/PT-240031/reports');
assert.deepEqual(history.map((report) => report.id), ['RPT-10284', 'RPT-10276']);
const detail = await ok('/api/reports/RPT-10284');
assert.equal(detail.patient.name, 'Amara Okafor');

const parameters = await ok('/api/tests/T-100/parameters');
assert.equal(parameters[0].name, 'Hemoglobin');
await ok('/api/tests/T-100/parameters', { method: 'PUT', body: { parameters: [{ id: 'hb', name: 'Hemoglobin', type: 'numeric', unit: 'g/dL', min: 13, max: 17 }] } });
const historical = await ok('/api/reports/RPT-10284');
assert.equal(historical.tests[0].results[0].min, 12, 'saved report keeps its original range snapshot');

const patient = await ok('/api/patients', { method: 'POST', body: { name: 'Demo Patient', age: 20, gender: 'Other', mobile: '', registeredAt: new Date().toISOString() } });
assert.match(patient.id, /^PT-/);
const infant = await ok('/api/patients', { method: 'POST', body: { name: 'Demo Infant', age: 0, gender: 'Other', mobile: '', registeredAt: new Date().toISOString() } });
assert.equal(infant.age, 0);
const created = await ok('/api/reports', { method: 'POST', body: { patientId: patient.id, tests: [{ testId: 'T-203', testName: 'Glucose · Random', results: [{ id: 'glucose', name: 'Glucose', type: 'numeric', value: '99', min: 70, max: 140, unit: 'mg/dL' }] }] } });
assert.match(created.id, /^RPT-/);
assert.equal((await ok(`/api/patients/${patient.id}/reports`)).length, 1);
const pdf = await ok(`/api/reports/${created.id}/pdf`, { responseType: 'blob' });
assert.equal(pdf.type, 'application/pdf');
assert.ok(pdf.size > 500);

console.log('Mock API smoke checks passed: auth, search, history ordering, snapshot immutability, registration, report save, and PDF.');
