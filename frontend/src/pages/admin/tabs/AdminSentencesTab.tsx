import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Pagination, InputAdornment, TableContainer,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { adminApi } from '../../../services/lmsApi';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import ErrorState from '../../../components/ErrorState';

const emptyForm = { english: '', vietnamese: '', topic: '' };

export default function AdminSentencesTab() {
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
    adminApi.listSentences({ page, pageSize, search })
      .then(d => { setItems(d.sentences || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);
  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => { setDialog(item); setForm({ english: item.english || '', vietnamese: item.vietnamese || '', topic: item.topic || '' }); };
  const handleSave = async () => {
    setSaving(true);
    try { if (dialog === 'create') await adminApi.createSentence(form); else await adminApi.updateSentence(dialog.uid || dialog.id, form); setDialog(null); fetch(); } catch { /* ignore */ } finally { setSaving(false); }
  };
  const handleDelete = async () => { if (!deleteId) return; try { await adminApi.deleteSentence(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ } };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Câu mẫu</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Thêm câu</Button>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField size="small" placeholder="Tìm kiếm..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 250 }} />
        </CardContent>
      </Card>
      {error ? <ErrorState title="Lỗi" message={error} onRetry={fetch} /> :
       loading ? <LoadingSkeleton type="list" count={8} /> :
       items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy câu mẫu</Typography> :
       <>
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead><TableRow><TableCell>Tiếng Anh</TableCell><TableCell>Tiếng Việt</TableCell><TableCell>Chủ đề</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead>
            <TableBody>{items.map((item: any) => (
              <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontWeight: 500 }}>{item.english}</TableCell>
                <TableCell><Typography variant="body2">{item.vietnamese}</Typography></TableCell>
                <TableCell><Typography variant="caption">{item.topic}</Typography></TableCell>
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
      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog === 'create' ? 'Thêm câu mới' : 'Chỉnh sửa câu'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth size="small" label="Tiếng Anh" value={form.english} onChange={e => setForm(p => ({ ...p, english: e.target.value }))} />
            <TextField fullWidth size="small" label="Tiếng Việt" value={form.vietnamese} onChange={e => setForm(p => ({ ...p, vietnamese: e.target.value }))} />
            <TextField fullWidth size="small" label="Chủ đề" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle><DialogContent><Typography>Bạn có chắc chắn muốn xóa câu này?</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteId(null)}>Hủy</Button><Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
