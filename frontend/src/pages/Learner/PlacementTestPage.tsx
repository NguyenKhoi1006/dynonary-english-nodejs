import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'redux/store';
import api from 'services/api';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

// Cambridge CEFR level colors and labels
const CEFR_META: Record<string, { label: string; color: 'success' | 'info' | 'primary' | 'warning' | 'error' | 'secondary'; score: number }> = {
  A1: { label: 'Beginner', color: 'error', score: 1 },
  A2: { label: 'Elementary', color: 'warning', score: 2 },
  B1: { label: 'Intermediate', color: 'info', score: 3 },
  B2: { label: 'Upper Intermediate', color: 'primary', score: 4 },
  C1: { label: 'Advanced', color: 'success', score: 5 },
  C2: { label: 'Proficient', color: 'secondary', score: 6 },
};

const SECTION_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  listening: 'Listening',
};

export default function PlacementTestPage() {
  const { level } = useSelector((state: RootState) => state.userInfo);
  const navigate = useNavigate();

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);

  // If user already has a level, redirect
  useEffect(() => {
    if (level) {
      navigate(ROUTES.LEARNER.MATERIALS, { replace: true });
    }
  }, [level, navigate]);

  // Fetch test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get('/apis/learner/placement/test', { params: { type: 'initial' } });
        setTest(res.data);
        setTimeLeft(res.data.timeLimit * 60);
      } catch (err: any) {
        setError(err.message || 'No placement test available');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  // Timer
  useEffect(() => {
    if (!started || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, result]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, selectedIndex: number) => {
    setAnswers({ ...answers, [questionId]: selectedIndex });
  };

  const handleSubmit = async () => {
    if (!test) return;
    setSubmitting(true);
    try {
      const payload = {
        testId: test.id,
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex,
        })),
      };
      const res = await api.post('/apis/learner/placement/submit', payload);
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading placement test...</Typography></Box>;
  if (error) return <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}><Alert severity="error">{error}</Alert></Box>;

  // ─── RESULT SCREEN ───
  if (result) {
    const meta = CEFR_META[result.resultLevel] || CEFR_META.A1;
    const sections = result.sectionBreakdown || {};
    const sectionKeys = Object.keys(sections).filter((k) => sections[k].total > 0);

    return (
      <Box sx={{ p: 4, maxWidth: 680, mx: 'auto' }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
              Bài kiểm tra đánh giá trình độ
            </Typography>

            {/* Overall Score */}
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Typography variant="h2" fontWeight={700} color={result.passed ? 'success.main' : 'error.main'}>
                {result.percentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {result.score} / {result.totalQuestions} câu đúng
              </Typography>
            </Box>

            {/* CEFR Level Display */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Chip
                label={`${result.resultLevel} – ${meta.label}`}
                color={meta.color}
                variant="filled"
                sx={{ fontSize: '1.1rem', fontWeight: 700, px: 2, py: 2.5, borderRadius: 2 }}
              />
            </Box>

            {/* Pass/Fail */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Chip
                label={result.passed ? 'ĐẠT – Xếp trình độ thành công' : 'CHƯA ĐẠT – Cần cố gắng thêm'}
                color={result.passed ? 'success' : 'error'}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Cambridge Can-Do Description */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Trình độ {result.resultLevel} – Bạn có thể:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              {result.canDoVi || result.canDo}
            </Typography>

            {/* Section Breakdown */}
            {sectionKeys.length > 0 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  📊 Chi tiết theo kỹ năng
                </Typography>
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {sectionKeys.map((sec) => {
                    const s = sections[sec];
                    const pct = s.percentage || 0;
                    return (
                      <Grid xs={6} sm={3} key={sec}>
                        <Card variant="outlined" sx={{ textAlign: 'center', py: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {SECTION_LABELS[sec] || sec}
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {pct}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.correct}/{s.total}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{ mt: 0.5, mx: 1, height: 4, borderRadius: 2 }}
                            color={pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'error'}
                          />
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}

            {/* CEFR Scale Reference */}
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              📈 Thang đo Cambridge CEFR
            </Typography>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                const m = CEFR_META[lvl];
                const isCurrent = lvl === result.resultLevel;
                const isBelow = LEVEL_ORDER[lvl] < LEVEL_ORDER[result.resultLevel];
                return (
                  <Box
                    key={lvl}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      opacity: isCurrent ? 1 : isBelow ? 0.6 : 0.35,
                    }}
                  >
                    <Chip
                      label={lvl}
                      size="small"
                      color={isCurrent ? m.color : 'default'}
                      variant={isCurrent ? 'filled' : 'outlined'}
                    />
                    <Typography variant="body2" fontWeight={isCurrent ? 700 : 400}>
                      {m.label}
                    </Typography>
                    {isCurrent && (
                      <Chip label="Trình độ của bạn" size="small" color={m.color} variant="outlined" sx={{ ml: 'auto' }} />
                    )}
                  </Box>
                );
              })}
            </Stack>

            {/* Action */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(result.passed ? ROUTES.LEARNER.MATERIALS : ROUTES.HOME)}
              >
                {result.passed ? 'Bắt đầu học ngay' : 'Về trang chủ'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ─── NO TEST ───
  if (!test) return <Box sx={{ p: 4, textAlign: 'center' }}><Alert severity="info">Chưa có bài kiểm tra đầu vào. Vui lòng liên hệ admin.</Alert></Box>;

  // ─── START SCREEN ───
  if (!started) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>{test.title}</Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>{test.description}</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {test.questions?.length || 0} câu hỏi · {test.timeLimit} phút
            </Typography>
            <Button variant="contained" size="large" onClick={() => setStarted(true)}>
              Bắt đầu làm bài
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ─── TEST IN PROGRESS ───
  const questions = test.questions || [];
  const q = questions[currentQ];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Câu {currentQ + 1} / {questions.length}
        </Typography>
        <Typography variant="body2" fontWeight={600} color={timeLeft < 60 ? 'error.main' : 'text.primary'}>
          {formatTime(timeLeft)}
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 6, borderRadius: 3 }} />

      {q && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {q.questionText}
            </Typography>
            <Chip label={q.type} size="small" sx={{ mb: 2 }} />
            <RadioGroup value={answers[q.id] ?? -1} onChange={(e) => handleAnswer(q.id, Number(e.target.value))}>
              {q.options.map((opt: string, oi: number) => (
                <FormControlLabel
                  key={oi}
                  value={oi}
                  control={<Radio />}
                  label={opt}
                  sx={{ mb: 0.5, '& .MuiFormControlLabel-label': { width: '100%' } }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button disabled={currentQ === 0} onClick={() => setCurrentQ((i) => i - 1)}>Previous</Button>
        <Stack direction="row" spacing={1}>
          {currentQ < questions.length - 1 ? (
            <Button variant="contained" onClick={() => setCurrentQ((i) => i + 1)}>Next</Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
