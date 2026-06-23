import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'redux/store';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DynonaryIcon from '@mui/icons-material/AutoStories';
import TranslateIcon from '@mui/icons-material/Translate';
import ForumIcon from '@mui/icons-material/Forum';
import CategoryIcon from '@mui/icons-material/Category';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ArticleIcon from '@mui/icons-material/Article';

import { clearAdmin } from 'redux/slices/adminInfo.slice';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAdminTheme } from './ThemeContext';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 68;

const navItems = [
  { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Người dùng', path: ROUTES.ADMIN.USERS, icon: <PeopleIcon /> },
  { label: 'Tài liệu', path: ROUTES.ADMIN.MATERIALS, icon: <MenuBookIcon /> },
  { label: 'Bài kiểm tra', path: ROUTES.ADMIN.TESTS, icon: <QuizIcon /> },
  { label: 'Từ vựng', path: ROUTES.ADMIN.WORDS, icon: <TranslateIcon /> },
  { label: 'Câu giao tiếp', path: ROUTES.ADMIN.SENTENCES, icon: <ForumIcon /> },
  { label: 'Chủ đề', path: ROUTES.ADMIN.TOPICS, icon: <CategoryIcon /> },
   { label: 'Động từ BQT', path: ROUTES.ADMIN.IRREGULAR_VERBS, icon: <TextSnippetIcon /> },
  { label: 'Blog/Grammar', path: ROUTES.ADMIN.BLOG, icon: <ArticleIcon /> },
  { label: 'Bài kiểm tra đầu vào', path: ROUTES.ADMIN.PLACEMENT_TESTS, icon: <QuizIcon /> },
  { label: 'Hoạt động', path: ROUTES.ADMIN.ACTIVITY, icon: <HistoryIcon /> },
];

const breadcrumbLabels: Record<string, string> = {
  [ROUTES.ADMIN.DASHBOARD]: 'Dashboard',
  [ROUTES.ADMIN.USERS]: 'Người dùng',
  [ROUTES.ADMIN.MATERIALS]: 'Tài liệu',
  [ROUTES.ADMIN.TESTS]: 'Bài kiểm tra',
  [ROUTES.ADMIN.WORDS]: 'Từ vựng',
  [ROUTES.ADMIN.SENTENCES]: 'Câu giao tiếp',
  [ROUTES.ADMIN.TOPICS]: 'Chủ đề',
  [ROUTES.ADMIN.IRREGULAR_VERBS]: 'Động từ BQT',
  [ROUTES.ADMIN.BLOG]: 'Blog/Grammar',
  [ROUTES.ADMIN.ACTIVITY]: 'Hoạt động',
  [ROUTES.ADMIN.PLACEMENT_TESTS]: 'Bài kiểm tra đầu vào',
};

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, avt, email } = useSelector((state: RootState) => state.adminInfo);
  const { mode, toggle: toggleTheme } = useAdminTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const handleLogout = async () => {
    setAnchorEl(null);
    dispatch(clearAdmin());
    navigate(ROUTES.ADMIN.LOGIN);
  };

  // Build breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const crumbs: { label: string; path: string }[] = [];
  let accum = '';
  for (const part of pathParts) {
    accum += '/' + part;
    const label = breadcrumbLabels[accum] || part.charAt(0).toUpperCase() + part.slice(1);
    crumbs.push({ label, path: accum });
  }

  // Active nav check
  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN.DASHBOARD) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1,
          px: collapsed ? 1 : 2.5,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
        }}
      >
        <DynonaryIcon color="primary" sx={{ fontSize: 28 }} />
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} color="primary" noWrap>
            Dynonary
          </Typography>
        )}
      </Box>

      {/* Nav items */}
      <List sx={{ flex: 1, px: collapsed ? 0.5 : 1, pt: 1, overflow: 'hidden' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              {collapsed ? (
                <Tooltip title={item.label} placement="right">
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      justifyContent: 'center',
                      borderRadius: 2,
                      mx: 0.5,
                      minHeight: 44,
                      position: 'relative',
                      '&.active': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': { color: 'white' },
                      },
                      '&:hover:not(.active)': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              ) : (
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mx: 0.5,
                    minHeight: 44,
                    position: 'relative',
                    '&::before': active
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          bottom: 6,
                          width: 3,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                        }
                      : {},
                    '&.active': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                    '&:hover:not(.active)': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: active ? 600 : 400, fontSize: 14 }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Collapse toggle */}
      <Box
        sx={{
          p: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
        }}
      >
        <IconButton size="small" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {React.cloneElement(drawerContent as React.ReactElement, {
          children: (
            <>
              {(drawerContent.props as any).children}
              {/* On mobile drawer, add toggle at bottom */}
            </>
          ),
        })}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Topbar */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              sx={{ display: { md: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Breadcrumbs */}
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {crumbs.map((crumb, idx) =>
                idx === crumbs.length - 1 ? (
                  <Typography key={crumb.path} variant="body2" color="text.primary" fontWeight={600}>
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    href={crumb.path}
                    color="text.secondary"
                    underline="hover"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(crumb.path);
                    }}
                  >
                    {crumb.label}
                  </Link>
                ),
              )}
            </Breadcrumbs>

            {/* Dark mode toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton size="small" onClick={toggleTheme}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* User avatar */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar src={avt || undefined} sx={{ width: 32, height: 32 }}>
                {!avt && name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { minWidth: 180, mt: 1 } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {name || 'Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Đăng xuất
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            bgcolor: 'background.default',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
