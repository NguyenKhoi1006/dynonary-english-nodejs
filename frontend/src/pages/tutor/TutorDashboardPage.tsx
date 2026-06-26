import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, Stack, Rating, Divider,
} from '@mui/material';
import {
  People as PeopleIcon, CalendarMonth as CalendarIcon, School as SchoolIcon,
  Star as StarIcon, Add as AddIcon, Schedule as ScheduleIcon, MonetizationOn as MonetizationOnIcon,
  EventNote as EventNoteIcon, VideoLibrary as VideoLibraryIcon, AppRegistration as AppRegistrationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulingApi, tutorApi, courseApi, reviewApi } from '../../services/lmsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

export default function TutorDashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      schedulingApi.getMySessions('tutor').catch(() => ({ sessions: [] })),
      schedulingApi.getTutorBookings().catch(() => ({ bookings: [] })),
      tutorApi.getMyProfile().catch(() => null),
      courseApi.getMyCourses().catch(() => ({ courses: [] })),
    ])
      .then(([sessionsData, bookingsData, profileData, coursesData]) => {
        if (cancelled) return;
        setSessions(sessionsData?.sessions || []);
        setBookings(Array.isArray(bookingsData?.bookings || bookingsData) ? (bookingsData?.bookings || bookingsData) : []);
        if (profileData && profileData.uid) {
          setProfile(profileData);
          // Fetch reviews if has rating
          const tutorId = profileData.uid || profileData.userId;
          if (tutorId) {
            reviewApi.getTutorReviews(tutorId).then((r: any) => {
              if (!cancelled) setReviews(Array.isArray(r?.reviews || r) ? (r?.reviews || r) : []);
            }).catch(() => {});
          }
        } else {
          setHasProfile(false);
        }
        setCourses(coursesData?.courses || []);
      })
      .catch(err => { if (!cancelled) setError(err.message || 'Không thể tải dữ liệu'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const upcomingSessions = sessions
    .filter(s => s.date >= todayStr && s.status !== 'cancelled' && s.status !== 'completed')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 5);
  const confirmedCount = sessions.filter(s => s.status === 'confirmed').length;
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const uniqueStudents = new Set(sessions.map(s => s.studentId)).size;
  const hourlyRate = profile?.hourlyRate || 0;
  const totalEarnings = completedCount * hourlyRate;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : (profile?.rating || '0.0');

  const stats = [
    { label: 'Học viên', value: uniqueStudents.toString(), icon: <PeopleIcon />, color: 'primary.main' },
    { label: 'Buổi đã dạy', value: completedCount.toString(), icon: <SchoolIcon />, color: 'success.main' },
    { label: 'Sắp tới', value: upcomingSessions.length.toString(), icon: <EventNoteIcon />, color: 'info.main' },
    { label: 'Chờ duyệt', value: pendingBookings.toString(), icon: <ScheduleIcon />, color: 'warning.main' },
  ];

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
        <Breadcrumbs items={[{ label: 'Bảng điều khiển' }]} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.25 }}>Bảng điều khiển</Typography>
            <Typography variant="body2" color="text.secondary">
              {todaySessions.length > 0
                ? `Hôm nay bạn có ${todaySessions.length} buổi học.`
                : upcomingSessions.length > 0
                  ? `Bạn có ${upcomingSessions.length} buổi học sắp tới.`
                  : 'Chào mừng trở lại!'}
            </Typography>
          </Box>
          {!hasProfile && (
            <Button variant="contained" startIcon={<AppRegistrationIcon />} onClick={() => navigate('/tutor/apply')} size="small">
              Đăng ký làm gia sư
            </Button>
          )}
        </Box>

        {loading ? (
          <LoadingSkeleton type="stats" count={4} />
        ) : (
          <>
            {/* Profile Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Avatar src={currentUser?.avt} sx={{ width: 52, height: 52, fontSize: '1.1rem' }}>
                  {currentUser?.name?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <Typography variant="h6">{currentUser?.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Rating value={Number(avgRating) || 0} size="small" readOnly precision={0.5} />
                    <Typography variant="caption" color="text.secondary">({reviews.length || profile?.totalReviews || 0} đánh giá)</Typography>
                    {hourlyRate > 0 && (
                      <Chip label={`${hourlyRate.toLocaleString()}đ/giờ`} size="small" variant="outlined" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />
                    )}
                    {profile?.totalSessions > 0 && (
                      <Chip label={`${profile.totalSessions} buổi`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                  {profile?.subjects?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {profile.subjects.slice(0, 4).map((s: string) => (
                        <Chip key={s} label={s} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      ))}
                    </Box>
                  )}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" color="success.main">{totalEarnings.toLocaleString()}đ</Typography>
                  <Typography variant="caption" color="text.secondary">Tổng doanh thu</Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {stats.map((stat, i) => (
                <Grid item xs={6} lg={3} key={i}>
                  <Card>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                      <Box>
                        <Typography variant="h5">{stat.value}</Typography>
                        <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Upcoming Sessions */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Buổi học sắp tới</Typography>
                {upcomingSessions.length === 0 ? (
                  <EmptyState
                    icon={<CalendarIcon sx={{ fontSize: 48 }} />}
                    title="Không có buổi học nào"
                    description={hasProfile ? 'Học viên sẽ đặt lịch khi họ tìm thấy bạn.' : 'Đăng ký làm gia sư để bắt đầu nhận học viên.'}
                    actionLabel={hasProfile ? 'Cài đặt lịch dạy' : 'Đăng ký ngay'}
                    onAction={() => navigate(hasProfile ? '/tutor/availability' : '/tutor/apply')}
                  />
                ) : (
                  upcomingSessions.map((s: any) => (
                    <Card key={s.uid || s.id} sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={s.studentAvt} sx={{ width: 36, height: 36 }} aria-hidden="true">
                          {s.studentName?.charAt(0) || '?'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.studentName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.courseName || ''}
                            {s.date && ` • ${new Date(s.date).toLocaleDateString('vi-VN')}`}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ fontWeight: 500, display: 'block' }}>{s.startTime} - {s.endTime}</Typography>
                          <Chip
                            label={s.status === 'confirmed' ? 'Đã xác nhận' : s.status === 'pending' ? 'Chờ' : s.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                            size="small"
                            color={s.status === 'confirmed' ? 'info' : s.status === 'pending' ? 'warning' : s.status === 'completed' ? 'success' : 'error'}
                            sx={{ height: 20, fontSize: '0.65rem', mt: 0.3 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}

                {/* Today's sessions */}
                {todaySessions.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Hôm nay ({todaySessions.length})
                    </Typography>
                    {todaySessions.map((s: any) => (
                      <Card key={s.uid || s.id} sx={{ mb: 0.5, bgcolor: 'action.hover' }}>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={s.studentAvt} sx={{ width: 28, height: 28, fontSize: '0.65rem' }}>
                            {s.studentName?.charAt(0) || '?'}
                          </Avatar>
                          <Typography variant="body2" sx={{ flex: 1 }}>{s.studentName}</Typography>
                          <Typography variant="caption" fontWeight={600}>{s.startTime} - {s.endTime}</Typography>
                          <Chip
                            label={s.status === 'confirmed' ? 'Đã xác nhận' : s.status === 'pending' ? 'Chờ' : 'Hoàn thành'}
                            size="small"
                            color={s.status === 'confirmed' ? 'info' : s.status === 'pending' ? 'warning' : 'success'}
                            sx={{ height: 18, fontSize: '0.6rem' }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={5}>
                {/* Quick Actions */}
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Truy cập nhanh</Typography>
                <Card sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack spacing={1}>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/my-courses')} fullWidth>
                        Tạo khóa học mới
                      </Button>
                      <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={() => navigate('/tutor/availability')} fullWidth>
                        Cài đặt lịch dạy
                      </Button>
                      <Button variant="outlined" startIcon={<EventNoteIcon />} onClick={() => navigate('/tutor/bookings')} fullWidth>
                        Xem lịch đặt
                      </Button>
                      <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => navigate('/students')} fullWidth>
                        Xem học viên
                      </Button>
                      <Button variant="outlined" startIcon={<MonetizationOnIcon />} onClick={() => navigate('/earnings')} fullWidth>
                        Xem doanh thu
                      </Button>
                      <Button variant="outlined" startIcon={<VideoLibraryIcon />} onClick={() => navigate('/my-courses')} fullWidth>
                        Quản lý bài giảng
                      </Button>
                      <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate('/tutor/profile')} fullWidth>
                        Chỉnh sửa hồ sơ
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Profile Summary */}
                {hasProfile && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Thông tin hồ sơ</Typography>
                    <Card>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Khóa học</Typography>
                            <Typography variant="body2" fontWeight={600}>{courses.length}</Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Đánh giá</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating value={Number(avgRating) || 0} size="small" readOnly precision={0.5} />
                              <Typography variant="body2" fontWeight={600}>{avgRating}</Typography>
                            </Box>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Tổng học viên</Typography>
                            <Typography variant="body2" fontWeight={600}>{uniqueStudents}</Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Giá/giờ</Typography>
                            <Typography variant="body2" fontWeight={600}>{hourlyRate > 0 ? `${hourlyRate.toLocaleString()}đ` : 'Chưa cập nhật'}</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Recent Reviews */}
                {reviews.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Đánh giá gần đây</Typography>
                    <Card>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack spacing={1.5}>
                          {reviews.slice(0, 3).map((r: any, i: number) => (
                            <Box key={r.uid || i}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Avatar src={r.studentAvt} sx={{ width: 24, height: 24, fontSize: '0.6rem' }}>
                                  {(r.studentName || '?').charAt(0)}
                                </Avatar>
                                <Typography variant="caption" fontWeight={600}>{r.studentName || 'Học viên'}</Typography>
                                <Rating value={r.rating || 0} size="small" readOnly sx={{ ml: 'auto' }} />
                              </Box>
                              {r.comment && <Typography variant="caption" color="text.secondary">{r.comment}</Typography>}
                              {i < reviews.length - 1 && i < 2 && <Divider sx={{ mt: 1 }} />}
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
