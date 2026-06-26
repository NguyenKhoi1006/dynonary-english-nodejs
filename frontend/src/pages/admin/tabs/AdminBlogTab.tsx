import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, IconButton, Pagination, InputAdornment,
  TableContainer, Switch, FormControlLabel,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { adminApi } from '../../../services/lmsApi';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import ErrorState from '../../../components/ErrorState';

const emptyForm = { title: '', content: '', excerpt: '', type: 'blog', published: true, tags: '' };

export default function AdminBlogTab() {
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
    adminApi.listBlogPosts({ page, pageSize, search })
      .then(d => { setItems(d.posts || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);
  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => {
    setDialog(item);
    setForm({
      title: item.title || '', content: item.content || '', excerpt: item.excerpt || '',
      type: item.type || 'blog', published: item.published ?? true,
      tags: (item.tags || []).join(', '),
    });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] };
      if (dialog === 'create') await adminApi.createBlogPost(payload);
      else await adminApi.updateBlogPost(dialog.uid || dialog.id, payload);
      setDialog(null); fetch();
    } catch { /* ignore */ } finally { setSaving(false); }
  };
  const handleDelete = async () => { if (!deleteId) return; try { await adminApi.deleteBlogPost(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ } };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Bài viết Blog</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Thêm bài viết</Button>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField size="small" placeholder="Tìm kiếm..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 250 }} />
        </CardContent>
      </Card>
      {error ? <ErrorState title="Lỗi" message={error} onRetry={fetch} /> :
       loading ? <LoadingSkeleton type="list" count={8} /> :
       items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy bài viết</Typography> :
       <>
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead><TableRow><TableCell>Tiêu đề</TableCell><TableCell>Loại</TableCell><TableCell>Xuất bản</TableCell><TableCell>Tags</TableCell><TableCell>Ngày tạo</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead>
            <TableBody>{items.map((item: any) => (
              <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{item.title}</TableCell>
                <TableCell><Typography variant="caption">{item.type}</Typography></TableCell>
                <TableCell><Chip label={item.published ? 'Có' : 'Không'} size="small" color={item.published ? 'success' : 'default'} variant={item.published ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                <TableCell><Typography variant="caption">{(item.tags || []).slice(0, 2).join(', ')}{item.tags?.length > 2 ? '...' : ''}</Typography></TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : '-'}</Typography></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(item)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => setDeleteId(item.uid || item.id)}><DeleteIcon fontSize="small" color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" /></Box>}
       </>}
      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>{dialog === 'create' ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth size="small" label="Tiêu đề" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Loại" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
              <TextField fullWidth size="small" label="Tags (phân cách bằng dấu phẩy)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            </Box>
            <FormControlLabel control={<Switch checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />} label="Xuất bản" />
            <TextField fullWidth size="small" label="Mô tả ngắn" multiline rows={2} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
            <TextField fullWidth size="small" label="Nội dung" multiline rows={6} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle><DialogContent><Typography>Bạn có chắc chắn muốn xóa bài viết này?</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteId(null)}>Hủy</Button><Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
