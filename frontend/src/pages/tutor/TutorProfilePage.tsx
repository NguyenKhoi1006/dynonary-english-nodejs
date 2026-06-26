import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Chip, Avatar,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { tutorApi } from '../../services/lmsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorState from '../../components/ErrorState';

export default function TutorProfilePage() {
  const { currentUser } = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '', subjectsInput: '', hourlyRate: 0, level: 'intermediate',
    qualificationsInput: '', videoIntro: '',
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true); setError(null);
    tutorApi.getMyProfile()
      .then((data: any) => {
        if (!data || !data.uid) { setNotFound(true); return; }
        setForm({
          bio: data.bio || '',
          subjectsInput: '',
          hourlyRate: data.hourlyRate || 0,
          level: data.level || 'intermediate',
          qualificationsInput: '',
          videoIntro: data.videoIntro || '',
        });
        setSubjects(data.subjects || []);
        setQualifications(data.qualifications || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, []);

  const addSubject = () => {
    const s = form.subjectsInput.trim();
    if (s && !subjects.includes(s)) { setSubjects(prev => [...prev, s]); setForm(p => ({ ...p, subjectsInput: '' })); }
  };

  const removeSubject = (s: string) => setSubjects(prev => prev.filter(x => x !== s));

  const addQualification = () => {
    const q = form.qualificationsInput.trim();
    if (q && !qualifications.includes(q)) { setQualifications(prev => [...prev, q]); setForm(p => ({ ...p, qualificationsInput: '' })); }
  };

  const removeQualification = (q: string) => setQualifications(prev => prev.filter(x => x !== q));

  const handleSave = async () => {
    setSaving(true);
    try {
      await tutorApi.updateProfile({
        bio: form.bio,
        subjects,
        hourlyRate: form.hourlyRate,
        level: form.level,
        qualifications,
        videoIntro: form.videoIntro,
      });
      alert('Cập nhật hồ sơ thành công');
    } catch { alert('Cập nhật thất bại'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <LoadingSkeleton type="list" count={6} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Bạn chưa có hồ sơ gia sư</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Vui lòng đăng ký làm gia sư trước.</Typography>
          <Button variant="contained" onClick={() => window.location.href = '/tutor/apply'}>Đăng ký làm gia sư</Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>Hồ sơ gia sư</Typography>

        <Card>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={currentUser?.avt} sx={{ width: 56, height: 56, fontSize: '1.2rem' }}>
                  {currentUser?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{currentUser?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{currentUser?.email}</Typography>
                </Box>
              </Box>

              <TextField fullWidth size="small" label="Giới thiệu" multiline rows={4}
                value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Môn học</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {subjects.map(s => <Chip key={s} label={s} size="small" onDelete={() => removeSubject(s)} />)}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth size="small" placeholder="Nhập môn học..."
                    value={form.subjectsInput}
                    onChange={e => setForm(p => ({ ...p, subjectsInput: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }} />
                  <Button size="small" variant="outlined" onClick={addSubject}>Thêm</Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Giá/giờ (VNĐ)" type="number"
                  value={form.hourlyRate} onChange={e => setForm(p => ({ ...p, hourlyRate: Number(e.target.value) }))} />
                <FormControl fullWidth size="small">
                  <InputLabel>Trình độ</InputLabel>
                  <Select value={form.level} label="Trình độ" onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Bằng cấp / Chứng chỉ</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {qualifications.map(q => <Chip key={q} label={q} size="small" onDelete={() => removeQualification(q)} />)}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth size="small" placeholder="Nhập bằng cấp..."
                    value={form.qualificationsInput}
                    onChange={e => setForm(p => ({ ...p, qualificationsInput: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQualification(); } }} />
                  <Button size="small" variant="outlined" onClick={addQualification}>Thêm</Button>
                </Box>
              </Box>

              <TextField fullWidth size="small" label="Video giới thiệu (URL)"
                value={form.videoIntro} onChange={e => setForm(p => ({ ...p, videoIntro: e.target.value }))} />

              <Box>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
