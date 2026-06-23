import { ThemeProvider } from '@mui/material/styles';
import Navigation from 'components/Navigation';
import BottomNav from 'components/BottomNav';
import SpeedDials from 'components/SpeedDial';
import GlobalLoading from 'components/UI/GlobalLoading';
import Message from 'components/UI/Message';
import theme from 'shared/configs/theme';
import useTheme from 'hooks/useTheme';
import useVoice from 'hooks/useVoice';
import NotFoundPage from 'features/home/NotFoundPage';
import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Element } from 'react-scroll';
import { routes } from 'shared/configs/router';
import { ROUTES } from 'constant';
import type { RootState } from 'redux/store';
import { onAuthChange } from 'services/auth.service';
import { getUserProfile, createUserProfile } from 'services/firestore.service';
import { setUser, clearUser, setAuthLoading } from 'redux/slices/userInfo.slice';
import { signOut, getAuth } from 'firebase/auth';
import ProtectedRoute from 'components/ProtectedRoute';
import AdminLayout from 'components/AdminLayout';
import { AdminThemeProvider } from 'components/AdminLayout/ThemeContext';

/* ── Learner paths that get bottom nav + compact header ── */
const LEARNER_PATHS = [
  ROUTES.LEARNER.PATH,
  ROUTES.LEARNER.PROGRESS,
  ROUTES.LEARNER.MATERIALS,
  ROUTES.LEARNER.MATERIAL_DETAIL,
  ROUTES.LEADERBOARD,
  ROUTES.LEARNER.PLACEMENT,
  ROUTES.LEARNER.LEVEL_UP,
];

function NavOnlyForLearner() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Navigation />;
}

function BottomNavOnLearner() {
  const { isAuth } = useSelector((state: RootState) => state.userInfo);
  const location = useLocation();
  const isLearnerPage = LEARNER_PATHS.some((p) => location.pathname.startsWith(p));
  if (!isAuth || !isLearnerPage) return null;
  return <BottomNav />;
}

function LearnerPagePadding({ children }: { children: React.ReactNode }) {
  const { isAuth } = useSelector((state: RootState) => state.userInfo);
  const location = useLocation();
  const isLearnerPage = LEARNER_PATHS.some((p) => location.pathname.startsWith(p));
  const padBottom = isAuth && isLearnerPage ? 'calc(var(--bottom-nav-height) + 1.6rem)' : '0';
  return <div style={{ paddingBottom: padBottom }}>{children}</div>;
}

function App() {
  const dispatch = useAppDispatch();
  const { isAuth, authLoading } = useSelector(
    (state: RootState) => state.userInfo,
  );

  // get and set theme
  useTheme();

  // get window voice and set custom voice
  useVoice();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Try to get existing Firestore profile
          let profile = await getUserProfile(firebaseUser.uid);

          if (!profile) {
            // First-time login — create profile document
            const displayName =
              firebaseUser.displayName ||
              firebaseUser.email?.split('@')[0] ||
              '';
            await createUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: displayName,
              username: displayName,
              avt: firebaseUser.photoURL || '',
              provider: firebaseUser.providerData[0]?.providerId as
                | 'password'
                | 'google.com'
                | 'facebook.com',
            });
            profile = await getUserProfile(firebaseUser.uid);
          }

          if (profile) {
            if (profile.role === 'admin') {
              signOut(getAuth()).catch(() => {});
              dispatch(clearUser());
              return;
            }

            dispatch(
              setUser({
                uid: firebaseUser.uid,
                email: profile.email,
                name: profile.name,
                username: profile.username,
                avt: profile.avt,
                coin: profile.coin,
                favoriteList: profile.favoriteList,
                role: profile.role,
                membership: profile.membership,
                level: profile.level,
                status: profile.status,
                xp: profile.xp,
              }),
            );
          } else {
            // Fallback: just use Firebase auth data
            dispatch(
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name:
                  firebaseUser.displayName ||
                  firebaseUser.email?.split('@')[0] ||
                  '',
                avt: firebaseUser.photoURL || '',
              }),
            );
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Still set basic user info from Firebase Auth
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                '',
              avt: firebaseUser.photoURL || '',
            }),
          );
        }
      } else {
        // User is signed out
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {authLoading ? (
        <GlobalLoading />
      ) : (
        <ThemeProvider theme={theme}>
          <Router>
            <div className="dynonary-app">
              <Element name="scrollTop" />
              <NavOnlyForLearner />

              {/* routes */}
              <Suspense fallback={<GlobalLoading />}>
                <LearnerPagePadding>
                  <Routes>
                  {routes.map((route) => {
                    const { isProtect, requiredRole } = route;

                    // Admin route – require admin role
                    if (requiredRole === 'admin') {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <AdminThemeProvider>
                                <AdminLayout />
                              </AdminThemeProvider>
                            </ProtectedRoute>
                          }>
                          <Route
                            index
                            element={
                              <React.Suspense fallback={<GlobalLoading />}>
                                {route.element}
                              </React.Suspense>
                            }
                          />
                        </Route>
                      );
                    }

                    // Protected route – require auth
                    if (isProtect && !isAuth) {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <React.Suspense fallback={<GlobalLoading />}>
                              {React.createElement(
                                React.lazy(
                                  () => import('features/auth/LoginPage'),
                                ),
                              )}
                            </React.Suspense>
                          }
                        />
                      );
                    }

                    const wrappedElement = route.placementRequired ? (
                      <ProtectedRoute placementRequired>
                        <React.Suspense fallback={<GlobalLoading />}>
                          {route.element}
                        </React.Suspense>
                      </ProtectedRoute>
                    ) : (
                      <React.Suspense fallback={<GlobalLoading />}>
                        {route.element}
                      </React.Suspense>
                    );

                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={wrappedElement}
                      />
                    );
                  })}
                </Routes>
                </LearnerPagePadding>
              </Suspense>

              <BottomNavOnLearner />

              {/* common component */}
              <div id="_overlay"></div>
              <Message />
              <SpeedDials />
            </div>
          </Router>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
