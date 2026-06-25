import ForgotPasswordData from 'components/ForgotPassword/data';
import useCloseNavigation from 'hooks/useCloseNavigation';
import useTitle from 'hooks/useTitle';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from 'shared/configs/theme';
import logoUrl from 'assets/images/logo.png';

function ForgotPasswordPage() {
  useTitle('Quên mật khẩu');
  useCloseNavigation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${tokens.warmBg} 0%, ${tokens.cloud} 100%)`,
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="img"
            src={logoUrl}
            alt="Dynonary"
            sx={{ height: 44, width: 'auto', mb: 1 }}
          />
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.4rem',
              fontWeight: 700,
              color: tokens.charcoal,
              letterSpacing: '-0.02em',
            }}
          >
            Dynonary
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            backgroundColor: tokens.white,
            borderRadius: 3,
            border: `1px solid ${tokens.bone}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            p: 3.5,
          }}
        >
          <ForgotPasswordData />
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPasswordPage;
