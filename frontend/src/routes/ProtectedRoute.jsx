import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

/**
 * Guards a route subtree. Pass `adminOnly` to additionally require ROLE_ADMIN,
 * mirroring the backend's SecurityConfig so the UI never dangles a link the
 * API would 403 on.
 */
export default function ProtectedRoute({ adminOnly = false }) {
  const { user, initializing, isAdmin } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
