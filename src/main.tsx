import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'virtual:windi.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
