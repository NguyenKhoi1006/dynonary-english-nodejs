import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMessage } from 'redux/slices/message.slice';
import { logoutUser } from 'services/auth.service';
import GlobalLoading from './UI/GlobalLoading';

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (!isAuth) {
      navigate(-1);
      return;
    }

    (async function () {
      try {
        await logoutUser();
        dispatch(
          setMessage({ type: 'success', message: 'Đăng xuất thành công' }),
        );
        window.location.href = window.location.pathname;
      } catch (error) {
        dispatch(
          setMessage({ type: 'error', message: 'Đăng xuất thất bại, thử lại' }),
        );
        navigate(-1);
      }
    })();

    return () => {};
  }, []);

  return <>{isAuth && <GlobalLoading title="Đang đang xuất ..." />}</>;
}

export default Logout;
