import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';
import type { RootState } from 'redux/store';
import api from 'services/api';

interface DashboardStats {
  totalUsers: number;
  adminCount: number;
  learnerCount: number;
  premiumCount: number;
  bannedCount: number;
  totalMaterials: number;
  totalTests: number;
  totalLogs: number;
}

export default function AdminDashboardPage() {
  const { name } = useSelector((state: RootState) => state.adminInfo);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/apis/admin/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Người dùng', value: stats?.totalUsers ?? '—', color: '#1976d2', subtitle: `${stats?.learnerCount ?? '—'} learner · ${stats?.adminCount ?? '—'} admin` },
    { title: 'Premium', value: stats?.premiumCount ?? '—', color: '#7b1fa2', subtitle: `/${stats?.totalUsers ?? '—'} users` },
    { title: 'Banned', value: stats?.bannedCount ?? '—', color: '#d32f2f', subtitle: `/${stats?.totalUsers ?? '—'} users` },
    { title: 'Tài liệu', value: stats?.totalMaterials ?? '—', color: '#388e3c' },
    { title: 'Bài kiểm tra', value: stats?.totalTests ?? '—', color: '#f57c00' },
    { title: 'Admin Logs', value: stats?.totalLogs ?? '—', color: '#546e7a' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Chào mừng {name} đến với trang quản trị Dynonary.
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Paper sx={{ p: 3 }}>
              {loading ? (
                <Box>
                  <Skeleton width="40%" />
                  <Skeleton width="30%" height={48} />
                  {stat.subtitle && <Skeleton width="60%" />}
                </Box>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  {stat.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
