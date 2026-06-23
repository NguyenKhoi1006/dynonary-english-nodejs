import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import { ROUTES } from 'constant';
import useStyle from './style';

const TABS = [
  { label: 'Lộ trình', icon: <SchoolIcon />, value: ROUTES.LEARNER.PATH },
  { label: 'Bài học', icon: <MenuBookIcon />, value: ROUTES.LEARNER.MATERIALS },
  { label: 'Xếp hạng', icon: <EmojiEventsIcon />, value: ROUTES.LEADERBOARD },
  { label: 'Hồ sơ', icon: <PersonIcon />, value: ROUTES.USER_ACCOUNT },
];

function BottomNav() {
  const classes = useStyle();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = TABS.find((t) => location.pathname.startsWith(t.value))?.value ?? false;

  return (
    <BottomNavigation
      className={classes.root}
      value={currentTab}
      onChange={(_, newValue) => navigate(newValue)}
      showLabels
    >
      {TABS.map((tab) => (
        <BottomNavigationAction
          key={tab.value}
          label={tab.label}
          icon={tab.icon}
          value={tab.value}
          className={classes.action}
        />
      ))}
    </BottomNavigation>
  );
}

export default BottomNav;
