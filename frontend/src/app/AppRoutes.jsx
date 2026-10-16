import React from '../reactRuntime.js';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AddTest from '../pages/AddTest.jsx';
import Reports from '../pages/Reports.jsx';
import PatientReports from '../pages/PatientReports.jsx';
import ReportDetails from '../pages/ReportDetails.jsx';
import UpdateValues from '../pages/UpdateValues.jsx';
import { useAuth } from './AuthContext.jsx';

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="add-test" element={<AddTest />} />
          <Route path="reports" element={<Reports />} />
          <Route path="patients/:patientId/reports" element={<PatientReports />} />
          <Route path="reports/:reportId" element={<ReportDetails />} />
          <Route path="update-values" element={<UpdateValues />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}
