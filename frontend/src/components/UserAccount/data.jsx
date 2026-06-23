import { formatDate } from 'helper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setUserAvt } from 'redux/slices/userInfo.slice';
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from 'services/firestore.service';
import api from 'services/api';
import UserAccount from '.';

function UserAccountData() {
  const [userInfo, setUserInfo] = useState({ email: null, createdDate: null });
  const [progressData, setProgressData] = useState(null);
  const dispatch = useDispatch();
  const { uid, membership } = useSelector((state) => state.userInfo);

  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const profile = await getUserProfile(uid);
        if (profile && isSub) {
          const { email, createdDate, membershipExpiry } = profile;
          setUserInfo({
            email: email || null,
            createdDate: createdDate
              ? formatDate(new Date(createdDate))
              : null,
            membershipExpiry,
          });
        }
      } catch (error) {
        console.error('Failed to load user profile');
      }
    })();

    // Fetch progress/learning data
    (async function () {
      try {
        const res = await api.get('/apis/learner/progress/');
        if (isSub) setProgressData(res.data);
      } catch {
        // progress might not exist yet for new users
      }
    })();

    return () => (isSub = false);
  }, [uid]);

  const handleUploadAvt = async (imgBase64) => {
    try {
      if (!imgBase64) return;
      const res = await fetch(imgBase64);
      const blob = await res.blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const newSrc = await uploadAvatar(uid, file);
      dispatch(
        setMessage({
          type: 'success',
          message: 'Cập nhật ảnh đại diện thành công',
        }),
      );
      dispatch(setUserAvt(newSrc));
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: 'Cập nhật ảnh đại diện thất bại. Thử lại',
        }),
      );
    }
  };

  const handleUpdateProfile = async (name, username) => {
    try {
      await updateUserProfile(uid, { name, username });
      dispatch(
        setMessage({
          type: 'success',
          message: 'Cập nhật thông tin thành công',
          duration: 500,
        }),
      );
      setTimeout(() => {
        location.reload();
      }, 750);
    } catch (error) {
      dispatch(setMessage({ type: 'error', message: 'Chỉnh sửa thông tin thất bại, thử lại !' }));
    }
  };

  return (
    <UserAccount
      email={userInfo.email}
      createdDate={userInfo.createdDate}
      membershipExpiry={userInfo.membershipExpiry}
      onUpload={handleUploadAvt}
      onUpdateProfile={handleUpdateProfile}
      progressData={progressData}
      membership={membership}
    />
  );
}

export default UserAccountData;
