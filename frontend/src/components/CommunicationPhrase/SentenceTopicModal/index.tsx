import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Tag from 'components/UI/Tag';
import { addOrDelItemInArray } from 'helper';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useTopics } from 'services/useContentData';
import useStyle from './style';

function SentenceTopicModal({ onClose, onSelect, open }) {
  const classes = useStyle();
  const { topics, loading } = useTopics('sentence');
  const topicRef = useRef([]);

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={open}
      keepMounted
      maxWidth="md"
      onClose={onClose}>
      <DialogTitle className={classes.title}>Chọn chủ đề</DialogTitle>

      <DialogContent dividers classes={{ dividers: classes.breakLine }}>
        {loading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            <CircularProgress />
          </div>
        ) : topics.length === 0 ? (
          <Typography variant="body2" color="text.secondary" style={{ textAlign: 'center', padding: '2rem' }}>
            Chưa có chủ đề nào
          </Typography>
        ) : (
          <ul className="d-flex flex-wrap">
            {topics.map((topic, index) => (
              <div className="m-2" key={index}>
                <Tag
                  title={topic.title}
                  id={topic.key}
                  onChange={(idTopic) =>
                    addOrDelItemInArray(topicRef.current, idTopic)
                  }
                />
              </div>
            ))}
          </ul>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="_btn _btn-stand">
          Đóng
        </Button>
        <Button
          onClick={() => onSelect(topicRef.current)}
          className="_btn _btn-primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SentenceTopicModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

SentenceTopicModal.defaultProps = {
  open: false,
  onClose: function () {},
  onSelect: function () {},
};

export default SentenceTopicModal;
