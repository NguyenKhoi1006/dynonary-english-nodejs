import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Avatar, Chip,
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, IconButton,
} from '@mui/material';
import {
  Search as SearchIcon, Message as MessageIcon, People as PeopleIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Session } from '../../types';

interface StudentSummary {
  studentId: string;
  studentName: string;
  studentAvt: string;
  courseNames: string[];
  totalSessions: number;
  lastSession: string;
}

export default function TutorStudentsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    schedulingApi.getMySessions('tutor')
      .then(data => {
        if (!cancelled) {
          const sessions: Session[] = data.sessions || [];
          // Aggregate by studentId
          const map = new Map<string, StudentSummary>();
          for (const s of sessions) {
            if (!s.studentId) continue;
            const existing = map.get(s.studentId);
            if (existing) {
              existing.totalSessions++;
              if (s.courseName && !existing.courseNames.includes(s.courseName)) {
                existing.courseNames.push(s.courseName);
              }
              if (s.date > existing.lastSession) {
                existing.lastSession = s.date;
              }
            } else {
              map.set(s.studentId, {
                studentId: s.studentId,
                studentName: s.studentName,
                studentAvt: s.studentAvt,
                courseNames: s.courseName ? [s.courseName] : [],
                totalSessions: 1,
                lastSession: s.date,
              });
            }
          }
          setStudents(Array.from(map.values()));
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách học viên');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Breadcrumbs items={[{ label: 'Học viên' }]} />
        <Typography variant="h4" sx={{ mb: 0.5 }}>Học viên của tôi</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Quản lý học viên và theo dõi tiến độ
        </Typography>

        <TextField
          fullWidth placeholder="Tìm học viên..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2.5, maxWidth: 400 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />

        {loading ? (
          <LoadingSkeleton type="table" count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<PeopleIcon sx={{ fontSize: 64 }} />}
            title="Không tìm thấy học viên"
            description={search ? 'Thử tìm kiếm với từ khóa khác' : 'Bạn chưa có học viên nào. Khi học viên đặt lịch, họ sẽ xuất hiện ở đây.'}
          />
        ) : (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Học viên</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Khóa học</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Buổi học</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Buổi cuối</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(student => (
                    <TableRow key={student.studentId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={student.studentAvt} sx={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                            {student.studentName?.charAt(0) || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.studentName}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {student.courseNames.length > 0
                            ? student.courseNames.map((name, i) => (
                                <Chip key={i} label={name} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                              ))
                            : <Typography variant="caption" color="text.secondary">Chưa đăng ký</Typography>
                          }
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.totalSessions}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {student.lastSession ? new Date(student.lastSession).toLocaleDateString('vi-VN') : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <MessageIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
}
