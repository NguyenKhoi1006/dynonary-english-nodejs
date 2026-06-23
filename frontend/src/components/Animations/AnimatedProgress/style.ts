import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    width: '100%',
    height: (props: any) => props.height || 12,
    backgroundColor: (props: any) => props.bgColor || '#e5e5e5',
    borderRadius: (props: any) => (props.height || 12) / 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: (props: any) => props.color || 'var(--primary-color)',
    borderRadius: (props: any) => (props.height || 12) / 2,
    transition: (props: any) =>
      `width ${props.duration || 400}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  },
}));
