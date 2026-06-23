import api from 'services/api';
import { getAuth } from 'firebase/auth';

// ─── Types ────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  username: string;
  avt: string;
  coin: number;
  favoriteList: string[];
  createdDate?: any;
  provider: 'password' | 'google.com' | 'facebook.com';
  role?: 'learner' | 'admin';
  membership?: 'free' | 'premium';
  level?: string | null;
  status?: 'active' | 'banned';
  xp?: number;
}

// ─── User Profile ─────────────────────────────────────────────

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  // Profile is auto-created on first API call via user-info endpoint
  // This function exists for backward compatibility
  // The Python backend creates the profile on first login
  try {
    await api.get('/apis/account/user-info');
  } catch {
    // Profile will be created by backend automatically
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const res = await api.get('/apis/account/user-info');
    return res.data as UserProfile;
  } catch {
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'name' | 'username' | 'avt'>>,
) {
  const payload: Record<string, string> = {};
  if (data.name) payload.name = data.name;
  if (data.username) payload.username = data.username;
  if (data.avt) payload.avt = data.avt;

  if (data.avt) {
    await api.put('/apis/account/update-avt', { avtSrc: data.avt });
  }
  if (data.name || data.username) {
    await api.put('/apis/account/update-profile', payload);
  }
}

export async function toggleFavoriteWord(
  uid: string,
  wordId: string,
  isAdd: boolean,
) {
  await api.put('/apis/account/toggle-favorite', { word: wordId, isAdd });
}

export async function updateUserCoin(uid: string, delta: number) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;
  // Get current coin, then update
  const profile = await getUserProfile(uid);
  const newCoin = (profile?.coin || 0) + delta;
  await api.put('/apis/account/update-coin', { newCoin });
}

export async function uploadAvatar(
  uid: string,
  file: File,
): Promise<string> {
  // Upload via Python backend (avoids Firebase Storage CORS issues)
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/apis/account/upload-avt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.newSrc;
}
