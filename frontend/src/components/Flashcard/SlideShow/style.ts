import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  wrapper: {
    height: 'calc(100vh - 20rem)',
  },

  skeleton: {
    borderTopLeftRadius: '64px',
    borderBottomRightRadius: '64px',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));
