import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel, Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi } from '../../services/lmsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_LABELS: Record<string, string> = { Monday: 'Thứ Hai', Tuesday: 'Thứ Ba', Wednesday: 'Thứ Tư', Thursday: 'Thứ Năm', Friday: 'Thứ Sáu', Saturday: 'Thứ Bảy', Sunday: 'Chủ Nhật' };
const TIMES = Array.from({ length: 33 }, (_, i) => {
  const h = 6 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

export default function TutorAvailabilityPage() {
  const { currentUser } = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ dayOfWeek: string; startTime: string; endTime: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00' });

  useEffect(() => {
    if (!currentUser?.uid) { setLoading(false); return; }
    setLoading(true); setError(null);
    schedulingApi.getAvailability(currentUser.uid)
      .then((data: any) => {
        const list = data.slots || data.availability || data || [];
        setSlots(Array.isArray(list) ? list : []);
      })
      .catch(err => setError(err.message || 'Không thể tải lịch rảnh'))
      .finally(() => setLoading(false));
  }, [currentUser?.uid]);

  const addSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) { alert('Giờ bắt đầu phải trước giờ kết thúc'); return; }
    setSlots(prev => [...prev, { ...newSlot }]);
    setDialog(false);
  };

  const removeSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await schedulingApi.setAvailability(slots);
      alert('Lưu lịch rảnh thành công');
    } catch { alert('Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const groupedSlots: Record<string, typeof slots> = {};
  DAYS.forEach(d => { groupedSlots[d] = slots.filter(s => s.dayOfWeek === d); });

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.25 }}>Lịch rảnh</Typography>
            <Typography variant="body2" color="text.secondary">Thiết lập thời gian bạn có thể dạy</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setDialog(true)}>Thêm khung giờ</Button>
            <Button variant="contained" size="small" onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Box>
        </Box>

        {loading ? <LoadingSkeleton type="list" count={7} /> : (
          <Grid container spacing={1.5}>
            {DAYS.map(day => (
              <Grid item xs={12} sm={6} md key={day}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{DAY_LABELS[day]}</Typography>
                    {groupedSlots[day].length === 0 ? (
                      <Typography variant="caption" color="text.disabled">Không có lịch</Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {groupedSlots[day].map((slot, i) => (
                          <Chip
                            key={i}
                            label={`${slot.startTime} - ${slot.endTime}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            onDelete={() => removeSlot(slots.indexOf(slot))}
                            sx={{ height: 26, justifyContent: 'space-between' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Thêm khung giờ rảnh</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Thứ</InputLabel>
                <Select value={newSlot.dayOfWeek} label="Thứ" onChange={e => setNewSlot(p => ({ ...p, dayOfWeek: e.target.value }))}>
                  {DAYS.map(d => <MenuItem key={d} value={d}>{DAY_LABELS[d]}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Giờ bắt đầu</InputLabel>
                <Select value={newSlot.startTime} label="Giờ bắt đầu" onChange={e => setNewSlot(p => ({ ...p, startTime: e.target.value }))}>
                  {TIMES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Giờ kết thúc</InputLabel>
                <Select value={newSlot.endTime} label="Giờ kết thúc" onChange={e => setNewSlot(p => ({ ...p, endTime: e.target.value }))}>
                  {TIMES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Hủy</Button>
            <Button variant="contained" onClick={addSlot}>Thêm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
