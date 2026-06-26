import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Pagination, TableContainer,
} from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

export default function AdminActivityPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    adminApi.listActivityLogs({ page, pageSize })
      .then(d => { setItems(d.logs || d.items || []); setTotal(d.total || 0); })
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      approve_tutor: 'Duyệt gia sư', reject_tutor: 'Từ chối gia sư',
      ban_user: 'Cấm người dùng', unban_user: 'Bỏ cấm người dùng',
      grant_premium: 'Cấp Premium', update_user: 'Cập nhật người dùng',
    };
    return map[action] || action;
  };

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Lịch sử hoạt động' }]} />
        <Typography variant="h4" sx={{ mb: 2 }}>Lịch sử hoạt động</Typography>

        {error ? <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetch} /> :
         loading ? <LoadingSkeleton type="list" count={10} /> :
         items.length === 0 ? <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Chưa có hoạt động nào</Typography> :
         <>
          <TableContainer component={Card}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Quản trị viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mục tiêu</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Chi tiết</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any, i: number) => (
                  <TableRow key={item.id || i} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Chip label={getActionLabel(item.action)} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: '0.75rem' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2">{item.adminName || item.adminId || '-'}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{item.targetId || '-'}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{item.details || '-'}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString('vi-VN') : '-'}
                      </Typography>
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
         </>}
      </Box>
    </DashboardLayout>
  );
}
