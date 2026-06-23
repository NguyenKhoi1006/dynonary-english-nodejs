import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

export default function AdminSentencesPage() {
  const [sentences, setSentences] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [topicFilter, setTopicFilter] = useState('');
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ sentence: '', meaning: '', topic: '', note: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchSentences = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (topicFilter) params.topic = topicFilter;
      if (search) params.search = search;
      const res = await api.get('/apis/admin/sentences/list', { params });
      setSentences(res.data.sentences);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, topicFilter, search]);

  useEffect(() => { fetchSentences(); }, [fetchSentences]);

  const openCreate = () => {
    setForm({ sentence: '', meaning: '', topic: '', note: '' });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({
      sentence: row.sentence,
      meaning: row.meaning || '',
      topic: row.topic || '',
      note: row.note || '',
    });
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (dialog.edit) {
        await api.put(`/apis/admin/sentences/${dialog.edit.id}`, form);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/sentences/', form);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchSentences();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this sentence?')) return;
    try {
      await api.delete(`/apis/admin/sentences/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchSentences();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'sentence', headerName: 'Sentence', width: 300, flex: 1,
      renderCell: (p) => <span>{(p.value || '').substring(0, 100)}{(p.value || '').length > 100 ? '...' : ''}</span>,
    },
    {
      field: 'meaning', headerName: 'Meaning', width: 250,
      renderCell: (p) => <span>{(p.value || '').substring(0, 80)}{(p.value || '').length > 80 ? '...' : ''}</span>,
    },
    { field: 'topic', headerName: 'Topic', width: 80,
      renderCell: (p) => p.value ? <Chip label={p.value} size="small" variant="outlined" /> : null,
    },
    {
      field: 'note', headerName: 'Note', width: 150,
      renderCell: (p) => <span>{(p.value || '').substring(0, 50)}{(p.value || '').length > 50 ? '...' : ''}</span>,
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
        <Typography variant="h4" fontWeight={700}>Quản lý câu giao tiếp</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Sentence</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
        <TextField size="small" label="Topic filter" value={topicFilter} onChange={(e) => { setTopicFilter(e.target.value); setPage(0); }} sx={{ minWidth: 120 }} helperText="Topic key" />
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={sentences} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Sentence' : 'New Sentence'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Sentence" value={form.sentence} onChange={(e) => setForm({ ...form, sentence: e.target.value })} required fullWidth multiline rows={2} />
            <TextField label="Meaning" value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} fullWidth multiline rows={2} />
            <TextField label="Topic key" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} fullWidth size="small" helperText="e.g. 0, 1, 5" />
            <TextField label="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} fullWidth multiline rows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.sentence}>
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
