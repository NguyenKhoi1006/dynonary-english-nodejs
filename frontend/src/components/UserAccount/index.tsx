import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InputCustom from 'components/UI/InputCustom';
import { DEFAULTS, MAX, ROUTES } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import { setMessage } from 'redux/slices/message.slice';
import PropTypes from 'prop-types';
import useStyle from './style';

const LEVEL_NAMES = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
  B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient',
};

const LEVEL_COLORS = {
  A1: '#4caf50', A2: '#8bc34a', B1: '#ff9800',
  B2: '#ff5722', C1: '#9c27b0', C2: '#e91e63',
};

function UserAccount({
  email,
  createdDate,
  onUpload,
  onUpdateProfile,
  progressData,
  membership,
  membershipExpiry,
}) {
  const navigate = useNavigate();
  const userInfo = useSelector((s) => s.userInfo);
  const { username, name, avt, coin, xp, level } = userInfo;
  const avtSrc = avt ? cloudinaryImgOptimize(avt, 150, 150) : DEFAULTS.IMAGE_SRC;
  const classes = useStyle();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef({ name, username });
  const [errors, setErrors] = useState({ name: false, username: false });

  const handleInputChange = (v, type = 0) => {
    if (type) {
      if (errors.name && v) setErrors((p) => ({ ...p, name: false }));
      inputRef.current.name = v;
    } else {
      if (errors.username && v) setErrors((p) => ({ ...p, username: false }));
      inputRef.current.username = v;
    }
  };

  const handleCloseEdit = () => {
    inputRef.current = { name, username };
    setEditMode(false);
  };

  const handleUpdate = () => {
    const n = inputRef.current.name.trim();
    const u = inputRef.current.username.trim();

    if (n === name && u === username) return;
    if (!n) { setErrors({ ...errors, name: true }); dispatch(setMessage({ type: 'error', message: 'Vui lòng nhập tên' })); return; }
    if (!u) { setErrors({ ...errors, username: true }); dispatch(setMessage({ type: 'error', message: 'Vui lòng nhập username' })); return; }
    if (u.includes(' ')) { setErrors({ ...errors, username: true }); dispatch(setMessage({ type: 'error', message: 'Username không chứa khoảng trống' })); return; }
    if (u.length > MAX.USERNAME_LEN) { setErrors({ ...errors, username: true }); dispatch(setMessage({ type: 'error', message: `Username tối đa ${MAX.USERNAME_LEN} ký tự` })); return; }
    if (n.length > MAX.NAME_LEN) { setErrors({ ...errors, name: true }); dispatch(setMessage({ type: 'error', message: `Tên tối đa ${MAX.NAME_LEN} ký tự` })); return; }

    onUpdateProfile(n, u);
  };

  // Derive activity list from progressData if available
  const levels = progressData?.levels || {};
  const totalStudyDays = progressData?.totalStudyDays || 0;
  const totalXp = progressData?.totalXp || xp || 0;

  // Build activity timeline from level data
  const buildTimeline = () => {
    const items = [];
    if (totalStudyDays > 0) items.push({ icon: <WhatshotIcon />, title: `${totalStudyDays} ngày học`, meta: 'Tổng số ngày đã học' });
    if (totalXp > 0) items.push({ icon: <EmojiEventsIcon />, title: `${totalXp} XP`, meta: 'Tổng điểm kinh nghiệm' });
    Object.entries(levels).forEach(([lvl, data]) => {
      if (data.status === 'completed') items.push({ icon: <CheckCircleIcon />, title: `Hoàn thành cấp độ ${lvl}`, meta: LEVEL_NAMES[lvl] || lvl });
    });
    return items;
  };
  const timeline = buildTimeline();

  // Membership display
  const isPremium = membership === 'premium';
  const premiumExpiryDate = membershipExpiry
    ? new Date(membershipExpiry).toLocaleDateString('vi-VN')
    : null;

  const stats = [
    { icon: <WhatshotIcon sx={{ color: '#ff9800' }} />, value: totalXp, label: 'Tổng XP' },
    { icon: <AutoStoriesIcon sx={{ color: '#1976d2' }} />, value: level || '—', label: 'Cấp độ' },
    { icon: <EmojiEventsIcon sx={{ color: '#4caf50' }} />, value: totalStudyDays, label: 'Ngày học' },
    { icon: <MonetizationOnIcon sx={{ color: '#f57c00' }} />, value: coin, label: 'Coin' },
  ];

  const fileInputRef = useRef(null);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type & size
    if (!file.type.startsWith('image/')) {
      dispatch(setMessage({ type: 'error', message: 'File phải là ảnh' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      dispatch(setMessage({ type: 'error', message: 'Ảnh tối đa 5MB' }));
      return;
    }

    // Read as base64 then upload
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.onerror = () => dispatch(setMessage({ type: 'error', message: 'Đọc file thất bại' }));
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className={`${classes.page} container`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        {/* ── Profile Card ── */}
        <div className={classes.profileCard}>
          <div className={classes.avtWrap}>
            <img className={classes.avt} src={avtSrc} alt="Avatar" />
            <div className={classes.cameraIconWrap} onClick={() => fileInputRef.current?.click()}>
              <CameraIcon className={classes.cameraIcon} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFilePick}
              />
            </div>
          </div>

          {!editMode ? (
            <>
              <h2 className={classes.name}>{name}</h2>
              <p className={classes.username}>@{username}</p>
              <div style={{ margin: '1.6rem 0', fontSize: '1.4rem', color: 'var(--label-color)', lineHeight: 2 }}>
                {email && <p>{email}</p>}
                {createdDate && <p>Đã tham gia {createdDate}</p>}
              </div>
              <Button
                onClick={() => setEditMode(true)}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                fullWidth
              >
                Chỉnh sửa
              </Button>
            </>
          ) : (
            <div style={{ marginTop: '1.6rem' }}>
              <InputCustom
                onChange={(e) => handleInputChange(e.target.value, 1)}
                className={classes.editInput}
                placeholder={name}
                label="Nhập tên"
                error={errors.name}
                defaultValue={name}
              />
              <InputCustom
                onChange={(e) => handleInputChange(e.target.value, 0)}
                className={classes.editInput}
                placeholder={username}
                label="Nhập username"
                error={errors.username}
                defaultValue={username}
              />
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <Button variant="outlined" color="inherit" onClick={handleCloseEdit} fullWidth>
                  Huỷ
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpdate} fullWidth>
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          {stats.map((s) => (
            <div key={s.label} className={classes.statCard}>
              <div className={classes.statIcon}>{s.icon}</div>
              <div className={classes.statValue}>{s.value}</div>
              <div className={classes.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Membership Card ── */}
        <div className={classes.profileCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {isPremium ? <WorkspacePremiumIcon sx={{ color: '#ffc107', fontSize: '4rem' }} /> : <LockOpenIcon sx={{ color: 'var(--label-color)', fontSize: '4rem' }} />}
          </div>
          <div className={isPremium ? classes.membershipBadge : classes.membershipBadge}
            style={{
              backgroundColor: isPremium ? '#fff8e1' : '#f5f5f5',
              color: isPremium ? '#f57f17' : '#757575',
              margin: '0 auto 1.2rem',
            }}
          >
            {isPremium ? <WorkspacePremiumIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
            {isPremium ? 'Gói Premium' : 'Gói Miễn phí'}
          </div>
          {isPremium && premiumExpiryDate && (
            <p style={{ fontSize: '1.3rem', color: 'var(--label-color)', marginBottom: '1.2rem' }}>
              Hạn đến: {premiumExpiryDate}
            </p>
          )}
          {!isPremium && (
            <p style={{ fontSize: '1.3rem', color: 'var(--label-color)', marginBottom: '1.2rem' }}>
              Nâng cấp để mở khoá toàn bộ tính năng
            </p>
          )}
          <Button
            variant={isPremium ? 'outlined' : 'contained'}
            color="warning"
            fullWidth
            onClick={() => window.location.href = '/learner/level-up'}
          >
            {isPremium ? 'Quản lý gói' : 'Nâng cấp ngay'}
          </Button>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className={classes.actionRow}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SchoolIcon />}
          onClick={() => navigate(ROUTES.LEARNER.PROGRESS)}
        >
          Xem lộ trình
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<RocketLaunchIcon />}
          onClick={() => navigate(ROUTES.LEARNER.LEVEL_UP)}
        >
          Làm bài kiểm tra lên cấp
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AutoStoriesIcon />}
          onClick={() => navigate(ROUTES.LEARNER.MATERIALS)}
        >
          Bài học
        </Button>
      </div>

      {/* ── Level Progress Section ── */}
      {Object.keys(levels).length > 0 && (
        <div className={classes.section}>
          <h3 className={classes.sectionTitle}>
            <AutoStoriesIcon color="primary" />
            Tiến trình cấp độ
          </h3>
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
            const data = levels[lvl];
            if (!data) return null;
            const isLocked = data.status === 'locked';
            const isCompleted = data.status === 'completed';
            const isCurrent = lvl === level;
            const progress = data.progress || 0;
            const color = LEVEL_COLORS[lvl] || '#1976d2';

            return (
              <div key={lvl} className={classes.levelRow}
                style={{ opacity: isLocked ? 0.4 : 1 }}
              >
                <div className={classes.levelBadge}
                  style={{
                    backgroundColor: isCompleted ? color : isLocked ? '#e0e0e0' : `${color}22`,
                    color: isCompleted ? '#fff' : isLocked ? '#999' : color,
                    border: isCurrent ? `3px solid ${color}` : 'none',
                  }}
                >
                  {lvl}
                </div>
                <div className={classes.levelInfo}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={classes.levelName}>{LEVEL_NAMES[lvl]}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color }}>
                      {isCompleted ? '100%' : `${progress}%`}
                    </span>
                  </div>
                  <div className={classes.progressTrack}>
                    <div className={classes.progressFill}
                      style={{
                        width: `${isCompleted ? 100 : progress}%`,
                        backgroundColor: isCompleted ? color : color,
                      }}
                    />
                  </div>
                  <span className={classes.levelDetail}>
                    {isCompleted ? 'Đã hoàn thành' : isLocked ? 'Khoá' : `Đang học · ${data.materialsCompleted?.length || 0} bài học`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Activity Timeline ── */}
      {timeline.length > 0 && (
        <div className={classes.section}>
          <h3 className={classes.sectionTitle}>
            <EmojiEventsIcon color="warning" />
            Lịch sử học tập
          </h3>
          <div className={classes.timeline}>
            {timeline.map((item, i) => (
              <div key={i} className={classes.timelineItem}>
                <div className={classes.timelineTitle}>{item.title}</div>
                <div className={classes.timelineMeta}>{item.meta}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

UserAccount.propTypes = {
  email: PropTypes.string,
  createdDate: PropTypes.string,
  onUpload: PropTypes.func,
  onUpdateProfile: PropTypes.func,
  progressData: PropTypes.object,
  membership: PropTypes.string,
  membershipExpiry: PropTypes.string,
};

export default UserAccount;
