import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import SettingModal from 'components/SpeedDial/Settings/Modal';
import { LINKS, ROUTES } from 'constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyle from './style';

function SettingMenu({ anchorEl = null, onClose = () => {} }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);

  return (
    <Menu
      classes={{ paper: classes.root }}
      anchorEl={anchorEl}
      disableScrollLock={true}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}>
      <Link to={ROUTES.USER_ACCOUNT}>
        <MenuItem className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Thông tin cá nhân</p>
        </MenuItem>
      </Link>

      <Link to={ROUTES.LEARNER.PROGRESS}>
        <MenuItem className={classes.menuItem}>
          <SchoolIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Lộ trình học</p>
        </MenuItem>
      </Link>
      <Link to={ROUTES.LEARNER.MATERIALS}>
        <MenuItem className={classes.menuItem}>
          <AutoStoriesIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Bài học</p>
        </MenuItem>
      </Link>

      <Divider />

      <MenuItem onClick={() => setOpen(true)} className={classes.menuItem}>
        <SettingsIcon className={classes.icon} fontSize="small" />
        <p className={classes.text}>Cài đặt</p>
      </MenuItem>

      <a href={LINKS.FB} target="_blank" rel="noreferrer">
        <MenuItem className={classes.menuItem}>
          <HelpIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Liên hệ - Giúp đỡ</p>
        </MenuItem>
      </a>

      <Link to={ROUTES.LOGOUT}>
        <MenuItem className={classes.menuItem}>
          <ExitToAppIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Đăng xuất</p>
        </MenuItem>
      </Link>

      {open && <SettingModal open={open} onClose={() => setOpen(false)} />}
    </Menu>
  );
}

SettingMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
};

export default SettingMenu;
