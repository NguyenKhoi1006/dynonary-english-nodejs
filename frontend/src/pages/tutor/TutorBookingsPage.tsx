import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab,
} from '@mui/material';
import { CheckCircle, Cancel, Event as EventIcon } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi } from '../../services/lmsApi';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã hủy'];
const STATUS_MAP = ['', 'pending', 'confirmed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', cancelled: 'Đã hủy' };
const STATUS_COLORS: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', confirmed: 'success', cancelled: 'error' };

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'confirm' | 'cancel'; name: string } | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    schedulingApi.getTutorBookings()
      .then((data: any) => {
        const list = data.bookings || data || [];
        setBookings(Array.isArray(list) ? list : []);
      })
      .catch(err => setError(err.message || 'Không thể tải lịch đặt'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = tab === 0 ? bookings : bookings.filter(b => b.status === STATUS_MAP[tab]);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.action === 'confirm') await schedulingApi.confirmBooking(confirmAction.id);
      else await schedulingApi.cancelBooking(confirmAction.id);
      setConfirmAction(null);
      fetch();
    } catch { /* ignore */ }
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[date.getDay()]}, ${date.toLocaleDateString('vi-VN')}`;
  };

  if (error) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetch} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Lịch đặt</Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {TABS.map((t, i) => <Tab key={i} label={`${t}${i > 0 ? ` (${bookings.filter(b => b.status === STATUS_MAP[i]).length})` : ''}`} />)}
        </Tabs>

        {loading ? <LoadingSkeleton type="list" count={6} /> : (
          filtered.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {tab === 0 ? 'Không có lịch đặt nào' : tab === 1 ? 'Không có lịch chờ xác nhận' : tab === 2 ? 'Không có lịch đã xác nhận' : 'Không có lịch đã hủy'}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((b: any) => (
                <Grid item xs={12} sm={6} lg={4} key={b.uid || b.id}>
                  <Card>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar src={b.studentAvt} sx={{ width: 36, height: 36, fontSize: '0.75rem' }}>
                          {(b.studentName || '?').charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">{b.studentName || 'Học viên'}</Typography>
                          <Typography variant="caption" color="text.secondary">{b.studentEmail || ''}</Typography>
                        </Box>
                        <Chip label={STATUS_LABELS[b.status] || b.status} size="small" color={STATUS_COLORS[b.status] || 'default'} sx={{ height: 22, fontSize: '0.7rem' }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2">{formatDate(b.date)}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {b.startTime || ''} - {b.endTime || ''}
                      </Typography>
                      {b.courseName && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Khóa học: {b.courseName}</Typography>}
                      {b.note && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>Ghi chú: {b.note}</Typography>}

                      {b.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Button size="small" variant="contained" color="success" startIcon={<CheckCircle />}
                            onClick={() => setConfirmAction({ id: b.uid || b.id, action: 'confirm', name: b.studentName || 'học viên' })}>
                            Xác nhận
                          </Button>
                          <Button size="small" variant="outlined" color="error" startIcon={<Cancel />}
                            onClick={() => setConfirmAction({ id: b.uid || b.id, action: 'cancel', name: b.studentName || 'học viên' })}>
                            Hủy
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}

        <Dialog open={Boolean(confirmAction)} onClose={() => setConfirmAction(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogContent>
            <Typography>
              {confirmAction?.action === 'confirm'
                ? `Xác nhận lịch đặt của "${confirmAction?.name}"?`
                : `Hủy lịch đặt của "${confirmAction?.name}"?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmAction(null)}>Hủy</Button>
            <Button variant="contained" color={confirmAction?.action === 'confirm' ? 'success' : 'error'} onClick={handleConfirm}>
              {confirmAction?.action === 'confirm' ? 'Xác nhận' : 'Hủy lịch'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
