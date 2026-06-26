import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Pagination, InputAdornment, TableContainer, Switch, FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const emptyForm = { title: '', description: '', testId: '', questions: '', levelDistribution: '', timeMinutes: 30, published: true };

export default function AdminPlacementTestsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    adminApi.listPlacementTests(params)
      .then(d => { setItems(d.tests || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => {
    setDialog(item);
    setForm({
      title: item.title || '', description: item.description || '', testId: item.testId || '',
      questions: item.questions ? JSON.stringify(item.questions, null, 2) : '',
      levelDistribution: item.levelDistribution ? JSON.stringify(item.levelDistribution, null, 2) : '',
      timeMinutes: item.timeMinutes || 30, published: item.published ?? true,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let questions: any[] = [];
      let levelDistribution: Record<string, number> = {};
      try { questions = JSON.parse(form.questions); } catch { questions = []; }
      try { levelDistribution = JSON.parse(form.levelDistribution); } catch { levelDistribution = {}; }
      const payload = { ...form, questions, levelDistribution };
      if (dialog === 'create') await adminApi.createPlacementTest(payload);
      else await adminApi.updatePlacementTest(dialog.uid || dialog.id, payload);
      setDialog(null); fetch();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await adminApi.deletePlacementTest(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ }
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Kiểm tra đầu vào' }]} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Quản lý kiểm tra đầu vào</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Tạo mới</Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Tìm kiếm..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 200 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" color="text.secondary">{total} bài kiểm tra</Typography></Box>
            </Box>
          </CardContent>
        </Card>

        {error ? <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetch} /> :
         loading ? <LoadingSkeleton type="list" count={8} /> :
         items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy bài kiểm tra</Typography> :
         <>
          <TableContainer component={Card}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Xuất bản</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell>
                    <TableCell>{item.timeMinutes || 0} phút</TableCell>
                    <TableCell><Chip label={item.published ? 'Có' : 'Không'} size="small" color={item.published ? 'success' : 'default'} variant={item.published ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : '-'}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEdit(item)} title="Chỉnh sửa"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => setDeleteId(item.uid || item.id)} title="Xóa"><DeleteIcon fontSize="small" color="error" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" /></Box>}
         </>}

        <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} maxWidth="md" fullWidth>
          <DialogTitle>{dialog === 'create' ? 'Tạo kiểm tra đầu vào mới' : 'Chỉnh sửa kiểm tra đầu vào'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField fullWidth size="small" label="Tiêu đề" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <TextField fullWidth size="small" label="Mã bài kiểm tra" value={form.testId} onChange={e => setForm(p => ({ ...p, testId: e.target.value }))} />
              <TextField fullWidth size="small" label="Mô tả" multiline rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <TextField fullWidth size="small" label="Thời gian (phút)" type="number" value={form.timeMinutes} onChange={e => setForm(p => ({ ...p, timeMinutes: Number(e.target.value) }))} />
              <FormControlLabel control={<Switch checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />} label="Xuất bản" />
              <TextField fullWidth size="small" label="Câu hỏi (JSON)" multiline rows={6} value={form.questions}
                onChange={e => setForm(p => ({ ...p, questions: e.target.value }))} helperText="Nhập câu hỏi dưới dạng JSON" />
              <TextField fullWidth size="small" label="Phân bố trình độ (JSON)" multiline rows={3} value={form.levelDistribution}
                onChange={e => setForm(p => ({ ...p, levelDistribution: e.target.value }))} helperText='VD: {"A1": 5, "A2": 8, "B1": 7}' />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(null)}>Hủy</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent><Typography>Bạn có chắc chắn muốn xóa bài kiểm tra này?</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
