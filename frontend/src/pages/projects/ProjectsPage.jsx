import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  AvatarGroup,
  Avatar,
  IconButton,
  Button,
  Tooltip,
  TablePagination,
  LinearProgress,
  TableSortLabel,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusPill from '../../components/common/StatusPill';
import PriorityPill from '../../components/common/PriorityPill';
import ProjectFormDialog from './ProjectFormDialog';
import { searchProjects, deleteProject } from '../../api/projectApi';
import { useNotify } from '../../context/NotificationContext';
import { formatDate, initialsOf } from '../../utils/format';

const STATUS_OPTIONS = ['', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED'];
const PRIORITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH'];

export default function ProjectsPage() {
  const { notify, notifyError } = useNotify();

  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchProjects({
        page,
        size,
        search,
        status,
        priority,
        sort: `${sortField},${sortDir}`,
      });
      setRows(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      notifyError(err, 'Could not load projects.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search, status, priority, sortField, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      setSearch(searchInput);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

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
      await deleteProject(confirmTarget.id);
      notify('Project deleted.');
      setConfirmTarget(null);
      load();
    } catch (err) {
      notifyError(err, 'Could not delete this project.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Projects"
        subtitle={`${totalElements} projects tracked.`}
        actions={
          <Button variant="contained" color="secondary" startIcon={<AddOutlinedIcon />} onClick={openCreate}>
            New project
          </Button>
        }
      />

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              placeholder="Search projects by name or description…"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Select size="small" value={status} displayEmpty onChange={(e) => { setPage(0); setStatus(e.target.value); }} sx={{ minWidth: 170 }}>
              <MenuItem value="">All statuses</MenuItem>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
              ))}
            </Select>
            <Select size="small" value={priority} displayEmpty onChange={(e) => { setPage(0); setPriority(e.target.value); }} sx={{ minWidth: 150 }}>
              <MenuItem value="">All priorities</MenuItem>
              {PRIORITY_OPTIONS.filter(Boolean).map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Sort by:
            </Typography>
            <TableSortLabel active={sortField === 'name'} direction={sortDir} onClick={() => handleSort('name')}>
              Name
            </TableSortLabel>
            <TableSortLabel active={sortField === 'status'} direction={sortDir} onClick={() => handleSort('status')}>
              Status
            </TableSortLabel>
            <TableSortLabel active={sortField === 'priority'} direction={sortDir} onClick={() => handleSort('priority')}>
              Priority
            </TableSortLabel>
            <TableSortLabel active={sortField === 'startDate'} direction={sortDir} onClick={() => handleSort('startDate')}>
              Start Date
            </TableSortLabel>
            <TableSortLabel active={sortField === 'endDate'} direction={sortDir} onClick={() => handleSort('endDate')}>
              End Date
            </TableSortLabel>
          </Stack>
        </Stack>
      </Paper>


      {loading && <LinearProgress color="secondary" sx={{ mb: 2, borderRadius: 1 }} />}

      {!loading && rows.length === 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
          <EmptyState title="No projects found" description="Try adjusting your filters, or create the first project." />
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {rows.map((project) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ pr: 1 }}>
                      {project.name}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(project)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setConfirmTarget(project)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <StatusPill status={project.status} />
                    <PriorityPill priority={project.priority} />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5, color: 'text.secondary' }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">
                      {formatDate(project.startDate)} — {formatDate(project.endDate)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.68rem' } }}>
                      {(project.employees || []).map((e) => (
                        <Tooltip key={e.id} title={`${e.firstName} ${e.lastName}`}>
                          <Avatar sx={{ bgcolor: '#EDF0F4', color: 'text.primary', fontWeight: 700 }}>
                            {initialsOf(e.firstName, e.lastName)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    <Typography variant="caption" color="text.secondary">
                      {(project.employees || []).length} assigned
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper variant="outlined" sx={{ mt: 2.5, borderRadius: 3 }}>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => { setSize(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[6, 12, 24]}
        />
      </Paper>

      <ProjectFormDialog open={formOpen} project={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete project?"
        description={`"${confirmTarget?.name}" and all of its tasks will be permanently removed.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  );
}
