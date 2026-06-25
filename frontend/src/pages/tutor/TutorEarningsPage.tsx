import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableContainer, TableHead, TableBody,
  TableRow, TableCell, Chip, Avatar,
} from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import Breadcrumbs from '../../components/Breadcrumbs';

const monthlyData = [
  { month: 'T1', amount: 3200000 },
  { month: 'T2', amount: 2800000 },
  { month: 'T3', amount: 4500000 },
  { month: 'T4', amount: 3800000 },
  { month: 'T5', amount: 5200000 },
  { month: 'T6', amount: 4800000 },
];

const transactions = [
  { id: 'TXN001', student: 'Nguyễn Minh Anh', avt: '', course: 'IELTS Speaking', date: '24/06/2026', amount: 500000, status: 'completed' },
  { id: 'TXN002', student: 'Trần Hoàng Nam', avt: '', course: 'IELTS Writing', date: '23/06/2026', amount: 350000, status: 'completed' },
  { id: 'TXN003', student: 'Lê Thu Trang', avt: '', course: 'Giao tiếp', date: '22/06/2026', amount: 400000, status: 'completed' },
  { id: 'TXN004', student: 'Phạm Đức Mạnh', avt: '', course: 'TOEIC Reading', date: '20/06/2026', amount: 300000, status: 'pending' },
  { id: 'TXN005', student: 'Vũ Thị Hương', avt: '', course: 'Ngữ pháp', date: '18/06/2026', amount: 250000, status: 'completed' },
  { id: 'TXN006', student: 'Đặng Công Tuấn', avt: '', course: 'IELTS Speaking', date: '15/06/2026', amount: 500000, status: 'completed' },
  { id: 'TXN007', student: 'Nguyễn Minh Anh', avt: '', course: 'IELTS Speaking', date: '12/06/2026', amount: 500000, status: 'completed' },
  { id: 'TXN008', student: 'Lê Thu Trang', avt: '', course: 'Giao tiếp', date: '10/06/2026', amount: 600000, status: 'completed' },
];

export default function TutorEarningsPage() {
  const [loading, setLoading] = useState(true);
  const totalEarnings = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Breadcrumbs items={[{ label: 'Doanh thu' }]} />
        <Typography variant="h4" sx={{ mb: 2.5 }}>Doanh thu</Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Tổng doanh thu', value: `${totalEarnings.toLocaleString()}đ` },
            { label: 'Tháng này', value: '4.800.000đ' },
            { label: 'Tăng trưởng', value: '+15%' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Chart */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Doanh thu theo tháng</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160, pt: 2 }}>
              {monthlyData.map((d, i) => (
                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {(d.amount / 1000000).toFixed(1)}tr
                  </Typography>
                  <Box sx={{
                    width: '100%', height: `${(d.amount / maxAmount) * 120}px`,
                    bgcolor: i === monthlyData.length - 1 ? 'primary.main' : 'primary.light',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s',
                    opacity: 0.8,
                  }} />
                  <Typography variant="caption" color="text.disabled">{d.month}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Giao dịch gần đây</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Mã GD</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Học viên</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Khóa học</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map(txn => (
                    <TableRow key={txn.id} hover>
                      <TableCell><Typography variant="caption" sx={{ fontWeight: 600 }}>{txn.id}</Typography></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                            {txn.student.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{txn.student}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{txn.course}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{txn.date}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'success.main' }}>
                          +{txn.amount.toLocaleString()}đ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.status === 'completed' ? 'Hoàn thành' : 'Chờ'}
                          size="small"
                          color={txn.status === 'completed' ? 'success' : 'warning'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
