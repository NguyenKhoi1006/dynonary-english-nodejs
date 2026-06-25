import Skeleton from '@mui/material/Skeleton';
import TooltipCustom from 'components/UI/TooltipCustom';
import { DEFAULTS } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';
import InfoIcon from '@mui/icons-material/Info';

const MAX_LEN_NAME = 20;

function LeaderBoardItem({ classes, nthTop, avt, name, score, unit }: { classes: any; nthTop: any; avt: any; name: any; score: any; unit: any }) {
  const nameReduced =
    Boolean(name) && name.length >= MAX_LEN_NAME
      ? `${name.slice(0, 17)}...`
      : name;
  const avtSrc = Boolean(avt)
    ? cloudinaryImgOptimize(avt, 50, 50)
    : DEFAULTS.IMAGE_SRC;
  const color =
    nthTop === 1
      ? '#FFAA00'
      : nthTop === 2
      ? '#C0C0C0'
      : nthTop === 3
      ? '#cd7f32'
      : '#EC4B76';

  return (
    <div
      className={classes.box}
      style={{ borderColor: nthTop <= 3 ? color : '' }}>
      <img src={avtSrc} alt="Avatar" className={classes.avt} />

      <div className={classes.content}>
        <h5 className={classes.name}>{nameReduced}</h5>
        <p>
          <span className={classes.count}>
            {score}&nbsp;{unit}
          </span>
        </p>
      </div>

      <div className={classes.nthTop} style={{ backgroundColor: color }}>
        {nthTop}
      </div>
    </div>
  );
}

function LeaderBoard({ title, list, color, loading, unit, tooltip }: { title: any; list: any; color: any; loading: any; unit: any; tooltip: any }) {
  const classes = useStyle({ color });
  const sortedList = list
    ? [...list].sort((a: any, b: any) => Number(b.score) - Number(a.score))
    : [];

  return (
    <div className={classes.root}>
      <div className={`${classes.titleWrap} flex-center-between`}>
        <h3 className={classes.title}>{title}</h3>
        {tooltip && (
          <TooltipCustom title={tooltip}>
            <InfoIcon className={classes.infoIcon} />
          </TooltipCustom>
        )}
      </div>

      <div className={classes.boxWrap}>
        {!loading
          ? list &&
            sortedList.map((item: any, index: number) => (
              <LeaderBoardItem
                {...item}
                unit={unit}
                classes={classes}
                key={index}
                nthTop={index + 1}
              />
            ))
          : new Array(10)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  className={classes.skeleton}
                  key={index}
                  animation="wave"
                  variant="rectangular"
                />
              ))}
      </div>
    </div>
  );
}

LeaderBoard.propTypes = {
  color: PropTypes.string,
  list: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  unit: PropTypes.string,
  tooltip: PropTypes.string,
};

export default LeaderBoard;
