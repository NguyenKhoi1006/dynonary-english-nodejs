import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button, TextField, InputAdornment,
  Skeleton, Pagination,
} from '@mui/material';
import {
  Search as SearchIcon, School as SchoolIcon, AccessTime as TimeIcon,
  People as PeopleIcon, Star as StarIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseApi } from '../../services/lmsApi';
import ErrorState from '../../components/ErrorState';
import type { Course } from '../../types';

const levels = ['Tất cả', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const subjects = ['Tất cả', 'English', 'Math', 'Science', 'Programming'];

export default function CourseBrowsePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState('Tất cả');
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    courseApi.list({
      page,
      pageSize,
      subject: activeSubject !== 'Tất cả' ? activeSubject : undefined,
      level: activeLevel !== 'Tất cả' ? activeLevel.toLowerCase() : undefined,
    })
      .then(data => {
        if (!cancelled) {
          setCourses(data.courses || []);
          setTotal(data.total || 0);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách khóa học');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, activeLevel, activeSubject]);

  const filtered = courses.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.tutorName.toLowerCase().includes(q);
  });

  const gradientForSubject = (subject: string) => {
    const map: Record<string, string> = {
      English: '#2563EB, #1D4ED8',
      Programming: '#7C3AED, #5B21B6',
      Math: '#10B981, #059669',
      Science: '#F59E0B, #D97706',
    };
    return map[subject] || '#64748B, #475569';
  };

  if (error) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>Khóa học</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nâng cao kiến thức với các khóa học chất lượng
        </Typography>

        <TextField
          fullWidth placeholder="Tìm khóa học..."
          value={search} onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          {subjects.map(s => (
            <Chip key={s} label={s} onClick={() => { setActiveSubject(s); setPage(1); }}
              color={activeSubject === s ? 'primary' : 'default'}
              variant={activeSubject === s ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {levels.map(l => (
            <Chip key={l} label={l} onClick={() => { setActiveLevel(l); setPage(1); }}
              color={activeLevel === l ? 'secondary' : 'default'}
              variant={activeLevel === l ? 'filled' : 'outlined'}
            />
          ))}
        </Box>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="rounded" width={100} height={22} sx={{ my: 1 }} />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">Không tìm thấy khóa học phù hợp</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {filtered.map(course => (
                <Grid item xs={12} sm={6} lg={4} key={course.uid}>
                  <Card sx={{ cursor: 'pointer', height: '100%' }}
                    onClick={() => navigate(`/courses/${course.uid}`)}
                  >
                    <Box sx={{
                      height: 140,
                      background: `linear-gradient(135deg, ${gradientForSubject(course.subject)})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <SchoolIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>{course.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {course.tutorName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                        <Chip label={course.level} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                        <Chip label={course.subject} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <TimeIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary">{course.totalLessons} bài</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <PeopleIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary">{course.totalStudents} học viên</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <StarIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary">{course.rating}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" color="primary">
                        {course.price.toLocaleString()}đ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {total > pageSize && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(total / pageSize)}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
