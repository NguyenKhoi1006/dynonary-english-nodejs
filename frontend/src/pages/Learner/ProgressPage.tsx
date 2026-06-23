import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'redux/store';
import api from 'services/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const LEVEL_NAMES: Record<string, string> = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient' };

export default function ProgressPage() {
  const { level: currentLevel, xp, name } = useSelector((state: RootState) => state.userInfo);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/apis/learner/progress/');
        setProgress(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}><Skeleton height={40} /><Skeleton height={200} /></Box>;

  const levels = progress?.levels || {};

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={1}>My Progress</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Track your learning journey, {name}!
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <WhatshotIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>{xp || 0}</Typography>
            <Typography variant="caption" color="text.secondary">Total XP</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <AutoStoriesIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>{currentLevel || '—'}</Typography>
            <Typography variant="caption" color="text.secondary">Current Level</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <EmojiEventsIcon color="success" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>{progress?.totalStudyDays || 0}</Typography>
            <Typography variant="caption" color="text.secondary">Study Days</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h5" fontWeight={700}>{Object.keys(levels).length}</Typography>
            <Typography variant="caption" color="text.secondary">Levels Unlocked</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Level Progress */}
      <Typography variant="h6" fontWeight={600} mb={2}>CEFR Level Progress</Typography>
      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
        const lvlData = levels[lvl];
        if (!lvlData) return null;
        const isLocked = lvlData.status === 'locked';
        const isCompleted = lvlData.status === 'completed';
        const isCurrent = lvl === currentLevel;

        return (
          <Card
            key={lvl}
            sx={{
              mb: 1.5,
              opacity: isLocked ? 0.5 : 1,
              border: isCurrent ? '2px solid' : 'none',
              borderColor: isCurrent ? 'primary.main' : 'transparent',
            }}
          >
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" fontWeight={600}>{lvl}</Typography>
                  <Typography variant="caption" color="text.secondary">{LEVEL_NAMES[lvl]}</Typography>
                </Stack>
                <Chip
                  label={isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isLocked ? 'Locked' : 'Available'}
                  size="small"
                  color={isCompleted ? 'success' : isCurrent ? 'primary' : 'default'}
                  variant={isLocked ? 'outlined' : 'filled'}
                />
              </Stack>
              {!isLocked && (
                <LinearProgress
                  variant="determinate"
                  value={lvlData.progress || 0}
                  sx={{ height: 6, borderRadius: 3 }}
                  color={isCompleted ? 'success' : 'primary'}
                />
              )}
              {!isLocked && (
                <Typography variant="caption" color="text.secondary">
                  {lvlData.materialsCompleted?.length || 0} materials completed
                  {lvlData.levelUpAttempts > 0 ? ` · ${lvlData.levelUpAttempts} level-up attempts` : ''}
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
