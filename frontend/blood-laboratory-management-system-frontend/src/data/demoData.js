export const demoUser = { id: 'USR-014', name: 'Maya Chen', role: 'Laboratory scientist', email: 'lab@clearline.test' };

export const demoPatients = [
  { id: 'PT-240031', name: 'Amara Okafor', age: 34, gender: 'Female', mobile: '9876543210', registeredAt: '2026-10-11T09:42:00' },
  { id: 'PT-240030', name: 'Dev Patel', age: 52, gender: 'Male', mobile: '9867123450', registeredAt: '2026-10-11T08:16:00' },
  { id: 'PT-240029', name: 'Sofia Reyes', age: 27, gender: 'Female', mobile: '9812345670', registeredAt: '2026-10-10T16:32:00' },
  { id: 'PT-240028', name: 'Jordan Ellis', age: 45, gender: 'Other', mobile: '9898765432', registeredAt: '2026-10-10T11:05:00' },
  { id: 'PT-240027', name: 'Nikhil Rao', age: 61, gender: 'Male', mobile: '9822012345', registeredAt: '2026-10-09T10:48:00' },
  { id: 'PT-240026', name: 'Layla Haddad', age: 39, gender: 'Female', mobile: '9870011223', registeredAt: '2026-10-08T14:21:00' },
];

export const demoTests = [
  { id: 'T-100', name: 'Full Blood Count', category: 'Hematology', turnaround: '4 hrs', sample: 'EDTA whole blood', parameters: [
    { id: 'hb', name: 'Hemoglobin', type: 'numeric', unit: 'g/dL', min: 12, max: 16, interpretation: 'Oxygen-carrying protein in red blood cells' },
    { id: 'wbc', name: 'White blood cells', type: 'numeric', unit: '×10⁹/L', min: 4, max: 11, interpretation: '' },
    { id: 'platelets', name: 'Platelet count', type: 'numeric', unit: '×10⁹/L', min: 150, max: 400, interpretation: '' },
  ] },
  { id: 'T-203', name: 'Glucose · Random', category: 'Biochemistry', turnaround: '2 hrs', sample: 'Fluoride plasma', parameters: [
    { id: 'glucose', name: 'Glucose', type: 'numeric', unit: 'mg/dL', min: 70, max: 140, interpretation: 'Random sample reference interval' },
  ] },
  { id: 'T-224', name: 'Lipid Profile', category: 'Biochemistry', turnaround: '6 hrs', sample: 'Serum', parameters: [
    { id: 'total', name: 'Total cholesterol', type: 'numeric', unit: 'mg/dL', min: 0, max: 200, interpretation: 'Desirable: below 200 mg/dL' },
    { id: 'hdl', name: 'HDL cholesterol', type: 'numeric', unit: 'mg/dL', min: 40, max: 100, interpretation: 'Higher values are generally favorable' },
    { id: 'ldl', name: 'LDL cholesterol', type: 'numeric', unit: 'mg/dL', min: 0, max: 130, interpretation: '' },
  ] },
  { id: 'T-309', name: 'Malaria Rapid Screen', category: 'Serology', turnaround: '1 hr', sample: 'Whole blood', parameters: [
    { id: 'malaria', name: 'Antigen screen', type: 'qualitative', unit: '', options: ['Negative', 'Positive'], interpretation: 'Rapid antigen detection' },
  ] },
  { id: 'T-317', name: 'C-Reactive Protein', category: 'Immunology', turnaround: '3 hrs', sample: 'Serum', parameters: [
    { id: 'crp', name: 'C-Reactive Protein', type: 'numeric', unit: 'mg/L', min: 0, max: 5, interpretation: '' },
  ] },
  { id: 'T-422', name: 'Urine Routine', category: 'Clinical Pathology', turnaround: '2 hrs', sample: 'Midstream urine', parameters: [
    { id: 'appearance', name: 'Appearance', type: 'qualitative', unit: '', options: ['Clear', 'Cloudy', 'Turbid'], interpretation: '' },
    { id: 'protein', name: 'Protein', type: 'qualitative', unit: '', options: ['Negative', 'Trace', '1+', '2+', '3+'], interpretation: '' },
    { id: 'glucose-urine', name: 'Glucose', type: 'qualitative', unit: '', options: ['Negative', 'Trace', 'Positive'], interpretation: '' },
  ] },
];

const byTest = (testId, values) => {
  const test = demoTests.find((item) => item.id === testId);
  return { testId, testName: test.name, results: test.parameters.map((parameter) => ({ ...parameter, value: values[parameter.id] ?? '' })) };
};

export const demoReports = [
  {
    id: 'RPT-10284', patientId: 'PT-240031', reportDate: '2026-10-11T11:32:00', status: 'Verified', createdBy: 'Maya Chen',
    tests: [byTest('T-100', { hb: '13.8', wbc: '6.2', platelets: '248' }), byTest('T-203', { glucose: '106' })],
  },
  {
    id: 'RPT-10276', patientId: 'PT-240031', reportDate: '2026-10-05T15:05:00', status: 'Verified', createdBy: 'A. Kim',
    tests: [byTest('T-317', { crp: '3.2' })],
  },
  {
    id: 'RPT-10272', patientId: 'PT-240030', reportDate: '2026-10-11T09:02:00', status: 'Verified', createdBy: 'Maya Chen',
    tests: [byTest('T-224', { total: '184', hdl: '52', ldl: '108' })],
  },
  {
    id: 'RPT-10243', patientId: 'PT-240029', reportDate: '2026-10-09T12:45:00', status: 'In review', createdBy: 'A. Kim',
    tests: [byTest('T-309', { malaria: 'Negative' })],
  },
  {
    id: 'RPT-10210', patientId: 'PT-240027', reportDate: '2026-10-07T10:17:00', status: 'Verified', createdBy: 'Maya Chen',
    tests: [byTest('T-100', { hb: '14.1', wbc: '7.8', platelets: '301' })],
  },
];
