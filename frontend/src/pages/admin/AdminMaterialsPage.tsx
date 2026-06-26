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
const TYPES = ['vocabulary', 'grammar', 'reading', 'listening', 'writing', 'speaking'];
const LEVEL_COLORS: Record<string, 'success' | 'primary' | 'warning' | 'error'> = { A1: 'success', A2: 'success', B1: 'primary', B2: 'primary', C1: 'warning', C2: 'error' };

const emptyForm = { title: '', description: '', level: '', type: '', order: 0, estimatedMinutes: 30, published: true, isPremium: false, tags: '', previewContent: '', content: '' };

export default function AdminMaterialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dialog, setDialog] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (levelFilter) params.level = levelFilter;
    if (typeFilter) params.type = typeFilter;
    adminApi.listMaterials(params)
      .then(d => { setItems(d.materials || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search, levelFilter, typeFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => {
    setDialog('edit');
    setForm({
      title: item.title || '', description: item.description || '', level: item.level || '',
      type: item.type || '', order: item.order || 0, estimatedMinutes: item.estimatedMinutes || 30,
      published: item.published ?? true, isPremium: item.isPremium ?? false,
      tags: (item.tags || []).join(', '), previewContent: item.previewContent || '', content: item.content || '',
    });
    setDialog(item);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] };
      if (dialog === 'create') await adminApi.createMaterial(payload);
      else await adminApi.updateMaterial(dialog.uid || dialog.id, payload);
      setDialog(null); fetch();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await adminApi.deleteMaterial(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ }
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Bài học' }]} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Quản lý bài học</Typography>
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
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Loại</InputLabel>
                <Select value={typeFilter} label="Loại" onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
                  <MenuItem value="">Tất cả</MenuItem>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" color="text.secondary">{total} bài học</Typography></Box>
            </Box>
          </CardContent>
        </Card>

        {error ? <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetch} /> :
         loading ? <LoadingSkeleton type="list" count={8} /> :
         items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy bài học</Typography> :
         <>
          <TableContainer component={Card}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Trình độ</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Xuất bản</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Thứ tự</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell>
                    <TableCell><Chip label={item.level} size="small" color={LEVEL_COLORS[item.level] || 'default'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell><Typography variant="body2">{item.type}</Typography></TableCell>
                    <TableCell><Chip label={item.published ? 'Có' : 'Không'} size="small" color={item.published ? 'success' : 'default'} variant={item.published ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell><Chip label={item.isPremium ? 'Premium' : 'Free'} size="small" color={item.isPremium ? 'warning' : 'default'} variant={item.isPremium ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell>{item.order || 0}</TableCell>
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
          <DialogTitle>{dialog === 'create' ? 'Tạo bài học mới' : 'Chỉnh sửa bài học'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField fullWidth size="small" label="Tiêu đề" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <TextField fullWidth size="small" label="Mô tả" multiline rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trình độ</InputLabel>
                  <Select value={form.level} label="Trình độ" onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                    {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select value={form.type} label="Loại" onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Thứ tự" type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
                <TextField fullWidth size="small" label="Thời gian (phút)" type="number" value={form.estimatedMinutes} onChange={e => setForm(p => ({ ...p, estimatedMinutes: Number(e.target.value) }))} />
              </Box>
              <TextField fullWidth size="small" label="Tags (phân cách bằng dấu phẩy)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel control={<Switch checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />} label="Xuất bản" />
                <FormControlLabel control={<Switch checked={form.isPremium} onChange={e => setForm(p => ({ ...p, isPremium: e.target.checked }))} />} label="Premium" />
              </Box>
              <TextField fullWidth size="small" label="Nội dung xem trước" multiline rows={2} value={form.previewContent} onChange={e => setForm(p => ({ ...p, previewContent: e.target.value }))} />
              <TextField fullWidth size="small" label="Nội dung" multiline rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(null)}>Hủy</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent><Typography>Bạn có chắc chắn muốn xóa bài học này?</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
