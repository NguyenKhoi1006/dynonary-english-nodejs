import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar, Chip, Divider, Grid,
} from '@mui/material';
import {
  Person as PersonIcon, Email as EmailIcon, Badge as BadgeIcon,
  CalendarToday as CalendarIcon, Save as SaveIcon, CameraAlt as CameraIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAppSelector } from '../../hooks/useAppDispatch';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ProfilePage() {
  const { currentUser } = useAppSelector(s => s.user);
  const [name, setName] = useState(currentUser?.name || '');
  const role = currentUser?.role || 'student';

  return (
    <DashboardLayout role={role as 'student' | 'tutor' | 'admin'}>
      <Box sx={{ maxWidth: 800 }}>
        <Breadcrumbs items={[{ label: 'Hồ sơ' }]} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Hồ sơ của tôi</Typography>

        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={currentUser?.avt || ''}
                  sx={{ width: 88, height: 88, bgcolor: 'primary.main', fontSize: '2rem' }}
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{
                  position: 'absolute', bottom: 0, right: 0,
                  bgcolor: 'primary.main', borderRadius: '50%',
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '2px solid', borderColor: 'background.paper',
                }}>
                  <CameraIcon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentUser?.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Chip
                    label={role === 'admin' ? 'Admin' : role === 'tutor' ? 'Gia sư' : 'Học viên'}
                    size="small"
                    color={role === 'admin' ? 'error' : role === 'tutor' ? 'secondary' : 'primary'}
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={currentUser?.membership === 'premium' ? 'Premium' : 'Free'}
                    size="small"
                    variant="outlined"
                    color={currentUser?.membership === 'premium' ? 'warning' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Họ tên" value={name}
                  onChange={e => setName(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Email" value={currentUser?.email || ''} disabled
                  InputProps={{
                    startAdornment: <EmailIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Lưu thay đổi
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Thông tin tài khoản</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">UID: </Typography>
                <Typography variant="body2">{currentUser?.uid?.slice(0, 16)}...</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">Tham gia từ: </Typography>
                <Typography variant="body2">Tháng 6, 2026</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
