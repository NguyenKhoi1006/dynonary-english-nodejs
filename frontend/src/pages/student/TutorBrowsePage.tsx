import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, TextField,
  InputAdornment, Rating, Skeleton, Pagination,
} from '@mui/material';
import {
  Search as SearchIcon, School as SchoolIcon, Star as StarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { tutorApi } from '../../services/lmsApi';
import ErrorState from '../../components/ErrorState';
import type { TutorProfile } from '../../types';

const subjects = ['Tất cả', 'English', 'Math', 'Science', 'Programming', 'Music', 'Art'];

export default function TutorBrowsePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    tutorApi.list({ page, pageSize, subject: activeSubject !== 'Tất cả' ? activeSubject : undefined })
      .then(data => {
        if (!cancelled) {
          setTutors(data.tutors || []);
          setTotal(data.total || 0);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách gia sư');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, activeSubject]);

  const filtered = tutors.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.subjects.some(s => s.toLowerCase().includes(q));
  });

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
        <Typography variant="h4" sx={{ mb: 0.5 }}>Tìm gia sư</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Chọn gia sư phù hợp nhất với bạn
        </Typography>

        <TextField
          fullWidth
          placeholder="Tìm theo tên gia sư hoặc môn học..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {subjects.map(s => (
            <Chip
              key={s}
              label={s}
              onClick={() => { setActiveSubject(s); setPage(1); }}
              color={activeSubject === s ? 'primary' : 'default'}
              variant={activeSubject === s ? 'filled' : 'outlined'}
            />
          ))}
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <Card>
                  <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={72} height={72} sx={{ mb: 1.5 }} />
                    <Skeleton variant="text" width={120} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="rounded" width={80} height={22} sx={{ my: 1 }} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">Không tìm thấy gia sư phù hợp</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2.5}>
              {filtered.map(tutor => (
                <Grid item xs={12} sm={6} lg={3} key={tutor.uid}>
                  <Card sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                    onClick={() => navigate(`/tutors/${tutor.uid}`)}
                  >
                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                      <Avatar src={tutor.avt} sx={{ width: 72, height: 72, mb: 1.5, fontSize: '1.5rem' }}>
                        {tutor.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1">{tutor.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Rating value={tutor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">({tutor.totalReviews})</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 1 }}>
                        {tutor.subjects.map(sub => (
                          <Chip key={sub} label={sub} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 'auto' }}>
                        {tutor.level === 'expert' ? 'Chuyên gia' : tutor.level === 'advanced' ? 'Nâng cao' : 'Trung cấp'}
                      </Typography>
                      <Box sx={{ mt: 1.5, width: '100%', pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" color="primary">
                          {tutor.hourlyRate.toLocaleString()}đ<span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#94A3B8' }}>/giờ</span>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {total > pageSize && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
