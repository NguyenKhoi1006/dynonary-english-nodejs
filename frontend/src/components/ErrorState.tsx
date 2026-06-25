import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Có lỗi xảy ra',
  message = '',
  onRetry,
}: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 320, mx: 'auto' }}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </Box>
  );
}
