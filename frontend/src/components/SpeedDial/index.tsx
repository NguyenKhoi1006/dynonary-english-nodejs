import ArrowUpIcon from '@mui/icons-material/ArrowDropUp';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HomeIcon from '@mui/icons-material/Home';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { LINKS } from 'constant';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import SettingButton from './Settings/SettingButton';
import useStyle from './style';

function ScrollTop() {
  return (
    <Link to="scrollTop" spy={true} smooth={true} duration={500}>
      <ArrowUpIcon style={{ transform: 'translateY(20%)' }} />
    </Link>
  );
}

const actions = [
  { icon: <HomeIcon />, name: 'Trang chủ', to: '/', isBlank: false },
  {
    icon: <ScrollTop />,
    name: 'Lên đầu trang',
    to: null,
    isBlank: false,
  },
  { icon: <SettingButton />, name: 'Cài đặt', to: null, isBlank: false },
  {
    icon: <ContactMailIcon />,
    name: 'Liên hệ Dyno',
    to: LINKS.WEBSITE,
    isBlank: true,
  },
];

function SpeedDials() {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  // const history = useHistory\(\);

  const handleClose = (to, isBlank = false) => {
    setOpen(false);
    if (to && to !== '') {
      if (isBlank) {
        window.open(to);
      } else {
        navigate(to);
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <SpeedDial
      classes={{
        root: classes.root,
        fab: classes.fab,
        actions: classes.actions,
      }}
      hidden={false}
      ariaLabel="Speed Dial"
      icon={<SpeedDialIcon />}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      open={open}
      direction="up">
      {actions.map((action, index) => (
        <SpeedDialAction
          key={index}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => handleClose(action.to, action.isBlank)}
        />
      ))}
    </SpeedDial>
  );
}

export default SpeedDials;
