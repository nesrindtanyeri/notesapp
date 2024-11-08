// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotesContextProvider } from './context/NotesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}> {/* Enable v7 flags */}
    <NotesContextProvider>
      <App />
    </NotesContextProvider>
  </Router>
);


