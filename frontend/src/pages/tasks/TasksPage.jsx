import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusPill from '../../components/common/StatusPill';
import PriorityPill from '../../components/common/PriorityPill';
import ExportMenu from '../../components/common/ExportMenu';
import TaskFormDialog from './TaskFormDialog';
import { listAllTasks, listTasksByEmployee, deleteTask, updateTaskStatus } from '../../api/taskApi';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';
import { downloadCsv, downloadPdf } from '../../utils/exportUtils';

const STATUS_OPTIONS = ['', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH'];

export default function TasksPage() {
  const { user, isAdmin } = useAuth();
  const { notify, notifyError } = useNotify();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAdmin ? await listAllTasks() : await listTasksByEmployee(user.id);
      setTasks(data || []);
    } catch (err) {
      notifyError(err, 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q && !`${t.title} ${t.project?.name || ''}`.toLowerCase().includes(q)) return false;
      if (status && t.status !== status) return false;
      if (priority && t.priority !== priority) return false;
      return true;
    });
  }, [tasks, search, status, priority]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };
  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(confirmTarget.id);
      notify('Task deleted.');
      setConfirmTarget(null);
      load();
    } catch (err) {
      notifyError(err, 'Could not delete this task.');
    } finally {
      setDeleting(false);
    }
  };

  const quickStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      notify('Status updated.');
      load();
    } catch (err) {
      notifyError(err, 'Could not update status.');
    }
  };

  const exportHeaders = ['Task Title', 'Project', 'Assigned Employee', 'Priority', 'Deadline', 'Status', 'Remarks'];
  const getExportRows = () =>
    filtered.map((t) => [
      t.title,
      t.project?.name || 'No project',
      t.assignedEmployee ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}` : 'Unassigned',
      t.priority,
      t.deadline ? formatDate(t.deadline) : 'No deadline',
      t.status,
      t.remarks || '',
    ]);

  const handleExportCsv = () => {
    downloadCsv(isAdmin ? 'all_tasks_report.csv' : 'my_tasks_report.csv', exportHeaders, getExportRows());
    notify('Task report downloaded as CSV.');
  };

  const handleExportPdf = () => {
    const visuals = [
      { label: 'Completed', value: filtered.filter((t) => t.status === 'COMPLETED').length },
      { label: 'In Progress', value: filtered.filter((t) => t.status === 'IN_PROGRESS').length },
      { label: 'Pending', value: filtered.filter((t) => t.status === 'PENDING').length },
    ];
    downloadPdf(
      isAdmin ? 'all_tasks_report.pdf' : 'my_tasks_report.pdf',
      isAdmin ? 'All Project Tasks Report' : `My Assigned Tasks (${user?.firstName || user?.username})`,
      exportHeaders,
      getExportRows(),
      `${filtered.length} task(s) listed`,
      visuals
    );
    notify('Task report downloaded as PDF.');
  };

  return (
    <Box>
      <PageHeader
        title={isAdmin ? 'Tasks' : 'My tasks'}
        subtitle={isAdmin ? `${tasks.length} tasks across all projects.` : `${tasks.length} tasks assigned to you.`}
        actions={
          <Stack direction="row" spacing={1.5} alignItems="center">
            {filtered.length > 0 && (
              <ExportMenu onExportCsv={handleExportCsv} onExportPdf={handleExportPdf} buttonText="Export Tasks" />
            )}
            {isAdmin && (
              <Button variant="contained" color="secondary" startIcon={<AddOutlinedIcon />} onClick={openCreate}>
                New task
              </Button>
            )}
          </Stack>
        }
      />

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            placeholder="Search tasks by title or project…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Select size="small" value={status} displayEmpty onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">All statuses</MenuItem>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
            ))}
          </Select>
          <Select size="small" value={priority} displayEmpty onChange={(e) => setPriority(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All priorities</MenuItem>
            {PRIORITY_OPTIONS.filter(Boolean).map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Paper>

      {loading && <LinearProgress color="secondary" sx={{ mb: 2, borderRadius: 1 }} />}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {!loading && filtered.length === 0 ? (
          <EmptyState title="No tasks found" description="Try adjusting your filters." />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Project</TableCell>
                  {isAdmin && <TableCell>Assigned to</TableCell>}
                  <TableCell>Priority</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 220 }}>{t.title}</TableCell>
                    <TableCell>{t.project?.name || '—'}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        {t.assignedEmployee ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}` : 'Unassigned'}
                      </TableCell>
                    )}
                    <TableCell><PriorityPill priority={t.priority} /></TableCell>
                    <TableCell>{formatDate(t.deadline)}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={t.status}
                        onChange={(e) => quickStatusChange(t.id, e.target.value)}
                        renderValue={(v) => <StatusPill status={v} />}
                        sx={{ '.MuiSelect-select': { py: 0.25, display: 'flex', alignItems: 'center' } }}
                      >
                        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
                          <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      {isAdmin && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(t)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setConfirmTarget(t)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      {isAdmin && (
        <TaskFormDialog open={formOpen} task={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete task?"
        description={`"${confirmTarget?.title}" will be permanently removed.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  );
}
