import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';

export function Copyright({ disableLink, ...props }) {
  return (
    <Box 
      sx={{ 
        borderTop: '1px solid rgba(0, 255, 0, 0.3)',
        py: 2,
        backgroundColor: 'black',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          color: '#00CC00',
          fontFamily: 'var(--font-geist-mono), monospace',
          letterSpacing: '0.02em',
          fontSize: '0.875rem',
        }}
      >
        <CodeIcon fontSize="small" sx={{ color: '#00FF00' }} />
        <span style={{ color: '#00CC00' }}>[C] {new Date().getFullYear()} </span>
        {disableLink ? (
          <span style={{ color: '#00FF00' }}>RED CAT MULTIVERSE</span>
        ) : (
          <Link 
            href="/" 
            sx={{
              color: '#00FF00',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                textShadow: '0 0 5px #00FF00, 0 0 10px #00FF00',
              }
            }}
          >
            RED CAT MULTIVERSE
          </Link>
        )}
        <span style={{ color: '#00CC00' }}> // ALL RIGHTS RESERVED</span>
      </Box>
    </Box>
  );
} 