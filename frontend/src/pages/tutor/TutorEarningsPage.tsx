import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableContainer, TableHead, TableBody,
  TableRow, TableCell, Chip, Avatar,
} from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi, tutorApi } from '../../services/lmsApi';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

export default function TutorEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [hourlyRate, setHourlyRate] = useState(300000);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      schedulingApi.getMySessions('tutor'),
      tutorApi.getMyProfile().catch(() => null),
    ])
      .then(([sessionsData, profile]) => {
        if (cancelled) return;
        const list = sessionsData?.sessions || sessionsData || [];
        setSessions(list);
        if (profile?.hourlyRate) setHourlyRate(profile.hourlyRate);
      })
      .catch(err => { if (!cancelled) setError(err.message || 'Không thể tải dữ liệu'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const completedSessions = sessions.filter((s: any) => s.status === 'completed');
  const totalEarnings = completedSessions.reduce((sum: number, s: any) => {
    const hours = s.durationMinutes ? s.durationMinutes / 60 : 1;
    return sum + hours * hourlyRate;
  }, 0);
  const thisMonthSessions = sessions.filter((s: any) => {
    if (!s.date) return false;
    const d = new Date(s.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthEarnings = thisMonthSessions
    .filter((s: any) => s.status === 'completed')
    .reduce((sum: number, s: any) => sum + hourlyRate, 0);

  const monthlyData = (() => {
    const months: Record<string, number> = {};
    completedSessions.forEach((s: any) => {
      if (!s.date) return;
      const d = new Date(s.date);
      const key = `T${d.getMonth() + 1}`;
      months[key] = (months[key] || 0) + hourlyRate;
    });
    const sorted = Object.entries(months).sort(([a], [b]) => {
      const ma = parseInt(a.slice(1)), mb = parseInt(b.slice(1));
      return ma - mb;
    });
    return sorted.map(([month, amount]) => ({ month, amount }));
  })();

  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);

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
        <Typography variant="h4" sx={{ mb: 2.5 }}>Doanh thu</Typography>

        {loading ? (
          <LoadingSkeleton type="stats" count={3} />
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Tổng doanh thu', value: `${totalEarnings.toLocaleString()}đ` },
                { label: 'Tháng này', value: `${thisMonthEarnings.toLocaleString()}đ` },
                { label: 'Buổi đã dạy', value: `${completedSessions.length} buổi` },
              ].map((stat, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Card>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h5">{stat.value}</Typography>
                      <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Doanh thu theo tháng</Typography>
                {monthlyData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Chưa có dữ liệu doanh thu
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160, pt: 2 }}>
                    {monthlyData.map((d, i) => (
                      <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {(d.amount / 1000000).toFixed(1)}tr
                        </Typography>
                        <Box sx={{
                          width: '100%', height: `${(d.amount / maxAmount) * 120}px`,
                          bgcolor: i === monthlyData.length - 1 ? 'primary.main' : 'primary.light',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s',
                          opacity: 0.8,
                        }} />
                        <Typography variant="caption" color="text.disabled">{d.month}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Giao dịch gần đây</Typography>
                {sessions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Chưa có giao dịch nào
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ fontWeight: 700 }}>Học viên</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Giờ</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sessions.slice(0, 20).map((s: any) => (
                          <TableRow key={s.uid || s.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                                  {(s.studentName || '?').charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{s.studentName || 'Học viên'}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {s.date ? new Date(s.date).toLocaleDateString('vi-VN') : '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {s.startTime || '-'} - {s.endTime || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: s.status === 'completed' ? 'success.main' : 'text.secondary' }}>
                                {s.status === 'completed' ? `+${hourlyRate.toLocaleString()}đ` : '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={s.status === 'completed' ? 'Hoàn thành' : s.status === 'cancelled' ? 'Đã hủy' : 'Chờ'}
                                size="small"
                                color={s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'error' : 'warning'}
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
