import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  page: {
    minHeight: 'calc(100vh - 7.2rem)',
    padding: '2.4rem 0',
  },

  /* ── Profile Card ── */
  profileCard: {
    backgroundColor: 'var(--bg-color-sec)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--box-shadow)',
    padding: '3rem',
    textAlign: 'center',
    height: '100%',
  },

  avtWrap: {
    width: '12rem',
    height: '12rem',
    position: 'relative',
    margin: '0 auto',
  },

  avt: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  cameraIconWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '3.6rem',
    height: '3.6rem',
    padding: '0.8rem',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'solid 4px var(--bg-color-sec)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover, &:active': { opacity: 0.85 },
  },

  cameraIcon: {
    color: 'var(--text-color)',
    fontSize: '1.6rem',
  },

  name: {
    fontSize: '2.2rem',
    fontWeight: 700,
    marginTop: '1.6rem',
    lineHeight: 1.4,
  },

  username: {
    fontSize: '1.4rem',
    color: 'var(--label-color)',
    fontWeight: 400,
  },

  editInput: {
    marginBottom: '0.8rem',
  },

  /* ── Stat Card ── */
  statCard: {
    backgroundColor: 'var(--bg-color-sec)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--box-shadow)',
    padding: '2rem',
    textAlign: 'center',
    height: '100%',
  },

  statIcon: {
    fontSize: '2.8rem',
    marginBottom: '0.8rem',
  },

  statValue: {
    fontSize: '2.4rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },

  statLabel: {
    fontSize: '1.3rem',
    color: 'var(--label-color)',
    marginTop: '0.2rem',
  },

  /* ── Section ── */
  section: {
    backgroundColor: 'var(--bg-color-sec)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--box-shadow)',
    padding: '2.4rem',
    marginTop: '2rem',
  },

  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '1.6rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },

  /* ── Level Bar ── */
  levelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    marginBottom: '1.2rem',
    padding: '0.8rem 1.2rem',
    borderRadius: 'var(--border-radius)',
    transition: 'background-color 0.2s',
    '&:hover': { backgroundColor: 'var(--hover-color)' },
  },

  levelBadge: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.4rem',
    flexShrink: 0,
  },

  levelInfo: { flex: 1, minWidth: 0 },

  levelName: {
    fontSize: '1.4rem',
    fontWeight: 600,
  },

  levelDetail: {
    fontSize: '1.2rem',
    color: 'var(--label-color)',
  },

  progressTrack: {
    height: '0.6rem',
    borderRadius: '0.3rem',
    backgroundColor: 'var(--border-color)',
    marginTop: '0.4rem',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: '0.3rem',
    transition: 'width 0.5s ease',
  },

  /* ── Membership ── */
  membershipBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 1.6rem',
    borderRadius: '2rem',
    fontWeight: 600,
    fontSize: '1.4rem',
  },

  /* ── Activity Timeline ── */
  timeline: {
    position: 'relative',
    paddingLeft: '2rem',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '0.6rem',
      top: 0,
      bottom: 0,
      width: '0.2rem',
      backgroundColor: 'var(--border-color)',
    },
  },

  timelineItem: {
    position: 'relative',
    paddingBottom: '1.6rem',
    '&:last-child': { paddingBottom: 0 },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-1.55rem',
      top: '0.4rem',
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-color)',
      border: '2px solid var(--bg-color-sec)',
    },
  },

  timelineTitle: {
    fontSize: '1.4rem',
    fontWeight: 500,
  },

  timelineMeta: {
    fontSize: '1.2rem',
    color: 'var(--label-color)',
  },

  /* ── Quick actions ── */
  actionRow: {
    display: 'flex',
    gap: '1.2rem',
    marginTop: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));
