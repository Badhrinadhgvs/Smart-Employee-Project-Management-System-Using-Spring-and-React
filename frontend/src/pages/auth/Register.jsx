import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Link, Grid } from '@mui/material';
import * as authApi from '../../api/authApi';

const EMPTY = { username: '', email: '', password: '', firstName: '', lastName: '' };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.email || !form.password || !form.firstName || !form.lastName) {
      setError('Please fill in every field.');
      return;
    }
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess('Account created. Redirecting to sign in…');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create the account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 480, p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          New accounts join as an employee. An admin can adjust roles later.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2.5 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="First name" fullWidth value={form.firstName} onChange={handleChange('firstName')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Last name" fullWidth value={form.lastName} onChange={handleChange('lastName')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Username" fullWidth value={form.username} onChange={handleChange('username')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={handleChange('email')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={form.password}
                onChange={handleChange('password')}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="secondary"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.2 }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover" fontWeight={700}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
