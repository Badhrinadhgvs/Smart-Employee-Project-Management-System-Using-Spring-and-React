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
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

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

function drawPdfBars(doc, items, startY) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const colors = [[55, 48, 163], [15, 118, 110], [225, 29, 72], [217, 119, 6]];
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30, 41, 59); doc.text('Visual summary', 16, startY);
  items.forEach((item, index) => {
    const y = startY + 8 + index * 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.text(String(item.label).slice(0, 25), 16, y + 3);
    doc.setFillColor(235, 238, 245); doc.roundedRect(62, y, 105, 4, 2, 2, 'F');
    doc.setFillColor(...colors[index % colors.length]); doc.roundedRect(62, y, Math.max(2, (105 * item.value) / max), 4, 2, 2, 'F');
    doc.setTextColor(30, 41, 59); doc.text(String(item.value), 172, y + 3);
  });
}

function downloadPdf(filename, title, headers, rows, summary, visuals = []) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const navy = [27, 42, 74];
  doc.setFillColor(...navy); doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('Smart Emp', 16, 15);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('PROJECT & TASK OPS  /  MANAGEMENT REPORT', 16, 24);
  doc.setTextColor(...navy); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(title, 16, 49);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(91, 100, 114); doc.text(`Generated ${new Date().toLocaleDateString()}${summary ? `  •  ${summary}` : ''}`, 16, 57);
  const visualHeight = visuals.length ? 8 + visuals.length * 8 + 8 : 0;
  if (visuals.length) drawPdfBars(doc, visuals, 68);
  autoTable(doc, { startY: 66 + visualHeight, head: [headers], body: rows, theme: 'grid', styles: { font: 'helvetica', fontSize: 8, cellPadding: 3, textColor: [22, 35, 63], lineColor: [227, 232, 239], lineWidth: 0.2 }, headStyles: { fillColor: navy, textColor: 255, fontStyle: 'bold' }, alternateRowStyles: { fillColor: [247, 249, 252] }, margin: { left: 16, right: 16 }, didDrawPage: () => { doc.setFontSize(8); doc.setTextColor(120); doc.text(`Smart Emp  •  Page ${doc.getNumberOfPages()}`, 16, 287); } });
  doc.save(filename);
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
              onClick={() => {
                downloadPdf(
                  'employee_task_report.pdf', 'Employee task report',
                  ['Employee', 'Department', 'Total', 'Completed', 'In progress', 'Pending'],
                  employeeReport.map((e) => [`${e.firstName} ${e.lastName}`, e.department, e.total, e.completed, e.inProgress, e.pending])
                  , '', [{ label: 'Completed', value: employeeReport.reduce((sum, e) => sum + e.completed, 0) }, { label: 'In progress', value: employeeReport.reduce((sum, e) => sum + e.inProgress, 0) }, { label: 'Pending', value: employeeReport.reduce((sum, e) => sum + e.pending, 0) }]
                );
              }}
            >
              Download PDF
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
              onClick={() => {
                downloadPdf(
                  'project_progress_report.pdf', 'Project progress report',
                  ['Project', 'Status', 'Priority', 'Total tasks', 'Completed', '% complete'],
                  projectReport.map((p) => [p.name, p.status, p.priority, p.totalTasks, p.completed, `${p.pct}%`])
                  , '', projectReport.slice().sort((a, b) => b.pct - a.pct).slice(0, 5).map((p) => ({ label: p.name, value: p.pct }))
                );
              }}
            >
              Download PDF
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
              onClick={() => {
                downloadPdf(
                  'pending_task_report.pdf', 'Pending task report',
                  ['Task', 'Project', 'Assigned to', 'Priority', 'Status', 'Deadline'],
                  pendingReport.map((t) => [
                    t.title,
                    t.project?.name || '',
                    t.assignedEmployee ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}` : 'Unassigned',
                    t.priority,
                    t.status,
                    t.deadline || '',
                  ])
                  , '', [{ label: 'High priority', value: pendingReport.filter((t) => t.priority === 'HIGH').length }, { label: 'Medium priority', value: pendingReport.filter((t) => t.priority === 'MEDIUM').length }, { label: 'Low priority', value: pendingReport.filter((t) => t.priority === 'LOW').length }]
                );
              }}
            >
              Download PDF
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
