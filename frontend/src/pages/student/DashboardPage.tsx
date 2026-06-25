import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button, Stack,
} from '@mui/material';
import {
  School as SchoolIcon, CalendarMonth as CalendarIcon,
  ArrowForward as ArrowIcon, Message as MessageIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { schedulingApi, messagingApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Session, Conversation } from '../../types';

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(s => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      schedulingApi.getMySessions('student').catch(() => ({ sessions: [] })),
      messagingApi.getConversations().catch(() => ({ conversations: [] })),
    ])
      .then(([sessionData, convData]) => {
        if (!cancelled) {
          setSessions(sessionData.sessions || []);
          setConversations(convData.conversations || []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải dữ liệu');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const confirmedCount = upcomingSessions.filter(s => s.status === 'confirmed').length;

  const stats = [
    { label: 'Buổi học', value: completedCount.toString() },
    { label: 'Buổi sắp tới', value: confirmedCount.toString() },
    { label: 'Hội thoại', value: conversations.length.toString() },
    {
      label: 'Học hôm nay',
      value: upcomingSessions.some(s => s.date === new Date().toISOString().slice(0, 10)) ? 'Có' : 'Không',
    },
  ];

  if (error) {
    return (
      <DashboardLayout role="student">
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <Box>
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Chào{currentUser?.name ? ` ${currentUser.name}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {upcomingSessions.length > 0
              ? `Hôm nay bạn có ${upcomingSessions.filter(s => s.date === new Date().toISOString().slice(0, 10)).length} buổi học.`
              : 'Chào mừng bạn đến với DynoLMS!'}
          </Typography>
        </Box>

        {loading ? (
          <LoadingSkeleton type="stats" count={4} />
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Card>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h5">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Buổi học sắp tới
            </Typography>

            {loading ? (
              <LoadingSkeleton type="list" count={3} />
            ) : upcomingSessions.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon sx={{ fontSize: 48 }} />}
                title="Chưa có buổi học nào"
                description="Hãy tìm gia sư và đặt lịch học ngay!"
                actionLabel="Tìm gia sư"
                onAction={() => navigate('/tutors')}
              />
            ) : (
              <>
                {upcomingSessions.slice(0, 5).map(s => (
                  <Card key={s.uid} sx={{ mb: 1 }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={s.tutorAvt} sx={{ width: 36, height: 36 }} aria-hidden="true">
                        {s.tutorName?.charAt(0) || '?'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.tutorName}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.courseName || ''}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 500, display: 'block' }}>
                          {new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{s.startTime}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Button endIcon={<ArrowIcon />} onClick={() => navigate('/sessions')} size="small" sx={{ mt: 0.5 }}>
                  Xem tất cả
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Truy cập nhanh
            </Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Button variant="contained" startIcon={<SearchIcon />} onClick={() => navigate('/tutors')} fullWidth>
                Tìm gia sư
              </Button>
              <Button variant="outlined" startIcon={<SchoolIcon />} onClick={() => navigate('/courses')} fullWidth>
                Khám phá khóa học
              </Button>
              <Button variant="outlined" startIcon={<CalendarIcon />} onClick={() => navigate('/sessions')} fullWidth>
                Lịch học
              </Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Tin nhắn gần đây
            </Typography>

            {loading ? (
              <LoadingSkeleton type="list" count={3} />
            ) : conversations.length === 0 ? (
              <EmptyState
                icon={<MessageIcon sx={{ fontSize: 48 }} />}
                title="Chưa có tin nhắn"
                description="Khi bạn nhận được tin nhắn từ gia sư, chúng sẽ hiển thị ở đây."
              />
            ) : (
              <>
                {conversations.slice(0, 4).map((conv, i) => (
                  <Card key={conv.userId} sx={{ mb: 1 }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={conv.userAvt} sx={{ width: 32, height: 32, fontSize: '0.85rem' }} aria-hidden="true">
                        {conv.userName?.charAt(0) || '?'}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {conv.userName}
                          {conv.unreadCount > 0 && (
                            <Chip label={conv.unreadCount} size="small" color="primary" sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{
                          display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {conv.lastMessage}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled">
                        {formatRelativeTime(conv.lastMessageDate)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                <Button endIcon={<ArrowIcon />} onClick={() => navigate('/messages')} size="small" sx={{ mt: 0.5 }}>
                  Xem tất cả
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
