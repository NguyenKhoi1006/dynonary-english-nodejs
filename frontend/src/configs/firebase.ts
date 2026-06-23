import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  connectAuthEmulator,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBvlh5XjzJh2fm-5eZkrDTo_m49BUj4bXU",
  authDomain: "dynoapp-7c57c.firebaseapp.com",
  projectId: "dynoapp-7c57c",
  storageBucket: "dynoapp-7c57c.firebasestorage.app",
  messagingSenderId: "1032825676307",
  appId: "1:1032825676307:web:405c7460938e07534c55e6",
  measurementId: "G-7S4CYRNFD3"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;
let facebookProvider: FacebookAuthProvider;

function initFirebase() {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();

  // Use emulators in dev if configured
  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  }

  return { app, auth, db, storage, googleProvider, facebookProvider };
}

// Lazy init to ensure env vars are loaded
let initialized = false;
function ensureInit() {
  if (!initialized) {
    const result = initFirebase();
    app = result.app;
    auth = result.auth;
    db = result.db;
    storage = result.storage;
    googleProvider = result.googleProvider;
    facebookProvider = result.facebookProvider;
    initialized = true;
  }
  return { auth, db, storage, googleProvider, facebookProvider };
}

export function getFirebaseAuth() {
  return ensureInit().auth;
}

export function getFirebaseDb() {
  return ensureInit().db;
}

export function getFirebaseStorage() {
  return ensureInit().storage;
}

export function getGoogleProvider() {
  return ensureInit().googleProvider;
}

export function getFacebookProvider() {
  return ensureInit().facebookProvider;
}

export default ensureInit;
