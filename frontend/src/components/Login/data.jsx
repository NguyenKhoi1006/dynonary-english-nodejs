import { UX } from 'constant';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { loginWithEmail } from 'services/auth.service';
import Login from './index';

function LoginData() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (account) => {
    try {
      setLoading(true);
      const { email, password } = account;

      await loginWithEmail(email.toLowerCase(), password);
      dispatch(
        setMessage({ message: 'Đăng nhập thành công', type: 'success' }),
      );

      setTimeout(() => {
        window.location.href = '/';
      }, UX.DELAY_TIME);
    } catch (error) {
      let message = 'Thất bại, thử lại !';
      if (error.code === 'auth/user-not-found') {
        message = 'Email không tồn tại';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Sai mật khẩu';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Email hoặc mật khẩu không đúng';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Quá nhiều lần thử, hãy thử lại sau';
      }
      dispatch(setMessage({ message, type: 'error' }));
      setLoading(false);
    }
  };

  return <Login onLogin={handleLogin} loading={loading} />;
}

export default LoginData;
