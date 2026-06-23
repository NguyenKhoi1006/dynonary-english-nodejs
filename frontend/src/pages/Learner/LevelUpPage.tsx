import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'redux/store';
import api from 'services/api';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LevelUpPage() {
  const { level: currentLevel } = useSelector((state: RootState) => state.userInfo);
  const navigate = useNavigate();

  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [taking, setTaking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const nextLevel = currentLevel ? LEVEL_ORDER[LEVEL_ORDER.indexOf(currentLevel as any) + 1] : null;
  const isMaxLevel = !nextLevel;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/apis/learner/tests/list', {
          params: { type: 'level_up', level: currentLevel, pageSize: 50 },
        });
        setTests(res.data.tests || []);
      } catch (err) {
        setError('Could not load level-up tests');
      } finally {
        setLoading(false);
      }
    };
    if (currentLevel) fetch();
  }, [currentLevel]);

  const handleStart = () => {
    if (!selectedTest) return;
    setTaking(true);
    setError('');

    // Simulate taking the test (in production would show question UI)
    api.post('/apis/learner/progress/level-up', { testId: selectedTest })
      .then((res) => {
        setResult(res.data);
        setTaking(false);
      })
      .catch((err) => {
        setError(err.message || 'Level-up failed');
        setTaking(false);
      });
  };

  if (!currentLevel) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Alert severity="info">You need to complete the placement test first.</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.LEARNER.PLACEMENT)}>
          Take Placement Test
        </Button>
      </Box>
    );
  }

  if (isMaxLevel) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 64, color: 'gold', mb: 2 }} />
        <Typography variant="h5" fontWeight={700}>You're at the highest level!</Typography>
        <Typography color="text.secondary">C2 — Proficient. Keep practicing to maintain your skills!</Typography>
      </Box>
    );
  }

  if (result) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Level-Up Result</Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="h2" fontWeight={700} color={result.passed ? 'success.main' : 'error.main'}>
                {result.percentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">{result.score} / {result.totalQuestions} correct</Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
              {result.passed && <Chip label={`Level Up! → ${result.newLevel}`} color="success" />}
              <Chip label={result.passed ? 'PASSED' : 'NOT PASSED'} color={result.passed ? 'success' : 'error'} />
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>{result.message}</Typography>
            <Button variant="contained" onClick={() => navigate(ROUTES.LEARNER.PROGRESS)}>View Progress</Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={1}>Level Up Test</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Current level: <Chip label={currentLevel} color="primary" size="small" />
        &nbsp;→ Next: <Chip label={nextLevel} color="warning" size="small" />
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Skeleton height={200} />
      ) : tests.length === 0 ? (
        <Alert severity="info">No level-up tests available for your level. Contact admin.</Alert>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>Select a Level-Up Test</Typography>
            {tests.map((t) => (
              <Card
                key={t.id}
                sx={{
                  mb: 1, cursor: 'pointer', p: 2,
                  border: selectedTest === t.id ? '2px solid #1976d2' : '1px solid #ddd',
                }}
                onClick={() => setSelectedTest(t.id)}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{t.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.questions?.length || 0} questions · {t.timeLimit} min · Pass: {t.passScore}%
                    </Typography>
                  </Box>
                  <Chip label={t.level} size="small" />
                </Stack>
              </Card>
            ))}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!selectedTest || taking}
              onClick={handleStart}
            >
              {taking ? 'Taking Test...' : 'Start Level-Up Test'}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
