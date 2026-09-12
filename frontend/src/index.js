import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';

// En production, REACT_APP_API_URL pointe vers le backend déployé
// (ex: https://sallereserve-backend.vercel.app/api). En dev, on laisse
// vide pour passer par le "proxy" défini dans package.json.
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
