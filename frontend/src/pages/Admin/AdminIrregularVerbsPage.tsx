import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import UploadIcon from '@mui/icons-material/Upload';
import api from 'services/api';

export default function AdminIrregularVerbsPage() {
  const [verbs, setVerbs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ v1: '', v2: '', v3: '', mean: '' });
  const [saving, setSaving] = useState(false);

  const [importDialog, setImportDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);

  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchVerbs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (search) params.search = search;
      const res = await api.get('/apis/admin/irregular-verbs/list', { params });
      setVerbs(res.data.verbs);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => { fetchVerbs(); }, [fetchVerbs]);

  const openCreate = () => {
    setForm({ v1: '', v2: '', v3: '', mean: '' });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({ v1: row.v1, v2: row.v2, v3: row.v3, mean: row.mean });
    setDialog({ open: true, edit: row });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (dialog.edit) {
        await api.put(`/apis/admin/irregular-verbs/${dialog.edit.id}`, form);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/irregular-verbs/', form);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchVerbs();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Save failed', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this verb?')) return;
    try {
      await api.delete(`/apis/admin/irregular-verbs/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchVerbs();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const handleBulkImport = async () => {
    setImporting(true);
    try {
      let verbsArray;
      try {
        verbsArray = JSON.parse(importText);
      } catch {
        setSnackbar({ message: 'Invalid JSON format', severity: 'error' });
        setImporting(false);
        return;
      }
      if (!Array.isArray(verbsArray) || verbsArray.length === 0) {
        setSnackbar({ message: 'JSON must be a non-empty array', severity: 'error' });
        setImporting(false);
        return;
      }
      const res = await api.post('/apis/admin/irregular-verbs/bulk-import', { verbs: verbsArray });
      setSnackbar({ message: `Imported ${res.data.imported} verbs`, severity: 'success' });
      setImportDialog(false);
      setImportText('');
      fetchVerbs();
    } catch (err: any) {
      setSnackbar({ message: err.response?.data?.detail || err.message || 'Import failed', severity: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'v1', headerName: 'V1 (Base)', width: 140, flex: 1,
      renderCell: (p) => <strong>{p.value}</strong>,
    },
    { field: 'v2', headerName: 'V2 (Past)', width: 160 },
    { field: 'v3', headerName: 'V3 (PP)', width: 180 },
    { field: 'mean', headerName: 'Meaning', width: 200, flex: 1 },
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
        <Typography variant="h4" fontWeight={700}>Quản lý động từ bất quy tắc</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setImportDialog(true)}>Import JSON</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Verb</Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={verbs} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[20, 50, 100, 200]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick
          slotProps={{ toolbar: { showQuickFilter: false } }} />
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Verb' : 'New Verb'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="V1 (Base form)" value={form.v1} onChange={(e) => setForm({ ...form, v1: e.target.value })} required fullWidth />
            <TextField label="V2 (Past form)" value={form.v2} onChange={(e) => setForm({ ...form, v2: e.target.value })} required fullWidth />
            <TextField label="V3 (Past participle)" value={form.v3} onChange={(e) => setForm({ ...form, v3: e.target.value })} required fullWidth />
            <TextField label="Meaning (Vietnamese)" value={form.mean} onChange={(e) => setForm({ ...form, mean: e.target.value })} required fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, edit: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.v1 || !form.mean}>
            {saving ? 'Saving...' : dialog.edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Irregular Verbs (JSON)</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {`Paste JSON array of verbs. Format: [{"v1":"abide","v2":"abode","v3":"abode","mean":"lưu trú"}, ...]`}
          </Typography>
          <TextField
            label="JSON array" value={importText} onChange={(e) => setImportText(e.target.value)}
            fullWidth multiline rows={15} placeholder='[{"v1":"abide","v2":"abode","v3":"abode","mean":"lưu trú"}]'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBulkImport} disabled={importing || !importText}>
            {importing ? 'Importing...' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {snackbar ? <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
