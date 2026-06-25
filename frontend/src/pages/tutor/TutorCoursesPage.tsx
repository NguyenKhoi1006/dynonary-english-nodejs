import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button, Switch, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Skeleton,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  People as PeopleIcon, School as SchoolIcon, Visibility as ViewIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Course } from '../../types';

export default function TutorCoursesPage() {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSubject, setFormSubject] = useState('english');
  const [formLevel, setFormLevel] = useState('intermediate');
  const [formPrice, setFormPrice] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    courseApi.getMyCourses()
      .then(data => setCourses(data.courses || []))
      .catch(err => setError(err.message || 'Không thể tải khóa học'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setSubmitting(true);
    try {
      await courseApi.create({
        title: formTitle,
        description: formDesc,
        subject: formSubject,
        level: formLevel,
        price: parseFloat(formPrice) || 0,
        isPublished: false,
        lessons: [],
      });
      setOpenCreate(false);
      setFormTitle('');
      setFormDesc('');
      setFormSubject('english');
      setFormLevel('intermediate');
      setFormPrice('');
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Tạo khóa học thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await courseApi.update(course.uid, { isPublished: !course.isPublished });
      fetchCourses();
    } catch { /* ignore */ }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Xóa khóa học này?')) return;
    try {
      await courseApi.delete(courseId);
      fetchCourses();
    } catch { /* ignore */ }
  };

  if (error && courses.length === 0) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={fetchCourses} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Breadcrumbs items={[{ label: 'Khóa học của tôi' }]} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">Khóa học của tôi</Typography>
            <Typography variant="body2" color="text.secondary">Quản lý tất cả khóa học bạn đang dạy</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} size="small">
            Tạo khóa học
          </Button>
        </Box>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<SchoolIcon sx={{ fontSize: 64 }} />}
            title="Chưa có khóa học nào"
            description="Tạo khóa học đầu tiên để bắt đầu dạy học!"
            actionLabel="Tạo khóa học"
            onAction={() => setOpenCreate(true)}
          />
        ) : (
          <Grid container spacing={2.5}>
            {courses.map(course => (
              <Grid item xs={12} md={6} key={course.uid}>
                <Card>
                  <Box sx={{
                    height: 100,
                    background: `linear-gradient(135deg, ${course.isPublished ? '#2563EB' : '#64748B'}, ${course.isPublished ? '#1D4ED8' : '#475569'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ flex: 1 }}>{course.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <IconButton size="small" onClick={() => navigate(`/courses/${course.uid}`)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(course.uid)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip label={course.level} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                      <Chip label={course.subject} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">{course.totalLessons} bài học</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{course.totalStudents} học viên</Typography>
                      </Box>
                      <Typography variant="subtitle2" color="primary" sx={{ ml: 'auto' }}>
                        {course.price.toLocaleString()}đ
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={course.isPublished}
                        onChange={() => handleTogglePublish(course)}
                        size="small"
                      />
                      <Typography variant="caption" color={course.isPublished ? 'success.main' : 'text.disabled'} sx={{ fontWeight: 600 }}>
                        {course.isPublished ? 'Đã xuất bản' : 'Nháp'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Tạo khóa học mới</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth label="Tên khóa học" required
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
              />
              <TextField
                fullWidth label="Mô tả" multiline rows={3}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Môn học" select value={formSubject} onChange={e => setFormSubject(e.target.value)}>
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="math">Math</MenuItem>
                    <MenuItem value="programming">Programming</MenuItem>
                    <MenuItem value="science">Science</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Cấp độ" select value={formLevel} onChange={e => setFormLevel(e.target.value)}>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <TextField
                fullWidth label="Giá (VNĐ)" type="number"
                value={formPrice}
                onChange={e => setFormPrice(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleCreate} disabled={!formTitle.trim() || submitting}>
              {submitting ? 'Đang tạo...' : 'Tạo khóa học'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
