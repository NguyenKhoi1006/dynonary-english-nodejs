import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid,
} from '@mui/material';
import {
  People as PeopleIcon, School as SchoolIcon, MenuBook as BookIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const statCards = [
  { label: 'Tổng người dùng', value: '1,247' },
  { label: 'Tổng gia sư', value: '86' },
  { label: 'Tổng khóa học', value: '234' },
  { label: 'Tổng buổi học', value: '3,892' },
];

const roleColors: Record<string, 'primary' | 'secondary' | 'error' | 'default'> = {
  tutor: 'secondary', student: 'primary', admin: 'error',
};
const roleLabels: Record<string, string> = { tutor: 'Gia sư', student: 'Học viên', admin: 'Admin' };
const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success', pending: 'warning', banned: 'error',
};
const statusLabels: Record<string, string> = { active: 'Hoạt động', pending: 'Chờ duyệt', banned: 'Bị cấm' };

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  // Simulate API load — admin endpoints not yet implemented
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout role="admin">
      <Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>Quản trị hệ thống</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Tổng quan hoạt động của nền tảng DynoLMS
        </Typography>

        {loading ? (
          <LoadingSkeleton type="stats" count={4} />
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statCards.map((stat, i) => (
              <Grid item xs={6} lg={3} key={i}>
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
