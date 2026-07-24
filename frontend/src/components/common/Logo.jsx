import { Box, Typography } from '@mui/material';
import logoImg from '../../assets/logo.png';

/**
 * Custom Logo component using the logo image from docs/logo/logo.png
 */
export default function Logo({ size = 36, showText = true, textColor = '#ffffff', subtitleColor = 'rgba(255,255,255,0.5)' }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, userSelect: 'none' }}>
      <Box
        component="img"
        src={logoImg || '/logo.png'}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/logo.png';
        }}
        alt="Smart Emp Logo"
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 2,
          bgcolor: '#ffffff',
          p: 0.25,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          flexShrink: 0,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />

      {showText && (
        <Box>
          <Typography
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontSize: size > 30 ? '1.05rem' : '0.9rem',
              lineHeight: 1.1,
              color: textColor,
              letterSpacing: '-0.02em',
            }}
          >
            Smart Emp
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: subtitleColor,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mt: 0.25,
            }}
          >
            Project & Task Ops
          </Typography>
        </Box>
      )}
    </Box>
  );
}
