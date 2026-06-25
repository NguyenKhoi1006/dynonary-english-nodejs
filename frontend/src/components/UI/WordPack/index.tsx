import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { CircularProgress, Typography } from '@mui/material';
import SelectCustom from 'components/UI/SelectCustom';
import { WORD_LEVELS, WORD_SPECIALTY, WORD_TYPES } from 'constant';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useTopics } from 'services/useContentData';
import TopicSelect from '../TopicSelect';
import useStyle from './style';

const formId = 'wordPackForm';

function addAllOption(optionList: any[] = []) {
  return [{ value: '-1', label: 'Tất cả' }, ...optionList];
}

function WordPack(props: any) {
  const {
    onChoose,
    onCancel,
    open,
    topicMultiples,
    title,
    okBtnText,
    cancelBtnText,
    okBtnProps,
    cancelBtnProps,
  } = props;

  const classes = useStyle();
  const { topics: fetchedTopics, loading } = useTopics('vocab');
  const topics = useRef([]);
  const topicOptions = fetchedTopics.map((t: any) => ({ value: t.key || t._id, label: t.title }));

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { target } = e;
    const type = target.type?.value || '-1',
      specialty = target.specialty?.value || '-1',
      topic = target.topic?.value || '-1',
      level = target.level?.value || '-1';

    onChoose({
      type,
      specialty,
      level,
      topics: topicMultiples ? topics.current : topic === '-1' ? [] : [topic],
    });
  };

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      maxWidth="md"
      fullWidth
      open={open}>
      <DialogTitle classes={{ root: classes.title }}>{title}</DialogTitle>

      <DialogContent dividers classes={{ dividers: classes.breakLine }}>
        <form id={formId} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SelectCustom
                label="Loại từ"
                className="w-100"
                options={addAllOption(WORD_TYPES) as any}
                inputProps={{ name: 'type' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectCustom
                label="Cấp độ"
                className="w-100"
                options={addAllOption(WORD_LEVELS) as any}
                inputProps={{ name: 'level' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectCustom
                label="Chuyên ngành"
                className="w-100"
                options={addAllOption(WORD_SPECIALTY) as any}
                inputProps={{ name: 'specialty' }}
              />
            </Grid>

            {topicMultiples ? (
              <TopicSelect
                onChange={(topicList: any) => (topics.current = topicList)}
                buttonWrapper={(props: any) => (
                  <Grid {...props} item xs={12} md={6} />
                )}
                tagsWrapper={(props: any) => <Grid {...props} item xs={12} />}
              />
            ) : (
              <Grid item xs={12} md={6}>
                {loading ? (
                <div className="flex-center" style={{ height: '100%' }}>
                  <CircularProgress size={24} />
                </div>
              ) : fetchedTopics.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Chưa có chủ đề</Typography>
              ) : (
                <SelectCustom
                  label="Chủ đề"
                  className="w-100"
                  options={addAllOption(topicOptions) as any}
                  inputProps={{ name: 'topic' }}
                />
              )}
              </Grid>
            )}

            {Boolean(props.children) && (
              <Grid item xs={12} md={6}>
                {props.children}
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          className="_btn _btn-stand"
          variant="outlined"
          {...cancelBtnProps}>
          {cancelBtnText}
        </Button>
        <Button
          autoFocus
          disableFocusRipple
          component="button"
          type="submit"
          form={formId}
          className="_btn _btn-primary"
          variant="contained"
          {...okBtnProps}>
          {okBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WordPack.propTypes = {
  cancelBtnProps: PropTypes.object,
  cancelBtnText: PropTypes.string,
  okBtnProps: PropTypes.object,
  okBtnText: PropTypes.string,
  onCancel: PropTypes.func,
  onChoose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  topicMultiples: PropTypes.bool,
};

WordPack.defaultProps = {
  onChoose: function () {},
  open: true,
  topicMultiples: true,
  title: 'Gói từ vựng',
  okBtnText: 'Ok',
  cancelBtnText: 'Đóng',
  okBtnProps: {},
  cancelBtnProps: {},
};

export default WordPack;
