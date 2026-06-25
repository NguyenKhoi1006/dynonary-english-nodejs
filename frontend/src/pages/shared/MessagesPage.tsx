import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, Typography, Avatar, TextField, IconButton, List, ListItem,
  ListItemAvatar, ListItemText, Badge, Divider, InputAdornment, Skeleton,
} from '@mui/material';
import {
  Send as SendIcon, Search as SearchIcon,
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { messagingApi } from '../../services/lmsApi';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { Conversation, Message } from '../../types';

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
  if (diff < 86400000) return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  return d.toLocaleDateString('vi-VN');
}

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const { currentUser } = useAppSelector(s => s.user);
  const role = currentUser?.role === 'tutor' ? 'tutor' : 'student';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    messagingApi.getConversations()
      .then(data => {
        if (!cancelled) {
          const convs = data.conversations || [];
          setConversations(convs);
          if (convs.length > 0 && !activeConv) {
            setActiveConv(convs[0].userId);
          }
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Không thể tải danh sách tin nhắn');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    let cancelled = false;
    setMessagesLoading(true);
    messagingApi.getMessages(activeConv)
      .then(data => {
        if (!cancelled) setMessages(data.messages || []);
      })
      .catch(() => { if (!cancelled) setMessages([]); })
      .finally(() => { if (!cancelled) setMessagesLoading(false); });
    return () => { cancelled = true; };
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConvData = conversations.find(c => c.userId === activeConv);
  const filteredConvs = conversations.filter(c =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    // Optimistic UI: add message locally
    const optimistic: Message = {
      uid: `temp-${Date.now()}`,
      senderId: currentUser?.uid || '',
      senderName: currentUser?.name || '',
      senderAvt: currentUser?.avt || '',
      receiverId: activeConv,
      content: text,
      isRead: false,
      createdDate: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    try {
      await messagingApi.send({ receiverId: activeConv, content: text });
    } catch {
      setMessages(prev => prev.filter(m => m.uid !== optimistic.uid));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout role={role}>
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          <ErrorState title="Lỗi tải dữ liệu" message={error} onRetry={() => window.location.reload()} />
        </Box>
      </DashboardLayout>
    );
  }

  const activeIndex = conversations.findIndex(c => c.userId === activeConv);

  return (
    <DashboardLayout role={role}>
      <Box>
        <Breadcrumbs items={[{ label: 'Tin nhắn' }]} />

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Tin nhắn</Typography>

        <Box sx={{ display: 'flex', gap: 2, minHeight: 'calc(100vh - 260px)' }}>
          {/* Sidebar */}
          <Box sx={{
            width: { xs: '100%', md: 340 }, flexShrink: 0,
            display: { xs: activeConv ? 'none' : 'block', md: 'block' },
            overflow: 'auto', maxHeight: 'calc(100vh - 300px)',
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
              }}
              inputProps={{ 'aria-label': 'Tìm kiếm hội thoại' }}
            />

            {loading ? (
              <LoadingSkeleton type="list" count={5} />
            ) : filteredConvs.length === 0 ? (
              <EmptyState
                title="Chưa có tin nhắn"
                description="Khi bạn nhắn tin với gia sư hoặc học viên, cuộc hội thoại sẽ hiển thị ở đây."
              />
            ) : (
              <List sx={{ p: 0 }}>
                {filteredConvs.map((conv, i) => (
                  <Card
                    key={conv.userId}
                    onClick={() => setActiveConv(conv.userId)}
                    sx={{
                      mb: 1, borderRadius: 2.5, cursor: 'pointer',
                      bgcolor: activeConv === conv.userId ? 'action.selected' : 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItem sx={{ p: 1.5 }} alignItems="flex-start">
                      <ListItemAvatar sx={{ minWidth: 48 }}>
                        <Avatar src={conv.userAvt} sx={{ bgcolor: 'primary.main' }} aria-hidden="true">
                          {conv.userName?.charAt(0) || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                              {conv.userName}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatTime(conv.lastMessageDate)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{
                            display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220,
                          }}>
                            {conv.lastMessage}
                          </Typography>
                        }
                      />
                      {conv.unreadCount > 0 && (
                        <Box sx={{ ml: 0.5 }}>
                          <Badge badgeContent={conv.unreadCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', fontWeight: 700, minWidth: 18, height: 18 } }} />
                        </Box>
                      )}
                    </ListItem>
                  </Card>
                ))}
              </List>
            )}
          </Box>

          {/* Chat */}
          <Box sx={{
            flex: 1, display: { xs: activeConv ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            borderRadius: 3, overflow: 'hidden',
          }}>
            {activeConvData ? (
              <>
                {/* Chat header */}
                <Box sx={{
                  p: 2, borderBottom: '1px solid', borderColor: 'divider',
                  display: 'flex', alignItems: 'center', gap: 1.5,
                }}>
                  <IconButton
                    sx={{ display: { md: 'none' } }}
                    onClick={() => setActiveConv(null)}
                    aria-label="Quay lại danh sách"
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                  <Avatar src={activeConvData.userAvt} sx={{ width: 36, height: 36, bgcolor: 'primary.main' }} aria-hidden="true">
                    {activeConvData.userName?.charAt(0) || '?'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {activeConvData.userName}
                    </Typography>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{
                  flex: 1, overflow: 'auto', p: 2.5,
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                }}>
                  {messagesLoading ? (
                    <LoadingSkeleton type="list" count={4} />
                  ) : messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">Chưa có tin nhắn. Hãy gửi lời chào đầu tiên!</Typography>
                    </Box>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.senderId === currentUser?.uid;
                      return (
                        <Box key={msg.uid} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: { xs: '85%', sm: '70%' } }}>
                          <Box sx={{
                            bgcolor: isMe ? 'primary.main' : 'action.hover',
                            color: isMe ? '#fff' : 'text.primary',
                            px: 2, py: 1.2,
                            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          }}>
                            <Typography variant="body2">{msg.content}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.3, px: 1 }}>
                            {formatTime(msg.createdDate)}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input */}
                <Box sx={{
                  p: 2, borderTop: '1px solid', borderColor: 'divider',
                  display: 'flex', gap: 1, alignItems: 'center',
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    inputProps={{ 'aria-label': 'Nhập tin nhắn' }}
                  />
                  <IconButton
                    color="primary"
                    disabled={!input.trim() || sending}
                    onClick={handleSend}
                    aria-label="Gửi tin nhắn"
                    sx={{ bgcolor: input.trim() ? 'primary.main' : 'transparent', color: input.trim() ? '#fff' : undefined, '&:hover': { bgcolor: input.trim() ? 'primary.dark' : 'action.hover' } }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Typography variant="body1" color="text.secondary">Chọn một hội thoại để bắt đầu</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
