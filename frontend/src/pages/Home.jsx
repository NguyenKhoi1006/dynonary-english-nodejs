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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExtensionIcon from '@mui/icons-material/Extension';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import LandingPage from 'features/home/LandingPage';
import { tokens } from 'shared/configs/theme';

// ─── Feature grid (supplement tools) ───
import communicateIcon from 'assets/icons/communicate.png';
import dictionaryIcon from 'assets/icons/dictionary.png';
import editIcon from 'assets/icons/edit.png';
import favoriteIcon from 'assets/icons/favorite.png';
import flashcardIcon from 'assets/icons/flashcard.png';
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
const LEVEL_COLORS = { A1: tokens.emerald, A2: tokens.info, B1: tokens.warning, B2: tokens.coral, C1: '#7C3AED', C2: tokens.navy };

// ─── Level Path ───
function LevelPath({ levels, currentLevel }) {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'visible' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
          <SchoolIcon sx={{ fontSize: 22, color: tokens.navy }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.5rem' }}>
            Lộ trình học A1 → C2
          </Typography>
        </Stack>

        <Stack spacing={1.8}>
          {LEVEL_ORDER.map((lvl, idx) => {
            const data = levels?.[lvl];
            const isCompleted = data?.status === 'completed';
            const isCurrent = lvl === currentLevel;
            const isLocked = data?.status === 'locked' && !isCurrent && !isCompleted;
            const progress = data?.progress || 0;
            const color = LEVEL_COLORS[lvl];

            return (
              <Box key={lvl}>
                <Stack direction="row" spacing={1.5} alignItems="stretch">
                  {/* Timeline dot */}
                  <Stack alignItems="center" sx={{ width: 40, flexShrink: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        bgcolor: isCompleted ? color : isCurrent ? `${color}18` : tokens.cloud,
                        color: isCompleted ? tokens.white : isLocked ? tokens.iron : color,
                        border: isCurrent ? `2.5px solid ${color}` : 'none',
                        boxShadow: isCurrent ? `0 0 0 4px ${color}25` : 'none',
                        transition: 'all 0.3s',
                      }}
                    >
                      {isCompleted ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : lvl}
                    </Box>
                    {/* Connector */}
                    {idx < LEVEL_ORDER.length - 1 && (
                      <Box
                        sx={{
                          flex: 1,
                          width: 2,
                          minHeight: 16,
                          bgcolor: isCompleted ? color : tokens.bone,
                        }}
                      />
                    )}
                  </Stack>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0, pb: idx < LEVEL_ORDER.length - 1 ? 0.5 : 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.3 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: '1.25rem', color: tokens.charcoal }}>
                        {lvl} — {LEVEL_NAMES[lvl]}
                      </Typography>
                      <Chip
                        label={isCompleted ? 'Hoàn thành' : isCurrent ? 'Đang học' : isLocked ? 'Khoá' : 'Sẵn sàng'}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          bgcolor: isCompleted ? `${color}18` : isCurrent ? `${color}15` : tokens.cloud,
                          color: isCompleted ? color : isCurrent ? color : tokens.stone,
                          borderRadius: 1,
                        }}
                      />
                    </Stack>
                    {!isLocked && (
                      <LinearProgress
                        variant="determinate"
                        value={isCompleted ? 100 : progress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: tokens.bone,
                          '& .MuiLinearProgress-bar': { bgcolor: color },
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Continue Learning ───
function ContinueLearning({ materials, loading, currentLevel, progress }) {
  const navigate = useNavigate();

  const mapColor = { A1: tokens.emerald, A2: tokens.info, B1: tokens.warning, B2: tokens.coral, C1: '#7C3AED', C2: tokens.navy };
  const mapName = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Int.', C1: 'Advanced', C2: 'Proficient' };

  const color = mapColor[currentLevel] || tokens.navy;
  const levelData = progress?.levels?.[currentLevel];
  const total = materials.length;
  const done = levelData?.materialsCompleted?.length || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton height={24} width="50%" />
          <Skeleton height={48} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}15`,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, fontSize: '0.9rem', color, fontFamily: "'Playfair Display', serif" }}
            >
              {currentLevel}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '1.3rem', color: tokens.charcoal }}>
                  Học tiếp
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '1rem', color: tokens.stone }}>
                  {mapName[currentLevel]} · {done}/{total} bài
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => navigate(ROUTES.LEARNER.MATERIALS)}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{ color: tokens.stone, fontSize: '1.05rem', fontWeight: 600, textTransform: 'none', p: 0.6, minWidth: 'auto', '&:hover': { color: tokens.charcoal, bgcolor: 'transparent' } }}
              >
                Xem tất cả
              </Button>
            </Stack>
          </Box>
        </Stack>

        {/* Progress */}
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 5,
            borderRadius: 3,
            mb: 2.5,
            bgcolor: tokens.bone,
            '& .MuiLinearProgress-bar': { bgcolor: color },
          }}
        />

        {/* Lessons */}
        {materials.length === 0 ? (
          <Typography variant="body2" sx={{ color: tokens.iron, textAlign: 'center', py: 4, fontSize: '1.1rem' }}>
            Chưa có bài học nào.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {materials.slice(0, 5).map((m, idx) => {
              const isDone = done > idx;
              return (
                <Box
                  key={m.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 1.5, py: 1.2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { backgroundColor: tokens.cloud },
                  }}
                  onClick={() => navigate(`/materials/${m.id}`)}
                >
                  {/* Status */}
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      bgcolor: isDone ? `${color}18` : tokens.cloud,
                      color: isDone ? color : tokens.iron,
                    }}
                  >
                    {isDone ? (
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{idx + 1}</Typography>
                    )}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1, minWidth: 0, fontSize: '1.15rem', fontWeight: 600,
                      color: isDone ? tokens.stone : tokens.charcoal,
                      textDecoration: isDone ? 'line-through' : 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {m.title}
                  </Typography>

                  {m.estimatedMinutes && (
                    <Typography variant="caption" sx={{ color: tokens.iron, fontSize: '1rem', flexShrink: 0 }}>
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

// ─── Learner Home ───
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
        <CircularProgress sx={{ color: tokens.navy }} />
      </Box>
    );
  }

  const levels = progress?.levels || {};
  const totalXp = progress?.totalXp || xp || 0;
  const totalStudyDays = progress?.totalStudyDays || 0;
  const hasLevel = !!currentLevel;
  const completedCount = LEVEL_ORDER.filter((l) => levels[l]?.status === 'completed').length;

  const stats = [
    { icon: <TrendingUpIcon />, value: totalXp, label: 'XP', color: tokens.xp, bg: tokens.xpLight },
    { icon: <SchoolIcon />, value: currentLevel || '—', label: 'Cấp độ', color: tokens.navy, bg: `${tokens.navy}12` },
    { icon: <WhatshotIcon />, value: totalStudyDays, label: 'Ngày học', color: tokens.streak, bg: `${tokens.streak}18` },
    { icon: <CheckCircleIcon />, value: `${completedCount}/${LEVEL_ORDER.length}`, label: 'Cấp đã qua', color: tokens.emerald, bg: tokens.emeraldLight },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      {/* ── Hero ── */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3.5,
          background: `linear-gradient(135deg, ${tokens.navy} 0%, ${tokens.navyLight} 100%)`,
          color: tokens.white,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${tokens.gold}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -30, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${tokens.coral}10 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2.5}>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Playfair Display', serif", color: tokens.white, fontSize: { xs: '2rem', md: '2.4rem' } }}>
                Chào bạn, {name || 'học viên'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.8, color: tokens.white, fontSize: '1.3rem' }}>
                {hasLevel
                  ? `Đang học trình độ ${currentLevel} — ${LEVEL_NAMES[currentLevel]}`
                  : 'Bạn chưa có trình độ. Hãy làm bài kiểm tra đầu vào!'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexShrink={0}>
              {!hasLevel ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(ROUTES.LEARNER.PLACEMENT)}
                  sx={{
                    backgroundColor: tokens.gold,
                    color: tokens.navyDark,
                    fontWeight: 700,
                    px: 3.5,
                    '&:hover': { backgroundColor: tokens.goldDark },
                  }}
                >
                  Kiểm tra đầu vào
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={() => navigate(ROUTES.LEARNER.MATERIALS)}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: tokens.white, backdropFilter: 'blur(4px)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' } }}
                    startIcon={<MenuBookIcon />}
                  >
                    Bài học
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.LEARNER.PROGRESS)}
                    sx={{ borderColor: 'rgba(255,255,255,0.3)', color: tokens.white, '&:hover': { borderColor: tokens.white, backgroundColor: 'rgba(255,255,255,0.08)' } }}
                    startIcon={<TrendingUpIcon />}
                  >
                    Lộ trình
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Stats Grid ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3.5,
        }}
      >
        {stats.map((s) => (
          <Card key={s.label} sx={{ borderRadius: 2.5, textAlign: 'center', py: 2.5, '&:hover': { transform: 'none' } }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1,
                backgroundColor: s.bg,
                color: s.color,
                fontSize: 22,
              }}
            >
              {s.icon}
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: '1.8rem', color: tokens.charcoal }}>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '1rem', color: tokens.stone, fontWeight: 500 }}>
              {s.label}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* ── Main Grid: Path + Continue ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 5,
        }}
      >
        <LevelPath levels={levels} currentLevel={currentLevel} />
        <ContinueLearning
          materials={materials}
          loading={loading && !materials.length}
          currentLevel={currentLevel}
          progress={progress}
        />
      </Box>

      {/* ── Supplement Tools ── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <ExtensionIcon sx={{ fontSize: 22, color: tokens.coral }} />
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: '1.6rem', color: tokens.charcoal }}>
            Công cụ bổ trợ
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: tokens.stone, mb: 2.5, ml: { xs: 0, md: 4 } }}>
          Các tính năng hỗ trợ việc học tiếng Anh của bạn
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {FEATURE_LIST.map((box, index) => (
            <FeatureBox key={index} imgUrl={box.imgUrl} title={box.title} to={box.to} subTitle={box.subTitle} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

function HomePage() {
  const { isAuth, level } = useSelector((s) => s.userInfo);
  if (!isAuth) return <LandingPage mode="guest" />;
  if (!level) return <LandingPage mode="onboarding" />;
  return <LearnerHome />;
}

export default HomePage;
