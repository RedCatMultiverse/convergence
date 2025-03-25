import SessionSelection from '@/components/ui/SessionSelection';
import { Box } from '@mui/material';

export default function SessionSelectionPage() {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#000000',
        minHeight: '100vh',
        color: '#00FF00',
        fontFamily: 'var(--font-geist-mono), monospace',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <SessionSelection />
    </Box>
  );
} 