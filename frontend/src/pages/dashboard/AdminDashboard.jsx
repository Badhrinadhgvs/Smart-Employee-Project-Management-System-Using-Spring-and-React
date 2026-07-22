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
  Avatar,
  Divider,
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatusPill from '../../components/common/StatusPill';
import { listAllEmployees } from '../../api/employeeApi';
import { searchProjects } from '../../api/projectApi';
import { listAllTasks } from '../../api/taskApi';
import { useNotify } from '../../context/NotificationContext';
import { formatDate, daysUntil, initialsOf } from '../../utils/format';
import { tokens } from '../../theme';

function KpiCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accent}1A`,
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontSize: '1.6rem', lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </Stack>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

const TASK_COLORS = { PENDING: '#94A3B8', IN_PROGRESS: '#0E8F82', COMPLETED: '#2FA36B' };
const PROJECT_COLORS = { NOT_STARTED: '#94A3B8', IN_PROGRESS: '#0E8F82', COMPLETED: '#2FA36B', SUSPENDED: '#D64545' };

export default function AdminDashboard() {
  const { notifyError } = useNotify();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        notifyError(err, 'Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taskStatusData = useMemo(() => {
    const counts = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    tasks.forEach((t) => (counts[t.status] = (counts[t.status] || 0) + 1));
    return Object.entries(counts).map(([status, value]) => ({ status, value }));
  }, [tasks]);

  const projectStatusData = useMemo(() => {
    const counts = { NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0, SUSPENDED: 0 };
    projects.forEach((p) => (counts[p.status] = (counts[p.status] || 0) + 1));
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, value]) => ({ status, value }));
  }, [projects]);

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'COMPLETED' && daysUntil(t.deadline) !== null && daysUntil(t.deadline) < 0);
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'COMPLETED' && t.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);
  const workloadData = useMemo(() => employees.map((e) => ({ name: `${e.firstName || ''} ${(e.lastName || '')[0] || ''}`.trim(), assigned: tasks.filter((t) => t.assignedEmployee?.id === e.id).length, completed: tasks.filter((t) => t.assignedEmployee?.id === e.id && t.status === 'COMPLETED').length })).filter((e) => e.assigned).slice(0, 8), [employees, tasks]);
  const deadlineTrend = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return { day: i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' }), tasks: tasks.filter((t) => t.status !== 'COMPLETED' && t.deadline && new Date(t.deadline).toDateString() === d.toDateString()).length }; }), [tasks]);

  return (
    <Box>
      <PageHeader title="Admin overview" subtitle="Live snapshot across employees, projects and tasks." />

      {loading && <LinearProgress color="secondary" sx={{ mb: 3, borderRadius: 1 }} />}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard icon={GroupsOutlinedIcon} label="Employees" value={employees.length} accent={tokens.navy} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            icon={FolderOpenOutlinedIcon}
            label="Active projects"
            value={projects.filter((p) => p.status === 'IN_PROGRESS').length}
            accent={tokens.teal}
            sub={`${projects.length} total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            icon={ChecklistOutlinedIcon}
            label="Tasks completed"
            value={`${completedTasks}/${tasks.length}`}
            accent={tokens.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard icon={ReportProblemOutlinedIcon} label="Overdue tasks" value={overdueTasks.length} accent={tokens.danger} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Task status breakdown
            </Typography>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusData} dataKey="value" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {taskStatusData.map((entry) => (
                      <Cell key={entry.status} fill={TASK_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mt: 1 }}>
              {taskStatusData.map((d) => (
                <Stack key={d.status} direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: TASK_COLORS[d.status] }} />
                  <Typography variant="caption" color="text.secondary">
                    {d.status.replace('_', ' ')} ({d.value})
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Projects by status
            </Typography>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatusData} barSize={38}>
                  <CartesianGrid vertical={false} stroke="#E3E8EF" />
                  <XAxis dataKey="status" tickFormatter={(v) => v.replace('_', ' ')} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {projectStatusData.map((entry) => (
                      <Cell key={entry.status} fill={PROJECT_COLORS[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Upcoming deadlines
            </Typography>
            {upcomingDeadlines.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No open tasks with a deadline right now.
              </Typography>
            ) : (
              <List disablePadding>
                {upcomingDeadlines.map((t, i) => (
                  <Box key={t.id}>
                    <ListItem
                      disableGutters
                      secondaryAction={<StatusPill status={t.status} />}
                    >
                      <Avatar sx={{ bgcolor: '#EDF0F4', color: 'text.primary', mr: 2, fontSize: '0.8rem', fontWeight: 700 }}>
                        {initialsOf(t.assignedEmployee?.firstName, t.assignedEmployee?.lastName) || '—'}
                      </Avatar>
                      <ListItemText
                        primary={t.title}
                        secondary={`${t.project?.name || 'Unassigned project'} · due ${formatDate(t.deadline)}`}
                      />
                    </ListItem>
                    {i < upcomingDeadlines.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>Team workload</Typography>
            <Typography variant="caption" color="text.secondary">Assigned versus completed tasks by team member</Typography>
            <Box sx={{ height: 245, mt: 1 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={workloadData} barGap={4}><CartesianGrid vertical={false} stroke="currentColor" opacity={0.1} /><XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip /><Legend /><Bar dataKey="assigned" name="Assigned" fill={tokens.navy} radius={[5, 5, 0, 0]} /><Bar dataKey="completed" name="Completed" fill={tokens.teal} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700}>Upcoming workload</Typography>
            <Typography variant="caption" color="text.secondary">Open deadlines over the next 7 days</Typography>
            <Box sx={{ height: 245, mt: 1 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={deadlineTrend}><defs><linearGradient id="deadlineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={tokens.coral} stopOpacity={0.35} /><stop offset="100%" stopColor={tokens.coral} stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="currentColor" opacity={0.1} /><XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="tasks" name="Open tasks" stroke={tokens.coral} fill="url(#deadlineFill)" strokeWidth={3} /></AreaChart></ResponsiveContainer></Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
