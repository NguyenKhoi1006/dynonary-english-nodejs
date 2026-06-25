import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button, List, ListItem,
  ListItemIcon, ListItemText, Divider, Avatar, Skeleton,
} from '@mui/material';
import {
  PlayCircle as PlayIcon, Lock as LockIcon, School as SchoolIcon,
  AccessTime as TimeIcon, People as PeopleIcon, Star as StarIcon,
  ArrowBack as BackIcon, CheckCircle as CheckIcon, MenuBook as BookIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseApi } from '../../services/lmsApi';
import ErrorState from '../../components/ErrorState';
import type { Course, Lesson } from '../../types';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    courseApi.getById(id)
      .then(data => {
        if (!cancelled) setCourse(data);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải thông tin khóa học');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => navigate('/courses')} />
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
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" height={300} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={400} />
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">Không tìm thấy khóa học</Typography>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
            Quay lại
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  const lessons = course.lessons || [];

  return (
    <DashboardLayout role="student">
      <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/courses')} sx={{ mb: 2 }}>
          Quay lại
        </Button>

        <Grid container spacing={3}>
          {/* Main */}
          <Grid item xs={12} md={8}>
            {/* Hero */}
            <Card sx={{ mb: 3 }}>
              <Box sx={{
                height: 200, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SchoolIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.15)' }} />
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{course.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip label={course.level} size="small" color="secondary" variant="outlined" />
                  <Chip label={course.subject} size="small" color="primary" variant="outlined" />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <StarIcon sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2">{course.rating}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                      {course.tutorName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{course.tutorName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">{course.totalStudents} học viên</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {course.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chương trình học</Typography>
                {lessons.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Chưa có bài học nào.</Typography>
                ) : (
                  lessons.map((lesson, i) => (
                    <Box key={lesson.uid}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {lesson.isFreePreview
                            ? <PlayIcon color="primary" fontSize="small" />
                            : <LockIcon fontSize="small" color="disabled" />
                          }
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {i + 1}. {lesson.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(lesson.duration / 60)} phút · {lesson.contentType}
                            </Typography>
                          </Box>
                        </Box>
                        {lesson.isFreePreview ? (
                          <Chip label="Miễn phí" size="small" color="success" variant="outlined" sx={{ height: 22 }} />
                        ) : (
                          <Chip label="Premium" size="small" icon={<LockIcon sx={{ fontSize: 14 }} />} sx={{ height: 22 }} />
                        )}
                      </Box>
                      {i < lessons.length - 1 && <Divider />}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                  {course.price.toLocaleString()}đ
                </Typography>
                <Button variant="contained" fullWidth size="large" sx={{ mb: 2 }}>
                  Đăng ký ngay
                </Button>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookIcon fontSize="small" color="action" />
                    <Typography variant="body2">{course.totalLessons} bài học</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{Math.round(course.totalDuration / 60)} phút học</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon fontSize="small" color="action" />
                    <Typography variant="body2">Tài liệu PDF đi kèm</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon fontSize="small" color="action" />
                    <Typography variant="body2">Chứng chỉ hoàn thành</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1.5 }}>Khóa học này bao gồm</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">✅ {course.totalLessons} bài giảng video</Typography>
                  <Typography variant="body2" color="text.secondary">✅ Tài liệu PDF tải về</Typography>
                  <Typography variant="body2" color="text.secondary">✅ Bài tập thực hành</Typography>
                  <Typography variant="body2" color="text.secondary">✅ Hỗ trợ từ gia sư</Typography>
                  <Typography variant="body2" color="text.secondary">✅ Quyền truy cập trọn đời</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
