'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Copyright } from '@/components/ui/Copyright';

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorType) => {
    switch (errorType) {
      case 'AccessDenied':
        return 'Access denied. You are not authorized to sign in with this email address.';
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'Verification':
        return 'The verification link may have expired or already been used.';
      default:
        return 'An error occurred during sign-in. Please try again or contact support if the problem persists.';
    }
  };

  return (
    <Box
      component="main"
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
        <ErrorOutlineIcon
          sx={{ 
            fontSize: 60, 
            mb: 2,
            color: 'error.main'
          }}
        />

        <Typography variant="h5" gutterBottom>
          Sign In Error
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {getErrorMessage(error)}
        </Typography>

        <Button
          component={Link}
          href="/auth/signin"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Return to Sign In
        </Button>
      </Box>
    </Box>
  );
};

// Wrap the component with Suspense
const ErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;
