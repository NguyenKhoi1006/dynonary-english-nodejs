import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SocialNetworkLogin from 'components/Login/SocialNetwork';
import { MAX, MIN, REGEX } from 'constant';
import { tokens } from 'shared/configs/theme';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Nhập email')
    .email('Email không hợp lệ')
    .max(MAX.EMAIL_LEN, `Email tối đa ${MAX.EMAIL_LEN}`),
  name: yup
    .string()
    .trim()
    .required('Nhập họ tên')
    .max(MAX.NAME_LEN, `Họ tên tối đa ${MAX.NAME_LEN} ký tự`)
    .matches(REGEX.NAME, 'Họ tên không chứ số và ký tự đặc biệt'),
  password: yup
    .string()
    .trim()
    .required('Nhập mật khẩu')
    .min(MIN.PASSWORD_LEN, `Mật khẩu ít nhất ${MIN.PASSWORD_LEN} ký tự`)
    .max(MAX.PASSWORD_LEN, `Mật khẩu tối đa ${MAX.PASSWORD_LEN}`),
});

function Register({ onRegister, loading }: { onRegister: any; loading: any }) {
  const [visiblePw, setVisiblePw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onRegister)}
      autoComplete="off"
      sx={{
        '& > *:not(:last-child)': { mb: 2.5 },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            backgroundColor: `${tokens.navy}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 22, color: tokens.navy }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, fontSize: '1.8rem', color: tokens.charcoal }}
        >
          Tạo tài khoản
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', color: tokens.stone, mt: 0.3 }}>
          Bắt đầu hành trình học tiếng Anh
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

      {/* Name */}
      <TextField
        fullWidth
        label="Họ tên"
        size="small"
        placeholder="Nhập họ tên"
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        inputProps={{ maxLength: MAX.NAME_LEN, ...register('name') }}
      />

      {/* Password */}  
      <TextField
        fullWidth
        label="Mật khẩu"
        size="small"
        placeholder="Nhập mật khẩu"
        type={visiblePw ? 'text' : 'password'}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        inputProps={{ maxLength: MAX.PASSWORD_LEN, ...register('password') }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisiblePw(!visiblePw)}
                edge="end"
                size="small"
                sx={{ color: tokens.iron }}
              >
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
          'Tạo tài khoản'
        )}
      </Button>

      {/* Divider */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          my: 1,
        }}
      >
        <Box sx={{ flex: 1, height: 1, backgroundColor: tokens.bone }} />
        <Typography sx={{ fontSize: '1.1rem', color: tokens.stone, fontWeight: 500 }}>
          HOẶC
        </Typography>
        <Box sx={{ flex: 1, height: 1, backgroundColor: tokens.bone }} />
      </Box>

      <SocialNetworkLogin />
    </Box>
  );
}

export default Register;
