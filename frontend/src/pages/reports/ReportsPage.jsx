import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Button,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PageHeader from '../../components/common/PageHeader';
import StatusPill from '../../components/common/StatusPill';
import PriorityPill from '../../components/common/PriorityPill';
import EmptyState from '../../components/common/EmptyState';
import { listAllEmployees } from '../../api/employeeApi';
import { searchProjects } from '../../api/projectApi';
import { listAllTasks } from '../../api/taskApi';
import { useNotify } from '../../context/NotificationContext';
import { formatDate, daysUntil } from '../../utils/format';
import { tokens } from '../../theme';

// Minimal CSV export — no extra dependency needed for this bonus feature.
function downloadCsv(filename, headers, rows) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { notifyError } = useNotify();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [emp, proj, tsk] = await Promise.all([
          listAllEmployees(),
          searchProjects({ page: 0, size: 200 }),
          listAllTasks(),
        ]);
        setEmployees(emp || []);
        setProjects(proj?.content || []);
        setTasks(tsk || []);
      } catch (err) {
        notifyError(err, 'Could not load report data.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employeeReport = useMemo(
    () =>
      employees.map((emp) => {
        const empTasks = tasks.filter((t) => t.assignedEmployee?.id === emp.id);
        const completed = empTasks.filter((t) => t.status === 'COMPLETED').length;
        const inProgress = empTasks.filter((t) => t.status === 'IN_PROGRESS').length;
        const pending = empTasks.filter((t) => t.status === 'PENDING').length;
        return { ...emp, total: empTasks.length, completed, inProgress, pending };
      }),
    [employees, tasks]
  );

  const projectReport = useMemo(
    () =>
      projects.map((proj) => {
        const projTasks = tasks.filter((t) => t.project?.id === proj.id);
        const completed = projTasks.filter((t) => t.status === 'COMPLETED').length;
        const pct = projTasks.length ? Math.round((completed / projTasks.length) * 100) : 0;
        return { ...proj, totalTasks: projTasks.length, completed, pct };
      }),
    [projects, tasks]
  );

  const pendingReport = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'COMPLETED')
        .sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31')),
    [tasks]
  );

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Aggregated views for planning and status reviews." />

      {loading && <LinearProgress color="secondary" sx={{ mb: 3, borderRadius: 1 }} />}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5 }}>
        <Tab label="Employee-wise tasks" />
        <Tab label="Project progress" />
        <Tab label="Pending tasks" />
      </Tabs>

      {tab === 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
            <Button
              size="small"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() =>
                downloadCsv(
                  'employee_task_report.csv',
                  ['Employee', 'Department', 'Total', 'Completed', 'In progress', 'Pending'],
                  employeeReport.map((e) => [`${e.firstName} ${e.lastName}`, e.department, e.total, e.completed, e.inProgress, e.pending])
                )
              }
            >
              Export CSV
            </Button>
          </Stack>
          {employeeReport.length === 0 ? (
            <EmptyState title="No employees to report on" />
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Completed</TableCell>
                    <TableCell align="right">In progress</TableCell>
                    <TableCell align="right">Pending</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeReport.map((e) => (
                    <TableRow key={e.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{e.firstName} {e.lastName}</TableCell>
                      <TableCell>{e.department || '—'}</TableCell>
                      <TableCell align="right">{e.total}</TableCell>
                      <TableCell align="right">{e.completed}</TableCell>
                      <TableCell align="right">{e.inProgress}</TableCell>
                      <TableCell align="right">{e.pending}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
            <Button
              size="small"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() =>
                downloadCsv(
                  'project_progress_report.csv',
                  ['Project', 'Status', 'Priority', 'Total tasks', 'Completed', '% complete'],
                  projectReport.map((p) => [p.name, p.status, p.priority, p.totalTasks, p.completed, `${p.pct}%`])
                )
              }
            >
              Export CSV
            </Button>
          </Stack>
          {projectReport.length === 0 ? (
            <EmptyState title="No projects to report on" />
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell align="right">Tasks</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectReport.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                      <TableCell><StatusPill status={p.status} /></TableCell>
                      <TableCell><PriorityPill priority={p.priority} /></TableCell>
                      <TableCell align="right">{p.completed}/{p.totalTasks}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={p.pct}
                            sx={{
                              flexGrow: 1,
                              height: 7,
                              borderRadius: 4,
                              bgcolor: '#EDF0F4',
                              '& .MuiLinearProgress-bar': { bgcolor: tokens.teal, borderRadius: 4 },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
                            {p.pct}%
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      )}

      {tab === 2 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
            <Button
              size="small"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() =>
                downloadCsv(
                  'pending_task_report.csv',
                  ['Task', 'Project', 'Assigned to', 'Priority', 'Status', 'Deadline'],
                  pendingReport.map((t) => [
                    t.title,
                    t.project?.name || '',
                    t.assignedEmployee ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}` : 'Unassigned',
                    t.priority,
                    t.status,
                    t.deadline || '',
                  ])
                )
              }
            >
              Export CSV
            </Button>
          </Stack>
          {pendingReport.length === 0 ? (
            <EmptyState title="No pending tasks" description="Everything assigned so far is complete." />
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Assigned to</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Deadline</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReport.map((t) => {
                    const days = daysUntil(t.deadline);
                    const overdue = days !== null && days < 0;
                    return (
                      <TableRow key={t.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                        <TableCell>{t.project?.name || '—'}</TableCell>
                        <TableCell>{t.assignedEmployee ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}` : 'Unassigned'}</TableCell>
                        <TableCell><PriorityPill priority={t.priority} /></TableCell>
                        <TableCell><StatusPill status={t.status} /></TableCell>
                        <TableCell sx={{ color: overdue ? 'error.main' : 'text.primary', fontWeight: overdue ? 700 : 400 }}>
                          {formatDate(t.deadline)}
                          {overdue ? ' · overdue' : ''}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
