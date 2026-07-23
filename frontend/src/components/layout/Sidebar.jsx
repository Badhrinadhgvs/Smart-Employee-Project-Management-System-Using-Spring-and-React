import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'; import { downloadAuditLogs } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';

export const DRAWER_WIDTH = 248;

// The signature mark: an interlocked ring that reads as both a progress
// indicator and an "S" — echoes the live completion rings used on the
// dashboards, so the brand mark is literally built from the product's data.
function Mark() {
  return (
    <Box
      component="svg"
      viewBox="0 0 40 40"
      sx={{ width: 32, height: 32, flexShrink: 0 }}
    >
      <circle cx="20" cy="20" r="17" fill="none" stroke="#6366F1" strokeWidth="4" />
      <path
        d="M20 3 A17 17 0 0 1 35.5 25"
        fill="none"
        stroke="#14B8A6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="5.5" fill="#F43F5E" />
    </Box>
  );
}

const ADMIN_LINKS = [
  { to: '/', label: 'Dashboard', icon: SpaceDashboardOutlinedIcon, end: true },
  { to: '/employees', label: 'Employees', icon: GroupsOutlinedIcon },
  { to: '/projects', label: 'Projects', icon: FolderOpenOutlinedIcon },
  { to: '/tasks', label: 'Tasks', icon: ChecklistOutlinedIcon },
  { to: '/reports', label: 'Reports', icon: AssessmentOutlinedIcon },
];

const EMPLOYEE_LINKS = [
  { to: '/', label: 'Dashboard', icon: SpaceDashboardOutlinedIcon, end: true },
  { to: '/employees', label: 'Directory', icon: GroupsOutlinedIcon },
  { to: '/tasks', label: 'My tasks', icon: ChecklistOutlinedIcon },
];

function SidebarContent() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const links = isAdmin ? ADMIN_LINKS : EMPLOYEE_LINKS;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 3 }}>
        <Mark />
        <Box>
          <Typography sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', lineHeight: 1.1 }}>
            Smart Emp
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
            PROJECT &amp; TASK OPS
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {links.map(({ to, label, icon: Icon, end }) => {
          const active = end ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              end={end}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                bgcolor: active ? 'rgba(99,102,241,0.22)' : 'transparent',
                borderLeft: active ? '3px solid #818CF8' : '3px solid transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: active ? 700 : 500 }}>
                {label}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ px: 2.5, py: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {isAdmin && <ListItemButton onClick={downloadAuditLogs} sx={{color:'rgba(255,255,255,0.65)',mb:1}}><ListItemIcon sx={{minWidth:36,color:'inherit'}}><DownloadOutlinedIcon fontSize="small" /></ListItemIcon><ListItemText primary="Download audit logs" primaryTypographyProps={{fontSize:'0.82rem'}} /></ListItemButton>}
        <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
          {isAdmin ? 'Admin workspace' : 'Employee workspace'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}
