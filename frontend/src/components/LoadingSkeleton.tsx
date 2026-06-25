import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

interface Props {
  type?: 'card' | 'list' | 'table' | 'stats' | 'detail';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: Props) {
  if (type === 'stats') {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item xs={6} lg={3} key={i}>
            <Card>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Skeleton variant="text" width="30%" height={28} />
                <Skeleton variant="text" width="50%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} sx={{ mb: 1 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={18} />
                <Skeleton variant="text" width="25%" height={14} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (type === 'detail') {
    return (
      <Box>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="50%" height={18} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={180} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="100%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={14} />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <Card>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 0 }} />
            <CardContent sx={{ p: 2 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="30%" height={24} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
