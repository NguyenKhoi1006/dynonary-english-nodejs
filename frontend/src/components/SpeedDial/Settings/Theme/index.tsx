import Collapse from '@mui/material/Collapse';
import DarkIcon from '@mui/icons-material/Brightness3';
import LightIcon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import { THEME_KEYS } from 'constant';
import { getCustomPalettes, setRootPalettes } from 'helper';
import React, { useState } from 'react';
import PaletteColor from './PaletteColor';
import useStyle from './style';

function ThemeSetting() {
  const classes = useStyle();
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem(THEME_KEYS.LS_KEY) || THEME_KEYS.LIGHT,
  );
  const [palettes, setPalettes] = useState(() => getCustomPalettes());

  const onChangeTheme = (theme: string) => {
    if (theme === currentTheme) return;

    const root = document.querySelector(':root') as HTMLElement;
    if (currentTheme === THEME_KEYS.CUSTOM) root.removeAttribute('style'); // reset style
    root.setAttribute(THEME_KEYS.ROOT_KEY, theme);
    localStorage.setItem(THEME_KEYS.LS_KEY, theme);
  };

  const toggleDarkLight = (theme: string) => {
    onChangeTheme(theme);
    setCurrentTheme(theme);
  };

  const onCustomThemeClick = (theme: string) => {
    if (theme === currentTheme) return;
    setPalettes(getCustomPalettes());
    setRootPalettes();
    setCurrentTheme(theme);
    onChangeTheme(theme);
  };

  return (
    <>
      <div className={`${classes.root} d-flex`}>
        {/* light */}
        <div
          className={`${classes.item} ${
            THEME_KEYS.LIGHT === currentTheme ? 'active' : ''
          }`}
          onClick={() => toggleDarkLight(THEME_KEYS.LIGHT)}>
          <LightIcon className="icon" />
        </div>

        {/* dark */}
        <div
          className={`${classes.item} ${
            THEME_KEYS.DARK === currentTheme ? 'active' : ''
          }`}
          onClick={() => toggleDarkLight(THEME_KEYS.DARK)}>
          <DarkIcon className="icon" />
        </div>

        {/* custom */}
        <div
          className={`${classes.item} ${
            THEME_KEYS.CUSTOM === currentTheme ? 'active' : ''
          }`}
          onClick={() => onCustomThemeClick(THEME_KEYS.CUSTOM)}>
          <PaletteIcon className="icon" />
        </div>
      </div>

      {/* palette custom color */}
      <Collapse in={currentTheme === THEME_KEYS.CUSTOM}>
        <PaletteColor palettes={palettes} />
      </Collapse>
    </>
  );
}

export default ThemeSetting;
