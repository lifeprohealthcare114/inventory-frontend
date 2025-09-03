import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import './App.css';
import { ToastContainer } from 'react-toastify';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    {/* Toast notifications available globally */}
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  </React.StrictMode>
);
