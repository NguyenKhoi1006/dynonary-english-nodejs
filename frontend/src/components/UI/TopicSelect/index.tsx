import { Button, Collapse, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tag from 'components/UI/Tag';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useTopics } from 'services/useContentData';
import useStyle from './style';

function TopicSelect({
  onChange,
  resetFlag,
  buttonTitle,
  topicList,
  buttonWrapper,
  tagsWrapper,
}: {
  onChange: any;
  resetFlag: any;
  buttonTitle: any;
  topicList: any;
  buttonWrapper: any;
  tagsWrapper: any;
}) {
  const classes = useStyle();
  const { topics: fetchedTopics, loading } = useTopics('vocab');
  const activeTopicList = topicList || fetchedTopics;
  const [visible, setVisible] = useState(false);
  const topics = useRef<any[]>([]);

  const ButtonWrapper = buttonWrapper || Grid;
  const TagsWrapper = tagsWrapper || Grid;

  const handleTopicChange = (id: any, isActive: boolean) => {
    if (isActive) {
      topics.current.push(id);
    } else {
      topics.current = topics.current.filter((i: any) => i !== id);
    }

    onChange(topics.current);
  };

  useEffect(() => {
    if (!resetFlag) return;
    // reset value if parent component reset, except first render
    topics.current = [];
  }, [resetFlag]);

  return (
    <>
      <ButtonWrapper>
        <Button
          color="secondary"
          variant="contained"
          endIcon={visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          className={`${classes.button} w-100 h-100`}
          onClick={() => setVisible(!visible)}>
          {buttonTitle}
        </Button>
      </ButtonWrapper>
      <TagsWrapper className={visible ? '' : classes.tagsWrap}>
        <Collapse in={visible}>
          {loading && !topicList ? (
            <div className="flex-center" style={{ padding: '1rem' }}>
              <CircularProgress size={24} />
            </div>
          ) : !activeTopicList || activeTopicList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              Chưa có chủ đề nào
            </Typography>
          ) : (
            <div className={classes.tags}>
              {activeTopicList.map((topic: any, index: number) => (
                <Tag
                  resetFlag={resetFlag}
                  iconSrc={topic.icon}
                  title={topic.title}
                  key={index}
                  id={topic.key}
                  onChange={handleTopicChange}
                />
              ))}
            </div>
          )}
        </Collapse>
      </TagsWrapper>
    </>
  );
}

TopicSelect.propTypes = {
  onChange: PropTypes.func,
  resetFlag: PropTypes.number,
  buttonTitle: PropTypes.string,
  topicList: PropTypes.array,
  buttonWrapper: PropTypes.any,
  tagsWrapper: PropTypes.any,
};

TopicSelect.defaultProps = {
  onChange: () => {},
  resetFlag: 0,
  buttonTitle: 'Chọn chủ đề',
  topicList: undefined,
};

export default TopicSelect;
