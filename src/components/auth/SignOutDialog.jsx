import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

export const SignOutDialog = ({ open, onClose }) => {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      disableScrollLock
      PaperProps={{
        elevation: 1,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>Sign Out</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to sign out?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSignOut} 
          variant="contained"
          color="primary"
        >
          Sign Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 