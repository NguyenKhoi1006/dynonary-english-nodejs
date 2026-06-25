import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Chip, Avatar, Grid, Button, Skeleton,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon, AccessTime as TimeIcon,
  Person as PersonIcon, VideoCameraFront as VideoIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { schedulingApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Session } from '../../types';

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error', no_show: 'default',
};
const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy', no_show: 'Vắng mặt',
};

export default function SessionsPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const { currentUser } = useAppSelector(s => s.user);
  const role = currentUser?.role === 'tutor' ? 'tutor' : 'student';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    schedulingApi.getMySessions(role)
      .then(data => {
        if (!cancelled) setSessions(data.sessions || []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách buổi học');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [role]);

  const upcoming = sessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
  const history = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled');
  const displaySessions = tab === 0 ? upcoming : history;

  if (error) {
    return (
      <DashboardLayout role={role}>
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role === 'tutor' ? 'tutor' : 'student'}>
      <Box>
        <Breadcrumbs items={[{ label: 'Lịch học' }]} />

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Lịch học</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Quản lý tất cả buổi học của bạn
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} aria-label="Bộ lọc lịch học">
          <Tab label={`Sắp tới (${upcoming.length})`} />
          <Tab label={`Lịch sử (${history.length})`} />
        </Tabs>

        {loading ? (
          <LoadingSkeleton type="list" count={4} />
        ) : displaySessions.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon sx={{ fontSize: 64 }} />}
            title={tab === 0 ? 'Không có buổi học sắp tới' : 'Chưa có lịch sử buổi học'}
            description={tab === 0 ? 'Tìm gia sư và đặt lịch học ngay!' : 'Các buổi học đã hoàn thành sẽ xuất hiện ở đây.'}
            actionLabel={tab === 0 ? 'Tìm gia sư' : undefined}
            onAction={tab === 0 ? () => window.location.href = '/tutors' : undefined}
          />
        ) : (
          displaySessions.map(session => {
            const displayName = role === 'tutor' ? session.studentName : session.tutorName;
            const displayAvt = role === 'tutor' ? session.studentAvt : session.tutorAvt;
            return (
              <Card key={session.uid} sx={{ mb: 1.5, borderRadius: 2.5, transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={displayAvt} sx={{ width: 44, height: 44, bgcolor: 'primary.main' }} aria-hidden="true">
                    {displayName?.charAt(0) || '?'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{displayName}</Typography>
                    <Typography variant="caption" color="text.secondary">{session.courseName || ''}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: 'text.primary' }}>
                      {session.date}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {session.startTime} - {session.endTime}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusLabels[session.status] || session.status}
                    color={statusColors[session.status] || 'default'}
                    size="small"
                    sx={{ fontWeight: 700, minWidth: 80 }}
                  />
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </DashboardLayout>
  );
}
