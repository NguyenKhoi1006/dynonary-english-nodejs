import React, { useEffect, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store';
import { getTheme } from './theme';
import { useAppDispatch } from './hooks/useAppDispatch';
import { onAuthChange } from './services/auth.service';
import { getUserProfile } from './services/firestore.service';
import { setUser, clearUser, setAuthLoading } from './store/slices/userSlice';
import { setLoading } from './store/slices/uiSlice';
import NotificationProvider from './components/NotificationProvider';
import PageTransition from './components/PageTransition';

// Lazy load pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/student/DashboardPage'));
const TutorBrowsePage = React.lazy(() => import('./pages/student/TutorBrowsePage'));
const TutorDetailPage = React.lazy(() => import('./pages/student/TutorDetailPage'));
const CourseBrowsePage = React.lazy(() => import('./pages/student/CourseBrowsePage'));
const CourseDetailPage = React.lazy(() => import('./pages/student/CourseDetailPage'));
const SessionsPage = React.lazy(() => import('./pages/shared/SessionsPage'));
const MessagesPage = React.lazy(() => import('./pages/shared/MessagesPage'));
const ProfilePage = React.lazy(() => import('./pages/shared/ProfilePage'));
const TutorDashboardPage = React.lazy(() => import('./pages/tutor/TutorDashboardPage'));
const TutorCoursesPage = React.lazy(() => import('./pages/tutor/TutorCoursesPage'));
const TutorStudentsPage = React.lazy(() => import('./pages/tutor/TutorStudentsPage'));
const TutorEarningsPage = React.lazy(() => import('./pages/tutor/TutorEarningsPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const NotFoundPage = React.lazy(() => import('./pages/shared/NotFoundPage'));

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isAuth, authLoading, currentUser } = useSelector((s: RootState) => s.user);

  if (authLoading) return <LoadingFallback />;
  if (!isAuth) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser?.role !== requiredRole) {
    const fallback = currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'tutor' ? '/tutor' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const { isAuth, authLoading, currentUser } = useSelector((s: RootState) => s.user);
  if (authLoading) return <LoadingFallback />;
  if (!isAuth) return <Navigate to="/login" replace />;
  const target = currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'tutor' ? '/tutor' : '/dashboard';
  return <Navigate to={target} replace />;
}

function AppRoutes() {
  const dispatch = useAppDispatch();
  const { themeMode } = useSelector((s: RootState) => s.ui);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            dispatch(setUser({
              user: {
                uid: firebaseUser.uid,
                email: profile.email,
                name: profile.name,
                avt: profile.avt,
                role: profile.role || 'student',
                membership: profile.membership || 'free',
                status: profile.status || 'active',
              },
              isTutor: false,
            }));
          } else {
            dispatch(setUser({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || '',
                avt: firebaseUser.photoURL || '',
                role: 'student',
                membership: 'free',
                status: 'active',
              },
            }));
          }
        } catch {
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <NotificationProvider />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PageTransition title="Đăng nhập"><LoginPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition title="Đăng ký"><RegisterPage /></PageTransition>} />
          <Route path="/" element={<RootRedirect />} />

          {/* Student */}
          <Route path="/dashboard" element={<ProtectedRoute><PageTransition title="Dashboard"><DashboardPage /></PageTransition></ProtectedRoute>} />
          <Route path="/tutors" element={<ProtectedRoute><PageTransition title="Tìm gia sư"><TutorBrowsePage /></PageTransition></ProtectedRoute>} />
          <Route path="/tutors/:id" element={<ProtectedRoute><PageTransition title="Chi tiết gia sư"><TutorDetailPage /></PageTransition></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><PageTransition title="Khóa học"><CourseBrowsePage /></PageTransition></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><PageTransition title="Chi tiết khóa học"><CourseDetailPage /></PageTransition></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><PageTransition title="Lịch học"><SessionsPage /></PageTransition></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><PageTransition title="Tin nhắn"><MessagesPage /></PageTransition></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageTransition title="Hồ sơ"><ProfilePage /></PageTransition></ProtectedRoute>} />

          {/* Tutor */}
          <Route path="/tutor" element={<ProtectedRoute requiredRole="tutor"><PageTransition title="Bảng điều khiển"><TutorDashboardPage /></PageTransition></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute requiredRole="tutor"><PageTransition title="Khóa học của tôi"><TutorCoursesPage /></PageTransition></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute requiredRole="tutor"><PageTransition title="Học viên"><TutorStudentsPage /></PageTransition></ProtectedRoute>} />
          <Route path="/earnings" element={<ProtectedRoute requiredRole="tutor"><PageTransition title="Doanh thu"><TutorEarningsPage /></PageTransition></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><PageTransition title="Quản trị"><AdminDashboardPage /></PageTransition></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}
