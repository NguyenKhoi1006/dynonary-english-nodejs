import React, { useEffect, useState, useCallback } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from 'services/api';

const LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TYPES = ['grammar', 'blog'];

interface BlogPost {
  id: string;
  title: string;
  content: string;
  description: string;
  type: string;
  tags: string[];
  level: string;
  image: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ title: '', description: '', content: '', type: 'grammar', tags: '', level: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/apis/admin/blog/list', { params });
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, typeFilter, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setForm({ title: '', description: '', content: '', type: 'grammar', tags: '', level: '' });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({
      title: row.title,
      description: row.description || '',
      content: row.content || '',
      type: row.type || 'grammar',
      tags: (row.tags || []).join(', '),
      level: row.level || '',
    });
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      if (dialog.edit) {
        await api.put(`/apis/admin/blog/${dialog.edit.id}`, payload);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/blog/', payload);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchPosts();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/apis/admin/blog/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchPosts();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 250, flex: 1 },
    { field: 'description', headerName: 'Description', width: 250,
      renderCell: (p) => <span>{(p.value || '').substring(0, 80)}{(p.value || '').length > 80 ? '...' : ''}</span>,
    },
    { field: 'type', headerName: 'Type', width: 100,
      renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'grammar' ? 'info' : 'default'} />,
    },
    { field: 'level', headerName: 'Level', width: 80,
      renderCell: (p) => p.value ? <Chip label={p.value} size="small" color="primary" variant="outlined" /> : null,
    },
    {
      field: 'createdAt', headerName: 'Created', width: 120,
      renderCell: (p) => p.value ? new Date(p.value).toLocaleDateString('vi-VN') : '',
    },
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
        <Typography variant="h4" fontWeight={700}>Quản lý Blog / Grammar</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Post</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={posts} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select value={form.level} label="Level" onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map(l => <MenuItem key={l || 'none'} value={l}>{l || 'None'}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
            <TextField label="Content (HTML)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} fullWidth multiline rows={10} />
            <TextField label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} fullWidth size="small" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.title}>
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
