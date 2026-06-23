import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from 'redux/store';
import { ROUTES } from 'constant';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExtensionIcon from '@mui/icons-material/Extension';

// ─── Feature grid ───
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

type LandingMode = 'guest' | 'onboarding';

interface LandingPageProps {
  mode: LandingMode;
}

function LandingPage({ mode }: LandingPageProps) {
  const navigate = useNavigate();
  const { name } = useSelector((s: RootState) => s.userInfo);

  const isGuest = mode === 'guest';

  return (
    <Box sx={{ backgroundColor: '#F7F6F3', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          textAlign: 'center',
          px: 3,
          pt: { xs: 8, md: 14 },
          pb: { xs: 8, md: 10 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Playfair Display', 'Instrument Serif', serif",
            fontWeight: 600,
            fontSize: { xs: '3rem', md: '4.5rem' },
            letterSpacing: '-0.02em',
            color: '#2F3437',
            lineHeight: 1.15,
            mb: 2.5,
          }}
        >
          {isGuest ? (
            'Học tiếng Anh cùng Dynonary'
          ) : (
            <>Chào mừng {name || 'bạn'}, đến với Dynonary</>
          )}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#787774',
            fontSize: { xs: '1.2rem', md: '1.4rem' },
            lineHeight: 1.7,
            mb: 5,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          {isGuest
            ? 'Ứng dụng học tiếng Anh miễn phí với lộ trình chuẩn Cambridge từ A1 đến C2. Bài kiểm tra đầu vào thông minh, bài học cá nhân hóa, và công cụ bổ trợ đầy đủ.'
            : 'Để bắt đầu lộ trình học tiếng Anh chuẩn Cambridge từ A1 đến C2, bạn cần hoàn thành bài kiểm tra đầu vào. Chỉ mất khoảng 15 phút, chúng tôi sẽ xác định trình độ hiện tại và gợi ý bài học phù hợp nhất.'}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          justifyContent="center"
        >
          {isGuest ? (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(ROUTES.REGISTER)}
                sx={{
                  backgroundColor: '#2F3437',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  px: 5,
                  py: 1.6,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#1a1d1f' },
                }}
              >
                Bắt đầu học
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(ROUTES.LOGIN)}
                sx={{
                  borderColor: '#2F3437',
                  color: '#2F3437',
                  borderRadius: '6px',
                  px: 5,
                  py: 1.6,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1a1d1f',
                    backgroundColor: '#EDEDEA',
                  },
                }}
              >
                Đăng nhập
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.LEARNER.PLACEMENT)}
              sx={{
                backgroundColor: '#2F3437',
                color: '#FFFFFF',
                borderRadius: '6px',
                px: 5,
                py: 1.6,
                fontSize: '1.15rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#1a1d1f' },
              }}
            >
              Làm bài kiểm tra đầu vào
            </Button>
          )}
        </Stack>
      </Box>

      {/* ── Value Props ── */}
      <Box sx={{ maxWidth: 1080, mx: 'auto', px: 3, pb: { xs: 6, md: 9 } }}>
        <Grid container spacing={3}>
          {[
            {
              icon: <SchoolIcon sx={{ fontSize: 36, color: '#346538' }} />,
              title: isGuest ? 'Lộ trình cá nhân hóa' : 'Lộ trình cá nhân hóa',
              desc: isGuest
                ? 'Bài kiểm tra đầu vào thông minh đánh giá chính xác trình độ của bạn, từ đó xây dựng lộ trình học phù hợp với từng cấp độ A1 đến C2.'
                : 'Bài kiểm tra sẽ đánh giá chính xác trình độ hiện tại của bạn, từ đó gợi ý lộ trình học phù hợp với từng cấp độ A1 đến C2.',
            },
            {
              icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#346538' }} />,
              title: isGuest ? 'Học mọi lúc mọi nơi' : 'Tiết kiệm thời gian',
              desc: isGuest
                ? 'Tăng 1000+ từ vựng, câu giao tiếp, ngữ pháp và bài tập tương tác. Luyện tập với flashcard, trò chơi và nhiều công cụ hỗ trợ khác.'
                : 'Không cần học lại những gì bạn đã biết. Bắt đầu đúng trình độ, tránh lãng phí thời gian với những bài học quá dễ hoặc quá khó.',
            },
            {
              icon: <AutoStoriesIcon sx={{ fontSize: 36, color: '#346538' }} />,
              title: isGuest ? 'Nội dung phong phú' : 'Mục tiêu rõ ràng',
              desc: isGuest
                ? 'Từ bảng phiên âm IPA, ngữ pháp, giao tiếp đến luyện thi. Tất cả đều miễn phí, không giới hạn số lượng bài học.'
                : 'Biết được điểm mạnh, điểm yếu của bạn ở từng kỹ năng. Theo dõi sự tiến bộ qua từng cấp độ một cách cụ thể.',
            },
          ].map((vp) => (
            <Grid item xs={12} sm={4} key={vp.title}>
              <Card
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #EAEAEA',
                  boxShadow: 'none',
                  backgroundColor: '#FFFFFF',
                  height: '100%',
                }}
              >
                <Box sx={{ p: 3.5 }}>
                  <Box sx={{ mb: 2 }}>{vp.icon}</Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.6rem',
                      color: '#2F3437',
                      mb: 1,
                    }}
                  >
                    {vp.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#787774',
                      fontSize: '1.15rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {vp.desc}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Supplement Tools ── */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          pb: { xs: 5, md: 8 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
          <ExtensionIcon sx={{ fontSize: 28, color: '#787774' }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', 'Instrument Serif', serif",
              fontWeight: 600,
              fontSize: '1.8rem',
              color: '#2F3437',
              letterSpacing: '-0.01em',
            }}
          >
            Công cụ bổ trợ
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ color: '#787774', mb: 3, fontSize: '1.15rem' }}
        >
          Các tính năng hỗ trợ việc học tiếng Anh của bạn
        </Typography>
        <Grid container spacing={2.5}>
          {FEATURE_LIST.map((box, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <FeatureBox
                imgUrl={box.imgUrl}
                title={box.title}
                to={box.to}
                subTitle={box.subTitle}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default LandingPage;
