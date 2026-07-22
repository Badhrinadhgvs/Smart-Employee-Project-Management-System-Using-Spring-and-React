import { Box, Typography } from '@mui/material';
import { tokens } from '../../theme';

const PRIORITY_STYLES = {
  LOW: { color: '#5B6472', label: 'Low' },
  MEDIUM: { color: tokens.amber, label: 'Medium' },
  HIGH: { color: tokens.coral, label: 'High' },
};

// A small dot + label rather than another filled chip, so a task row reading
// left-to-right doesn't turn into a wall of same-shaped pills.
export default function PriorityPill({ priority }) {
  const style = PRIORITY_STYLES[priority] || { color: '#5B6472', label: priority };
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: style.color, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {style.label}
      </Typography>
    </Box>
  );
}
