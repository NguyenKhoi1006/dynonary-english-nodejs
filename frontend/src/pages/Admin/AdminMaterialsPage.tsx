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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from 'services/api';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TYPES = ['lesson', 'document', 'video', 'exercise', 'audio'];

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  // Form dialog
  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ title: '', description: '', level: 'A1', type: 'lesson', content: '', previewContent: '', isPremium: false, tags: '', order: 0, estimatedMinutes: 10, published: false });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (levelFilter) params.level = levelFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/apis/admin/materials/list', { params });
      setMaterials(res.data.materials);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, levelFilter, typeFilter, search]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const openCreate = () => {
    setForm({ title: '', description: '', level: 'A1', type: 'lesson', content: '', previewContent: '', isPremium: false, tags: '', order: 0, estimatedMinutes: 10, published: false });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({ title: row.title, description: row.description || '', level: row.level, type: row.type, content: row.content || '', previewContent: row.previewContent || '', isPremium: row.isPremium || false, tags: (row.tags || []).join(', '), order: row.order || 0, estimatedMinutes: row.estimatedMinutes || 10, published: row.published || false });
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        isPremium: Boolean(form.isPremium),
        published: Boolean(form.published),
      };
      if (dialog.edit) {
        await api.put(`/apis/admin/materials/${dialog.edit.id}`, payload);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/materials/', payload);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchMaterials();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await api.delete(`/apis/admin/materials/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchMaterials();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'order', headerName: '#', width: 50, type: 'number' },
    { field: 'title', headerName: 'Title', width: 250, flex: 1 },
    {
      field: 'level', headerName: 'Level', width: 80,
      renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'C1' || p.value === 'C2' ? 'warning' : 'primary'} />,
    },
    { field: 'type', headerName: 'Type', width: 100 },
    {
      field: 'isPremium', headerName: 'Premium', width: 90,
      renderCell: (p) => <Chip label={p.value ? 'Premium' : 'Free'} size="small" color={p.value ? 'warning' : 'default'} variant={p.value ? 'filled' : 'outlined'} />,
    },
    {
      field: 'published', headerName: 'Status', width: 100,
      renderCell: (p) => <Chip label={p.value ? 'Published' : 'Draft'} size="small" color={p.value ? 'success' : 'default'} />,
    },
    { field: 'estimatedMinutes', headerName: 'Min', width: 60, type: 'number' },
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
        <Typography variant="h4" fontWeight={700}>Quản lý tài liệu</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Material</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Level</InputLabel>
          <Select value={levelFilter} label="Level" onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={materials} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Material' : 'New Material'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select value={form.level} label="Level" onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Minutes" type="number" value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} size="small" sx={{ width: 100 }} />
              <TextField label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} size="small" sx={{ width: 80 }} />
            </Stack>
            <TextField label="Content (HTML)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} fullWidth multiline rows={8} />
            <TextField label="Preview Content" value={form.previewContent} onChange={(e) => setForm({ ...form, previewContent: e.target.value })} fullWidth multiline rows={3} helperText="Shown to free users if this is premium content" />
            <TextField label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} fullWidth size="small" />
            <Stack direction="row" spacing={3}>
              <FormControlLabel control={<Switch checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} />} label="Premium" />
              <FormControlLabel control={<Switch checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />} label="Published" />
            </Stack>
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
