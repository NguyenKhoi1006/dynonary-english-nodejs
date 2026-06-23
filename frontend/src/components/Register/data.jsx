import { ROUTES, UX } from 'constant';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMessage } from 'redux/slices/message.slice';
import { registerWithEmail, logoutUser } from 'services/auth.service';
import { createUserProfile } from 'services/firestore.service';
import Register from './index';

function RegisterData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (account) => {
    try {
      setLoading(true);
      const { email, password, name } = account;

      // Create Firebase Auth account
      const user = await registerWithEmail(
        email.toLowerCase(),
        password,
        name,
      );

      // Create Firestore profile
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: email.toLowerCase(),
        name,
        username: name,
        provider: 'password',
      });

      // Sign out so user goes to login page
      await logoutUser();

      dispatch(setMessage({ type: 'success', message: 'Đăng ký thành công' }));
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.LOGIN);
      }, UX.DELAY_TIME);
    } catch (error) {
      let message = 'Đăng ký thất bại, thử lại !';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email đã được sử dụng';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      dispatch(setMessage({ type: 'error', message }));
      setLoading(false);
    }
  };

  return <Register onRegister={handleRegister} loading={loading} />;
}

export default RegisterData;
