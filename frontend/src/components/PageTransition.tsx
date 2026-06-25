import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function PageTransition({ children, title }: Props) {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Update document title
  useEffect(() => {
    if (title) {
      document.title = `${title} | DynoLMS`;
    } else {
      document.title = 'DynoLMS';
    }
  }, [title]);

  return (
    <Box sx={{ animation: 'slideUp 0.35s ease' }}>
      {children}
    </Box>
  );
}
