import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi, type AdminStats } from '../../services/lmsApi';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminApi.getDashboardStats()
      .then(data => { if (!cancelled) setStats(data); })
      .catch(err => { if (!cancelled) setError(err.message || 'Không thể tải dữ liệu'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const statCards = stats
    ? [
        { label: 'Người dùng', value: stats.totalUsers.toLocaleString() },
        { label: 'Học viên', value: stats.studentCount.toLocaleString() },
        { label: 'Gia sư', value: (stats.totalUsers - stats.adminCount - stats.studentCount).toLocaleString() },
        { label: 'Premium', value: stats.premiumCount.toLocaleString() },
        { label: 'Bị cấm', value: stats.bannedCount.toLocaleString() },
        { label: 'Bài học', value: stats.totalMaterials.toLocaleString() },
        { label: 'Bài kiểm tra', value: stats.totalTests.toLocaleString() },
      ]
    : [];

  if (error) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.25 }}>Quản trị hệ thống</Typography>
            <Typography variant="body2" color="text.secondary">Tổng quan hoạt động của nền tảng</Typography>
          </Box>
          <Button variant="contained" size="small" onClick={() => navigate('/admin/users')}>
            Quản lý người dùng
          </Button>
        </Box>

        {loading ? (
          <LoadingSkeleton type="stats" count={7} />
        ) : (
          <Grid container spacing={2}>
            {statCards.map((stat, i) => (
              <Grid item xs={6} sm={4} lg={3} key={i}>
                <Card>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h5">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
}
