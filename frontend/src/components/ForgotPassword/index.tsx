import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { MAX, MIN } from 'constant';
import { tokens } from 'shared/configs/theme';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Nhập email')
    .email('Email không hợp lệ')
    .max(MAX.EMAIL_LEN, `Email tối đa ${MAX.EMAIL_LEN}`),
  verifyCode: yup
    .string()
    .trim()
    .required('Nhập mã xác thực')
    .length(MAX.VERIFY_CODE, `Mã xác thực có ${MAX.VERIFY_CODE} chữ số`)
    .matches(
      new RegExp(`\\d{${MAX.VERIFY_CODE}}`),
      `Mã xác thực là số có ${MAX.VERIFY_CODE} chữ số`,
    ),
  password: yup
    .string()
    .trim()
    .required('Nhập mật khẩu')
    .min(MIN.PASSWORD_LEN, `Mật khẩu ít nhất ${MIN.PASSWORD_LEN} ký tự`)
    .max(MAX.PASSWORD_LEN, `Mật khẩu tối đa ${MAX.PASSWORD_LEN}`),
  confirmPw: yup
    .string()
    .trim()
    .required('Xác nhận lại mật khẩu')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
});

function ForgotPassword({ onSubmit, loading, mailSending, onSendVerifyCode }: { onSubmit: any; loading: any; mailSending: any; onSendVerifyCode: any }) {
  const [visiblePw, setVisiblePw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const handleSendCode = async () => {
    const email = getValues('email');
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(email.toLowerCase())) {
      dispatch(setMessage({ type: 'error', message: 'Email không hợp lệ' }));
      return;
    }
    onSendVerifyCode(email);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      sx={{ '& > *:not(:last-child)': { mb: 2.5 } }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            backgroundColor: `${tokens.coral}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <LockResetIcon sx={{ fontSize: 22, color: tokens.coral }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.8rem', color: tokens.charcoal }}>
          Lấy lại mật khẩu
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', color: tokens.stone, mt: 0.3 }}>
          Nhập email để nhận mã xác thực
        </Typography>
      </Box>

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        size="small"
        placeholder="Nhập email"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        inputProps={{ maxLength: MAX.EMAIL_LEN, autoFocus: true, ...register('email') }}
      />

      {/* Verify Code + Send Button */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <TextField
          label="Mã xác nhận"
          size="small"
          placeholder="X X X X X X"
          error={Boolean(errors.verifyCode)}
          helperText={errors.verifyCode?.message}
          inputProps={{ maxLength: MAX.VERIFY_CODE, ...register('verifyCode') }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          disabled={mailSending}
          onClick={handleSendCode}
          sx={{ mt: 0.3, height: 40, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {mailSending ? <CircularProgress size={18} /> : 'Gửi mã'}
        </Button>
      </Box>

      {/* New Password */}
      <TextField
        fullWidth
        label="Mật khẩu mới"
        size="small"
        placeholder="Nhập mật khẩu"
        type={visiblePw ? 'text' : 'password'}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        inputProps={{ maxLength: MAX.PASSWORD_LEN, ...register('password') }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setVisiblePw(!visiblePw)} edge="end" size="small" sx={{ color: tokens.iron }}>
                {visiblePw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password */}
      <TextField
        fullWidth
        label="Xác nhận mật khẩu"
        size="small"
        placeholder="Nhập lại mật khẩu"
        type={visiblePw ? 'text' : 'password'}
        error={Boolean(errors.confirmPw)}
        helperText={errors.confirmPw?.message}
        inputProps={{ maxLength: MAX.PASSWORD_LEN, ...register('confirmPw') }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setVisiblePw(!visiblePw)} edge="end" size="small" sx={{ color: tokens.iron }}>
                {visiblePw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        size="large"
        sx={{ py: 1.4 }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: tokens.white }} />
        ) : (
          'Đổi mật khẩu'
        )}
      </Button>
    </Box>
  );
}

export default ForgotPassword;
