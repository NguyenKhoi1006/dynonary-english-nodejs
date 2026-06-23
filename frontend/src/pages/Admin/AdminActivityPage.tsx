import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import api from 'services/api';

const ACTION_COLORS: Record<string, 'primary' | 'warning' | 'success' | 'error' | 'info'> = {
  ban_user: 'error',
  unban_user: 'success',
  premium_grant: 'warning',
  update_user: 'info',
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [actionFilter, setActionFilter] = useState('');
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'error' } | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (actionFilter) params.action = actionFilter;

      const res = await api.get('/apis/admin/activity/logs', { params });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load logs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Log ID', width: 80 },
    {
      field: 'action',
      headerName: 'Action',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={ACTION_COLORS[params.value] || 'default'}
        />
      ),
    },
    { field: 'adminUid', headerName: 'Admin UID', width: 120 },
    { field: 'targetId', headerName: 'Target', width: 120 },
    {
      field: 'details',
      headerName: 'Details',
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: 11, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(params.value, null, 1).slice(0, 200)}
        </Typography>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleString('vi-VN') : '—'}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Lịch sử hoạt động
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          size="small"
          label="Filter by action type"
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
          placeholder="e.g. ban_user, premium_grant"
          sx={{ minWidth: 260 }}
        />
      </Stack>

      {/* Data Grid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={logs}
          getRowId={(row) => row.id}
          columns={columns}
          rowCount={total}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          paginationMode="server"
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: false },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Box>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {snackbar ? (
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
