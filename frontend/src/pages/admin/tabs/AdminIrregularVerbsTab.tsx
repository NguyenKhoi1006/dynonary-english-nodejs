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

const emptyForm = { baseForm: '', pastSimple: '', pastParticiple: '', meaning: '' };

export default function AdminIrregularVerbsTab() {
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
    adminApi.listIrregularVerbs({ page, pageSize, search })
      .then(d => { setItems(d.verbs || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);
  const openCreate = () => { setDialog('create'); setForm(emptyForm); };
  const openEdit = (item: any) => { setDialog(item); setForm({ baseForm: item.baseForm || '', pastSimple: item.pastSimple || '', pastParticiple: item.pastParticiple || '', meaning: item.meaning || '' }); };
  const handleSave = async () => {
    setSaving(true);
    try { if (dialog === 'create') await adminApi.createIrregularVerb(form); else await adminApi.updateIrregularVerb(dialog.uid || dialog.id, form); setDialog(null); fetch(); } catch { /* ignore */ } finally { setSaving(false); }
  };
  const handleDelete = async () => { if (!deleteId) return; try { await adminApi.deleteIrregularVerb(deleteId); setDeleteId(null); fetch(); } catch { /* ignore */ } };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Động từ bất quy tắc</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>Thêm động từ</Button>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField size="small" placeholder="Tìm kiếm..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 250 }} />
        </CardContent>
      </Card>
      {error ? <ErrorState title="Lỗi" message={error} onRetry={fetch} /> :
       loading ? <LoadingSkeleton type="list" count={8} /> :
       items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy động từ</Typography> :
       <>
        <TableContainer component={Card}>
          <Table size="small">
            <TableHead><TableRow><TableCell>Bare form</TableCell><TableCell>Past Simple</TableCell><TableCell>Past Participle</TableCell><TableCell>Nghĩa</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead>
            <TableBody>{items.map((item: any) => (
              <TableRow key={item.uid || item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontWeight: 600 }}>{item.baseForm}</TableCell>
                <TableCell><Typography variant="body2">{item.pastSimple}</Typography></TableCell>
                <TableCell><Typography variant="body2">{item.pastParticiple}</Typography></TableCell>
                <TableCell><Typography variant="caption">{item.meaning}</Typography></TableCell>
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
        <DialogTitle>{dialog === 'create' ? 'Thêm động từ mới' : 'Chỉnh sửa động từ'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth size="small" label="Nguyên thể" value={form.baseForm} onChange={e => setForm(p => ({ ...p, baseForm: e.target.value }))} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Quá khứ" value={form.pastSimple} onChange={e => setForm(p => ({ ...p, pastSimple: e.target.value }))} />
              <TextField fullWidth size="small" label="Phân từ 2" value={form.pastParticiple} onChange={e => setForm(p => ({ ...p, pastParticiple: e.target.value }))} />
            </Box>
            <TextField fullWidth size="small" label="Nghĩa" value={form.meaning} onChange={e => setForm(p => ({ ...p, meaning: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" onClick={handleSave} disabled={saving}>Lưu</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa</DialogTitle><DialogContent><Typography>Bạn có chắc chắn muốn xóa động từ này?</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteId(null)}>Hủy</Button><Button variant="contained" color="error" onClick={handleDelete}>Xóa</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
