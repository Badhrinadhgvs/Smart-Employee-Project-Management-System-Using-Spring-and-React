import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PageHeader from '../../components/common/PageHeader';
import { getMyProfile, updateMyProfile } from '../../api/profileApi';
import { useNotify } from '../../context/NotificationContext';
import { validateName, validatePhone, validatePassword } from '../../utils/validation';
import { formatDate, initialsOf } from '../../utils/format';
import { tokens } from '../../theme';

function ProfileStatCard({ icon: Icon, label, value, color }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}1A`,
            color: color,
            flexShrink: 0,
          }}
        >
          <Icon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function ProfilePage() {
  const { notify, notifyError } = useNotify();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    password: '',
  });

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      notifyError(err, 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      department: profile.department || '',
      password: '',
    });
    setEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const fnErr = validateName(form.firstName, 'First name');
    if (fnErr) { notify(fnErr, 'error'); return; }

    const lnErr = validateName(form.lastName, 'Last name');
    if (lnErr) { notify(lnErr, 'error'); return; }

    const phoneErr = validatePhone(form.phone);
    if (phoneErr) { notify(phoneErr, 'error'); return; }

    const passErr = validatePassword(form.password, false);
    if (passErr) { notify(passErr, 'error'); return; }

    setSaving(true);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      notify('Profile updated successfully.');
      setEditOpen(false);
    } catch (err) {
      notifyError(err, 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="My Profile" subtitle="Manage your personal account details and work stats." />
        <LinearProgress color="secondary" sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  const isAdmin = profile?.roles?.includes('ROLE_ADMIN');
  const completionRate = profile?.assignedTaskCount
    ? Math.round((profile.completedTaskCount / profile.assignedTaskCount) * 100)
    : 0;

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, security, and workload snapshot."
        actions={
          <Button variant="contained" color="secondary" startIcon={<EditOutlinedIcon />} onClick={openEdit}>
            Edit Profile
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Header Profile Banner Card */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(20,27,46,0.95), rgba(30,41,68,0.98))',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: tokens.purple,
                  fontSize: '2rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  border: '3px solid rgba(255,255,255,0.2)',
                }}
              >
                {initialsOf(profile?.firstName, profile?.lastName)}
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ fontFamily: 'Sora, sans-serif' }}>
                    {profile?.firstName} {profile?.lastName}
                  </Typography>
                  <Chip
                    label={isAdmin ? 'Administrator' : 'Employee'}
                    size="small"
                    sx={{
                      bgcolor: isAdmin ? '#6366F1' : '#14B8A6',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  />
                </Stack>

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  @{profile?.username} · {profile?.designation || 'Team Member'}
                </Typography>

                <Stack direction="row" spacing={2.5} flexWrap="wrap" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <EmailOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{profile?.email}</span>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <BusinessOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{profile?.department || 'General Department'}</span>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Work Snapshot Stats */}
        <Grid item xs={12} sm={4}>
          <ProfileStatCard
            icon={ChecklistOutlinedIcon}
            label="Assigned Tasks"
            value={profile?.assignedTaskCount ?? 0}
            color={tokens.navy}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProfileStatCard
            icon={TaskAltOutlinedIcon}
            label="Completed Tasks"
            value={`${profile?.completedTaskCount ?? 0} (${completionRate}%)`}
            color={tokens.success}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ProfileStatCard
            icon={FolderOpenOutlinedIcon}
            label="Active Projects"
            value={profile?.assignedProjectCount ?? 0}
            color={tokens.teal}
          />
        </Grid>

        {/* Personal & Employment Details */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
              Account Information
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PersonOutlineIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Full Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.firstName} {profile?.lastName}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" alignItems="center" spacing={2}>
                <EmailOutlinedIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email Address
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" alignItems="center" spacing={2}>
                <PhoneOutlinedIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Phone Number
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.phone || 'Not provided'}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" alignItems="center" spacing={2}>
                <BusinessOutlinedIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Department
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.department || '—'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
              Employment Details
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <WorkOutlineIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Designation / Title
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {profile?.designation || 'Team Member'}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction="row" alignItems="center" spacing={2}>
                <CalendarTodayOutlinedIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Hire Date
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(profile?.hireDate)}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', mt: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Workload Progress
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Completion Rate</Typography>
                  <Typography variant="caption" fontWeight={700}>{completionRate}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'divider', '& .MuiLinearProgress-bar': { bgcolor: tokens.teal, borderRadius: 4 } }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>Edit My Profile</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  fullWidth
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Password (optional)"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setEditOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
