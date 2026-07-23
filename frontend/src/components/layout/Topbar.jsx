import { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import { DRAWER_WIDTH } from './Sidebar';
import * as notificationApi from '../../api/notificationApi';

function initials(user) {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.username[0].toUpperCase();
}

function formatNotifTime(dateStr) {
  if (!dateStr) return '';
  const date = dayjs(dateStr);
  const now = dayjs();
  if (now.isSame(date, 'day')) {
    return date.format('hh:mm A');
  }
  return date.format('DD MMM, hh:mm A');
}

export default function Topbar({ onMenuClick, title, onToggleTheme, mode }) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Notification state
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleOpenNotifs = (event) => {
    setNotifAnchorEl(event.currentTarget);
    setLoadingNotifs(true);
    fetchNotifications().finally(() => setLoadingNotifs(false));
  };

  const handleCloseNotifs = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    signOut();
    navigate('/login', { replace: true });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isNotifOpen = Boolean(notifAnchorEl);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.05rem' }}>
          {title}
        </Typography>

        {/* Theme Toggle */}
        <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <IconButton onClick={onToggleTheme} color="inherit" aria-label="toggle theme">
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        {/* Bell Icon Notification Button */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleOpenNotifs}
            color="inherit"
            aria-label="notifications"
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Popover */}
        <Popover
          open={isNotifOpen}
          anchorEl={notifAnchorEl}
          onClose={handleCloseNotifs}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: { xs: 320, sm: 380 },
              maxHeight: 480,
              borderRadius: 3,
              boxShadow: 8,
              mt: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={700}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {unreadCount} new
                </Typography>
              )}
            </Stack>

            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon fontSize="small" />}
                onClick={handleMarkAllAsRead}
                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
              >
                Mark all read
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loadingNotifs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, px: 2, color: 'text.secondary' }}>
                <NotificationsOutlinedIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
                <Typography variant="body2">No notifications yet</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {notifications.map((item, idx) => (
                  <Box key={item.id || idx}>
                    <ListItem
                      button="true"
                      onClick={() => handleMarkAsRead(item.id, item.read)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        alignItems: 'flex-start',
                        bgcolor: item.read ? 'transparent' : 'action.hover',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: item.read ? 'transparent' : 'primary.main',
                          mt: 0.8,
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      />
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: item.read ? 600 : 700,
                                color: 'text.primary',
                                lineHeight: 1.3,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: 1, whiteSpace: 'nowrap', fontSize: '0.7rem' }}
                            >
                              {formatNotifTime(item.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < notifications.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </Popover>

        {/* User Info & Avatar */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', mr: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin ? 'Administrator' : 'Employee'}
          </Typography>
        </Box>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.25 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 38, height: 38, fontSize: '0.85rem', fontWeight: 700 }}>
            {initials(user)}
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight={700}>
              {user?.username}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
