import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Divider, Alert, IconButton, InputAdornment,
} from '@mui/material';
import {
  Google as GoogleIcon, Facebook as FacebookIcon,
  Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon,
} from '@mui/icons-material';
import AuthLayout from '../../layouts/AuthLayout';
import { loginWithEmail, loginWithGoogle, loginWithFacebook } from '../../services/auth.service';
import { getUserProfile } from '../../services/firestore.service';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../store/slices/userSlice';
import type { User } from '../../types';

const VALID_ROLES = ['student', 'tutor', 'admin'] as const;

function normalizeRole(role: string | undefined): User['role'] {
  return role && VALID_ROLES.includes(role as any) ? (role as User['role']) : 'student';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Vui lòng nhập email và mật khẩu'); return; }
    setLoading(true);
    setError('');
    try {
      const userCred = await loginWithEmail(email, password);
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || 'free',
            status: profile.status || 'active',
          },
        }));
      }
      navigate(profile?.role === 'admin' ? '/admin' : profile?.role === 'tutor' ? '/tutor' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const userCred = await loginWithGoogle();
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || 'free',
            status: profile.status || 'active',
          },
        }));
      }
      navigate(profile?.role === 'admin' ? '/admin' : profile?.role === 'tutor' ? '/tutor' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebook = async () => {
    setLoading(true);
    setError('');
    try {
      const userCred = await loginWithFacebook();
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || 'free',
            status: profile.status || 'active',
          },
        }));
      }
      navigate(profile?.role === 'admin' ? '/admin' : profile?.role === 'tutor' ? '/tutor' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Facebook thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn đến với DynoLMS">
      <Box component="form" onSubmit={handleLogin}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>,
          }}
        />
        <TextField
          fullWidth
          label="Mật khẩu"
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 1 }}
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

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Typography
            component={Link}
            to="/forgot-password"
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <Divider sx={{ my: 2 }}>hoặc</Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogle}
            disabled={loading}
            startIcon={<GoogleIcon />}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleFacebook}
            disabled={loading}
            startIcon={<FacebookIcon />}
          >
            Facebook
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Chưa có tài khoản?{' '}
          <Typography component={Link} to="/register" color="primary" sx={{ fontWeight: 600, textDecoration: 'none' }}>
            Đăng ký
          </Typography>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
