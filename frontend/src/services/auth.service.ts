import {
  getFirebaseAuth,
  getGoogleProvider,
  getFacebookProvider,
} from 'configs/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  User,
  onAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth';
import api from 'services/api';

// ─── Email/Password Auth ────────────────────────────────────────

export async function loginWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: string = 'student',
) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  // Set display name
  await updateProfile(credential.user, { displayName });
  // Send verification email
  await sendEmailVerification(credential.user);

  // Create profile with selected role (best-effort)
  try {
    await api.get('/apis/account/user-info');
    await api.put('/apis/account/update-profile', { role });
  } catch {
    // Profile will be created on first login with default role
  }

  return credential.user;
}

export async function logoutUser() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export async function resetPassword(email: string) {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

// ─── Social Login ───────────────────────────────────────────────

export async function loginWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = getGoogleProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function loginWithFacebook() {
  const auth = getFirebaseAuth();
  const provider = getFacebookProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// ─── Auth State Listener ────────────────────────────────────────

export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

// ─── Helpers ────────────────────────────────────────────────────

export function getUserDisplayName(user: User | null): string {
  return user?.displayName || user?.email?.split('@')[0] || '';
}

export function getUserEmail(user: User | null): string {
  return user?.email || '';
}

export function getUserPhotoURL(user: User | null): string {
  return user?.photoURL || '';
}
