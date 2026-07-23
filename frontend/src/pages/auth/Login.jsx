import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useAuth } from '../../context/AuthContext';

export default function Login({ onToggleTheme, mode }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(form.username, form.password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '46%',
          bgcolor: '#141B2E',
          color: '#fff',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 40 40"
          sx={{ width: 40, height: 40, position: 'relative', zIndex: 1 }}
        >
          <circle cx="20" cy="20" r="17" fill="none" stroke="#2C3E63" strokeWidth="4" />
          <path d="M20 3 A17 17 0 0 1 35.5 25" fill="none" stroke="#0E8F82" strokeWidth="4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="5.5" fill="#E8703A" />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '2.1rem', lineHeight: 1.15, mb: 2 }}>
            Every project,
            <br />
            every task,
            <br />
            one ring of visibility.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380 }}>
            Assign work, track progress, and keep deadlines honest — across every
            department, in one workspace.
          </Typography>
        </Box>

        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
          Smart Employee &amp; Project Management System
        </Typography>

        {/* Ambient ring decoration */}
        <Box
          component="svg"
          viewBox="0 0 200 200"
          sx={{ position: 'absolute', right: -60, bottom: -60, width: 320, height: 320, opacity: 0.5 }}
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="#2C3E63" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#2C3E63" strokeWidth="1.5" />
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Paper
          variant="outlined"
          sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 3 }}
        >
          <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><Typography variant="h4" sx={{ mb: 0.5 }}>
            Welcome back
          </Typography><IconButton onClick={onToggleTheme}>{mode === 'dark' ? <LightModeOutlinedIcon/> : <DarkModeOutlinedIcon/>}</IconButton></Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your workspace to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              fullWidth
              autoFocus
              margin="normal"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" tabIndex={-1}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            New here?{' '}
            <Link component={RouterLink} to="/register" underline="hover" fontWeight={700}>
              Create an account
            </Link>
          </Typography>

          <Box sx={{ mt: 3, p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Demo admin: <strong>admin</strong> / admin123
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Demo employee: <strong>john_doe</strong> / john123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
