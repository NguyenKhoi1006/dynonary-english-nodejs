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
const WORD_TYPES = ['', 'n', 'adj', 'adv', 'v', 'pro', 'con', 'pre', 'det'];

export default function AdminWordsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ word: '', mean: '', type: '', level: '', phonetic: '', specialty: '', topic: '', examples: '', note: '', synonyms: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (levelFilter) params.level = levelFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/apis/admin/words/list', { params });
      setWords(res.data.words);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, levelFilter, typeFilter, search]);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  const openCreate = () => {
    setForm({ word: '', mean: '', type: '', level: '', phonetic: '', specialty: '', topic: '', examples: '', note: '', synonyms: '' });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({
      word: row.word,
      mean: row.mean || '',
      type: row.type || '',
      level: row.level || '',
      phonetic: row.phonetic || '',
      specialty: row.specialty || '',
      topic: (row.topic || []).join(', '),
      examples: (row.examples || []).join('\n'),
      note: row.note || '',
      synonyms: row.synonyms || '',
    });
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        topic: form.topic ? form.topic.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        examples: form.examples ? form.examples.split('\n').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      if (dialog.edit) {
        await api.put(`/apis/admin/words/${dialog.edit.id}`, payload);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/words/', payload);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchWords();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this word?')) return;
    try {
      await api.delete(`/apis/admin/words/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchWords();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'word', headerName: 'Word', width: 140, flex: 1 },
    {
      field: 'mean', headerName: 'Meaning', width: 200,
      renderCell: (p) => <span>{(p.value || '').substring(0, 60)}{(p.value || '').length > 60 ? '...' : ''}</span>,
    },
    {
      field: 'type', headerName: 'Type', width: 70,
      renderCell: (p) => p.value ? <Chip label={p.value} size="small" variant="outlined" /> : null,
    },
    {
      field: 'level', headerName: 'Level', width: 70,
      renderCell: (p) => p.value ? <Chip label={p.value} size="small" color={['C1','C2'].includes(p.value) ? 'warning' : 'primary'} /> : null,
    },
    { field: 'phonetic', headerName: 'Phonetic', width: 130 },
    {
      field: 'topic', headerName: 'Topics', width: 120,
      renderCell: (p) => Array.isArray(p.value) ? p.value.join(', ') : '',
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
        <Typography variant="h4" fontWeight={700}>Quản lý từ vựng</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Word</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Level</InputLabel>
          <Select value={levelFilter} label="Level" onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {LEVELS.filter(Boolean).map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {WORD_TYPES.filter(Boolean).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={words} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Word' : 'New Word'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={2}>
              <TextField label="Word" value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} required fullWidth />
              <TextField label="Phonetic" value={form.phonetic} onChange={(e) => setForm({ ...form, phonetic: e.target.value })} fullWidth />
            </Stack>
            <TextField label="Meaning" value={form.mean} onChange={(e) => setForm({ ...form, mean: e.target.value })} fullWidth />
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {WORD_TYPES.map(t => <MenuItem key={t || 'none'} value={t}>{t || 'None'}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select value={form.level} label="Level" onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map(l => <MenuItem key={l || 'none'} value={l}>{l || 'None'}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
            <TextField label="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} fullWidth size="small" />
            <TextField label="Topic keys (comma separated)" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} fullWidth size="small" helperText="e.g. 0, 1, 3" />
            <TextField label="Examples (one per line)" value={form.examples} onChange={(e) => setForm({ ...form, examples: e.target.value })} fullWidth multiline rows={3} />
            <TextField label="Synonyms" value={form.synonyms} onChange={(e) => setForm({ ...form, synonyms: e.target.value })} fullWidth size="small" />
            <TextField label="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} fullWidth size="small" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.word}>
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
