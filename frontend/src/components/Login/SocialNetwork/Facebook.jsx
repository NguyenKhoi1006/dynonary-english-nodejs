import fbIcon from 'assets/icons/fb-icon.png';
import { UX } from 'constant';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { loginWithFacebook } from 'services/auth.service';
import useStyle from './style';

function LoginFacebook() {
  const classes = useStyle();
  const dispatch = useDispatch();

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
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
        return;
      }
      const message = 'Đăng nhập thất bại, thử lại !';
      dispatch(setMessage({ type: 'error', message }));
    }
  };

  return (
    <div onClick={handleFacebookLogin} className={classes.socialBtn}>
      <img className={classes.socialImg} src={fbIcon} alt="FB" />
      <span className={classes.socialName}>Facebook</span>
    </div>
  );
}

export default LoginFacebook;
