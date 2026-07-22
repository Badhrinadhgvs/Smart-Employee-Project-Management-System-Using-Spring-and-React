import { createTheme } from '@mui/material/styles';

// ---- Design tokens -------------------------------------------------------
// Ink navy for structure, a working teal for primary actions, warm coral
// reserved strictly for HIGH priority signals, and a calm cool-gray canvas
// (not the generic warm-cream default) since this is a data-dense ops tool.
const tokens = {
  ink: '#141B2E',
  navy: '#1B2A4A',
  teal: '#0E8F82',
  tealDark: '#0B6F65',
  coral: '#E8703A',
  amber: '#D9A441',
  success: '#2FA36B',
  danger: '#D64545',
  canvas: '#F3F6F9',
  surface: '#FFFFFF',
  line: '#E3E8EF',
  textPrimary: '#16233F',
  textSecondary: '#5B6472',
};

export { tokens };

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.navy, light: '#2C3E63', dark: tokens.ink, contrastText: '#fff' },
    secondary: { main: tokens.teal, dark: tokens.tealDark, contrastText: '#fff' },
    error: { main: tokens.danger },
    warning: { main: tokens.amber },
    success: { main: tokens.success },
    info: { main: tokens.coral },
    background: { default: tokens.canvas, paper: tokens.surface },
    text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
    divider: tokens.line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    subtitle2: { fontWeight: 600, color: tokens.textSecondary },
    overline: { fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.08em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.canvas },
        '::selection': { backgroundColor: tokens.teal, color: '#fff' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: tokens.line },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.line}`,
          boxShadow: '0 1px 2px rgba(20,27,46,0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16 },
        containedPrimary: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: tokens.textSecondary,
          backgroundColor: '#F8FAFC',
          borderBottom: `1px solid ${tokens.line}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: tokens.ink, borderRight: 'none' },
      },
    },
  },
});

export default theme;
