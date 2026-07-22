import { Chip } from '@mui/material';
import { tokens } from '../../theme';

const STATUS_STYLES = {
  NOT_STARTED: { bg: '#EDF0F4', fg: '#5B6472', label: 'Not started' },
  PENDING: { bg: '#EDF0F4', fg: '#5B6472', label: 'Pending' },
  IN_PROGRESS: { bg: '#E4F3F1', fg: tokens.tealDark, label: 'In progress' },
  COMPLETED: { bg: '#E7F5EC', fg: tokens.success, label: 'Completed' },
  SUSPENDED: { bg: '#FBE9E7', fg: tokens.danger, label: 'Suspended' },
};

export default function StatusPill({ status, size = 'small' }) {
  const style = STATUS_STYLES[status] || { bg: '#EDF0F4', fg: '#5B6472', label: status };
  return (
    <Chip
      size={size}
      label={style.label}
      sx={{
        bgcolor: style.bg,
        color: style.fg,
        fontWeight: 700,
        '& .MuiChip-label': { px: 1.2 },
      }}
    />
  );
}
