'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Link from 'next/link';
import { Copyright } from '@/components/ui/Copyright';

const VerifyRequest = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '400px',
        px: 2
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 1,
          textAlign: 'center',
        }}
      >
        <MarkEmailReadIcon
          sx={{ 
            fontSize: 60, 
            mb: 2,
            color: 'primary.main'
          }}
        />

        <Typography variant="h5" gutterBottom>
          Check Your Email
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We've sent a magic link to your email. Please check your inbox and click the link to sign in.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/"
          fullWidth
          sx={{ mt: 1 }}
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyRequest;
