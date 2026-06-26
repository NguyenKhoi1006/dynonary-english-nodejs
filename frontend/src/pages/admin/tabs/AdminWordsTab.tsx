import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, IconButton, Pagination, InputAdornment, TableContainer,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { adminApi } from '../../../services/lmsApi';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import ErrorState from '../../../components/ErrorState';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const emptyForm = { word: '', meaning: '', level: '', type: '', topic: '', phonetic: '', example: '' };

export default function AdminWordsTab() {
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
    adminApi.listWords({ page, pageSize, search })
      .then(d => { setItems(d.words || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);
  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => { setDialog(item); setForm({ word: item.word || '', meaning: item.meaning || '', level: item.level || '', type: item.type || '', topic: item.topic || '', phonetic: item.phonetic || '', example: item.example || '' }); };
  const handleSave = async () => {
    setSaving(true);
    try { if (dialog === 'create') await adminApi.createWord(form); else await adminApi.updateWord(dialog.uid || dialog.id, form); setDialog(null); fetch(); } catch { /* ignore */ } finally { setSaving(false); }
  };
  const handleDelete = async () => { if (!deleteId) return; try { await adminApi.deleteWord(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ } };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Từ vựng</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Thêm từ</Button>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField size="small" placeholder="Tìm kiếm từ..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 250 }} />
        </CardContent>
      </Card>
      {error ? <ErrorState title="Lỗi" message={error} onRetry={fetch} /> :
       loading ? <LoadingSkeleton type="list" count={8} /> :
       items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy từ vựng</Typography> :
       <>
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead><TableRow><TableCell>Từ</TableCell><TableCell>Nghĩa</TableCell><TableCell>Trình độ</TableCell><TableCell>Loại</TableCell><TableCell>Chủ đề</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead>
            <TableBody>{items.map((item: any) => (
              <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontWeight: 600 }}>{item.word}</TableCell>
                <TableCell><Typography variant="body2">{item.meaning}</Typography></TableCell>
                <TableCell><Chip label={item.level} size="small" color={(item.level === 'A1' || item.level === 'A2' ? 'success' : item.level === 'B1' || item.level === 'B2' ? 'primary' : 'warning') as any} sx={{ height: 22, fontSize: '0.75rem' }} /></TableCell>
                <TableCell><Typography variant="caption">{item.type}</Typography></TableCell>
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
        <DialogTitle>{dialog === 'create' ? 'Thêm từ mới' : 'Chỉnh sửa từ'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth size="small" label="Từ" value={form.word} onChange={e => setForm(p => ({ ...p, word: e.target.value }))} />
            <TextField fullWidth size="small" label="Nghĩa" value={form.meaning} onChange={e => setForm(p => ({ ...p, meaning: e.target.value }))} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small"><InputLabel>Trình độ</InputLabel><Select value={form.level} label="Trình độ" onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>{LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}</Select></FormControl>
              <TextField fullWidth size="small" label="Loại từ" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Chủ đề" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
              <TextField fullWidth size="small" label="Phiên âm" value={form.phonetic} onChange={e => setForm(p => ({ ...p, phonetic: e.target.value }))} />
            </Box>
            <TextField fullWidth size="small" label="Ví dụ" multiline rows={2} value={form.example} onChange={e => setForm(p => ({ ...p, example: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle><DialogContent><Typography>Bạn có chắc chắn muốn xóa từ này?</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteId(null)}>Hủy</Button><Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
