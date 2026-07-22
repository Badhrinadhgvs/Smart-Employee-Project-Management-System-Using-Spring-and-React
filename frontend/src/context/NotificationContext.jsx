import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', severity: 'success' });

  const notify = useCallback((message, severity = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  const notifyError = useCallback(
    (err, fallback = 'Something went wrong. Please try again.') => {
      const message = err?.response?.data?.message || err?.message || fallback;
      setState({ open: true, message, severity: 'error' });
    },
    []
  );

  const handleClose = () => setState((s) => ({ ...s, open: false }));

  const value = useMemo(() => ({ notify, notifyError }), [notify, notifyError]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 72, sm: 80 } }}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within a NotificationProvider');
  return ctx;
}
