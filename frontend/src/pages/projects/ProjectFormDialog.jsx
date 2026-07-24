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
  Select,
  InputLabel,
  FormControl,
  Chip,
  Box,
} from '@mui/material';
import { createProject, updateProject } from '../../api/projectApi';
import { listAllEmployees } from '../../api/employeeApi';
import { useNotify } from '../../context/NotificationContext';
import { validateTitle, validateDate } from '../../utils/validation';

const EMPTY = {
  name: '',
  description: '',
  status: 'NOT_STARTED',
  priority: 'MEDIUM',
  startDate: '',
  endDate: '',
  employeeIds: [],
};

export default function ProjectFormDialog({ open, project, onClose, onSaved }) {
  const { notify, notifyError } = useNotify();
  const [form, setForm] = useState(EMPTY);
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const isEdit = !!project;

  useEffect(() => {
    if (!open) return;
    listAllEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]));
    setForm(
      project
        ? {
            name: project.name || '',
            description: project.description || '',
            status: project.status || 'NOT_STARTED',
            priority: project.priority || 'MEDIUM',
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            employeeIds: (project.employees || []).map((e) => e.id),
          }
        : EMPTY
    );
  }, [open, project]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const titleErr = validateTitle(form.name, 'Project name');
    if (titleErr) { notify(titleErr, 'error'); return; }

    const sdErr = validateDate(form.startDate, 'Start date');
    if (sdErr) { notify(sdErr, 'error'); return; }

    const edErr = validateDate(form.endDate, 'End date');
    if (edErr) { notify(edErr, 'error'); return; }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      notify('End date cannot be before the start date.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, startDate: form.startDate || null, endDate: form.endDate || null };
      if (isEdit) {
        await updateProject(project.id, payload);
        notify('Project updated.');
      } else {
        await createProject(payload);
        notify('Project created.');
      }
      onSaved();
    } catch (err) {
      notifyError(err, 'Could not save this project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit project' : 'New project'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Project name" fullWidth value={form.name} onChange={set('name')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                value={form.description}
                onChange={set('description')}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={set('status')}>
                  {['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED'].map((s) => (
                    <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" value={form.priority} onChange={set('priority')}>
                  {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={set('startDate')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={set('endDate')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assigned employees</InputLabel>
                <Select
                  multiple
                  label="Assigned employees"
                  value={form.employeeIds}
                  onChange={set('employeeIds')}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const emp = employees.find((e) => e.id === id);
                        return <Chip key={id} size="small" label={emp ? `${emp.firstName} ${emp.lastName}` : id} />;
                      })}
                    </Box>
                  )}
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} — {emp.designation || emp.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
