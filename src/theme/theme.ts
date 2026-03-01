import { createTheme } from '@mui/material/styles';
import palette from './palette';

const theme = createTheme({
  palette: {
    primary: palette.primary,
    secondary: palette.accent,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    grey: palette.grey,
    background: {
      default: palette.grey[100],
      paper: '#ffffff',
    },
    divider: palette.grey[300],
  },
});

export default theme;
