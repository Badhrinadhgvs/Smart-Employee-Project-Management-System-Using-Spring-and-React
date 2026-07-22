import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export default function EmptyState({ title = 'Nothing here yet', description, icon: Icon = InboxOutlinedIcon }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Icon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5, mb: 1.5 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360, mx: 'auto' }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
