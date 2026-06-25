import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import SearchIcon from '@mui/icons-material/Search';
import wordApi from 'apis/wordApi';
import { MAX } from 'constant';
import NAV_SEARCH_DATA from 'constant/nav-search-data';
import { debounce } from 'helper';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WordDetailModal from '../WordDetailModal';
import useStyle from './style';

function SearchInputCustom({ placeholder = '' }) {
  const classes = useStyle();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const [focused, setFocused] = useState(false);
  const [resultList, setResultList] = useState<any[]>([]);
  const [wordDetails, setWordDetails] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCloseMenu = useCallback(() => {
    setResultList([]);
  }, []);

  const handleSelect = useCallback(
    async (word: any, to: any) => {
      handleCloseMenu();
      inputRef.current?.blur();

      if (to) {
        navigate(to);
        return;
      }

      const apiRes = await wordApi.getWordDetails(word);
      setWordDetails(apiRes?.data);
    },
    [navigate, handleCloseMenu],
  );

  const handleSearch = useCallback((e: any) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = debounce(
      null,
      async () => {
        const word = e.target?.value?.trim();
        if (!word) {
          setResultList([]);
          return;
        }

        const lower = word.toLowerCase();
        const navResults = NAV_SEARCH_DATA.filter(
          (i) => `${i.title} ${i.searchKey}`.indexOf(lower) !== -1,
        ).map((i) => ({ title: i.title, to: i.to }));

        let wordResults = [];
        try {
          const apiRes = await wordApi.getSearchWord(word, true);
          if (apiRes.data?.packList) {
            wordResults = apiRes.data.packList.map((i: any) => ({ title: i.word, to: null }));
          }
        } catch (_) {
          wordResults = [];
        }

        const merged = [...navResults, ...wordResults].slice(0, 20);
        setResultList(merged);
      },
      350,
    );
  }, []);

  const hasResults = resultList.length > 0;

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <div className={classes.root} ref={containerRef}>
        <div className={`${classes.inputWrap} ${focused ? classes.inputWrapFocused : ''}`}>
          <SearchIcon className={classes.searchIcon} />
          <InputBase
            inputRef={inputRef}
            onChange={handleSearch}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search', maxLength: MAX.SEARCH_LEN }}
          />
        </div>

        <Popper
          open={focused && hasResults}
          anchorEl={containerRef.current}
          placement="bottom-start"
          className={classes.popper}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', enabled: true, options: { boundary: 'clippingParents' } },
          ]}>
          <Paper className={classes.resPaper} elevation={8}>
            {resultList.map((item, index) => (
              <div
                key={index}
                className={classes.resItem}
                onClick={() => handleSelect(item.title, item.to)}
                onMouseDown={(e) => e.preventDefault()}>
                {item.title}
              </div>
            ))}
          </Paper>
        </Popper>

        {focused && !hasResults && (
          <Popper
            open={true}
            anchorEl={containerRef.current}
            placement="bottom-start"
            className={classes.popper}
            modifiers={[
              { name: 'flip', enabled: false },
              { name: 'preventOverflow', enabled: true, options: { boundary: 'clippingParents' } },
            ]}>
            <Paper className={classes.resPaper} elevation={8}>
              <div className={classes.resItem}>Gõ để tìm kiếm...</div>
            </Paper>
          </Popper>
        )}

        {wordDetails && (
          <WordDetailModal
            open={true}
            loading={false}
            {...wordDetails}
            onClose={() => setWordDetails(null)}
          />
        )}
      </div>
    </ClickAwayListener>
  );
}

SearchInputCustom.propTypes = {
  placeholder: PropTypes.string,
};

export default SearchInputCustom;
