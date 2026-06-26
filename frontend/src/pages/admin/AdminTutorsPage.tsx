import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Pagination, InputAdornment, TableContainer, Avatar, Rating,
} from '@mui/material';
import {
  Search as SearchIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];
const STATUS_LABELS: Record<string, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
const STATUS_COLORS: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' };

export default function AdminTutorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailDialog, setDetailDialog] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; name: string; action: 'approve' | 'reject' } | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    adminApi.listAdminTutors(params)
      .then(d => { setItems(d.tutors || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  const openDetail = async (tutorId: string) => {
    try {
      const data = await adminApi.getAdminTutor(tutorId);
      setDetailDialog(data);
    } catch { /* ignore */ }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.action === 'approve') await adminApi.approveTutor(confirmAction.id);
      else await adminApi.rejectTutor(confirmAction.id);
      setConfirmAction(null);
      fetch();
    } catch { /* ignore */ }
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Gia sư' }]} />
        <Typography variant="h4" sx={{ mb: 2 }}>Quản lý gia sư</Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Tìm kiếm tên / email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 220 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[{ value: '', label: 'Tất cả' }, ...STATUS_OPTIONS.map(s => ({ value: s, label: STATUS_LABELS[s] }))].map(opt => (
                  <Chip key={opt.value} label={opt.label} size="small"
                    color={(statusFilter === opt.value ? STATUS_COLORS[opt.value] || 'primary' : 'default') as any}
                    variant={statusFilter === opt.value ? 'filled' : 'outlined'}
                    onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>{total} gia sư</Typography>
            </Box>
          </CardContent>
        </Card>

        {error ? <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetch} /> :
         loading ? <LoadingSkeleton type="list" count={8} /> :
         items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy gia sư</Typography> :
         <>
          <TableContainer component={Card}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Gia sư</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Môn học</TableCell>
                  <TableCell>Giá/giờ</TableCell>
                  <TableCell>Đánh giá</TableCell>
                  <TableCell>Buổi</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={item.avt} sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>{item.name?.charAt(0)}</Avatar>
                        <Typography variant="body2">{item.name || '-'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="caption">{item.email || '-'}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{(item.subjects || []).slice(0, 2).join(', ')}{item.subjects?.length > 2 ? '...' : ''}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{item.hourlyRate?.toLocaleString()}đ</Typography></TableCell>
                    <TableCell><Rating value={item.rating || 0} size="small" readOnly precision={0.5} /></TableCell>
                    <TableCell><Typography variant="caption">{item.totalSessions || 0}</Typography></TableCell>
                    <TableCell>
                      <Chip label={STATUS_LABELS[item.applicationStatus] || item.applicationStatus} size="small"
                        color={STATUS_COLORS[item.applicationStatus] || 'default'} sx={{ height: 22, fontSize: '0.75rem' }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openDetail(item.uid)} title="Xem chi tiết"><ViewIcon fontSize="small" /></IconButton>
                      {item.applicationStatus === 'pending' && <>
                        <IconButton size="small" onClick={() => setConfirmAction({ id: item.uid, name: item.name || item.email, action: 'approve' })} title="Duyệt" color="success"><ApproveIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setConfirmAction({ id: item.uid, name: item.name || item.email, action: 'reject' })} title="Từ chối" color="error"><RejectIcon fontSize="small" /></IconButton>
                      </>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" /></Box>}
         </>}

        <Dialog open={Boolean(detailDialog)} onClose={() => setDetailDialog(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Chi tiết gia sư</DialogTitle>
          <DialogContent>
            {detailDialog && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={detailDialog.avt} sx={{ width: 48, height: 48 }}>{detailDialog.name?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="h6">{detailDialog.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{detailDialog.email}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2"><strong>Giới thiệu:</strong> {detailDialog.bio || 'Chưa có'}</Typography>
                <Typography variant="body2"><strong>Môn học:</strong> {(detailDialog.subjects || []).join(', ') || 'Chưa có'}</Typography>
                <Typography variant="body2"><strong>Giá/giờ:</strong> {detailDialog.hourlyRate?.toLocaleString()}đ</Typography>
                <Typography variant="body2"><strong>Trình độ:</strong> {detailDialog.level || 'Chưa có'}</Typography>
                <Typography variant="body2"><strong>Đánh giá:</strong> <Rating value={detailDialog.rating || 0} size="small" readOnly precision={0.5} /> ({detailDialog.totalReviews || 0})</Typography>
                <Typography variant="body2"><strong>Đã dạy:</strong> {detailDialog.totalSessions || 0} buổi - {detailDialog.totalStudents || 0} học viên</Typography>
                <Typography variant="body2"><strong>Bằng cấp:</strong> {(detailDialog.qualifications || []).join('; ') || 'Chưa có'}</Typography>
                {detailDialog.videoIntro && <Typography variant="body2"><strong>Video giới thiệu:</strong> <a href={detailDialog.videoIntro} target="_blank" rel="noreferrer">{detailDialog.videoIntro}</a></Typography>}
                <Typography variant="body2"><strong>Trạng thái:</strong> <Chip label={STATUS_LABELS[detailDialog.applicationStatus] || detailDialog.applicationStatus} size="small" color={STATUS_COLORS[detailDialog.applicationStatus] || 'default'} sx={{ height: 22 }} /></Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialog(null)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(confirmAction)} onClose={() => setConfirmAction(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogContent>
            <Typography>
              {confirmAction?.action === 'approve'
                ? `Bạn có chắc chắn muốn duyệt gia sư "${confirmAction?.name}"?`
                : `Bạn có chắc chắn muốn từ chối gia sư "${confirmAction?.name}"?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmAction(null)}>Hủy</Button>
            <Button variant="contained" color={confirmAction?.action === 'approve' ? 'success' : 'error'} onClick={handleConfirm}>
              {confirmAction?.action === 'approve' ? 'Duyệt' : 'Từ chối'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
