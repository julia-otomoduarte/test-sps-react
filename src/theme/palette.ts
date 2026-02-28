

const palette = {
  primary: {
    lighter: '#d0e4ff',
    light:   '#1a5dc8',
    main:    '#003399',
    dark:    '#002277',
    darker:  '#001155',
    contrastText: '#ffffff',
  },


  accent: {
    lighter: '#ffe3cc',
    light:   '#ffaa66',
    main:    '#ff6600',
    dark:    '#e05500',
    darker:  '#b34200',
    contrastText: '#ffffff',
  },


  grey: {
    100: '#f5f5f5',
    200: '#e0e0e0',
    300: '#bdbdbd',
    400: '#9e9e9e',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#212121',
    900: '#111111',
  },


  success: {
    light:   '#4caf50',
    main:    '#2e7d32',
    dark:    '#1b5e20',
    contrastText: '#ffffff',
  },
  warning: {
    light:   '#ffb74d',
    main:    '#f57c00',
    dark:    '#e65100',
    contrastText: '#ffffff',
  },
  error: {
    light:   '#ef9a9a',
    main:    '#d32f2f',
    dark:    '#b71c1c',
    contrastText: '#ffffff',
  },
  info: {
    light:   '#4fc3f7',
    main:    '#0288d1',
    dark:    '#01579b',
    contrastText: '#ffffff',
  },


  gradient: {
    primary: 'linear-gradient(160deg, #002277 0%, #003399 50%, #1a5dc8 100%)',
    accentOverlay: 'linear-gradient(135deg, rgba(255,102,0,0.15) 0%, rgba(0,51,153,0.05) 100%)',
  },


  alpha: {
    white10:  'rgba(255, 255, 255, 0.10)',
    white15:  'rgba(255, 255, 255, 0.15)',
    white30:  'rgba(255, 255, 255, 0.30)',
    white50:  'rgba(255, 255, 255, 0.50)',
    white65:  'rgba(255, 255, 255, 0.65)',
    white75:  'rgba(255, 255, 255, 0.75)',
    white85:  'rgba(255, 255, 255, 0.85)',
    black10:  'rgba(0, 0, 0, 0.10)',
    black30:  'rgba(0, 0, 0, 0.30)',
    black50:  'rgba(0, 0, 0, 0.50)',
  },
} as const;

export default palette;
