import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { WORD_SPECIALTY } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import PropTypes from 'prop-types';
import React from 'react';
import { useTopics } from 'services/useContentData';
import Tag from '../Tag';
import useStyle from './style';

function sliceTopics(topicKeys: any, allTopics: any) {
  return topicKeys.map((key: any) => allTopics.find((i: any) => i.key === key)).filter(Boolean);
}

function WordDetailModal(props: any) {
  const {
    picture,
    word,
    mean,
    phonetic,
    level,
    type,
    examples,
    specialty,
    synonyms,
    note,
    topics: wordTopicKeys,
    open,
    onClose,
    loading,
  } = props;

  const classes = useStyle();
  const { topics: allTopics } = useTopics('vocab');

  return (
    <Popover
      classes={{
        root: `${classes.root} flex-center`,
        paper: `${classes.paper} container`,
      }}
      open={open}
      onClose={onClose}
      anchorReference={'none'}>
      <div className="flex-center-between">
        <h2 className={classes.title}>
          Chi tiết từ <span className={classes.wordTitle}>{`"${word}"`}</span>
        </h2>
        <CloseIcon
          className={`${classes.closeIcon} cur-pointer`}
          onClick={onClose}
        />
      </div>

      <div className="dyno-break"></div>

      {loading ? (
        <Skeleton
          style={{ width: '100%', height: '35vh' }}
          variant="rectangular"
          animation="wave"
        />
      ) : (
        <div className={classes.content}>
          <div className="flex-center--ver my-4">
            {picture && picture !== '' && (
              <img
                src={cloudinaryImgOptimize(picture, 56, 56, true)}
                alt="Photo"
                className={`${classes.picture} mr-8`}
              />
            )}
            <div>
              <p className={classes.word}>
                {word}&nbsp;
                {Boolean(type) && (
                  <span className={classes.type}>( {type} )</span>
                )}
                <span className={classes.mean}>{` - ${mean}`}</span>
              </p>
              {Boolean(phonetic) && (
                <p className={`${classes.phonetic} mt-4`}>/ {phonetic} /</p>
              )}
            </div>
          </div>

          {level !== '0' && (
            <p className={classes.level}>
              <b className={classes.label}>Cấp độ:</b>&nbsp;&nbsp;
              {level}
            </p>
          )}
          {examples && examples.length > 0 && (
            <div>
              <b className={classes.label}>Câu ví dụ:</b>
              {examples.map((ex: any, index: number) => (
                <p key={index}>
                  {index + 1}.&nbsp;{ex}
                </p>
              ))}
            </div>
          )}

          {specialty && specialty !== '0' && (
            <p>
              <b className={classes.label}>Thuộc chuyên ngành:</b>
              &nbsp;&nbsp;
              {WORD_SPECIALTY.find((i) => i.value === specialty)?.label ||
                'Không'}
            </p>
          )}

          {wordTopicKeys && wordTopicKeys.length > 0 && (
            <>
              <b className={classes.label}>Chủ đề:</b>

              <div className={`${classes.topics} d-flex flex-wrap`}>
                {sliceTopics(wordTopicKeys, allTopics).length > 0 ? (
                  sliceTopics(wordTopicKeys, allTopics).map((topic: any, index: number) => (
                    <Tag key={index} title={topic.title} iconSrc={topic.icon} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">Chủ đề không xác định</Typography>
                )}
              </div>
            </>
          )}

          {synonyms && synonyms.length > 0 && (
            <p>
              <b className={classes.label}>Các từ đồng nghĩa:</b>&nbsp;&nbsp;
              {synonyms.join(', ')}
            </p>
          )}

          {note && note !== '' && (
            <>
              <b className={classes.label}>Ghi chú:</b>
              <p>
                {note.split('\n').map((i: any, index: number) => (
                  <span key={index}>
                    {i} <br />
                  </span>
                ))}
              </p>
            </>
          )}
        </div>
      )}
    </Popover>
  );
}

WordDetailModal.propTypes = {
  examples: PropTypes.array,
  level: PropTypes.string,
  loading: PropTypes.bool,
  mean: PropTypes.string,
  note: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  phonetic: PropTypes.string,
  picture: PropTypes.string,
  specialty: PropTypes.string,
  synonyms: PropTypes.array,
  topics: PropTypes.array,
  type: PropTypes.string,
  word: PropTypes.string,
};

WordDetailModal.defaultProps = {
  examples: [],
  level: '',
  loading: true,
  mean: '',
  note: '',
  onClose: function () {},
  open: false,
  phonetic: '',
  picture: '',
  specialty: '',
  synonyms: [],
  topics: [],
  type: '',
  word: '',
};

export default WordDetailModal;
