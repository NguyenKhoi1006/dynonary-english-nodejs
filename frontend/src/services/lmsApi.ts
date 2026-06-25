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

// ─── Messaging API ──────────────────────────────────────────────

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
