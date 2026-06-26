import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, IconButton, Pagination, InputAdornment,
  TableContainer, Switch, FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_COLORS: Record<string, string> = { A1: 'success', A2: 'success', B1: 'primary', B2: 'primary', C1: 'warning', C2: 'error' };

const emptyForm = { title: '', level: '', testId: '', questions: '', passScore: 60, timeMinutes: 30, published: true };

export default function AdminTestsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [dialog, setDialog] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (levelFilter) params.level = levelFilter;
    adminApi.listTests(params)
      .then(d => { setItems(d.tests || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search, levelFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => {
    setDialog(item);
    setForm({
      title: item.title || '', level: item.level || '', testId: item.testId || '',
      questions: item.questions ? JSON.stringify(item.questions, null, 2) : '',
      passScore: item.passScore || 60, timeMinutes: item.timeMinutes || 30, published: item.published ?? true,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let questions: any[] = [];
      try { questions = JSON.parse(form.questions); } catch { questions = []; }
      const payload = { ...form, questions };
      if (dialog === 'create') await adminApi.createTest(payload);
      else await adminApi.updateTest(dialog.uid || dialog.id, payload);
      setDialog(null); fetch();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await adminApi.deleteTest(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ }
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Bài kiểm tra' }]} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Quản lý bài kiểm tra</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Tạo mới</Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Tìm kiếm..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 200 }} />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Trình độ</InputLabel>
                <Select value={levelFilter} label="Trình độ" onChange={e => { setLevelFilter(e.target.value); setPage(1); }}>
                  <MenuItem value="">Tất cả</MenuItem>
                  {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
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
                  <TableCell>Trình độ</TableCell>
                  <TableCell>Điểm đạt</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Xuất bản</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell>
                    <TableCell><Chip label={item.level} size="small" color={(LEVEL_COLORS[item.level] as any) || 'default'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell>{item.passScore || 0}%</TableCell>
                    <TableCell>{item.timeMinutes || 0} phút</TableCell>
                    <TableCell><Chip label={item.published ? 'Có' : 'Không'} size="small" color={item.published ? 'success' : 'default'} variant={item.published ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
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
          <DialogTitle>{dialog === 'create' ? 'Tạo bài kiểm tra mới' : 'Chỉnh sửa bài kiểm tra'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField fullWidth size="small" label="Tiêu đề" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <TextField fullWidth size="small" label="Mã bài kiểm tra" value={form.testId} onChange={e => setForm(p => ({ ...p, testId: e.target.value }))} />
              <FormControl fullWidth size="small">
                <InputLabel>Trình độ</InputLabel>
                <Select value={form.level} label="Trình độ" onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                  {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Điểm đạt (%)" type="number" value={form.passScore} onChange={e => setForm(p => ({ ...p, passScore: Number(e.target.value) }))} />
                <TextField fullWidth size="small" label="Thời gian (phút)" type="number" value={form.timeMinutes} onChange={e => setForm(p => ({ ...p, timeMinutes: Number(e.target.value) }))} />
              </Box>
              <FormControlLabel control={<Switch checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />} label="Xuất bản" />
              <TextField fullWidth size="small" label="Câu hỏi (JSON)" multiline rows={6} value={form.questions}
                onChange={e => setForm(p => ({ ...p, questions: e.target.value }))}
                helperText="Nhập câu hỏi dưới dạng JSON" />
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
