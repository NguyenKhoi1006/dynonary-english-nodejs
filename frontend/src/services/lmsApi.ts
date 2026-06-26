import api from './api';
import type { TutorProfile, Course, Booking, Session, Review, Message, Conversation } from '../types';

// ─── Tutor API ──────────────────────────────────────────────────

export const tutorApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string; subject?: string; level?: string }) =>
    api.get('/apis/tutors/list', { params }).then(r => r.data),

  getById: (uid: string) =>
    api.get(`/apis/tutors/${uid}`).then(r => r.data),

  getMyProfile: () =>
    api.get('/apis/tutors/my-profile').then(r => r.data),

  apply: (data: { bio: string; subjects: string[]; hourlyRate: number; level?: string; qualifications?: string[]; videoIntro?: string }) =>
    api.post('/apis/tutors/apply', data).then(r => r.data),

  updateProfile: (data: Partial<TutorProfile>) =>
    api.put('/apis/tutors/my-profile', data).then(r => r.data),
};

// ─── Course API ─────────────────────────────────────────────────

export const courseApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string; subject?: string; level?: string }) =>
    api.get('/apis/courses/list', { params }).then(r => r.data),

  getById: (courseId: string) =>
    api.get(`/apis/courses/${courseId}`).then(r => r.data),

  getMyCourses: (params?: { page?: number; pageSize?: number }) =>
    api.get('/apis/courses/my-courses', { params }).then(r => r.data),

  create: (data: any) =>
    api.post('/apis/courses/create', data).then(r => r.data),

  update: (courseId: string, data: any) =>
    api.put(`/apis/courses/${courseId}`, data).then(r => r.data),

  delete: (courseId: string) =>
    api.delete(`/apis/courses/${courseId}`).then(r => r.data),

  getLessons: (courseId: string) =>
    api.get(`/apis/courses/${courseId}/lessons`).then(r => r.data),

  addLesson: (courseId: string, data: any) =>
    api.post(`/apis/courses/${courseId}/lessons`, data).then(r => r.data),

  updateLesson: (courseId: string, lessonId: string, data: any) =>
    api.put(`/apis/courses/${courseId}/lessons/${lessonId}`, data).then(r => r.data),

  deleteLesson: (courseId: string, lessonId: string) =>
    api.delete(`/apis/courses/${courseId}/lessons/${lessonId}`).then(r => r.data),
};

// ─── Scheduling API ─────────────────────────────────────────────

export const schedulingApi = {
  setAvailability: (slots: { dayOfWeek: string; startTime: string; endTime: string }[]) =>
    api.post('/apis/scheduling/availability', { slots }).then(r => r.data),

  getAvailability: (tutorId: string) =>
    api.get(`/apis/scheduling/availability/${tutorId}`).then(r => r.data),

  createBooking: (data: { tutorId: string; courseId?: string; date: string; startTime: string; endTime: string; note?: string }) =>
    api.post('/apis/scheduling/book', data).then(r => r.data),

  getMyBookings: () =>
    api.get('/apis/scheduling/my-bookings').then(r => r.data),

  getTutorBookings: () =>
    api.get('/apis/scheduling/tutor-bookings').then(r => r.data),

  confirmBooking: (bookingId: string) =>
    api.put(`/apis/scheduling/bookings/${bookingId}/confirm`).then(r => r.data),

  cancelBooking: (bookingId: string) =>
    api.put(`/apis/scheduling/bookings/${bookingId}/cancel`).then(r => r.data),

  getMySessions: (role: 'student' | 'tutor') =>
    api.get('/apis/scheduling/my-sessions', { params: { role } }).then(r => r.data),

  getSession: (sessionId: string) =>
    api.get(`/apis/scheduling/sessions/${sessionId}`).then(r => r.data),

  completeSession: (sessionId: string, note?: string) =>
    api.put(`/apis/scheduling/sessions/${sessionId}/complete`, { note: note || '' }).then(r => r.data),
};

// ─── Reviews API ────────────────────────────────────────────────

export const reviewApi = {
  create: (data: { tutorId: string; sessionId: string; rating: number; comment: string }) =>
    api.post('/apis/reviews/create', data).then(r => r.data),

  getTutorReviews: (tutorId: string) =>
    api.get(`/apis/reviews/tutor/${tutorId}`).then(r => r.data),
};

// ─── Admin API ──────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  adminCount: number;
  studentCount: number;
  premiumCount: number;
  bannedCount: number;
  totalMaterials: number;
  totalTests: number;
  totalLogs: number;
}

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  username: string;
  avt: string;
  coin: number;
  role: string;
  membership: string;
  level: string | null;
  status: string;
  xp: number;
  createdDate: string | null;
  provider: string;
  lastActiveAt: string | null;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export const adminApi = {
  getDashboardStats: () =>
    api.get('/apis/admin/dashboard/stats').then(r => r.data as AdminStats),

  listUsers: (params?: { page?: number; pageSize?: number; search?: string; role?: string; status?: string; membership?: string; level?: string }) =>
    api.get('/apis/admin/users/list', { params }).then(r => r.data as AdminUserListResponse),

  getUser: (uid: string) =>
    api.get(`/apis/admin/users/${uid}`).then(r => r.data),

  updateUser: (uid: string, data: { name?: string; username?: string; role?: string; level?: string; membership?: string; status?: string }) =>
    api.put(`/apis/admin/users/${uid}`, data).then(r => r.data),

  toggleBan: (uid: string) =>
    api.put(`/apis/admin/users/${uid}/ban`).then(r => r.data),

  grantPremium: (uid: string, durationDays: number) =>
    api.put(`/apis/admin/users/${uid}/premium`, { durationDays }).then(r => r.data),

  // ── Materials ───────────────────────────────────────────────
  listMaterials: (params?: { page?: number; pageSize?: number; search?: string; level?: string; type?: string; published?: boolean }) =>
    api.get('/apis/admin/materials/list', { params }).then(r => r.data),

  getMaterial: (materialId: string) =>
    api.get(`/apis/admin/materials/${materialId}`).then(r => r.data),

  createMaterial: (data: any) =>
    api.post('/apis/admin/materials/create', data).then(r => r.data),

  updateMaterial: (materialId: string, data: any) =>
    api.put(`/apis/admin/materials/${materialId}`, data).then(r => r.data),

  deleteMaterial: (materialId: string) =>
    api.delete(`/apis/admin/materials/${materialId}`).then(r => r.data),

  // ── Tests ───────────────────────────────────────────────────
  listTests: (params?: { page?: number; pageSize?: number; search?: string; level?: string; published?: boolean }) =>
    api.get('/apis/admin/tests/list', { params }).then(r => r.data),

  getTest: (testId: string) =>
    api.get(`/apis/admin/tests/${testId}`).then(r => r.data),

  createTest: (data: any) =>
    api.post('/apis/admin/tests/create', data).then(r => r.data),

  updateTest: (testId: string, data: any) =>
    api.put(`/apis/admin/tests/${testId}`, data).then(r => r.data),

  deleteTest: (testId: string) =>
    api.delete(`/apis/admin/tests/${testId}`).then(r => r.data),

  // ── Placement Tests ─────────────────────────────────────────
  listPlacementTests: (params?: { page?: number; pageSize?: number; search?: string; published?: boolean }) =>
    api.get('/apis/admin/placement-tests/list', { params }).then(r => r.data),

  getPlacementTest: (testId: string) =>
    api.get(`/apis/admin/placement-tests/${testId}`).then(r => r.data),

  createPlacementTest: (data: any) =>
    api.post('/apis/admin/placement-tests/create', data).then(r => r.data),

  updatePlacementTest: (testId: string, data: any) =>
    api.put(`/apis/admin/placement-tests/${testId}`, data).then(r => r.data),

  deletePlacementTest: (testId: string) =>
    api.delete(`/apis/admin/placement-tests/${testId}`).then(r => r.data),

  // ── Tutors ──────────────────────────────────────────────────
  listAdminTutors: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) =>
    api.get('/apis/admin/tutors/list', { params }).then(r => r.data),

  getAdminTutor: (tutorId: string) =>
    api.get(`/apis/admin/tutors/${tutorId}`).then(r => r.data),

  approveTutor: (tutorId: string) =>
    api.put(`/apis/admin/tutors/${tutorId}/approve`).then(r => r.data),

  rejectTutor: (tutorId: string) =>
    api.put(`/apis/admin/tutors/${tutorId}/reject`).then(r => r.data),

  // ── Words ───────────────────────────────────────────────────
  listWords: (params?: { page?: number; pageSize?: number; search?: string; level?: string; type?: string; topic?: string }) =>
    api.get('/apis/admin/words/list', { params }).then(r => r.data),

  getWord: (wordId: string) =>
    api.get(`/apis/admin/words/${wordId}`).then(r => r.data),

  createWord: (data: any) =>
    api.post('/apis/admin/words/create', data).then(r => r.data),

  updateWord: (wordId: string, data: any) =>
    api.put(`/apis/admin/words/${wordId}`, data).then(r => r.data),

  deleteWord: (wordId: string) =>
    api.delete(`/apis/admin/words/${wordId}`).then(r => r.data),

  // ── Sentences ───────────────────────────────────────────────
  listSentences: (params?: { page?: number; pageSize?: number; search?: string; topic?: string }) =>
    api.get('/apis/admin/sentences/list', { params }).then(r => r.data),

  getSentence: (sentenceId: string) =>
    api.get(`/apis/admin/sentences/${sentenceId}`).then(r => r.data),

  createSentence: (data: any) =>
    api.post('/apis/admin/sentences/create', data).then(r => r.data),

  updateSentence: (sentenceId: string, data: any) =>
    api.put(`/apis/admin/sentences/${sentenceId}`, data).then(r => r.data),

  deleteSentence: (sentenceId: string) =>
    api.delete(`/apis/admin/sentences/${sentenceId}`).then(r => r.data),

  // ── Topics ──────────────────────────────────────────────────
  listTopics: (params?: { page?: number; pageSize?: number; search?: string; type?: string }) =>
    api.get('/apis/admin/topics/list', { params }).then(r => r.data),

  getTopic: (topicId: string) =>
    api.get(`/apis/admin/topics/${topicId}`).then(r => r.data),

  createTopic: (data: any) =>
    api.post('/apis/admin/topics/create', data).then(r => r.data),

  updateTopic: (topicId: string, data: any) =>
    api.put(`/apis/admin/topics/${topicId}`, data).then(r => r.data),

  deleteTopic: (topicId: string) =>
    api.delete(`/apis/admin/topics/${topicId}`).then(r => r.data),

  // ── Irregular Verbs ─────────────────────────────────────────
  listIrregularVerbs: (params?: { page?: number; pageSize?: number; search?: string }) =>
    api.get('/apis/admin/irregular-verbs/list', { params }).then(r => r.data),

  getIrregularVerb: (verbId: string) =>
    api.get(`/apis/admin/irregular-verbs/${verbId}`).then(r => r.data),

  createIrregularVerb: (data: any) =>
    api.post('/apis/admin/irregular-verbs/create', data).then(r => r.data),

  updateIrregularVerb: (verbId: string, data: any) =>
    api.put(`/apis/admin/irregular-verbs/${verbId}`, data).then(r => r.data),

  deleteIrregularVerb: (verbId: string) =>
    api.delete(`/apis/admin/irregular-verbs/${verbId}`).then(r => r.data),

  // ── Blog ────────────────────────────────────────────────────
  listBlogPosts: (params?: { page?: number; pageSize?: number; search?: string; type?: string; published?: boolean }) =>
    api.get('/apis/admin/blog/list', { params }).then(r => r.data),

  getBlogPost: (postId: string) =>
    api.get(`/apis/admin/blog/${postId}`).then(r => r.data),

  createBlogPost: (data: any) =>
    api.post('/apis/admin/blog/create', data).then(r => r.data),

  updateBlogPost: (postId: string, data: any) =>
    api.put(`/apis/admin/blog/${postId}`, data).then(r => r.data),

  deleteBlogPost: (postId: string) =>
    api.delete(`/apis/admin/blog/${postId}`).then(r => r.data),

  // ── Activity Log ────────────────────────────────────────────
  listActivityLogs: (params?: { page?: number; pageSize?: number }) =>
    api.get('/apis/admin/activity/logs', { params }).then(r => r.data),
};

export const messagingApi = {
  send: (data: { receiverId: string; content: string; sessionId?: string }) =>
    api.post('/apis/messaging/send', data).then(r => r.data),

  getConversations: () =>
    api.get('/apis/messaging/conversations').then(r => r.data),

  getMessages: (otherId: string) =>
    api.get(`/apis/messaging/messages/${otherId}`).then(r => r.data),

  markAsRead: (otherId: string) =>
    api.put(`/apis/messaging/read/${otherId}`).then(r => r.data),
};
