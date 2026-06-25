import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
      textAlign: 'center',
      px: 2,
    }}>
      <Typography variant="h1" sx={{
        fontWeight: 900, fontSize: '8rem',
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        mb: 2,
      }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Trang không tìm thấy
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </Typography>
      <Button variant="contained" size="large" startIcon={<HomeIcon />} onClick={() => navigate('/dashboard')}>
        Về trang chủ
      </Button>
    </Box>
  );
}
