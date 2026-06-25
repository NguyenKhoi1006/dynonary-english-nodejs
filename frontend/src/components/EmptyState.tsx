import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined as InboxIcon } from '@mui/icons-material';

interface Props {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title = 'Không có dữ liệu',
  description = '',
  actionLabel,
  onAction,
}: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
      <Box sx={{ mb: 1.5, color: 'text.disabled' }}>
        {icon || <InboxIcon sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: 'text.secondary' }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" sx={{ mb: 2, maxWidth: 320, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="outlined" size="small" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
