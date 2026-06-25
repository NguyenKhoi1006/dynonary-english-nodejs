import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'services/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import VideocamIcon from '@mui/icons-material/Videocam';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LEVEL_META: Record<string, { name: string; color: string }> = {
  A1: { name: 'Beginner', color: '#346538' },
  A2: { name: 'Elementary', color: '#1F6C9F' },
  B1: { name: 'Intermediate', color: '#956400' },
  B2: { name: 'Upper Intermediate', color: '#9F2F2D' },
  C1: { name: 'Advanced', color: '#5E3A8A' },
  C2: { name: 'Proficient', color: '#0A1F2E' },
};

const TYPE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  lesson: { icon: <MenuBookIcon sx={{ fontSize: 18 }} />, label: 'Bài học' },
  exercise: { icon: <AssignmentIcon sx={{ fontSize: 18 }} />, label: 'Bài tập' },
  video: { icon: <VideocamIcon sx={{ fontSize: 18 }} />, label: 'Video' },
  audio: { icon: <HeadphonesIcon sx={{ fontSize: 18 }} />, label: 'Audio' },
  document: { icon: <DescriptionIcon sx={{ fontSize: 18 }} />, label: 'Tài liệu' },
};

interface Material {
  id: string;
  title: string;
  description?: string;
  previewContent?: string;
  level: string;
  type: string;
  estimatedMinutes?: number;
  isPremium?: boolean;
  isLocked?: boolean;
}

function getTypeMeta(type: string) {
  return TYPE_META[type] || { icon: <DescriptionIcon sx={{ fontSize: 18 }} />, label: type };
}

function CourseCard({
  level,
  materials,
  completedIds,
}: {
  level: string;
  materials: Material[];
  completedIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const meta = LEVEL_META[level] || { name: level, color: '#6B7280' };

  const total = materials.length;
  const completed = materials.filter((m) => completedIds.includes(m.id)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: '8px',
        border: '1px solid #E8E5DF',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Course header */}
      <Box
        sx={{
          p: 2.5,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': { backgroundColor: '#F0EDE7' },
        }}
        onClick={() => setOpen(!open)}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Level badge */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${meta.color}15`,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.1rem',
                color: meta.color,
                fontFamily: "'Playfair Display', 'Instrument Serif', serif",
              }}
            >
              {level}
            </Typography>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#0A1F2E' }}>
              Trình độ {level} — {meta.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: '#E8E5DF',
                  '& .MuiLinearProgress-bar': { backgroundColor: meta.color },
                }}
              />
                  <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {completed}/{total} bài
              </Typography>
            </Stack>
          </Box>

          {/* Expand */}
          <IconButton size="small" sx={{ color: '#6B7280' }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Box>

      {/* Lesson list */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ borderTop: '1px solid #E8E5DF' }}>
          {materials.map((m, idx) => {
            const isCompleted = completedIds.includes(m.id);
            const typeMeta = getTypeMeta(m.type);
            return (
              <Box
                key={m.id}
                sx={{
                  px: 2.5,
                  py: 1.8,
                  cursor: m.isLocked ? 'default' : 'pointer',
                  transition: 'background-color 0.15s',
                  '&:hover': { backgroundColor: m.isLocked ? undefined : '#F0EDE7' },
                  borderBottom: idx < materials.length - 1 ? '1px solid #EDE9E3' : 'none',
                  opacity: m.isLocked ? 0.5 : 1,
                }}
                onClick={() => {
                  if (!m.isLocked) navigate(`/materials/${m.id}`);
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {/* Status icon */}
                  <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.isLocked ? (
                      <LockIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    ) : isCompleted ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: meta.color }} />
                    ) : (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid #D1D5DB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9CA3AF' }}>
                          {idx + 1}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.925rem',
                          color: isCompleted ? '#6B7280' : '#0A1F2E',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                        noWrap
                      >
                        {m.title}
                      </Typography>
                      {isCompleted && (
                        <Chip label="Xong" size="small" sx={{ height: 22, fontSize: '0.75rem', backgroundColor: '#EDF3EC', color: '#346538', fontWeight: 600 }} />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.3 }}>
                      <Stack direction="row" spacing={0.3} alignItems="center" sx={{ color: '#6B7280' }}>
                        {typeMeta.icon}
                        <Typography variant="caption" sx={{ fontSize: '0.85rem', color: '#6B7280' }}>
                          {typeMeta.label}
                        </Typography>
                      </Stack>
                      {m.estimatedMinutes && (
                        <Stack direction="row" spacing={0.3} alignItems="center" sx={{ color: '#6B7280' }}>
                          <AccessTimeIcon sx={{ fontSize: 13 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.85rem' }}>
                            {m.estimatedMinutes} phút
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>

                  {/* Action */}
                  {!m.isLocked && !isCompleted && (
          <IconButton size="small" sx={{ color: '#6B7280' }}>
                      <PlayArrowIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Card>
  );
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch materials per level to stay within API pageSize limit
        const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const [levelResults, progRes] = await Promise.all([
          Promise.all(
            LEVELS.map((lvl) =>
              api
                .get('/apis/learner/materials/list', { params: { level: lvl, pageSize: 50 } })
                .then((r) => r.data.materials || [])
                .catch(() => []),
            ),
          ),
          api.get('/apis/learner/progress/').catch(() => null),
        ]);

        const list: Material[] = levelResults.flat();

        // Extract completed material IDs from progress
        const done: string[] = [];
        if (progRes?.data?.levels) {
          Object.values(progRes.data.levels).forEach((lvl: any) => {
            if (lvl.materialsCompleted) done.push(...lvl.materialsCompleted);
          });
        }
        setMaterials(list);
        setCompletedIds(done);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Group by level
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const grouped = levels
    .map((lvl) => ({
      level: lvl,
      materials: materials.filter((m) => m.level === lvl),
    }))
    .filter((g) => g.materials.length > 0);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
        <Skeleton height={40} width="50%" sx={{ mb: 1 }} />
        <Skeleton height={20} width="70%" sx={{ mb: 3 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1.5, borderRadius: '8px' }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
        <SchoolIcon sx={{ fontSize: 28, color: '#0A1F2E' }} />
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', 'Instrument Serif', serif",
            fontWeight: 600,
            fontSize: '1.6rem',
            color: '#0A1F2E',
            letterSpacing: '-0.01em',
          }}
        >
          Khoá học
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 3, fontSize: '0.925rem' }}>
        Chọn trình độ và bắt đầu học theo lộ trình từ A1 đến C2.
      </Typography>

      {/* Course list */}
      {grouped.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <AutoStoriesIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#6B7280', mb: 2 }}>
            Chưa có tài liệu học nào. Vui lòng quay lại sau.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {grouped.map((g) => (
            <CourseCard key={g.level} level={g.level} materials={g.materials} completedIds={completedIds} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
