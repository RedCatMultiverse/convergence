'use client';

import { Box } from '@mui/material';

export default function GamesLayout({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
} 