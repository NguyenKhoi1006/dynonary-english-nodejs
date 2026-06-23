import ggIcon from 'assets/icons/gg-icon.png';
import { UX } from 'constant';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { loginWithGoogle } from 'services/auth.service';
import useStyle from './style';

function LoginGoogle() {
  const classes = useStyle();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      dispatch(
        setMessage({
          type: 'success',
          message: 'Đăng nhập thành công',
          duration: UX.DELAY_TIME,
        }),
      );

      setTimeout(() => {
        location.href = '/';
      }, UX.DELAY_TIME);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing
        return;
      }
      const message = 'Đăng nhập thất bại, thử lại !';
      dispatch(setMessage({ type: 'error', message }));
    }
  };

  return (
    <div onClick={handleGoogleLogin} className={classes.socialBtn}>
      <img className={classes.socialImg} src={ggIcon} alt="GG" />
      <span className={classes.socialName}>Google</span>
    </div>
  );
}

export default LoginGoogle;
