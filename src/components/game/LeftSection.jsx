'use client';

import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import BugReportIcon from '@mui/icons-material/BugReport';

const LeftSection = ({ title = "CONTROL PANEL" }) => {
  const menuItems = [
    { icon: <MemoryIcon sx={{ color: '#00FF00' }} />, label: 'SYSTEM STATUS' },
    { icon: <StorageIcon sx={{ color: '#00FF00' }} />, label: 'DATA STORAGE' },
    { icon: <CodeIcon sx={{ color: '#00FF00' }} />, label: 'COMMAND LINE' },
    { icon: <BugReportIcon sx={{ color: '#00FF00' }} />, label: 'DEBUG TOOLS' },
    { icon: <SettingsIcon sx={{ color: '#00FF00' }} />, label: 'SETTINGS' },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        border: '1px solid #00FF00',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        boxShadow: '0 0 5px #00FF00',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00FF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 5px #00FF00',
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <List sx={{ width: '100%', p: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index}
              sx={{ 
                py: 1.5,
                borderBottom: index < menuItems.length - 1 ? '1px solid rgba(0, 255, 0, 0.1)' : 'none',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  sx: {
                    color: '#00CC00',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 255, 0, 0.3)' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#00CC00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.02em',
            display: 'block',
            opacity: 0.7,
          }}
        >
          {'> SYSTEM READY'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00CC00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.02em',
            display: 'block',
            opacity: 0.7,
          }}
        >
          {'> AWAITING INPUT...'}
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftSection; 