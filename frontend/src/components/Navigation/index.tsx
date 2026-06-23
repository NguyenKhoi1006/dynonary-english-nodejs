import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import defaultUserImg from 'assets/images/default-user.png';
import logoUrl from 'assets/images/logo.png';
import SearchInputCustom from 'components/UI/SearchInputCustom';
import { ROUTES } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import SettingMenu from './SettingMenu';
import useStyle from './style';

/* ── Learner pages where we show the compact header ── */
const LEARNER_PATHS = [
  ROUTES.LEARNER.PATH,
  ROUTES.LEARNER.PROGRESS,
  ROUTES.LEARNER.MATERIALS,
  ROUTES.LEARNER.MATERIAL_DETAIL,
  ROUTES.LEADERBOARD,
  ROUTES.LEARNER.PLACEMENT,
  ROUTES.LEARNER.LEVEL_UP,
];

/**
 * Small helper: level based on XP (Duolingo-style rough brackets).
 * Level 1 = 0 XP, each level requires +100 XP more than previous.
 */
const xpForLevel = (level: number) => (level * (level - 1) * 50) + 100;
const levelFromXp = (xp: number) => {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
};

function Navigation() {
  const classes = useStyle();
  const location = useLocation();
  const isLearnerPage = LEARNER_PATHS.some((p) => location.pathname.startsWith(p));

  const { avt, name, isAuth, xp, streak, hearts, maxHearts } = useSelector(
    (state: any) => state.userInfo,
  );
  const avtSrc = Boolean(avt)
    ? cloudinaryImgOptimize(avt, 48, 48)
    : defaultUserImg;
  const [anchorMenu, setAnchorMenu] = useState<any>(null);

  const onOpenMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorMenu(e.currentTarget);
  const onCloseMenu = () => setAnchorMenu(undefined);

  /* ── XP / Level calc ── */
  const level = levelFromXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progressInLevel = Math.min((xp - currentLevelXp) / (nextLevelXp - currentLevelXp), 1);

  /* ── Compact learner header ── */
  if (isLearnerPage && isAuth) {
    return (
      <div className={`${classes.navWrapper} w-100vw`} id="dynoNav">
        <div className={`${classes.nav} w-100`}>
          <div className={`${classes.compactInner} container h-100 flex-center--ver`}>
            {/* Logo (smaller) */}
            <Link to="/" className={`${classes.logoLink} flex-center--ver`}>
              <img className={classes.logoCompactImg} src={logoUrl} alt="Logo" />
            </Link>

            {/* XP display */}
            <div className={classes.xpBlock}>
              <StarIcon className={classes.xpIcon} />
              <span className={classes.xpValue}>{xp}</span>
              <LinearProgress
                variant="determinate"
                value={progressInLevel * 100}
                className={classes.xpBar}
              />
            </div>

            {/* Streak */}
            <div className={classes.statBlock}>
              <LocalFireDepartmentIcon className={classes.streakIcon} />
              <span className={classes.statValue}>{streak}</span>
            </div>

            {/* Hearts */}
            <div className={classes.statBlock}>
              <FavoriteIcon className={classes.heartIcon} />
              <span className={classes.statValue}>{hearts}/{maxHearts}</span>
            </div>

            {/* User avatar */}
            <div
              className={`${classes.userCompact} flex-center--ver cur-pointer`}
              onClick={onOpenMenu}
              onMouseEnter={onOpenMenu}>
              <Avatar
                className={classes.avt}
                alt="Username"
                src={avtSrc}
              />
            </div>

            <SettingMenu anchorEl={anchorMenu} onClose={onCloseMenu} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Default full header ── */
  return (
    <div className={`${classes.navWrapper} w-100vw`} id="dynoNav">
      <div className={`${classes.nav} w-100`}>
        <div className="container h-100 flex-center--ver">
          <Link to="/" className={`${classes.logoLink} flex-center--ver`}>
            <img className={classes.logoImg} src={logoUrl} alt="Logo" />
            <span className={classes.logoText}>Dynonary</span>
          </Link>

          {/* Search — flex-grow to take available space */}
          <div className={classes.searchWrap}>
            <SearchInputCustom placeholder="Tìm từ, tính năng..." />
          </div>

          {/* LMS nav links — visible when logged in */}
          {isAuth && (
            <div className={`${classes.lmsLinks} flex-center--ver`}>
              <Link to={ROUTES.LEARNER.PROGRESS} className={classes.lmsLink}>Lộ trình</Link>
              <Link to={ROUTES.LEARNER.MATERIALS} className={classes.lmsLink}>Bài học</Link>
            </div>
          )}

          {/* User controls */}
          <div className={`${classes.controls} flex-center--ver`}>
            {isAuth ? (
              <div
                className={`${classes.userInfo} flex-center--ver cur-pointer`}
                onClick={onOpenMenu}
                onMouseEnter={onOpenMenu}>
                <Avatar
                  className={classes.avt}
                  alt="Username"
                  src={avtSrc}
                />
                <span className={classes.userName}>{name}</span>
              </div>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <Button
                  className="_btn _btn-primary"
                  classes={{ root: classes.loginBtn }}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ '.MuiButton-label': { fontSize: '1.4rem' } }}>
                  Đăng nhập
                </Button>
              </Link>
            )}

            <SettingMenu anchorEl={anchorMenu} onClose={onCloseMenu} />
          </div>
        </div>
      </div>
    </div>
    );
}

export default Navigation;
