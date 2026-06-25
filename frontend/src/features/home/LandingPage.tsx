import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from 'redux/store';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { tokens } from 'shared/configs/theme';

import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// ─── Feature grid icons ───
import communicateIcon from 'assets/icons/communicate.png';
import dictionaryIcon from 'assets/icons/dictionary.png';
import flashcardIcon from 'assets/icons/flashcard.png';
import gameIcon from 'assets/icons/game.png';
import ipaIcon from 'assets/icons/ipa.png';
import grammarIcon from 'assets/icons/grammar.png';
import verbIcon from 'assets/icons/verb.png';
import toeicIcon from 'assets/icons/toeic.png';
import editIcon from 'assets/icons/edit.png';
import medalIcon from 'assets/icons/medal.png';
import favoriteIcon from 'assets/icons/favorite.png';

const FEATURE_LIST = [
  { title: 'Bảng phiên âm IPA', desc: 'Luyện nghe, phát âm chuẩn với 44 âm trong bảng phiên âm quốc tế IPA', icon: ipaIcon, to: ROUTES.IPA },
  { title: '1000+ câu giao tiếp', desc: 'Luyện nghe, nói câu tiếng Anh giao tiếp hàng ngày cùng Dyno', icon: communicateIcon, to: ROUTES.COMMUNICATION_PHRASE },
  { title: 'Flashcard thông minh', desc: 'Học từ vựng với phương pháp Flashcard nổi tiếng. Hoàn toàn miễn phí', icon: flashcardIcon, to: ROUTES.FLASHCARD },
  { title: 'Từ điển thông minh', desc: 'Danh sách từ vựng phân loại theo cấp độ, loại từ, chủ đề', icon: dictionaryIcon, to: ROUTES.DYNO_DICTIONARY },
  { title: 'Từ vựng TOEIC', desc: 'Các từ vựng thường gặp trong đề thi TOEIC', icon: toeicIcon, to: ROUTES.TOEIC_DICTIONARY },
  { title: 'Từ vựng yêu thích', desc: 'Danh sách từ vựng yêu thích bạn đã lưu lại', icon: favoriteIcon, to: ROUTES.FAVORITE },
  { title: 'Động từ bất quy tắc', desc: 'Tất cả động từ bất quy tắc trong tiếng Anh', icon: verbIcon, to: ROUTES.IRREGULAR },
  { title: 'Ngữ pháp', desc: 'Tổng hợp cấu trúc câu trong tiếng Anh', icon: grammarIcon, to: ROUTES.GRAMMAR },
  { title: 'Play Games', desc: 'Ôn luyện kiến thức qua trò chơi cùng Dyno', icon: gameIcon, to: ROUTES.GAMES.HOME },
  { title: 'Bảng xếp hạng', desc: 'Cùng xem thành tích của bạn bè', icon: medalIcon, to: ROUTES.LEADERBOARD },
  { title: 'Đóng góp', desc: 'Thêm từ mới, sửa lỗi sai, đóng góp cho cộng đồng', icon: editIcon, to: ROUTES.CONTRIBUTION },
];

type LandingMode = 'guest' | 'onboarding';

interface LandingPageProps {
  mode: LandingMode;
}

function LandingPage({ mode }: LandingPageProps) {
  const navigate = useNavigate();
  const { name } = useSelector((s: RootState) => s.userInfo);
  const isGuest = mode === 'guest';

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* ════════════════════════════════════════
          Hero Section
          ════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(165deg, ${tokens.navyDark} 0%, ${tokens.navy} 45%, ${tokens.navyLight} 100%)`,
          color: tokens.white,
        }}
      >
        {/* Subtle decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${tokens.gold}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${tokens.coral}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
              pt: { xs: 12, md: 16 },
              pb: { xs: 10, md: 14 },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.6,
                py: 0.6,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(4px)',
                mb: 3,
              }}
            >
              <SchoolIcon sx={{ fontSize: 14, mr: 0.6, color: tokens.gold }} />
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: tokens.goldLight,
                  letterSpacing: '0.02em',
                }}
              >
                Nền tảng học tiếng Anh trực tuyến
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              component="h1"
              sx={{
                fontFamily: "'Playfair Display', 'Instrument Serif', serif",
                fontWeight: 700,
                fontSize: { xs: '3.6rem', md: '5.6rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: tokens.white,
                mb: 2.5,
                maxWidth: 900,
                mx: 'auto',
              }}
            >
              {isGuest ? (
                'Học tiếng Anh cùng Dynonary'
              ) : (
                <>Chào mừng {name || 'bạn'} đến với Dynonary</>
              )}
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.7)',
                mb: 4.5,
                maxWidth: 680,
                mx: 'auto',
              }}
            >
              {isGuest
                ? 'Lộ trình chuẩn Cambridge từ A1 đến C2. Bài kiểm tra đầu vào thông minh, bài học cá nhân hóa hoàn toàn miễn phí.'
                : 'Để bắt đầu, bạn cần hoàn thành bài kiểm tra đầu vào. Chỉ mất 15 phút, chúng tôi sẽ xác định trình độ và gợi ý lộ trình phù hợp nhất.'}
            </Typography>

            {/* CTA */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              {isGuest ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    sx={{
                      backgroundColor: tokens.gold,
                      color: tokens.navyDark,
                      fontWeight: 700,
                      fontSize: '1.4rem',
                      px: 5,
                      py: 1.6,
                      '&:hover': {
                        backgroundColor: tokens.goldDark,
                      },
                    }}
                  >
                    Bắt đầu học miễn phí
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: tokens.white,
                      fontWeight: 600,
                      fontSize: '1.4rem',
                      px: 5,
                      py: 1.6,
                      '&:hover': {
                        borderColor: tokens.white,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(ROUTES.LEARNER.PLACEMENT)}
                    sx={{
                      backgroundColor: tokens.gold,
                      color: tokens.navyDark,
                      fontWeight: 700,
                      fontSize: '1.4rem',
                      px: 5,
                      py: 1.6,
                      '&:hover': {
                        backgroundColor: tokens.goldDark,
                      },
                    }}
                  >
                    Làm bài kiểm tra đầu vào
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(ROUTES.LEARNER.PATH)}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: tokens.white,
                      fontWeight: 600,
                      fontSize: '1.4rem',
                      px: 5,
                      py: 1.6,
                      '&:hover': {
                        borderColor: tokens.white,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Khám phá lộ trình
                  </Button>
                </>
              )}
            </Stack>

            {/* Stats row */}
            <Stack
              direction="row"
              spacing={{ xs: 3, md: 6 }}
              justifyContent="center"
              sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              {[
                { value: 'A1 → C2', label: 'Lộ trình chuẩn' },
                { value: '1000+', label: 'Từ vựng & câu' },
                { value: 'Hoàn toàn', label: 'Miễn phí' },
              ].map((s) => (
                <Box key={s.label} sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: tokens.gold,
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', mt: 0.3 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════
          Value Props
          ════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 4,
              height: 24,
              borderRadius: 2,
              backgroundColor: tokens.gold,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 600,
              color: tokens.charcoal,
            }}
          >
            Tại sao chọn Dynonary?
          </Typography>
        </Stack>
        <Typography
          sx={{ color: tokens.stone, fontSize: '1.3rem', mb: 4, ml: { xs: 0, md: 5.5 } }}
        >
          {isGuest
            ? 'Phương pháp học hiện đại, lộ trình cá nhân hóa — hoàn toàn miễn phí.'
            : 'Học đúng trình độ, theo dõi tiến bộ, không lãng phí thời gian.'}
        </Typography>

        <Stack spacing={2.5}>
          {[
            {
              icon: <SchoolIcon sx={{ fontSize: 28 }} />,
              title: 'Lộ trình cá nhân hóa',
              desc: isGuest
                ? 'Bài kiểm tra đầu vào thông minh đánh giá chính xác trình độ, xây dựng lộ trình học phù hợp từ A1 đến C2.'
                : 'Bài kiểm tra sẽ đánh giá chính xác trình độ hiện tại, từ đó gợi ý lộ trình học phù hợp.',
              color: tokens.navy,
              bgColor: `${tokens.navy}10`,
            },
            {
              icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
              title: isGuest ? 'Học mọi lúc mọi nơi' : 'Tiết kiệm thời gian',
              desc: isGuest
                ? 'Tăng vốn từ vựng, câu giao tiếp, ngữ pháp qua bài tập tương tác, flashcard và trò chơi.'
                : 'Không học lại những gì bạn đã biết. Bắt đầu đúng trình độ, tránh lãng phí thời gian.',
              color: tokens.emerald,
              bgColor: `${tokens.emerald}10`,
            },
            {
              icon: <AutoStoriesIcon sx={{ fontSize: 28 }} />,
              title: isGuest ? 'Nội dung phong phú' : 'Mục tiêu rõ ràng',
              desc: isGuest
                ? 'Từ IPA, ngữ pháp, giao tiếp đến luyện thi. Tất cả miễn phí, không giới hạn.'
                : 'Biết điểm mạnh, điểm yếu ở từng kỹ năng. Theo dõi sự tiến bộ qua từng cấp độ.',
              color: tokens.coral,
              bgColor: `${tokens.coral}10`,
            },
          ].map((vp) => (
            <Box
              key={vp.title}
              sx={{
                display: 'flex',
                gap: 2.5,
                p: 3,
                borderRadius: 3,
                backgroundColor: tokens.white,
                border: `1px solid ${tokens.bone}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.04)' },
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: vp.bgColor,
                  color: vp.color,
                }}
              >
                {vp.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 0.5 }}
                >
                  {vp.title}
                </Typography>
                <Typography sx={{ color: tokens.stone, fontSize: '1.3rem', lineHeight: 1.7 }}>
                  {vp.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* ════════════════════════════════════════
          Feature Grid
          ════════════════════════════════════════ */}
      <Box sx={{ backgroundColor: tokens.white, borderTop: `1px solid ${tokens.bone}`, borderBottom: `1px solid ${tokens.bone}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 4,
                height: 24,
                borderRadius: 2,
                backgroundColor: tokens.coral,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 600,
                color: tokens.charcoal,
              }}
            >
              Công cụ bổ trợ
            </Typography>
          </Stack>
          <Typography sx={{ color: tokens.stone, fontSize: '1.3rem', mb: 4, ml: { xs: 0, md: 5.5 } }}>
            Các tính năng hỗ trợ việc học tiếng Anh của bạn
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            {FEATURE_LIST.map((f, i) => (
              <Box
                key={i}
                onClick={() => navigate(f.to)}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  p: 2.5,
                  borderRadius: 2.5,
                  border: `1px solid ${tokens.bone}`,
                  backgroundColor: tokens.warmBg,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: tokens.white,
                    borderColor: tokens.iron,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={f.icon}
                  alt={f.title}
                  sx={{ width: 36, height: 36, flexShrink: 0, mt: 0.3 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: tokens.charcoal, mb: 0.3 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', color: tokens.stone, lineHeight: 1.6 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════
          Footer CTA
          ════════════════════════════════════════ */}
      {isGuest && (
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 600,
              color: tokens.charcoal,
              mb: 1.5,
            }}
          >
            Bắt đầu hành trình của bạn
          </Typography>
          <Typography sx={{ color: tokens.stone, fontSize: '1.3rem', mb: 4, maxWidth: 500, mx: 'auto' }}>
            Tham gia cộng đồng Dynonary và nâng cao trình độ tiếng Anh mỗi ngày.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.REGISTER)}
            sx={{
              backgroundColor: tokens.navy,
              color: tokens.white,
              fontWeight: 700,
              fontSize: '1.4rem',
              px: 6,
              py: 1.6,
              '&:hover': { backgroundColor: tokens.navyLight },
            }}
          >
            Đăng ký miễn phí
          </Button>
        </Container>
      )}
    </Box>
  );
}

export default LandingPage;
