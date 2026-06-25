import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterIcon from '@mui/icons-material/FilterList';
import AZIcon from '@mui/icons-material/TextRotateUp';
import ZAIcon from '@mui/icons-material/TextRotationDown';
import AutoSearchInput from 'components/UI/AutoSearchInput';
import Speaker from 'components/UI/Speaker';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useIrregularVerbs } from 'services/useContentData';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import useStyle from './style';

function IrregularVerbFilter({ classes, onSort, onFilter }: { classes: any; onSort: any; onFilter: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortType, setSortType] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleFilter = (v: any) => {
    setIsFiltered(Boolean(v));
    setAnchorEl(null);
    onFilter(v);
  };

  const handleSort = () => {
    if (!sortType !== sortType) onSort(sortType);
    setSortType(!sortType);
  };

  return (
    <div className="d-flex ml-8">
      <div onClick={handleSort} className={`${classes.controlItem} mr-8`}>
        <span className="pr-2">Sắp xếp</span>
        {sortType ? (
          <AZIcon className={classes.controlIcon} />
        ) : (
          <ZAIcon className={classes.controlIcon} />
        )}
      </div>
      <div
        className={`${classes.controlItem} ${isFiltered ? 'active' : ''}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}>
        <span className="pr-2">Lọc</span>
        <FilterIcon className={classes.controlIcon} />
      </div>
      <Menu
        classes={{
          paper: classes.filterMenu,
        }}
        anchorEl={anchorEl}
        disableScrollLock={true}
        onClose={() => setAnchorEl(null)}
        keepMounted
        open={Boolean(anchorEl)}>
        <MenuItem onClick={() => handleFilter(0)}>Không lọc</MenuItem>
        <MenuItem onClick={() => handleFilter(1)}>v1 = v2 = v3</MenuItem>
        <MenuItem onClick={() => handleFilter(2)}>v2 = v3</MenuItem>
        <MenuItem onClick={() => handleFilter(3)}>{'ay > aid > aid'}</MenuItem>
        <MenuItem onClick={() => handleFilter(4)}>{'d > t'}</MenuItem>
        <MenuItem onClick={() => handleFilter(5)}>{'eed > ed'}</MenuItem>
        <MenuItem onClick={() => handleFilter(6)}>{'ow > ew > own'}</MenuItem>
        <MenuItem onClick={() => handleFilter(7)}>{'ear > ore > orn'}</MenuItem>
      </Menu>
    </div>
  );
}

IrregularVerbFilter.propTypes = {
  classes: PropTypes.object,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
};

function filterIrregularList(list: any[] = [], type = 1) {
  let newList: any[] = [];

  switch (type) {
    case 0:
      // not filter
      newList = [...list];
      break;
    // v1 = v2 = v3
    case 1:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;
        return (
          v1.toLowerCase() === v2.toLowerCase() &&
          v1.toLowerCase() === v3.toLowerCase()
        );
      });
      break;

    // v2 = v3
    case 2:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;
        return (
          v1.toLowerCase() !== v2.toLowerCase() &&
          v2.toLowerCase() === v3.toLowerCase()
        );
      });
      break;

    // ay -> aid -> aid
    case 3:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;

        return (
          v1.slice(v1.length - 2).toLowerCase() === 'ay' &&
          v2.slice(v2.length - 3).toLowerCase() === 'aid' &&
          v3.slice(v3.length - 3).toLowerCase() === 'aid'
        );
      });
      break;
    // d -> t
    case 4:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;

        return (
          v1[v1.length - 1].toLowerCase() === 'd' &&
          v2[v2.length - 1].toLowerCase() === 't' &&
          v3[v3.length - 1].toLowerCase() === 't'
        );
      });
      break;
    // eed -> ed
    case 5:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;

        return (
          v1.slice(v1.length - 3).toLowerCase() === 'eed' &&
          v2.slice(v2.length - 2).toLowerCase() === 'ed' &&
          v3.slice(v3.length - 2).toLowerCase() === 'ed'
        );
      });
      break;
    // ow -> ew -> own
    case 6:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;

        return (
          v1.slice(v1.length - 2).toLowerCase() === 'ow' &&
          v2.slice(v2.length - 2).toLowerCase() === 'ew' &&
          v3.slice(v3.length - 3).toLowerCase() === 'own'
        );
      });
      break;
    // ear -> ore -> orne
    case 7:
      newList = list.filter((item) => {
        const { v1, v2, v3 } = item;

        return (
          v1.slice(v1.length - 3).toLowerCase() === 'ear' &&
          v2.slice(v2.length - 3).toLowerCase() === 'ore' &&
          v3.slice(v3.length - 4).toLowerCase() === 'orne'
        );
      });
      break;
    default:
      break;
  }

  return newList;
}

function IrregularVerb() {
  const classes = useStyle();
  const { verbs: initList, loading } = useIrregularVerbs();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList([...initList]);
  }, [initList]);

  const handleSort = (sortType = true) => {
    let newList: any[] = [];
    if (sortType) {
      newList = list.sort((a, b) => (a.v1 > b.v1 ? 1 : a.v1 < b.v1 ? -1 : 0));
    } else {
      newList = list.sort((a, b) => (a.v1 > b.v1 ? -1 : a.v1 < b.v1 ? 1 : 0));
    }
    setList([...newList]);
  };

  const handleSearch = (word: string) => {
    const foundList = initList.filter((item) => {
      const chainStr = `${item.v1} $${item.v2} ${item.v3} ${item.mean}`;
      return chainStr.toLowerCase().indexOf(word.toLowerCase()) !== -1;
    });

    setList([...foundList]);
  };

  const handleFilter = (type: any) => {
    const newList = filterIrregularList(initList, type);
    setList([...newList]);
  };

  if (loading) {
    return (
      <div className={`${classes.root} container flex-center`} style={{ minHeight: '60vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!loading && initList.length === 0) {
    return (
      <div className={`${classes.root} container flex-center`} style={{ minHeight: '60vh' }}>
        <Typography variant="h6" color="text.secondary">Chưa có dữ liệu động từ bất quy tắc</Typography>
      </div>
    );
  }

  return (
    <div className={`${classes.root} container`}>
      {/* header */}
      <h1 className="dyno-title">Động từ bất quy tắc (Irregular Verb)</h1>
      <p className="dyno-sub-title">
        Chúng ta có hơn 600 động từ bất quy tắc, nhưng chỉ có khoảng 360 từ
        thường xuyên xuất hiện nhất. <br /> Bạn hãy tập trung học những từ này
        trước nhé 😎 (Click vào từ để nghe phát âm)
      </p>
      <div className="dyno-break"></div>

      {/* search, filter */}
      <div className="flex-center-between">
        <AutoSearchInput
          onSearch={handleSearch}
          maxLength={40}
          style={{ padding: '1rem 1.2rem', maxWidth: '45rem' }}
        />
        <IrregularVerbFilter
          classes={classes}
          onSort={handleSort}
          onFilter={handleFilter}
        />
      </div>

      {/* verb table */}
      <div className={classes.tableWrap}>
        <table className={classes.table}>
          <thead>
            <tr className={classes.tableHeader}>
              <th>Infinitive (V1)</th>
              <th>Simple Past (V2)</th>
              <th>Past Participle (V3)</th>
              <th>Mean</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, index) => {
              const { v1, v2, v3, mean } = item;
              return (
                <tr key={index}>
                  <td>
                    <Speaker isWrap={true} text={v1}>
                      {v1}
                    </Speaker>
                  </td>
                  <td>
                    <Speaker isWrap={true} text={v2}>
                      {v2}
                    </Speaker>
                  </td>
                  <td>
                    <Speaker isWrap={true} text={v3}>
                      {v3}
                    </Speaker>
                  </td>
                  <td>{mean}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IrregularVerb;
