import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from 'services/api';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';

import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExtensionIcon from '@mui/icons-material/Extension';
import LandingPage from 'features/home/LandingPage';

// ─── Feature grid (shown for guests or as supplement tools) ───
import communicateIcon from 'assets/icons/communicate.png';
import dictionaryIcon from 'assets/icons/dictionary.png';
import editIcon from 'assets/icons/edit.png';
import favoriteIcon from 'assets/icons/favorite.png';
import flashcardIcon from 'assets/icons/flashcard.png';
import friendsIcon from 'assets/icons/friends.png';
import gameIcon from 'assets/icons/game.png';
import grammarIcon from 'assets/icons/grammar.png';
import ipaIcon from 'assets/icons/ipa.png';
import toeicIcon from 'assets/icons/toeic.png';
import verbIcon from 'assets/icons/verb.png';
import medalIcon from 'assets/icons/medal.png';
import FeatureBox from 'components/FeatureBox';

const FEATURE_LIST = [
  { title: 'Bảng phiên âm (IPA)', subTitle: 'Luyện nghe, phát âm chuẩn với 44 âm trong bảng phiên âm quốc tế IPA', imgUrl: ipaIcon, to: ROUTES.IPA },
  { title: '1000+ câu giao tiếp', subTitle: 'Luyện nghe, nói câu tiếng Anh giao tiếp hàng ngày cùng Dyno', imgUrl: communicateIcon, to: ROUTES.COMMUNICATION_PHRASE },
  { title: 'Từ vựng với Flashcard', subTitle: 'Flashcard phương pháp học từ vựng nổi tiếng. Nay hoàn toàn miễn phí trên Dynonary', imgUrl: flashcardIcon, to: ROUTES.FLASHCARD },
  { title: 'Từ điển trong Dynonary', subTitle: 'Danh sách từ vựng được phân loại theo cấp độ, loại từ, ...', imgUrl: dictionaryIcon, to: ROUTES.DYNO_DICTIONARY },
  { title: 'Từ vựng TOEIC', subTitle: 'Các từ vựng thường gặp trong đề thi Toeic', imgUrl: toeicIcon, to: ROUTES.TOEIC_DICTIONARY },
  { title: 'Từ vựng yêu thích của bạn', imgUrl: favoriteIcon, subTitle: 'Danh sách những từ vựng yêu thích mà bạn đã lưu', to: ROUTES.FAVORITE },
  { title: 'Động từ bất quy tắc', imgUrl: verbIcon, subTitle: 'Tất cả những động từ bất quy tắc trong tiếng Anh', to: ROUTES.IRREGULAR },
  { title: 'Ngữ pháp', imgUrl: grammarIcon, subTitle: 'Danh sách tổng hợp những cấu trúc câu trong tiếng Anh', to: ROUTES.GRAMMAR },
  { title: 'Play Games', imgUrl: gameIcon, subTitle: 'Ôn luyện kiến thức hiệu quả và đỡ nhàm chán hơn qua việc chơi game cùng Dyno nhé', to: ROUTES.GAMES.HOME },
  { title: 'Bảng xếp hạng', imgUrl: medalIcon, subTitle: 'Cùng xem thành tích của bạn bè và những người khác nhé', to: ROUTES.LEADERBOARD },
  { title: 'Đóng góp', imgUrl: editIcon, subTitle: 'Dyno rất mong được sự đóng góp của bạn. Bạn có thể thêm từ mới, sửa lỗi sai', to: ROUTES.CONTRIBUTION },
];

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_NAMES = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient' };
const LEVEL_COLORS = { A1: '#4caf50', A2: '#8bc34a', B1: '#ff9800', B2: '#ff5722', C1: '#9c27b0', C2: '#e91e63' };

function LevelPath({ levels, currentLevel }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Lộ trình học A1 → C2
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {LEVEL_ORDER.map((lvl, idx) => {
            const data = levels?.[lvl];
            const isCompleted = data?.status === 'completed';
            const isCurrent = lvl === currentLevel;
            const isLocked = data?.status === 'locked' && !isCurrent && !isCompleted;
            const progress = data?.progress || 0;
            const color = LEVEL_COLORS[lvl];

            return (
              <Box key={lvl}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {/* Level badge */}
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                      fontSize: '0.95rem', flexShrink: 0,
                      bgcolor: isCompleted ? color : isCurrent ? `${color}22` : isLocked ? '#f0f0f0' : `${color}15`,
                      color: isCompleted ? '#fff' : isLocked ? '#bbb' : color,
                      border: isCurrent ? `3px solid ${color}` : 'none',
                      boxShadow: isCurrent ? `0 0 0 3px ${color}44` : 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isCompleted ? <CheckCircleIcon fontSize="small" /> : lvl}
                  </Box>

                  {/* Level info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        {lvl} — {LEVEL_NAMES[lvl]}
                      </Typography>
                      <Chip
                        label={isCompleted ? 'Hoàn thành' : isCurrent ? 'Đang học' : isLocked ? 'Khoá' : 'Sẵn sàng'}
                        size="small"
                        color={isCompleted ? 'success' : isCurrent ? 'primary' : 'default'}
                        variant={isLocked ? 'outlined' : 'filled'}
                        sx={{ height: 22, '& .MuiChip-label': { fontSize: '0.85rem', px: 1 } }}
                      />
                    </Stack>
                    {!isLocked && (
                      <LinearProgress
                        variant="determinate"
                        value={isCompleted ? 100 : progress}
                        sx={{ height: 4, borderRadius: 2, mt: 0.5, bgcolor: '#eee' }}
                        color={isCompleted ? 'success' : 'primary'}
                      />
                    )}
                  </Box>
                </Stack>

                {/* Connector line */}
                {idx < LEVEL_ORDER.length - 1 && (
                  <Box sx={{ pl: '24px', ml: '24px', height: 12, borderLeft: '2px dashed', borderColor: isCompleted ? color : '#ddd' }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ContinueLearning({ materials, loading, currentLevel, progress }) {
  const navigate = useNavigate();

  const LEVEL_COLORS = { A1: '#346538', A2: '#1F6C9F', B1: '#956400', B2: '#9F2F2D', C1: '#5E3A8A', C2: '#2F3437' };
  const LEVEL_NAMES_SHORT = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Int.', C1: 'Advanced', C2: 'Proficient' };

  const color = LEVEL_COLORS[currentLevel] || '#2F3437';
  const levelData = progress?.levels?.[currentLevel];
  const total = materials.length;
  const done = levelData?.materialsCompleted?.length || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (loading) {
    return (
      <Card sx={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: 'none' }}>
        <CardContent>
          <Skeleton height={24} width="50%" />
          <Skeleton height={48} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: 'none', backgroundColor: '#FFFFFF' }}>
      <CardContent sx={{ p: 2.5 }}>
        {/* Header with level badge */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: `${color}15`, flexShrink: 0,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem', color, fontFamily: "'Playfair Display', serif" }}>
              {currentLevel}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#2F3437' }}>
              Học tiếp
            </Typography>
            <Typography variant="caption" sx={{ color: '#787774', fontSize: '0.85rem' }}>
              {LEVEL_NAMES_SHORT[currentLevel]} · {done}/{total} bài
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => navigate(ROUTES.LEARNER.MATERIALS)}
            sx={{ color: '#787774', fontSize: '0.85rem', textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto', '&:hover': { backgroundColor: 'transparent', color: '#2F3437' } }}
          >
            Xem tất cả →
          </Button>
        </Stack>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 4, borderRadius: 2, mb: 2,
            backgroundColor: '#EDEDEA',
            '& .MuiLinearProgress-bar': { backgroundColor: color },
          }}
        />

        {/* Lesson list */}
        {materials.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#BBBBBB', textAlign: 'center', py: 3, fontSize: '0.95rem' }}>
            Chưa có bài học nào.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {materials.slice(0, 5).map((m, idx) => {
              const isDone = done > idx;
              return (
                <Box
                  key={m.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.2,
                    borderRadius: '6px', cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    '&:hover': { backgroundColor: '#F7F6F3' },
                  }}
                  onClick={() => navigate(`/materials/${m.id}`)}
                >
                  {/* Number / status */}
                  <Box sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isDone ? (
                      <CheckCircleIcon sx={{ fontSize: 18, color }} />
                    ) : (
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #DDD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#BBB' }}>{idx + 1}</Typography>
                      </Box>
                    )}
                  </Box>
                  {/* Title */}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1, minWidth: 0, fontSize: '0.95rem', fontWeight: 600,
                      color: isDone ? '#787774' : '#2F3437',
                      textDecoration: isDone ? 'line-through' : 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {m.title}
                  </Typography>
                  {/* Time */}
                  {m.estimatedMinutes && (
                    <Typography variant="caption" sx={{ color: '#BBB', fontSize: '0.85rem', flexShrink: 0 }}>
                      {m.estimatedMinutes}p
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function LearnerHome() {
  const navigate = useNavigate();
  const { name, level: currentLevel, xp, isAuth } = useSelector((s) => s.userInfo);
  const [progress, setProgress] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSub = true;
    const fetch = async () => {
      try {
        const [progRes, matRes] = await Promise.all([
          api.get('/apis/learner/progress/'),
          api.get('/apis/learner/materials/list', { params: { level: currentLevel || '', pageSize: 10 } }),
        ]);
        if (!isSub) return;
        setProgress(progRes.data);
        setMaterials(matRes.data.materials || []);
      } catch {
        // silently fail
      } finally {
        if (isSub) setLoading(false);
      }
    };
    if (isAuth) fetch();
    return () => { isSub = false; };
  }, [isAuth, currentLevel]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const levels = progress?.levels || {};
  const totalXp = progress?.totalXp || xp || 0;
  const totalStudyDays = progress?.totalStudyDays || 0;

  const hasLevel = !!currentLevel;
  const completedCount = LEVEL_ORDER.filter((l) => levels[l]?.status === 'completed').length;

  const stats = [
    { icon: <WhatshotIcon sx={{ color: '#ff9800' }} />, value: totalXp, label: 'XP' },
    { icon: <AutoStoriesIcon sx={{ color: '#1976d2' }} />, value: currentLevel || '—', label: 'Cấp độ' },
    { icon: <EmojiEventsIcon sx={{ color: '#4caf50' }} />, value: totalStudyDays, label: 'Ngày học' },
    { icon: <CheckCircleIcon sx={{ color: '#9c27b0' }} />, value: `${completedCount}/${LEVEL_ORDER.length}`, label: 'Cấp đã qua' },
  ];

  return (
    <Box className="container" sx={{ py: { xs: 2, md: 4 } }}>
      {/* ── Hero ── */}
      <Card sx={{ borderRadius: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Chào bạn, {name || 'học viên'} 👋
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.9 }}>
                {hasLevel
                  ? `Đang học ở trình độ ${currentLevel} — ${LEVEL_NAMES[currentLevel]}. Cố lên nhé!`
                  : 'Bạn chưa có trình độ. Hãy làm bài kiểm tra đầu vào để bắt đầu!'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              {!hasLevel ? (
                <Button variant="contained" color="warning" size="large" onClick={() => navigate(ROUTES.LEARNER.PLACEMENT)}>
                  Kiểm tra đầu vào
                </Button>
              ) : (
                <>
                  <Button variant="contained" color="warning" onClick={() => navigate(ROUTES.LEARNER.PROGRESS)}>
                    Lộ trình
                  </Button>
                  <Button variant="outlined" sx={{ color: '#fff', borderColor: '#ffffff88', '&:hover': { borderColor: '#fff', bgcolor: '#ffffff22' } }} onClick={() => navigate(ROUTES.LEARNER.LEVEL_UP)}>
                    Lên cấp
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Stats ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={{ textAlign: 'center', py: 2, borderRadius: 3 }}>
              <Box sx={{ fontSize: 28, mb: 0.5 }}>{s.icon}</Box>
              <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Learning Path ── */}
        <Grid item xs={12} md={6}>
          <LevelPath levels={levels} currentLevel={currentLevel} />
        </Grid>

        {/* ── Continue Learning ── */}
        <Grid item xs={12} md={6}>
          <ContinueLearning materials={materials} loading={loading && !materials.length} currentLevel={currentLevel} progress={progress} />
        </Grid>
      </Grid>

      {/* ── Supplement Tools ── */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          <ExtensionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Công cụ bổ trợ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Các tính năng hỗ trợ việc học tiếng Anh của bạn
        </Typography>
        <Grid container spacing={2}>
          {FEATURE_LIST.map((box, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <FeatureBox imgUrl={box.imgUrl} title={box.title} to={box.to} subTitle={box.subTitle} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function HomePage() {
  const { isAuth, level } = useSelector((s) => s.userInfo);
  if (!isAuth) return <LandingPage mode="guest" />;
  if (!level) return <LandingPage mode="onboarding" />;
  return <LearnerHome />;
}

export default HomePage;
