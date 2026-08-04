import { createTheme } from '@mui/material/styles';

/**
 * Tema corporativo do AquaSense: superfícies claras, bordas discretas
 * e tipografia compacta. Os tokens espelham as variáveis de global.css.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#005e99', light: '#0084d6', contrastText: '#ffffff' },
    secondary: { main: '#4a5f6d', contrastText: '#ffffff' },
    success: { main: '#1e7a4f' },
    warning: { main: '#c98a04' },
    error: { main: '#c0392b' },
    background: { default: '#f5f7f9', paper: '#ffffff' },
    text: { primary: '#16202a', secondary: '#5d6a75' },
    divider: '#e2e7ec',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.005em' },
    h3: { fontSize: '0.9375rem', fontWeight: 600 },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid #e2e7e4' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 4 },
        sizeSmall: { height: 22, fontSize: '0.6875rem' },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#16211d', fontSize: '0.6875rem', fontWeight: 400 },
      },
    },
  },
});

export default theme;
