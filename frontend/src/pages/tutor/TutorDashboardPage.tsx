import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, Stack,
} from '@mui/material';
import {
  People as PeopleIcon, CalendarMonth as CalendarIcon, School as SchoolIcon,
  Star as StarIcon, Add as AddIcon, Schedule as ScheduleIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Session } from '../../types';

export default function TutorDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    schedulingApi.getMySessions('tutor')
      .then(data => {
        if (!cancelled) setSessions(data.sessions || []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải dữ liệu');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const confirmedCount = sessions.filter(s => s.status === 'confirmed').length;
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const uniqueStudents = new Set(sessions.map(s => s.studentId)).size;

  const stats = [
    { label: 'Học viên', value: uniqueStudents.toString() },
    { label: 'Buổi đang mở', value: confirmedCount.toString() },
    { label: 'Buổi đã dạy', value: completedCount.toString() },
    { label: 'Hôm nay', value: todaySessions.length.toString() },
  ];

  if (error) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Breadcrumbs items={[{ label: 'Bảng điều khiển' }]} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>Bảng điều khiển</Typography>
            <Typography variant="body2" color="text.secondary">
              {todaySessions.length > 0
                ? `Hôm nay bạn có ${todaySessions.length} buổi học.`
                : 'Chào mừng trở lại!'}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/my-courses')} size="small">
            Tạo khóa học mới
          </Button>
        </Box>

        {loading ? (
          <LoadingSkeleton type="stats" count={4} />
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, i) => (
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Hôm nay</Typography>

            {loading ? (
              <LoadingSkeleton type="list" count={4} />
            ) : todaySessions.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon sx={{ fontSize: 48 }} />}
                title="Hôm nay không có buổi học nào"
                description="Bạn có thể cài đặt lịch dạy để học viên đặt lịch."
                actionLabel="Cài đặt lịch"
              />
            ) : (
              todaySessions.map(s => (
                <Card key={s.uid} sx={{ mb: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={s.studentAvt} sx={{ width: 36, height: 36 }} aria-hidden="true">
                      {s.studentName?.charAt(0) || '?'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.studentName}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.courseName || ''}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 500, display: 'block' }}>{s.startTime} - {s.endTime}</Typography>
                      <Chip
                        label={s.status === 'confirmed' ? 'Đã xác nhận' : s.status === 'pending' ? 'Chờ' : s.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        size="small"
                        color={s.status === 'confirmed' ? 'info' : s.status === 'pending' ? 'warning' : s.status === 'completed' ? 'success' : 'error'}
                        sx={{ height: 20, fontSize: '0.65rem', mt: 0.3 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Truy cập nhanh</Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/my-courses')} fullWidth>
                Tạo khóa học mới
              </Button>
              <Button variant="outlined" startIcon={<ScheduleIcon />} fullWidth>
                Cài đặt lịch dạy
              </Button>
              <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => navigate('/students')} fullWidth>
                Xem học viên
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
