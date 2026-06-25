import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, IconButton, InputAdornment, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Person as PersonIcon, Email as EmailIcon, Lock as LockIcon,
  School as SchoolIcon, People as PeopleIcon,
} from '@mui/icons-material';
import AuthLayout from '../../layouts/AuthLayout';
import { registerWithEmail } from '../../services/auth.service';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !role) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPwd) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name, role);
      navigate('/login');
    } catch (err: any) {
      const msg = err.message || 'Đăng ký thất bại';
      if (msg.includes('email-already-in-use')) setError('Email đã được sử dụng');
      else if (msg.includes('weak-password')) setError('Mật khẩu quá yếu');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký" subtitle="Tạo tài khoản DynoLMS">
      <Box component="form" onSubmit={handleRegister}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth label="Họ tên" value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment>,
          }}
        />
        <TextField
          fullWidth label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>,
          }}
        />
        <TextField
          fullWidth label="Mật khẩu" type={showPwd ? 'text' : 'password'} value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPwd(!showPwd)}
                  edge="end" size="small"
                  aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth label="Xác nhận mật khẩu" type="password" value={confirmPwd}
          onChange={e => setConfirmPwd(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Bạn là</Typography>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(_, v) => v && setRole(v)}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="student" sx={{ py: 1, gap: 0.5 }}>
            <PeopleIcon fontSize="small" />
            Học viên
          </ToggleButton>
          <ToggleButton value="tutor" sx={{ py: 1, gap: 0.5 }}>
            <SchoolIcon fontSize="small" />
            Gia sư
          </ToggleButton>
        </ToggleButtonGroup>

        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Đã có tài khoản?{' '}
          <Typography component={Link} to="/login" color="primary" sx={{ fontWeight: 600, textDecoration: 'none' }}>
            Đăng nhập
          </Typography>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
