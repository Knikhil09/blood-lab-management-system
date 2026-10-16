import React, { createRoot } from './reactRuntime.js';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
