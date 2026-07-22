import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { createEmployee, updateEmployee } from '../../api/employeeApi';
import { useNotify } from '../../context/NotificationContext';

const EMPTY = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  department: '',
  designation: '',
  salary: '',
  phone: '',
  roles: ['EMPLOYEE'],
  password: '',
};

const ROLE_OPTIONS = ['ADMIN', 'EMPLOYEE'];

export default function EmployeeFormDialog({ open, employee, onClose, onSaved }) {
  const { notify, notifyError } = useNotify();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = !!employee;

  useEffect(() => {
    if (open) {
      setForm(
        employee
          ? {
              username: employee.username || '',
              email: employee.email || '',
              firstName: employee.firstName || '',
              lastName: employee.lastName || '',
              department: employee.department || '',
              designation: employee.designation || '',
              salary: employee.salary ?? '',
              phone: employee.phone || '',
              roles: (employee.roles || ['EMPLOYEE']).map((r) => r.replace('ROLE_', '')),
              password: '',
            }
          : EMPTY
      );
    }
  }, [open, employee]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleRole = (role) => {
    setForm((f) => {
      const has = f.roles.includes(role);
      const roles = has ? f.roles.filter((r) => r !== role) : [...f.roles, role];
      return { ...f, roles: roles.length ? roles : [role] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.firstName || !form.lastName) {
      notify('Username, email, and full name are required.', 'error');
      return;
    }
    if (!isEdit && !form.password) {
      notify('A password is required for new employees.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        salary: form.salary === '' ? null : Number(form.salary),
        password: form.password || undefined,
      };
      if (isEdit) {
        await updateEmployee(employee.id, payload);
        notify('Employee updated.');
      } else {
        await createEmployee(payload);
        notify('Employee added.');
      }
      onSaved();
    } catch (err) {
      notifyError(err, 'Could not save this employee.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit employee' : 'Add employee'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="First name" fullWidth value={form.firstName} onChange={set('firstName')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Last name" fullWidth value={form.lastName} onChange={set('lastName')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Username" fullWidth value={form.username} onChange={set('username')} disabled={isEdit} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={set('email')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Department" fullWidth value={form.department} onChange={set('department')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Designation" fullWidth value={form.designation} onChange={set('designation')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Salary (₹/yr)" type="number" fullWidth value={form.salary} onChange={set('salary')} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Phone" fullWidth value={form.phone} onChange={set('phone')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={isEdit ? 'New password (optional)' : 'Password'}
                type="password"
                fullWidth
                value={form.password}
                onChange={set('password')}
                helperText={isEdit ? 'Leave blank to keep the current password.' : ' '}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 1, fontSize: '0.8rem', color: 'text.secondary', fontWeight: 600 }}>Roles</Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {ROLE_OPTIONS.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    clickable
                    onClick={() => toggleRole(role)}
                    color={form.roles.includes(role) ? 'secondary' : 'default'}
                    variant={form.roles.includes(role) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add employee'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
