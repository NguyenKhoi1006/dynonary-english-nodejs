import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, Rating,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton,
} from '@mui/material';
import {
  School as SchoolIcon, Star as StarIcon, CalendarMonth as CalendarIcon,
  ArrowBack as BackIcon, Message as MessageIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { tutorApi, reviewApi } from '../../services/lmsApi';
import ErrorState from '../../components/ErrorState';
import type { TutorProfile } from '../../types';

interface ReviewItem {
  uid: string;
  studentName: string;
  studentAvt: string;
  rating: number;
  comment: string;
  createdDate: string;
}

export default function TutorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      tutorApi.getById(id),
      reviewApi.getTutorReviews(id).catch(() => ({ reviews: [] })),
    ])
      .then(([profile, reviewData]) => {
        if (!cancelled) {
          setTutor(profile);
          setReviews(reviewData.reviews || []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải thông tin gia sư');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => navigate('/tutors')} />
        </Box>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <Skeleton variant="rounded" width={120} height={36} sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Skeleton variant="circular" width={96} height={96} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={100} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" height={100} />
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    );
  }

  if (!tutor) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">Không tìm thấy gia sư</Typography>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/tutors')} sx={{ mt: 2 }}>
            Quay lại
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/tutors')} sx={{ mb: 2 }}>
          Quay lại
        </Button>

        <Grid container spacing={3}>
          {/* Profile */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Avatar src={tutor.avt} sx={{ width: 96, height: 96, mx: 'auto', mb: 2, fontSize: '2rem' }}>
                  {tutor.name.charAt(0)}
                </Avatar>
                <Typography variant="h5">{tutor.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                  <Rating value={tutor.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">({tutor.totalReviews} đánh giá)</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                  {tutor.subjects.map(s => <Chip key={s} label={s} size="small" color="primary" variant="outlined" />)}
                </Box>
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                  {tutor.hourlyRate.toLocaleString()}đ<span style={{ fontSize: '1rem', fontWeight: 400, color: '#94A3B8' }}>/giờ</span>
                </Typography>
                <Button variant="contained" fullWidth size="large" sx={{ mb: 1 }} startIcon={<CalendarIcon />}>
                  Đặt lịch học
                </Button>
                <Button variant="outlined" fullWidth startIcon={<MessageIcon />}>
                  Nhắn tin
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'Buổi học', value: tutor.totalSessions, color: '#2563EB' },
                { label: 'Học viên', value: tutor.totalStudents, color: '#7C3AED' },
                { label: 'Đánh giá', value: tutor.totalReviews, color: '#10B981' },
                { label: 'Cấp độ', value: tutor.level === 'expert' ? 'Chuyên gia' : tutor.level === 'advanced' ? 'Nâng cao' : 'Trung cấp', color: '#F59E0B' },
              ].map((stat, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Card sx={{ textAlign: 'center' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h5" sx={{ color: stat.color }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Bio */}
                <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>Giới thiệu</Typography>
                {tutor.bio.split('\n\n').map((p, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1, whiteSpace: 'pre-line' }}>{p}</Typography>
                ))}
              </CardContent>
            </Card>

            {/* Qualifications */}
            {tutor.qualifications.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>Bằng cấp & Chứng chỉ</Typography>
                  <List disablePadding>
                    {tutor.qualifications.map((q, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <ListItemAvatar sx={{ minWidth: 36 }}>
                          <SchoolIcon color="primary" fontSize="small" />
                        </ListItemAvatar>
                        <ListItemText primary={q} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Đánh giá</Typography>
                {reviews.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Chưa có đánh giá nào.</Typography>
                ) : (
                  reviews.map((r, i) => (
                    <Box key={r.uid} sx={{ mb: i < reviews.length - 1 ? 2 : 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>{r.studentName.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{r.studentName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Rating value={r.rating} size="small" readOnly />
                            <Typography variant="caption" color="text.disabled">{new Date(r.createdDate).toLocaleDateString('vi-VN')}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5 }}>{r.comment}</Typography>
                      {i < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
