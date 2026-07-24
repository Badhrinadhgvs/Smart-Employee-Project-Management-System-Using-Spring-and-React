import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

export default function ExportMenu({ onExportCsv, onExportPdf, buttonText = 'Export', size = 'small', variant = 'outlined' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCsv = () => {
    handleClose();
    if (onExportCsv) onExportCsv();
  };

  const handlePdf = () => {
    handleClose();
    if (onExportPdf) onExportPdf();
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        color="secondary"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 160, mt: 0.5 },
        }}
      >
        <MenuItem onClick={handleCsv}>
          <ListItemIcon>
            <TableChartOutlinedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Export CSV" />
        </MenuItem>
        <MenuItem onClick={handlePdf}>
          <ListItemIcon>
            <PictureAsPdfOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Export PDF" />
        </MenuItem>
      </Menu>
    </>
  );
}
