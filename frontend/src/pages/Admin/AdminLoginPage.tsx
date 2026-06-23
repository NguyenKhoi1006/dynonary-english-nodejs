import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { setAdmin, clearAdmin } from 'redux/slices/adminInfo.slice';
import { getAuth, signOut } from 'firebase/auth';
import api from 'services/api';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DynonaryIcon from '@mui/icons-material/AutoStories';

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/apis/admin/auth/login', { email, password });
      const data = res.data;

      // Sign out any existing Firebase SDK session to avoid conflict
      const fbAuth = getAuth();
      if (fbAuth.currentUser) {
        await signOut(fbAuth).catch(() => {});
      }

      dispatch(
        setAdmin({
          uid: data.uid,
          email: data.email,
          name: data.name,
          avt: data.avt,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        }),
      );

      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      const msg =
        err.message === 'Request failed'
          ? err.response?.data?.detail || err.response?.data?.message || 'Đăng nhập thất bại'
          : err.message || 'Đăng nhập thất bại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a237e 50%, #0d47a1 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <DynonaryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            Dynonary Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Đăng nhập với tài khoản quản trị
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
          <Button
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => navigate('/login')}
          >
            Quay lại trang chủ
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
