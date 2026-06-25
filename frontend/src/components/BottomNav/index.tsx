import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import { ROUTES } from 'constant';
import { tokens } from 'shared/configs/theme';

const TABS = [
  { label: 'Lộ trình', icon: <SchoolIcon />, value: ROUTES.LEARNER.PATH },
  { label: 'Bài học', icon: <MenuBookIcon />, value: ROUTES.LEARNER.MATERIALS },
  { label: 'Xếp hạng', icon: <EmojiEventsIcon />, value: ROUTES.LEADERBOARD },
  { label: 'Hồ sơ', icon: <PersonIcon />, value: ROUTES.USER_ACCOUNT },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = TABS.find((t) => location.pathname.startsWith(t.value))?.value ?? false;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
      }}
    >
      <BottomNavigation
        value={currentTab}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
        sx={{
          height: 'var(--bottom-nav-height)',
          backgroundColor: tokens.white,
          borderTop: `1px solid ${tokens.bone}`,
          boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
          '& .MuiBottomNavigationAction-root': {
            '&.Mui-selected': {
              backgroundColor: tokens.cloud,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontWeight: 600,
            fontSize: '1.05rem',
            '&.Mui-selected': {
              fontSize: '1.05rem',
              color: tokens.navy,
            },
          },
        }}
      >
        {TABS.map((tab) => (
          <BottomNavigationAction
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;
