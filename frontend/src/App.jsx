import React from './reactRuntime.js';
import { AuthProvider } from './app/AuthContext.jsx';
import AppRoutes from './app/AppRoutes.jsx';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
