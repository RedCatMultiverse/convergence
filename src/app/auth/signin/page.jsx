'use client';

import AuthProvider from '@/components/auth/Provider';
import { useSession, signIn } from 'next-auth/react';
import { Box, Button, Container, Divider, Typography, Collapse, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Link from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

const CheckUser = () => {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    console.log("User authorized");
    return <meta httpEquiv="refresh" content="0; URL='/'" />;
  }
};

const SignIn = () => {
  const theme = useTheme();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    signIn("email", { email: data.email });
  };

  return (
    <AuthProvider>
      <CheckUser />
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Box sx={{ width: '100%', height: 60, position: 'relative', mb: 4 }}>
            <Image
              src="/images/logo.png"
              alt="Red Cat Multiverse Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={() => signIn("google")}
            sx={{ mb: 2 }}
          >
            Sign in with Google
          </Button>

          <Divider sx={{ width: '100%', my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<EmailIcon />}
            onClick={() => setShowEmailForm(!showEmailForm)}
          >
            Sign in with Magic Link
          </Button>

          <Collapse in={showEmailForm} sx={{ width: '100%' }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Send Magic Link
              </Button>
            </Box>
          </Collapse>

          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center" 
            sx={{ mt: 3 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </AuthProvider>
  );
};

export default SignIn;