import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from 'services/api';
import SkillTree from 'components/SkillTree';
import type { RootState } from 'redux/store';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AnimatedProgress } from 'components/Animations';

interface SkillNodeData {
  id: string;
  title: string;
  description: string;
  position: { row: number; col: number };
  dependencies: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  totalLessons: number;
  lessonsCompleted: number;
}

/** Map CEFR level → a numeric range for display progress */
const xpToLevel = (xp: number): number => {
  if (xp < 100) return 1;
  return Math.min(25, Math.floor(xp / 100) + 1);
};

const levelXp = (level: number): number => (level - 1) * 100 + 50;

export default function PathPage() {
  const navigate = useNavigate();
  const { xp, streak, hearts, maxHearts, level: cefrLevel } = useSelector(
    (state: RootState) => state.userInfo,
  );

  const [nodes, setNodes] = useState<SkillNodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const userLevel = xpToLevel(xp);
  const currentLevelXp = levelXp(userLevel);
  const nextLevelXp = levelXp(userLevel + 1);
  const progressPct = Math.min(
    ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100,
    100,
  );

  useEffect(() => {
    const fetchSkillTree = async () => {
      setLoading(true);
      try {
        const res = await api.get('/apis/gamification/skill-tree/');
        setNodes(res.data.nodes || []);
      } catch {
        /* Fallback: use static skill tree data if API unavailable */
        setNodes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillTree();
  }, []);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      navigate(`/materials?skill=${nodeId}`);
    },
    [navigate],
  );

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 2 }}>
      {/* ── Compact top stats bar ── */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          size="small"
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
          onClick={handleBack}
          sx={{ flexShrink: 0, minWidth: 0, p: 0.5 }}
        >
          Home
        </Button>

        {/* Level badge */}
        <Stack alignItems="center" sx={{ flexShrink: 0 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ lineHeight: 1 }}>
            LEVEL
          </Typography>
          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>
            {userLevel}
          </Typography>
        </Stack>

        {/* XP progress */}
        <Stack sx={{ flex: 1 }} spacing={0.3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {xp} XP
            </Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {nextLevelXp} XP
            </Typography>
          </Stack>
          <AnimatedProgress value={progressPct} height={10} />
        </Stack>

        {/* Streak */}
        <Stack alignItems="center" sx={{ flexShrink: 0 }}>
          <LocalFireDepartmentIcon color="warning" sx={{ fontSize: 20 }} />
          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>
            {streak}
          </Typography>
        </Stack>

        {/* Hearts */}
        <Stack alignItems="center" sx={{ flexShrink: 0 }}>
          <FavoriteIcon color="error" sx={{ fontSize: 20 }} />
          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>
            {hearts}/{maxHearts}
          </Typography>
        </Stack>
      </Box>

      {/* ── Skill tree ── */}
      {nodes.length > 0 ? (
        <SkillTree nodes={nodes} onNodeClick={handleNodeClick} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Chưa có lộ trình học
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Bạn cần hoàn thành bài kiểm tra đầu vào để được gợi ý lộ trình.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/placement-test')}
          >
            Làm bài kiểm tra
          </Button>
        </Box>
      )}

      {/* ── Level info footer ── */}
      {cefrLevel && (
        <Box sx={{ textAlign: 'center', mt: 2, px: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Current CEFR Level: <strong>{cefrLevel}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
