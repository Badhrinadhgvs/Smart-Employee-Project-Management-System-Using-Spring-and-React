import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  Avatar,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmployeeFormDialog from './EmployeeFormDialog';
import { searchEmployees, deleteEmployee } from '../../api/employeeApi';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';
import { formatCurrency, formatDate, initialsOf, roleLabel } from '../../utils/format';
import { pendingUsers, approveUser } from '../../api/adminApi';

const DEPARTMENTS = ['', 'Engineering', 'Executive', 'HR', 'Finance', 'Operations', 'Sales'];

export default function EmployeesPage() {
  const { isAdmin } = useAuth();
  const { notify, notifyError } = useNotify();

  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchEmployees({
        page,
        size,
        search,
        department,
        sort: `${sortField},${sortDir}`,
      });
      setRows(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      notifyError(err, 'Could not load employees.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search, department, sortField, sortDir]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => { if (isAdmin) pendingUsers().then(setPending).catch(() => {}); }, [isAdmin]);

  // Debounce search input so we don't hit the API on every keystroke.
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      setSearch(searchInput);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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
      await deleteEmployee(confirmTarget.id);
      notify('Employee removed.');
      setConfirmTarget(null);
      load();
    } catch (err) {
      notifyError(err, 'Could not delete this employee.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Employees"
        subtitle={`${totalElements} people across the organization.`}
        actions={
          isAdmin && (
            <Button variant="contained" color="secondary" startIcon={<PersonAddAlt1OutlinedIcon />} onClick={openCreate}>
              Add employee
            </Button>
          )
        }
      />
      {isAdmin && pending.length > 0 && <Paper variant="outlined" sx={{p:2,mb:2,borderRadius:3}}><Typography variant="subtitle1" fontWeight={700}>Pending registrations</Typography><Stack spacing={1} sx={{mt:1}}>{pending.map(u => <Stack key={u.id} direction="row" alignItems="center" justifyContent="space-between"><Typography variant="body2">{u.firstName} {u.lastName} ({u.username})</Typography><Button size="small" variant="contained" onClick={async()=>{await approveUser(u.id);setPending(pending.filter(x=>x.id!==u.id));notify('Account approved.')}}>Approve</Button></Stack>)}</Stack></Paper>}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2.5 }}>
          <TextField
            placeholder="Search by name, email, department…"
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
          <Select
            size="small"
            value={department}
            displayEmpty
            onChange={(e) => {
              setPage(0);
              setDepartment(e.target.value);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All departments</MenuItem>
            {DEPARTMENTS.filter(Boolean).map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {!loading && rows.length === 0 ? (
          <EmptyState title="No employees found" description="Try a different search term or department filter." />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel active={sortField === 'firstName'} direction={sortDir} onClick={() => handleSort('firstName')}>
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={sortField === 'department'} direction={sortDir} onClick={() => handleSort('department')}>
                      Department
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Roles</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <TableSortLabel active={sortField === 'salary'} direction={sortDir} onClick={() => handleSort('salary')}>
                        Salary
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell>Hired</TableCell>
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: '#EDF0F4', color: 'text.primary', fontSize: '0.78rem', fontWeight: 700 }}>
                          {initialsOf(row.firstName, row.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {row.firstName} {row.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.department || '—'}</TableCell>
                    <TableCell>{row.designation || '—'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {(row.roles || []).map((r) => (
                          <Chip key={r} size="small" label={roleLabel(r)} sx={{ bgcolor: '#EDF0F4' }} />
                        ))}
                      </Stack>
                    </TableCell>
                    {isAdmin && <TableCell>{formatCurrency(row.salary)}</TableCell>}
                    <TableCell>{formatDate(row.hireDate)}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(row)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={row.id === 1 ? 'The primary admin cannot be removed' : 'Delete'}>
                          <span>
                            <IconButton size="small" disabled={row.id === 1} onClick={() => setConfirmTarget(row)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => {
            setSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {isAdmin && (
        <EmployeeFormDialog open={formOpen} employee={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Remove employee?"
        description={`This removes ${confirmTarget?.firstName} ${confirmTarget?.lastName} and their task assignments will need to be reassigned.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  );
}
