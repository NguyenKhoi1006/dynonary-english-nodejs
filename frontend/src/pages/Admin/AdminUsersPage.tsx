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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import api from 'services/api';

const ROLE_COLORS: Record<string, 'primary' | 'default'> = {
  admin: 'primary',
  learner: 'default',
};

const STATUS_COLORS: Record<string, 'success' | 'error' | 'default'> = {
  active: 'success',
  banned: 'error',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Premium dialog
  const [premiumDialog, setPremiumDialog] = useState<{ open: boolean; uid: string; name: string }>({
    open: false, uid: '', name: '',
  });
  const [durationDays, setDurationDays] = useState(30);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: page + 1, pageSize };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/apis/admin/users/list', { params });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Failed to load users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBan = async (uid: string) => {
    try {
      const res = await api.put(`/apis/admin/users/${uid}/ban`);
      setSnackbar({ message: res.data.message, severity: 'success' });
      fetchUsers();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Action failed', severity: 'error' });
    }
  };

  const handleGrantPremium = async () => {
    try {
      const res = await api.put(`/apis/admin/users/${premiumDialog.uid}/premium`, {
        durationDays,
      });
      setSnackbar({ message: res.data.message, severity: 'success' });
      setPremiumDialog({ open: false, uid: '', name: '' });
      fetchUsers();
    } catch (err: any) {
      setSnackbar({ message: err.message || 'Action failed', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'uid',
      headerName: 'UID',
      width: 100,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
          {params.value.slice(0, 8)}...
        </Typography>
      ),
    },
    { field: 'email', headerName: 'Email', width: 220, flex: 1 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'username', headerName: 'Username', width: 130 },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={ROLE_COLORS[params.value] || 'default'}
          variant={params.value === 'admin' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'membership',
      headerName: 'Membership',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'premium' ? 'warning' : 'default'}
          variant={params.value === 'premium' ? 'filled' : 'outlined'}
        />
      ),
    },
    { field: 'level', headerName: 'Level', width: 80 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={STATUS_COLORS[params.value] || 'default'}
        />
      ),
    },
    { field: 'xp', headerName: 'XP', width: 80, type: 'number' },
    { field: 'coin', headerName: 'Coin', width: 80, type: 'number' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color={params.row.status === 'banned' ? 'success' : 'error'}
            title={params.row.status === 'banned' ? 'Unban' : 'Ban'}
            onClick={() => handleBan(params.row.uid)}
          >
            {params.row.status === 'banned' ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            color="warning"
            title="Grant Premium"
            onClick={() =>
              setPremiumDialog({
                open: true,
                uid: params.row.uid,
                name: params.row.name || params.row.email,
              })
            }
          >
            <WorkspacePremiumIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Quản lý người dùng
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField
          size="small"
          label="Search email/name/username"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="learner">Learner</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Data Grid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          getRowId={(row) => row.uid}
          columns={columns}
          rowCount={total}
          loading={loading}
          pageSizeOptions={[10, 20, 50]}
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

      {/* Premium Dialog */}
      <Dialog open={premiumDialog.open} onClose={() => setPremiumDialog({ open: false, uid: '', name: '' })}>
        <DialogTitle>Grant Premium</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Grant premium membership to <strong>{premiumDialog.name}</strong>
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Duration</InputLabel>
            <Select
              value={durationDays}
              label="Duration"
              onChange={(e) => setDurationDays(Number(e.target.value))}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days (1 month)</MenuItem>
              <MenuItem value={90}>90 days (3 months)</MenuItem>
              <MenuItem value={180}>180 days (6 months)</MenuItem>
              <MenuItem value={365}>365 days (1 year)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPremiumDialog({ open: false, uid: '', name: '' })}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleGrantPremium}>
            Grant Premium
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
