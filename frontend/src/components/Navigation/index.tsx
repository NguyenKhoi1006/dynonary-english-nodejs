import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import defaultUserImg from 'assets/images/default-user.png';
import logoUrl from 'assets/images/logo.png';
import SearchInputCustom from 'components/UI/SearchInputCustom';
import { ROUTES } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { tokens } from 'shared/configs/theme';

/* ── Learner compact-header paths ── */
const LEARNER_PATHS = [
  ROUTES.LEARNER.PATH,
  ROUTES.LEARNER.PROGRESS,
  ROUTES.LEARNER.MATERIALS,
  ROUTES.LEARNER.MATERIAL_DETAIL,
  ROUTES.LEADERBOARD,
  ROUTES.LEARNER.PLACEMENT,
  ROUTES.LEARNER.LEVEL_UP,
];

const xpForLevel = (level: number) => (level * (level - 1) * 50) + 100;
const levelFromXp = (xp: number) => {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
};

/* ── Shared styles ── */
const NAV_H = 64;

const styles = {
  wrapper: {
    paddingBottom: `${NAV_H}px`,
  },
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    height: NAV_H,
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${tokens.bone}`,
  },
  inner: {
    maxWidth: 1200,
    mx: 'auto',
    px: { xs: 1.6, md: 3.2 },
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 1, md: 2 },
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoImg: {
    height: 36,
    width: 'auto',
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: tokens.charcoal,
    ml: 0.8,
    letterSpacing: '-0.03em',
    fontFamily: "'Playfair Display', serif",
  },
  searchWrap: {
    flex: '1 1 auto',
    maxWidth: 480,
    mx: { xs: 1, md: 2 },
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.graphite,
    fontSize: '1.3rem',
    fontWeight: 600,
    px: 1.2,
    py: 0.6,
    borderRadius: 1,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
    '&:hover': {
      backgroundColor: tokens.cloud,
      color: tokens.charcoal,
    },
  },
  badge: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0.3,
    flexShrink: 0,
    px: 1,
    py: 0.4,
    borderRadius: 1.5,
    backgroundColor: tokens.cloud,
    fontSize: '1.25rem',
    fontWeight: 700,
    color,
  }),
};

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLearnerPage = LEARNER_PATHS.some((p) => location.pathname.startsWith(p));

  const { avt, name, isAuth, xp, streak, hearts, maxHearts } = useSelector(
    (state: any) => state.userInfo,
  );
  const avtSrc = avt ? cloudinaryImgOptimize(avt, 48, 48) : defaultUserImg;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const level = levelFromXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progressInLevel = Math.min((xp - currentLevelXp) / (nextLevelXp - currentLevelXp), 1);

  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  /* ─── User Menu ─── */
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2.5,
            border: `1px solid ${tokens.bone}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            p: 0.8,
          },
        },
      }}
    >
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{name}</Typography>
        <Typography variant="caption" sx={{ fontSize: '1rem' }}>
          Cấp {level} · {xp} XP
        </Typography>
      </Box>
      <Divider sx={{ my: 0.4 }} />
      <MenuItem onClick={() => { handleClose(); navigate(ROUTES.USER_ACCOUNT); }} sx={{ borderRadius: 1.5 }}>
        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
        Hồ sơ
      </MenuItem>
      <MenuItem onClick={() => { handleClose(); navigate('/settings'); }} sx={{ borderRadius: 1.5 }}>
        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
        Cài đặt
      </MenuItem>
      <Divider sx={{ my: 0.4 }} />
      <MenuItem onClick={() => { handleClose(); navigate(ROUTES.LOGOUT); }} sx={{ borderRadius: 1.5 }}>
        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  /* ════════════════════════════════════
     Compact header (learner mode)
     ════════════════════════════════════ */
  if (isLearnerPage && isAuth) {
    return (
      <>
        <Box id="dynoNav" sx={styles.wrapper}>
          <Box sx={styles.nav}>
            <Box sx={styles.inner}>
              {/* Logo */}
              <Link to="/" style={styles.logoLink}>
                <Box component="img" src={logoUrl} alt="Dynonary" sx={styles.logoImg} />
              </Link>

              {/* XP bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flex: '0 1 auto', minWidth: 80 }}>
                <StarIcon sx={{ fontSize: 18, color: tokens.xp }} />
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: tokens.xp }}>
                  {xp}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressInLevel * 100}
                  sx={{
                    flex: 1,
                    minWidth: 40,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: tokens.xpLight,
                    '& .MuiLinearProgress-bar': { bgcolor: tokens.xp },
                  }}
                />
              </Box>

              {/* Streak */}
              <Box sx={styles.badge(tokens.streak)}>
                <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />
                {streak}
              </Box>

              {/* Hearts */}
              <Box sx={styles.badge(tokens.hearts)}>
                <FavoriteIcon sx={{ fontSize: 14 }} />
                {hearts}/{maxHearts}
              </Box>

              {/* Spacer */}
              <Box sx={{ flex: 1 }} />

              {/* Avatar */}
              <IconButton onClick={handleMenu} size="small" sx={{ p: 0.3 }}>
                <Avatar src={avtSrc} alt={name} sx={{ width: 34, height: 34 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {userMenu}
      </>
    );
  }

  /* ════════════════════════════════════
     Full header (default)
     ════════════════════════════════════ */
  return (
    <>
      <Box id="dynoNav" sx={styles.wrapper}>
        <Box sx={styles.nav}>
          <Box sx={styles.inner}>
            {/* Logo */}
            <Link to="/" style={styles.logoLink}>
              <Box component="img" src={logoUrl} alt="Dynonary" sx={styles.logoImg} />
              <Typography component="span" sx={styles.logoText}>
                Dynonary
              </Typography>
            </Link>

            {/* Search */}
            <Box sx={styles.searchWrap}>
              <SearchInputCustom placeholder="Tìm từ, tính năng..." />
            </Box>

            {/* LMS links */}
            {isAuth && (
              <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0, mr: 1.5 }}>
                <Link to={ROUTES.LEARNER.PROGRESS} style={styles.navLink}>Lộ trình</Link>
                <Link to={ROUTES.LEARNER.MATERIALS} style={styles.navLink}>Bài học</Link>
              </Stack>
            )}

            {/* User area */}
            {isAuth ? (
              <Stack direction="row" spacing={0.8} alignItems="center">
                {/* XP */}
                <Box sx={styles.badge(tokens.xp)}>
                  <StarIcon sx={{ fontSize: 16 }} />
                  {xp}
                </Box>
                {/* Streak */}
                <Box sx={styles.badge(tokens.streak)}>
                  <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />
                  {streak}
                </Box>
                {/* Hearts */}
                <Box sx={styles.badge(tokens.hearts)}>
                  <FavoriteIcon sx={{ fontSize: 14 }} />
                  {hearts}/{maxHearts}
                </Box>

                {/* Avatar */}
                <IconButton onClick={handleMenu} size="small" sx={{ p: 0.3 }}>
                  <Avatar
                    src={avtSrc}
                    alt={name}
                    sx={{ width: 36, height: 36, borderRadius: 1.5 }}
                  />
                </IconButton>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  sx={{ px: 2.4 }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  sx={{ px: 2.4 }}
                >
                  Đăng ký
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
      {userMenu}
    </>
  );
}

export default Navigation;
