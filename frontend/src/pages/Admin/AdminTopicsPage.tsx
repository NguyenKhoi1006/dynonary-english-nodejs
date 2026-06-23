import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import api from 'services/api';

const TOPIC_TYPES = ['vocab', 'sentence'];

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ key: '', title: '', type: 'vocab', icon: '', order: 0 });
  const [iconPreview, setIconPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/apis/admin/topics/list', { params });
      setTopics(res.data.topics);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, typeFilter, search]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setForm({ ...form, icon: dataUrl });
      setIconPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setForm({ key: '', title: '', type: 'vocab', icon: '', order: 0 });
    setIconPreview('');
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({
      key: row.key,
      title: row.title,
      type: row.type || 'vocab',
      icon: row.icon || '',
      order: row.order || 0,
    });
    setIconPreview(row.icon || '');
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order),
      };
      if (dialog.edit) {
        await api.put(`/apis/admin/topics/${dialog.edit.id}`, payload);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/topics/', payload);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchTopics();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await api.delete(`/apis/admin/topics/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchTopics();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'key', headerName: 'Key', width: 70 },
    {
      field: 'icon', headerName: 'Icon', width: 60, sortable: false,
      renderCell: (p) => p.value ? <Avatar src={p.value} sx={{ width: 32, height: 32 }} /> : <Avatar sx={{ width: 32, height: 32 }}><ImageIcon /></Avatar>,
    },
    { field: 'title', headerName: 'Title', width: 200, flex: 1 },
    {
      field: 'type', headerName: 'Type', width: 100,
      renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'vocab' ? 'primary' : 'secondary'} />,
    },
    { field: 'order', headerName: 'Order', width: 70, type: 'number' },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" color="primary" onClick={() => openEdit(p.row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Quản lý chủ đề</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Topic</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {TOPIC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={topics} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50, 100]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Topic' : 'New Topic'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={2}>
              <TextField label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required size="small" sx={{ width: 100 }} />
              <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} size="small" sx={{ width: 80 }} />
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TOPIC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />

            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                Upload Icon
                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleIconSelect} />
              </Button>
              {iconPreview && <Avatar src={iconPreview} sx={{ width: 48, height: 48 }} />}
            </Stack>
            {form.icon && (
              <TextField label="Icon Data URL" value={form.icon} onChange={(e) => { setForm({ ...form, icon: e.target.value }); setIconPreview(e.target.value); }} fullWidth size="small" multiline rows={2} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.title || !form.key}>
            {saving ? 'Saving...' : dialog.edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {snackbar ? <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
