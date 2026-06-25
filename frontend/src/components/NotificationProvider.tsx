import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { clearNotification } from '../store/slices/uiSlice';

export default function NotificationProvider() {
  const dispatch = useAppDispatch();
  const { notification } = useAppSelector(s => s.ui);

  if (!notification) return null;

  const handleClose = () => dispatch(clearNotification());

  return (
    <Snackbar
      open={true}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 7 }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity as AlertColor}
        variant="filled"
        sx={{ borderRadius: 2, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 300 }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
