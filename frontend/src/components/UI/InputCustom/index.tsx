import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';

function InputCustom(props: any) {
  const { endAdornment, error, inputProps, ...propRest } = props;
  const classes = useStyle();

  return (
    <TextField
      classes={classes}
      error={error}
      InputProps={{
        disableUnderline: true,
        endAdornment,
      }}
      inputProps={inputProps}
      InputLabelProps={{
        shrink: true,
      }}
      variant="filled"
      {...propRest}
    />
  );
}

InputCustom.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  multiline: PropTypes.bool,
  error: PropTypes.bool,
  endAdornment: PropTypes.any,
  inputProps: PropTypes.any,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
};

InputCustom.defaultProps = {
  className: '',
  label: '',
  placeholder: '',
  size: 'small',
  multiline: false,
  error: false,
  endAdornment: null,
  inputProps: {},
  onChange: function () {},
  defaultValue: '',
};

export default InputCustom;
