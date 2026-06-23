import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import SortIcon from '@mui/icons-material/SortByAlpha';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useStyle from './style';

function WordSortModal({ classNameIcon, onSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyle();

  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (v) => {
    setAnchorEl(null);
    if (typeof v === 'string') {
      onSelect(v);
    }
  };

  return (
    <>
      <SortIcon className={classNameIcon} onClick={handleOpenModal} />
      <Menu
        classes={{ paper: classes.menu }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => handleClose('asc')}>
          A-Z&nbsp;
          <ArrowDownIcon />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={() => handleClose('desc')}>
          Z-A&nbsp;
          <ArrowUpIcon />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={() => handleClose('rand')}>
          Random&nbsp;
          <SwapVertIcon />
        </MenuItem>
      </Menu>
    </>
  );
}

WordSortModal.propTypes = {
  classNameIcon: PropTypes.string,
  onSelect: PropTypes.func,
};

WordSortModal.defaultProps = {
  classNameIcon: '',
  onSelect: () => {},
};

export default WordSortModal;
