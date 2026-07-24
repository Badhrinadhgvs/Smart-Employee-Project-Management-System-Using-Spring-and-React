import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { getTheme } from './theme';

function Root() {
  const [mode, setMode] = React.useState(() => localStorage.getItem('smart-emp-theme') || 'light');
  const toggleTheme = () => setMode((current) => { const next = current === 'light' ? 'dark' : 'light'; localStorage.setItem('smart-emp-theme', next); return next; });
  return <ThemeProvider theme={getTheme(mode)}><CssBaseline /><App onToggleTheme={toggleTheme} mode={mode} /></ThemeProvider>;
}

console.log('Smart Employee & Project Management System loaded completely. Frontend URL: http://localhost:5173');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
