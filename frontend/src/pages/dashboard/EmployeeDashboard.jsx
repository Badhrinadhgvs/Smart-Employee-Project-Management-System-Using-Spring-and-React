import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Divider,
} from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import StatusPill from '../../components/common/StatusPill';
import PriorityPill from '../../components/common/PriorityPill';
import EmptyState from '../../components/common/EmptyState';
import ExportMenu from '../../components/common/ExportMenu';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';
import { listTasksByEmployee, updateTaskStatus } from '../../api/taskApi';
import { formatDate, daysUntil } from '../../utils/format';
import { downloadCsv, downloadPdf } from '../../utils/exportUtils';
import { tokens } from '../../theme';

function CompletionRing({ percent }) {
  const size = 140;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E3E8EF" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.teal}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ fontSize: '1.6rem' }}>
          {percent}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          complete
        </Typography>
      </Box>
    </Box>
  );
}

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { notify, notifyError } = useNotify();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await listTasksByEmployee(user.id);
      setTasks(data || []);
    } catch (err) {
      notifyError(err, 'Could not load your tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'COMPLETED' && t.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [tasks]
  );

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, { status });
      notify('Task status updated.');
      load();
    } catch (err) {
      notifyError(err, 'Could not update task status.');
    }
  };

  const exportHeaders = ['Task Title', 'Project', 'Priority', 'Deadline', 'Status', 'Remarks'];
  const getExportRows = () =>
    tasks.map((t) => [
      t.title,
      t.project?.name || 'No project',
      t.priority,
      t.deadline ? formatDate(t.deadline) : 'No deadline',
      t.status,
      t.remarks || '',
    ]);

  const handleExportCsv = () => {
    downloadCsv(`${user?.username || 'employee'}_assigned_tasks.csv`, exportHeaders, getExportRows());
    notify('Employee task list downloaded as CSV.');
  };

  const handleExportPdf = () => {
    const summary = `${completed} / ${tasks.length} tasks completed (${percent}%)`;
    const visuals = [
      { label: 'Completed', value: completed },
      { label: 'In Progress', value: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
      { label: 'Pending', value: tasks.filter((t) => t.status === 'PENDING').length },
    ];
    downloadPdf(
      `${user?.username || 'employee'}_assigned_tasks.pdf`,
      `My Assigned Work & Project Tasks (${user?.firstName || user?.username})`,
      exportHeaders,
      getExportRows(),
      summary,
      visuals
    );
    notify('Employee task list downloaded as PDF.');
  };

  return (
    <Box>
      <PageHeader
        title={`Hi, ${user?.firstName || user?.username}`}
        subtitle="Here's where your work stands today."
        actions={
          tasks.length > 0 ? (
            <ExportMenu onExportCsv={handleExportCsv} onExportPdf={handleExportPdf} buttonText="Download My Work" />
          ) : null
        }
      />

      {loading && <LinearProgress color="secondary" sx={{ mb: 3, borderRadius: 1 }} />}

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ alignSelf: 'flex-start', mb: 2 }}>
              Your completion rate
            </Typography>
            <CompletionRing percent={percent} />
            <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{tasks.length}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Assigned
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{completed}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{upcoming.length}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Open
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Upcoming deadlines
            </Typography>
            {upcoming.length === 0 ? (
              <EmptyState title="Nothing due" description="Every open task is deadline-free right now." />
            ) : (
              <List disablePadding>
                {upcoming.map((t, i) => {
                  const days = daysUntil(t.deadline);
                  return (
                    <Box key={t.id}>
                      <ListItem
                        disableGutters
                        secondaryAction={
                          <Select
                            size="small"
                            value={t.status}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            sx={{ minWidth: 150, fontSize: '0.8rem' }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>
                                {s.replace('_', ' ')}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                      >
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Typography fontWeight={600}>{t.title}</Typography>
                              <PriorityPill priority={t.priority} />
                            </Stack>
                          }
                          secondary={`${t.project?.name || 'No project'} · due ${formatDate(t.deadline)}${
                            days < 0 ? ` · ${Math.abs(days)}d overdue` : days === 0 ? ' · due today' : ` · ${days}d left`
                          }`}
                        />
                      </ListItem>
                      {i < upcoming.length - 1 && <Divider component="li" />}
                    </Box>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              All assigned tasks
            </Typography>
            {tasks.length === 0 ? (
              <EmptyState title="No tasks yet" description="Your admin hasn't assigned any tasks to you." />
            ) : (
              <List disablePadding>
                {tasks.map((t, i) => (
                  <Box key={t.id}>
                    <ListItem disableGutters secondaryAction={<StatusPill status={t.status} />}>
                      <ListItemText
                        primary={t.title}
                        secondary={t.remarks ? t.remarks : t.project?.name || 'No project'}
                      />
                    </ListItem>
                    {i < tasks.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
