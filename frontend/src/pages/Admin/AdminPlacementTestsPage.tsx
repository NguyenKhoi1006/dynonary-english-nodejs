import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import api from 'services/api';

const QUESTION_TYPES = ['grammar', 'vocabulary', 'reading', 'listening'];
const TEST_TYPES = ['initial', 'placement'];

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  type: string;
}

export default function AdminPlacementTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');

  const [dialog, setDialog] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [form, setForm] = useState<any>({ title: '', description: '', type: 'initial', timeLimit: 30, passScore: 70, questions: [] });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (search) params.search = search;
      const res = await api.get('/apis/admin/placement-tests/list', { params });
      setTests(res.data.tests);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const openCreate = () => {
    setForm({ title: '', description: '', type: 'initial', timeLimit: 30, passScore: 70, questions: [] });
    setDialog({ open: true, edit: null });
  };

  const openEdit = (row: any) => {
    setForm({ title: row.title, description: row.description || '', type: row.type, timeLimit: row.timeLimit || 30, passScore: row.passScore || 70, questions: row.questions || [] });
    setDialog({ open: true, edit: row });
  };

  const addQuestion = () => {
    const newQ: Question = { id: Math.random().toString(36).slice(2, 10), questionText: '', options: ['', '', '', ''], correctAnswer: 0, type: 'grammar' };
    setForm({ ...form, questions: [...form.questions, newQ] });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const qs = [...form.questions];
    qs[index] = { ...qs[index], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const qs = [...form.questions];
    qs[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: qs });
  };

  const removeQuestion = (index: number) => {
    setForm({ ...form, questions: form.questions.filter((_: any, i: number) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (dialog.edit) {
        await api.put(`/apis/admin/placement-tests/${dialog.edit.id}`, payload);
        setSnackbar({ message: 'Updated successfully', severity: 'success' });
      } else {
        await api.post('/apis/admin/placement-tests/', payload);
        setSnackbar({ message: 'Created successfully', severity: 'success' });
      }
      setDialog({ open: false, edit: null });
      fetchTests();
    } catch (err: any) {
      const msg = err?.response?.data?.detail
        ? (Array.isArray(err.response.data.detail)
            ? err.response.data.detail.map((e: any) => `${e.loc?.join('.') || ''}: ${e.msg}`).join('; ')
            : err.response.data.detail)
        : err.message || 'Save failed';
      console.error('Save placement test error:', msg, err?.response?.data);
      setSnackbar({ message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this placement test?')) return;
    try {
      await api.delete(`/apis/admin/placement-tests/${id}`);
      setSnackbar({ message: 'Deleted successfully', severity: 'success' });
      fetchTests();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 250, flex: 1 },
    { field: 'type', headerName: 'Type', width: 110, renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'initial' ? 'warning' : 'info'} /> },
    { field: 'timeLimit', headerName: 'Time (min)', width: 90, type: 'number' },
    { field: 'passScore', headerName: 'Pass %', width: 80, type: 'number' },
    { field: 'questions', headerName: 'Questions', width: 90, type: 'number', valueGetter: (val) => (Array.isArray(val) ? val.length : 0) },
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
        <Typography variant="h4" fontWeight={700}>Quản lý bài kiểm tra đầu vào</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Placement Test</Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ minWidth: 200 }} />
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={tests} getRowId={(r) => r.id} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[10, 20, 50]} paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
          paginationMode="server" slots={{ toolbar: GridToolbar }} disableRowSelectionOnClick />
      </Box>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, edit: null })} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.edit ? 'Edit Placement Test' : 'New Placement Test'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Test Type</InputLabel>
                <Select value={form.type} label="Test Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TEST_TYPES.map(t => <MenuItem key={t} value={t}>{t === 'initial' ? 'Initial (first-time)' : 'Placement (re-evaluate)'}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Time Limit (min)" type="number" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })} size="small" sx={{ width: 130 }} />
              <TextField label="Pass Score (%)" type="number" value={form.passScore} onChange={(e) => setForm({ ...form, passScore: Number(e.target.value) })} size="small" sx={{ width: 120 }} />
            </Stack>

            {/* Questions Builder */}
            <Typography variant="subtitle1" fontWeight={600} mt={2}>Questions ({form.questions.length})</Typography>
            {form.questions.map((q: Question, qi: number) => (
              <Box key={q.id} sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Question {qi + 1}</Typography>
                  <IconButton size="small" color="error" onClick={() => removeQuestion(qi)}><RemoveCircleIcon /></IconButton>
                </Stack>
                <TextField label="Question text" value={q.questionText} onChange={(e) => updateQuestion(qi, 'questionText', e.target.value)} fullWidth size="small" sx={{ mb: 1 }} />
                <Stack direction="row" spacing={1} mb={1}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select value={q.type} label="Type" onChange={(e) => updateQuestion(qi, 'type', e.target.value)}>
                      {QUESTION_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
                {[0, 1, 2, 3].map(oi => (
                  <Stack direction="row" spacing={1} alignItems="center" key={oi} sx={{ mb: 0.5 }}>
                    <TextField label={`Option ${oi + 1}`} value={q.options[oi] || ''} onChange={(e) => updateOption(qi, oi, e.target.value)} fullWidth size="small" />
                    <FormControlLabel
                      control={<RadioButton checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, 'correctAnswer', oi)} />}
                      label="Correct"
                    />
                  </Stack>
                ))}
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addQuestion} variant="outlined">Add Question</Button>
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

// Inline radio button component (same as AdminTestsPage)
function RadioButton({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span
      onClick={onChange}
      style={{
        display: 'inline-flex', width: 20, height: 20, borderRadius: '50%',
        border: '2px solid', borderColor: checked ? '#1976d2' : '#aaa',
        cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {checked && <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1976d2' }} />}
    </span>
  );
}
