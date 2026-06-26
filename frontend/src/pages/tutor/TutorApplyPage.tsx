import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { tutorApi } from '../../services/lmsApi';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function TutorApplyPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    bio: '', subjectsInput: '', hourlyRate: 100000, level: 'intermediate',
    qualificationsInput: '', videoIntro: '',
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);

  useEffect(() => {
    tutorApi.getMyProfile()
      .then((data: any) => {
        if (data && data.uid) setAlreadyApplied(true);
      })
      .catch(() => { /* no profile yet */ })
      .finally(() => setChecking(false));
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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.bio.trim()) errs.bio = 'Vui lòng nhập giới thiệu';
    else if (form.bio.trim().length < 10) errs.bio = 'Giới thiệu cần ít nhất 10 ký tự';
    if (subjects.length === 0) errs.subjects = 'Vui lòng thêm ít nhất một môn học';
    if (!form.hourlyRate || form.hourlyRate < 0) errs.hourlyRate = 'Giá/giờ không hợp lệ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await tutorApi.apply({
        bio: form.bio,
        subjects,
        hourlyRate: form.hourlyRate,
        level: form.level,
        qualifications,
        videoIntro: form.videoIntro || '',
      });
      alert('Đăng ký thành công! Vui lòng chờ admin duyệt.');
      navigate('/tutor');
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message || 'Đăng ký thất bại');
    } finally { setSaving(false); }
  };

  if (checking) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <LoadingSkeleton type="list" count={4} />
        </Box>
      </DashboardLayout>
    );
  }

  if (alreadyApplied) {
    return (
      <DashboardLayout role="tutor">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Bạn đã đăng ký làm gia sư</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hồ sơ của bạn đang chờ admin duyệt. Vui lòng kiểm tra lại sau.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/tutor')}>Quay lại Dashboard</Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tutor">
      <Box>
        <Typography variant="h4" sx={{ mb: 0.25 }}>Đăng ký làm gia sư</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Điền thông tin để trở thành gia sư trên DynoLMS
        </Typography>

        <Card sx={{ maxWidth: 700 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField fullWidth size="small" label="Giới thiệu" multiline rows={4} required
                value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                error={Boolean(errors.bio)} helperText={errors.bio}
                placeholder="Giới thiệu ngắn về bản thân, kinh nghiệm giảng dạy..." />

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, color: errors.subjects ? 'error.main' : 'text.primary' }}>
                  Môn học có thể dạy <Typography component="span" color="error">*</Typography>
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {subjects.map(s => <Chip key={s} label={s} size="small" onDelete={() => removeSubject(s)} />)}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth size="small" placeholder="VD: IELTS Speaking, TOEIC..."
                    value={form.subjectsInput}
                    onChange={e => setForm(p => ({ ...p, subjectsInput: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                    error={Boolean(errors.subjects)} />
                  <Button size="small" variant="outlined" onClick={addSubject}>Thêm</Button>
                </Box>
                {errors.subjects && <Typography variant="caption" color="error">{errors.subjects}</Typography>}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Giá/giờ (VNĐ)" type="number" required
                  value={form.hourlyRate} onChange={e => setForm(p => ({ ...p, hourlyRate: Number(e.target.value) }))}
                  error={Boolean(errors.hourlyRate)} helperText={errors.hourlyRate} />
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
                  <TextField fullWidth size="small" placeholder="VD: TESOL, IELTS 8.0..."
                    value={form.qualificationsInput}
                    onChange={e => setForm(p => ({ ...p, qualificationsInput: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQualification(); } }} />
                  <Button size="small" variant="outlined" onClick={addQualification}>Thêm</Button>
                </Box>
              </Box>

              <TextField fullWidth size="small" label="Video giới thiệu (URL)"
                value={form.videoIntro} onChange={e => setForm(p => ({ ...p, videoIntro: e.target.value }))} />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={() => navigate('/tutor')}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Đang gửi...' : 'Gửi đăng ký'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
