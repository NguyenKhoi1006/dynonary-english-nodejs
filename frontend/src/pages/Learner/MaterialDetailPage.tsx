import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'services/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import LessonRenderer from 'features/lessons/LessonRenderer';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface Material {
  id: string;
  title: string;
  level: string;
  type: string;
  estimatedMinutes?: number;
  isPremium?: boolean;
  isLocked?: boolean;
  content?: string;
  description?: string;
}

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<Material | null>(null);
  const [siblings, setSiblings] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  // ─── Fetch material + siblings for prev/next nav ───
  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setCompleted(false);
    setProgressPct(0);
    try {
      const matRes = await api.get(`/apis/learner/materials/${id}`);
      const mat: Material = matRes.data;
      setMaterial(mat);

      // Fetch same-level materials for navigation
      const [listRes, progRes] = await Promise.all([
        api
          .get('/apis/learner/materials/list', { params: { level: mat.level, pageSize: 50 } })
          .catch(() => null),
        api.get('/apis/learner/progress/').catch(() => null),
      ]);

      if (listRes) {
        const all: Material[] = listRes.data.materials || [];
        setSiblings(all.filter((m: Material) => !m.isLocked));
      }

      // Check completion
      if (progRes?.data?.levels) {
        const done: string[] = [];
        Object.values(progRes.data.levels).forEach((lvl: any) => {
          if (lvl.materialsCompleted) done.push(...lvl.materialsCompleted);
        });
        setCompleted(done.includes(id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Track scroll progress ───
  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = document.getElementById('material-content');
      if (!scrollEl) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) {
        setProgressPct(100);
        return;
      }
      setProgressPct(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
    };

    const scrollEl = document.getElementById('material-content');
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      // Initial check
      setTimeout(handleScroll, 100);
    }
    return () => scrollEl?.removeEventListener('scroll', handleScroll);
  }, [material]);

  // ─── Mark as completed ───
  const handleMarkComplete = async () => {
    if (!material || completed) return;
    try {
      await api.post('/apis/learner/progress/', {
        materialId: material.id,
        action: 'complete',
      });
      setCompleted(true);
    } catch {
      // Silently fail — local state still toggles for UX
      setCompleted(true);
    }
  };

  // ─── Navigation ───
  const currentIdx = siblings.findIndex((m) => m.id === id);
  const prevMaterial = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextMaterial = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  const goTo = (matId: string) => {
    navigate(`/materials/${matId}`, { replace: false });
  };

  const levelMeta: Record<string, { name: string; color: string }> = {
    A1: { name: 'Beginner', color: '#346538' },
    A2: { name: 'Elementary', color: '#1F6C9F' },
    B1: { name: 'Intermediate', color: '#956400' },
    B2: { name: 'Upper Intermediate', color: '#9F2F2D' },
    C1: { name: 'Advanced', color: '#5E3A8A' },
    C2: { name: 'Proficient', color: '#2F3437' },
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 760, mx: 'auto' }}>
        <Skeleton height={16} width="30%" sx={{ mb: 2 }} />
        <Skeleton height={32} width="70%" sx={{ mb: 1 }} />
        <Skeleton height={16} width="40%" sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '8px' }} />
      </Box>
    );
  }

  if (!material) {
    return (
      <Box sx={{ p: 4, maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
        <Typography color="#787774">Không tìm thấy tài liệu.</Typography>
        <Button onClick={() => navigate('/materials')} sx={{ mt: 2 }}>Quay lại khoá học</Button>
      </Box>
    );
  }

  const meta = levelMeta[material.level] || { name: material.level, color: '#787774' };

  return (
    <Box sx={{ p: { xs: 0, md: 4 }, maxWidth: 760, mx: 'auto' }}>
      {/* ── Top navigation bar ── */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: { xs: 2, md: 0 },
          pt: { xs: 1.5, md: 0 },
          pb: { xs: 1, md: 2 },
          borderBottom: { xs: '1px solid #EAEAEA', md: 'none' },
          mb: { xs: 1.5, md: 2 },
        }}
      >
        <IconButton size="small" onClick={() => navigate('/materials')} sx={{ color: '#787774' }}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SchoolIcon sx={{ fontSize: 16, color: meta.color }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: meta.color, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {material.level} — {meta.name}
            </Typography>
            {material.estimatedMinutes && (
              <Typography variant="caption" sx={{ color: '#BBBBBB', fontSize: '0.85rem' }}>
                · {material.estimatedMinutes} phút
              </Typography>
            )}
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#2F3437',
              mt: 0.2,
              lineHeight: 1.3,
            }}
            noWrap
          >
            {material.title}
          </Typography>
        </Box>

        {/* Completed badge */}
        {completed && <CheckCircleIcon sx={{ fontSize: 22, color: '#346538' }} />}
      </Stack>

      {/* ── Reading progress (thin bar) ── */}
      <LinearProgress
        variant="determinate"
        value={progressPct}
        sx={{
          height: 2,
          backgroundColor: '#EDEDEA',
          '& .MuiLinearProgress-bar': { backgroundColor: '#2F3437' },
          mb: 0,
          borderRadius: 0,
        }}
      />

      {/* ── Content area (interactive lesson) ── */}
      <Box
        id="material-content"
        sx={{
          px: { xs: 2, md: 0 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 10, md: 6 },
          maxHeight: { xs: 'calc(100vh - 240px)', md: 'none' },
          overflowY: { xs: 'auto', md: 'visible' },
        }}
      >
        <LessonRenderer content={material.content || ''} />
      </Box>

      {/* ── Bottom action bar ── */}
      <Box
        sx={{
          position: { xs: 'fixed', md: 'static' },
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EAEAEA',
          px: { xs: 2, md: 0 },
          py: { xs: 1.5, md: 2 },
          zIndex: 100,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Previous */}
          <IconButton
            size="small"
            disabled={!prevMaterial}
            onClick={() => prevMaterial && goTo(prevMaterial.id)}
            sx={{ color: prevMaterial ? '#2F3437' : '#CCCCCC' }}
          >
            <ArrowBackIosIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Position indicator */}
          <Typography variant="caption" sx={{ color: '#BBBBBB', fontWeight: 600, minWidth: 60, textAlign: 'center' }}>
            {currentIdx >= 0 ? `${currentIdx + 1}/${siblings.length}` : ''}
          </Typography>

          {/* Next */}
          <IconButton
            size="small"
            disabled={!nextMaterial}
            onClick={() => nextMaterial && goTo(nextMaterial.id)}
            sx={{ color: nextMaterial ? '#2F3437' : '#CCCCCC' }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* Mark complete */}
          <Button
            variant={completed ? 'text' : 'contained'}
            size="small"
            startIcon={completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
            onClick={handleMarkComplete}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 700,
fontSize: '0.95rem',
              backgroundColor: completed ? 'transparent' : '#2F3437',
              color: completed ? '#346538' : '#FFFFFF',
              '&:hover': {
                backgroundColor: completed ? 'transparent' : '#1a1d1f',
              },
              px: 2,
              py: 0.8,
            }}
          >
            {completed ? 'Đã hoàn thành' : 'Hoàn thành'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
