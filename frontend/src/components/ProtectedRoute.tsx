import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from 'redux/store';
import { ROUTES } from 'constant';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'learner';
  placementRequired?: boolean;
}

export default function ProtectedRoute({ children, requiredRole, placementRequired }: ProtectedRouteProps) {
  const { isAuth, authLoading, level } = useSelector((state: RootState) => state.userInfo);
  const adminInfo = useSelector((state: RootState) => state.adminInfo);

  // Admin routes check adminInfo slice (separate from regular user session)
  if (requiredRole === 'admin') {
    if (!adminInfo.isAuth) {
      return <Navigate to={ROUTES.ADMIN.LOGIN} replace />;
    }
    return <>{children}</>;
  }

  // Learner / regular protected routes check userInfo slice
  if (authLoading) return null;

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (placementRequired && !level) {
    return <Navigate to={ROUTES.LEARNER.PLACEMENT} replace />;
  }

  return <>{children}</>;
}
