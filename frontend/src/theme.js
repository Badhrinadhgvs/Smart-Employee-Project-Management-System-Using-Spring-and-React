import { createTheme } from '@mui/material/styles';

// ---- Design tokens -------------------------------------------------------
// Ink navy for structure, a working teal for primary actions, warm coral
// reserved strictly for HIGH priority signals, and a calm cool-gray canvas
// (not the generic warm-cream default) since this is a data-dense ops tool.
const tokens = {
  ink: '#111827',
  navy: '#3730A3',
  teal: '#0F766E',
  tealDark: '#115E59',
  coral: '#E11D48',
  amber: '#D97706',
  success: '#15803D',
  danger: '#BE123C',
  canvas: '#F5F7FB',
  surface: '#FFFFFF',
  line: '#E3E8EF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
};

export { tokens };

export function getTheme(mode = 'light') {
  const dark = mode === 'dark';
  const palette = {
    mode,
    primary: { main: dark ? '#A5B4FC' : tokens.navy, light: '#6366F1', dark: dark ? '#E0E7FF' : tokens.ink, contrastText: dark ? '#111827' : '#fff' },
    secondary: { main: dark ? '#5EEAD4' : tokens.teal, dark: tokens.tealDark, contrastText: dark ? '#042F2E' : '#fff' },
    error: { main: dark ? '#FF8C82' : tokens.danger }, warning: { main: dark ? '#F0C56B' : tokens.amber }, success: { main: dark ? '#63D99A' : tokens.success }, info: { main: tokens.coral },
    background: { default: dark ? '#0F172A' : tokens.canvas, paper: dark ? '#172033' : tokens.surface },
    text: { primary: dark ? '#F8FAFC' : tokens.textPrimary, secondary: dark ? '#A8B3C7' : tokens.textSecondary },
    divider: dark ? '#29364D' : tokens.line,
  };
  return createTheme({
  palette,
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
        body: { backgroundColor: dark ? '#0F172A' : tokens.canvas },
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
          backgroundColor: dark ? '#1D2B40' : '#F8FAFC',
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: tokens.ink, borderRight: 'none' },
      },
    },
  },
}); }

export default getTheme('light');
