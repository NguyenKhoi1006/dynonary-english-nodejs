import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, IconButton, Avatar, Menu, MenuItem, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, School as SchoolIcon,
  People as PeopleIcon, CalendarMonth as CalendarIcon, Message as MessageIcon,
  Star as StarIcon, Settings as SettingsIcon, Logout as LogoutIcon,
  DarkMode as DarkModeIcon, LightMode as LightModeIcon,
  VideoLibrary as VideoLibraryIcon, MonetizationOn as MonetizationOnIcon,
  AdminPanelSettings as AdminIcon, Person as PersonIcon,
  Book as BookIcon, Quiz as QuizIcon, Assignment as AssignmentIcon,
  RecordVoiceOver as RecordVoiceOverIcon, Article as ArticleIcon,
  History as HistoryIcon, Schedule as ScheduleIcon, EventNote as EventNoteIcon,
  AppRegistration as AppRegistrationIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { toggleTheme } from '../store/slices/uiSlice';
import { logoutUser } from '../services/auth.service';
import { clearUser } from '../store/slices/userSlice';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'tutor' | 'admin';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(s => s.user);
  const { themeMode } = useAppSelector(s => s.ui);

  const navItems: NavItem[] = [
    // Admin
    { label: 'Dashboard', path: '/admin', icon: <AdminIcon />, roles: ['admin'] },
    { label: 'Người dùng', path: '/admin/users', icon: <PeopleIcon />, roles: ['admin'] },
    { label: 'Bài học', path: '/admin/materials', icon: <BookIcon />, roles: ['admin'] },
    { label: 'Bài kiểm tra', path: '/admin/tests', icon: <QuizIcon />, roles: ['admin'] },
    { label: 'Kiểm tra đầu vào', path: '/admin/placement-tests', icon: <AssignmentIcon />, roles: ['admin'] },
    { label: 'Gia sư', path: '/admin/tutors', icon: <RecordVoiceOverIcon />, roles: ['admin'] },
    { label: 'Nội dung', path: '/admin/content', icon: <ArticleIcon />, roles: ['admin'] },
    { label: 'Lịch sử', path: '/admin/activity', icon: <HistoryIcon />, roles: ['admin'] },
    // Student
    { label: 'Tìm gia sư', path: '/tutors', icon: <PeopleIcon />, roles: ['student'] },
    { label: 'Khóa học', path: '/courses', icon: <SchoolIcon />, roles: ['student'] },
    { label: 'Lịch học', path: '/sessions', icon: <CalendarIcon />, roles: ['student'] },
    { label: 'Tin nhắn', path: '/messages', icon: <MessageIcon />, roles: ['student', 'tutor'] },
    { label: 'Đánh giá', path: '/reviews', icon: <StarIcon />, roles: ['student', 'tutor'] },
    // Tutor
    { label: 'Dashboard', path: '/tutor', icon: <DashboardIcon />, roles: ['tutor'] },
    { label: 'Lịch rảnh', path: '/tutor/availability', icon: <ScheduleIcon />, roles: ['tutor'] },
    { label: 'Lịch đặt', path: '/tutor/bookings', icon: <EventNoteIcon />, roles: ['tutor'] },
    { label: 'Học viên', path: '/students', icon: <PeopleIcon />, roles: ['tutor'] },
    { label: 'Doanh thu', path: '/earnings', icon: <MonetizationOnIcon />, roles: ['tutor'] },
    { label: 'Bài giảng', path: '/my-courses', icon: <VideoLibraryIcon />, roles: ['tutor'] },
    { label: 'Hồ sơ gia sư', path: '/tutor/profile', icon: <PersonIcon />, roles: ['tutor'] },
    { label: 'Đăng ký gia sư', path: '/tutor/apply', icon: <AppRegistrationIcon />, roles: ['tutor'] },
    // Shared
    { label: 'Hồ sơ', path: '/profile', icon: <PersonIcon />, roles: ['student', 'tutor', 'admin'] },
    { label: 'Cài đặt', path: '/settings', icon: <SettingsIcon />, roles: ['student', 'tutor', 'admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: 1,
          bgcolor: 'primary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>D</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>DynoLMS</Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 0.5 }}>
        {filteredNav.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.2 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 1,
                  py: 0.8,
                  px: 1.5,
                  bgcolor: active ? 'action.selected' : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: active ? 'action.selected' : 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <ListItemButton
          onClick={() => dispatch(toggleTheme())}
          sx={{ borderRadius: 1, px: 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText
            primary={themeMode === 'dark' ? 'Sáng' : 'Tối'}
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  const handleLogout = async () => {
    setAnchorEl(null);
    await logoutUser();
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: { xs: 2, md: 3 }, py: 1,
          borderBottom: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper',
          minHeight: 56,
        }}>
          <Box>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} size="small">
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={() => dispatch(toggleTheme())} size="small">
              {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <Avatar
                src={currentUser?.avt || ''}
                sx={{ width: 30, height: 30, fontSize: '0.85rem' }}
              >
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  sx: { mt: 0.5, minWidth: 180, borderRadius: 1.5, p: 0.5 },
                },
              }}
            >
              <Box sx={{ px: 1.5, py: 0.75 }}>
                <Typography variant="subtitle2">{currentUser?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{currentUser?.email}</Typography>
              </Box>
              <Divider sx={{ my: 0.25 }} />
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ borderRadius: 1 }}>
                Hồ sơ
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }} sx={{ borderRadius: 1 }}>
                Cài đặt
              </MenuItem>
              <Divider sx={{ my: 0.25 }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
