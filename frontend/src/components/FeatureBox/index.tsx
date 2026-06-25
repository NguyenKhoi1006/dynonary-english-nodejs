import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from 'shared/configs/theme';

interface FeatureBoxProps {
  to?: string;
  imgUrl?: string;
  title?: string;
  subTitle?: string;
}

function FeatureBox({ to = '', imgUrl = '', title = '', subTitle = '' }: FeatureBoxProps) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2.5,
          borderRadius: 2.5,
          border: `1px solid ${tokens.bone}`,
          backgroundColor: tokens.warmBg,
          cursor: 'pointer',
          transition: 'all 0.2s',
          height: '100%',
          '&:hover': {
            backgroundColor: tokens.white,
            borderColor: tokens.iron,
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {imgUrl && (
          <Box
            component="img"
            src={imgUrl}
            alt={title}
            sx={{ width: 36, height: 36, flexShrink: 0, mt: 0.3 }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: tokens.charcoal, mb: 0.3 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', color: tokens.stone, lineHeight: 1.6 }}>
            {subTitle}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

export default FeatureBox;
