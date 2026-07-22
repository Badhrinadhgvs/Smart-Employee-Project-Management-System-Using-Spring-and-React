import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/reports': 'Reports',
};

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = '/' + pathname.split('/')[1];
  return TITLES[base] || 'Smart Emp';
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} title={titleFor(location.pathname)} />
        <Toolbar />
        <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
