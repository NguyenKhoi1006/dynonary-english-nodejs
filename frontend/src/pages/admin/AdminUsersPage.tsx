import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, IconButton, Pagination, InputAdornment,
  TableContainer, TableSortLabel, Grid,
} from '@mui/material';
import {
  Search as SearchIcon, Block as BanIcon, CheckCircle as UnbanIcon,
  WorkspacePremium as PremiumIcon, Edit as EditIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi, type AdminUser } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

const ROLE_LABELS: Record<string, string> = { student: 'Học viên', tutor: 'Gia sư', admin: 'Admin' };
const ROLE_COLORS: Record<string, 'primary' | 'secondary' | 'error'> = { student: 'primary', tutor: 'secondary', admin: 'error' };
const STATUS_LABELS: Record<string, string> = { active: 'Hoạt động', banned: 'Bị cấm', pending: 'Chờ duyệt' };
const STATUS_COLORS: Record<string, 'success' | 'error' | 'warning'> = { active: 'success', banned: 'error', pending: 'warning' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [editDialog, setEditDialog] = useState<AdminUser | null>(null);
  const [editData, setEditData] = useState({ name: '', username: '', role: '', membership: '', level: '', status: '' });
  const [saving, setSaving] = useState(false);

  const [premiumDialog, setPremiumDialog] = useState<AdminUser | null>(null);
  const [premiumDays, setPremiumDays] = useState(30);
  const [grantingPremium, setGrantingPremium] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string | number> = { page, pageSize };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    if (statusFilter) params.status = statusFilter;
    adminApi.listUsers(params)
      .then(data => { setUsers(data.users); setTotal(data.total); })
      .catch(err => setError(err.message || 'Không thể tải danh sách'))
      .finally(() => setLoading(false));
  }, [page, pageSize, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages = Math.ceil(total / pageSize);

  const openEdit = (user: AdminUser) => {
    setEditDialog(user);
    setEditData({ name: user.name, username: user.username, role: user.role, membership: user.membership, level: user.level || '', status: user.status });
  };

  const handleEditSave = async () => {
    if (!editDialog) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (editData.name !== editDialog.name) payload.name = editData.name;
      if (editData.username !== editDialog.username) payload.username = editData.username;
      if (editData.role !== editDialog.role) payload.role = editData.role;
      if (editData.membership !== editDialog.membership) payload.membership = editData.membership;
      if (editData.level !== (editDialog.level || '')) payload.level = editData.level || '';
      if (editData.status !== editDialog.status) payload.status = editData.status;
      if (Object.keys(payload).length > 0) {
        await adminApi.updateUser(editDialog.uid, payload);
      }
      setEditDialog(null);
      fetchUsers();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleBan = async (user: AdminUser) => {
    try {
      await adminApi.toggleBan(user.uid);
      fetchUsers();
    } catch { /* ignore */ }
  };

  const handleGrantPremium = async () => {
    if (!premiumDialog) return;
    setGrantingPremium(true);
    try {
      await adminApi.grantPremium(premiumDialog.uid, premiumDays);
      setPremiumDialog(null);
      fetchUsers();
    } catch { /* ignore */ } finally { setGrantingPremium(false); }
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Người dùng' }]} />

        <Typography variant="h4" sx={{ mb: 2 }}>Quản lý người dùng</Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth size="small" placeholder="Tìm kiếm tên / email..."
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Vai trò</InputLabel>
                  <Select value={roleFilter} label="Vai trò" onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="student">Học viên</MenuItem>
                    <MenuItem value="tutor">Gia sư</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={statusFilter} label="Trạng thái" onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="banned">Bị cấm</MenuItem>
                    <MenuItem value="pending">Chờ duyệt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="body2" color="text.secondary">
                  {total} người dùng
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error ? (
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetchUsers} />
        ) : loading ? (
          <LoadingSkeleton type="list" count={8} />
        ) : users.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Không tìm thấy người dùng</Typography>
        ) : (
          <>
            <TableContainer component={Card}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Gói</TableCell>
                    <TableCell>Trình độ</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.uid} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </TableCell>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>
                        <Chip label={ROLE_LABELS[user.role] || user.role} size="small" color={ROLE_COLORS[user.role] || 'default'} sx={{ height: 22, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={STATUS_LABELS[user.status] || user.status} size="small" color={STATUS_COLORS[user.status] || 'default'} sx={{ height: 22, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={user.membership === 'premium' ? 'Premium' : 'Free'} size="small" color={user.membership === 'premium' ? 'warning' : 'default'} variant={user.membership === 'premium' ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell>{user.level || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(user)} title="Chỉnh sửa"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleBan(user)} title={user.status === 'banned' ? 'Bỏ cấm' : 'Cấm'}>
                          {user.status === 'banned' ? <UnbanIcon fontSize="small" color="success" /> : <BanIcon fontSize="small" color="error" />}
                        </IconButton>
                        <IconButton size="small" onClick={() => setPremiumDialog(user)} title="Cấp Premium" disabled={user.membership === 'premium'}>
                          <PremiumIcon fontSize="small" color={user.membership === 'premium' ? 'disabled' : 'warning'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editDialog)} onClose={() => setEditDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth size="small" label="Tên" value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
            <TextField fullWidth size="small" label="Username" value={editData.username} onChange={e => setEditData(p => ({ ...p, username: e.target.value }))} />
            <FormControl fullWidth size="small">
              <InputLabel>Vai trò</InputLabel>
              <Select value={editData.role} label="Vai trò" onChange={e => setEditData(p => ({ ...p, role: e.target.value }))}>
                <MenuItem value="student">Học viên</MenuItem>
                <MenuItem value="tutor">Gia sư</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Trình độ</InputLabel>
              <Select value={editData.level} label="Trình độ" onChange={e => setEditData(p => ({ ...p, level: e.target.value }))}>
                <MenuItem value="">Không</MenuItem>
                <MenuItem value="A1">A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="C1">C1</MenuItem>
                <MenuItem value="C2">C2</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Gói</InputLabel>
              <Select value={editData.membership} label="Gói" onChange={e => setEditData(p => ({ ...p, membership: e.target.value }))}>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select value={editData.status} label="Trạng thái" onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="banned">Bị cấm</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={saving}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Premium Dialog */}
      <Dialog open={Boolean(premiumDialog)} onClose={() => setPremiumDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Cấp Premium</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Cấp gói Premium cho <strong>{premiumDialog?.name || premiumDialog?.email}</strong>
          </Typography>
          <TextField
            fullWidth size="small" label="Số ngày" type="number"
            value={premiumDays} onChange={e => setPremiumDays(Math.max(1, Math.min(3650, Number(e.target.value))))}
            inputProps={{ min: 1, max: 3650 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPremiumDialog(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleGrantPremium} disabled={grantingPremium}>
            Cấp Premium
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
