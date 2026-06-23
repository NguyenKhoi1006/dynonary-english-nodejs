import { ROUTES, UX } from 'constant';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMessage } from 'redux/slices/message.slice';
import { resetPassword } from 'services/auth.service';
import ForgotPassword from '.';

function ForgotPasswordData() {
  const [loading, setLoading] = useState(false);
  const [mailSending, setMailSending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendMail = async (email) => {
    setMailSending(true);
    try {
      await resetPassword(email);
      dispatch(
        setMessage({
          type: 'success',
          message: 'Gửi mã thành công. Hãy kiểm tra email của bạn',
        }),
      );
    } catch (error) {
      let message = 'Gửi mã thất bại, thử lại !';
      if (error.code === 'auth/user-not-found') {
        message = 'Email không tồn tại trong hệ thống';
      }
      dispatch(setMessage({ type: 'error', message }));
    } finally {
      setMailSending(false);
    }
  };

  const handleResetPassword = async ({ email, verifyCode, password }) => {
    // With Firebase, password reset is handled via email link
    // This form used the old backend verify-code flow
    // Now we just send the reset email (verifyCode is ignored)
    setLoading(true);
    try {
      await resetPassword(email);
      dispatch(
        setMessage({
          type: 'success',
          message: 'Đã gửi email đặt lại mật khẩu. Hãy kiểm tra hộp thư của bạn',
          duration: UX.DELAY_TIME,
        }),
      );
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, UX.DELAY_TIME);
    } catch (error) {
      let message = 'Gửi email thất bại, thử lại !';
      if (error.code === 'auth/user-not-found') {
        message = 'Email không tồn tại trong hệ thống';
      }
      dispatch(setMessage({ type: 'error', message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPassword
      loading={loading}
      mailSending={mailSending}
      onSendVerifyCode={handleSendMail}
      onSubmit={handleResetPassword}
    />
  );
}

export default ForgotPasswordData;
