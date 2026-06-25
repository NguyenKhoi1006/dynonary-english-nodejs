import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import React from 'react';
import ThemeSetting from '../Theme';
import ToggleNavButton from '../ToggleNavButton';
import VoiceSetting from '../Voice';
import useStyle from './style';

function SettingModal({ open = false, onClose = () => {} }) {
  const classes = useStyle();

  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Cài Đặt</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <div className={classes.contentItem}>
          <h2 className={classes.contentLabel}>Chủ đề</h2>
          <ThemeSetting />
        </div>

        <div className={classes.contentItem}>
          <h2 className={classes.contentLabel}>Giọng đọc</h2>
          <VoiceSetting />
        </div>

        <div className={classes.contentItem}>
          <h2 className={classes.contentLabel}>Cài đặt khác</h2>
          <div>
            <h3 className="dyno-label my-5">Hiện/Ẩn thanh điều hướng</h3>
            <ToggleNavButton />
          </div>
        </div>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          className="_btn _btn-primary"
          onClick={onClose}
          color="primary"
          size="small"
          variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default SettingModal;
