/**
 * Gamification API service.
 * Wraps all gamification endpoint calls (streak, hearts, achievements, quests, skill tree).
 */
import api from './api';

/* ─── Streak ─── */
export const streakApi = {
  checkIn: () => api.post('/apis/gamification/streak/check-in').then((r) => r.data),
  get: () => api.get('/apis/gamification/streak/').then((r) => r.data),
};

/* ─── Hearts ─── */
export const heartsApi = {
  get: () => api.get('/apis/gamification/hearts/').then((r) => r.data),
  consume: (count = 1) =>
    api.post('/apis/gamification/hearts/consume', { count }).then((r) => r.data),
  refill: () => api.post('/apis/gamification/hearts/refill').then((r) => r.data),
};

/* ─── Achievements ─── */
export const achievementsApi = {
  get: () => api.get('/apis/gamification/achievements/').then((r) => r.data),
  check: (eventType: string, eventValue = 1) =>
    api.post('/apis/gamification/achievements/check', { eventType, eventValue }).then((r) => r.data),
};

/* ─── Daily Quests ─── */
export const questsApi = {
  get: () => api.get('/apis/gamification/quests/').then((r) => r.data),
  updateProgress: (questId: string, delta = 1) =>
    api.post('/apis/gamification/quests/progress', { questId, progressDelta: delta }).then((r) => r.data),
};

/* ─── Skill Tree ─── */
export const skillTreeApi = {
  get: () => api.get('/apis/gamification/skill-tree/').then((r) => r.data),
  completeLesson: (nodeId: string) =>
    api.post('/apis/gamification/skill-tree/complete-lesson', { nodeId }).then((r) => r.data),
  getAvailable: () => api.get('/apis/gamification/skill-tree/available').then((r) => r.data),
};
