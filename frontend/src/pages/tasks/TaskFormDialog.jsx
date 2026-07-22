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
  Box,
} from '@mui/material';
import { createTask, updateTask } from '../../api/taskApi';
import { listAllEmployees } from '../../api/employeeApi';
import { searchProjects } from '../../api/projectApi';
import { useNotify } from '../../context/NotificationContext';

const EMPTY = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  deadline: '',
  remarks: '',
  assignedEmployeeId: '',
  projectId: '',
};

export default function TaskFormDialog({ open, task, onClose, onSaved }) {
  const { notify, notifyError } = useNotify();
  const [form, setForm] = useState(EMPTY);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const isEdit = !!task;

  useEffect(() => {
    if (!open) return;
    listAllEmployees().then(setEmployees).catch(() => setEmployees([]));
    searchProjects({ page: 0, size: 200 })
      .then((data) => setProjects(data.content || []))
      .catch(() => setProjects([]));
    setForm(
      task
        ? {
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'PENDING',
            priority: task.priority || 'MEDIUM',
            deadline: task.deadline || '',
            remarks: task.remarks || '',
            assignedEmployeeId: task.assignedEmployee?.id || '',
            projectId: task.project?.id || '',
          }
        : EMPTY
    );
  }, [open, task]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      notify('Task title is required.', 'error');
      return;
    }
    if (form.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) {
      notify('Enter a valid deadline date.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        deadline: form.deadline || null,
        assignedEmployeeId: form.assignedEmployeeId || null,
        projectId: form.projectId || null,
      };
      if (isEdit) {
        await updateTask(task.id, payload);
        notify('Task updated.');
      } else {
        await createTask(payload);
        notify('Task created.');
      }
      onSaved();
    } catch (err) {
      notifyError(err, 'Could not save this task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit task' : 'New task'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Title" fullWidth value={form.title} onChange={set('title')} />
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
                <InputLabel>Project</InputLabel>
                <Select label="Project" value={form.projectId} onChange={set('projectId')}>
                  <MenuItem value="">No project</MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned to</InputLabel>
                <Select label="Assigned to" value={form.assignedEmployeeId} onChange={set('assignedEmployeeId')}>
                  <MenuItem value="">Unassigned</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={set('status')}>
                  {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
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
                label="Deadline"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.deadline}
                onChange={set('deadline')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                fullWidth
                multiline
                minRows={2}
                value={form.remarks}
                onChange={set('remarks')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
