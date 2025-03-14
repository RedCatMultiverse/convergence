'use client';

import { useState } from 'react';
import Image from "next/image";
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Button,
  Divider
} from "@mui/material";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';
import LockIcon from '@mui/icons-material/Lock';
import { SignOutDialog } from '../auth/SignOutDialog';

const navigationLinks = [
  { name: 'GAMES', href: '/games' },
  { name: 'ABOUT', href: '/about' },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  // Don't show anything until we know the session status
  if (status === 'loading') {
    return null;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'black',
        borderBottom: '1px solid #00FF00',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            height: 80,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 4
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/">
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: '#00FF00',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  textShadow: '0 0 5px #00FF00, 0 0 10px #00FF00',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TerminalIcon sx={{ fontSize: 28 }} />
                RCM&gt;_
              </Typography>
            </Link>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 4,
            flex: 1,
            justifyContent: 'center'
          }}>
            {navigationLinks.map((link) => (
              <Typography
                key={link.name}
                component={Link}
                href={link.href}
                sx={{
                  color: '#00FF00',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.975rem',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  letterSpacing: '0.05em',
                  position: 'relative',
                  padding: '4px 8px',
                  '&:hover': {
                    textShadow: '0 0 5px #00FF00, 0 0 10px #00FF00',
                    '&::before': {
                      width: '100%',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '0%',
                    height: '1px',
                    backgroundColor: '#00FF00',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 5px #00FF00',
                  }
                }}
              >
                {link.name}
              </Typography>
            ))}
          </Box>

          {/* Auth Section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {session ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  alt={session.user.name}
                  src={session.user.image}
                  onClick={handleMenuOpen}
                  sx={{ 
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    border: '1px solid #00FF00',
                    backgroundColor: 'black',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 0 5px #00FF00',
                    '&:hover': {
                      boxShadow: '0 0 10px #00FF00, 0 0 15px #00FF00',
                    }
                  }}
                >
                  {!session.user.image && <CodeIcon sx={{ color: '#00FF00' }} />}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  disableScrollLock
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        backgroundColor: 'black',
                        border: '1px solid #00FF00',
                        boxShadow: '0 0 10px #00FF00',
                      }
                    }
                  }}
                >
                  <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 255, 0, 0.3)' }}>
                    <Typography variant="subtitle2" color="#00CC00" sx={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                      USER:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>
                      {session.user.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="#00CC00"
                      sx={{ 
                        display: 'block',
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-geist-mono), monospace'
                      }}
                    >
                      {session.user.email}
                    </Typography>
                  </Box>
                  
                  <MenuItem 
                    component={Link} 
                    href="/profile"
                    sx={{ py: 1.5, px: 3 }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" sx={{ color: '#00FF00' }} />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>PROFILE</Typography>
                  </MenuItem>
                  
                  <MenuItem 
                    onClick={handleSignOutClick}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" sx={{ color: '#00FF00' }} />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>LOGOUT</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                variant="outlined"
                component={Link}
                href="/auth/signin"
                startIcon={<LockIcon />}
                sx={{
                  borderRadius: '0px',
                  textTransform: 'uppercase',
                  px: 3,
                  border: '1px solid #00FF00',
                  color: '#00FF00',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    boxShadow: '0 0 10px #00FF00',
                  }
                }}
              >
                LOGIN
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      <SignOutDialog 
        open={signOutDialogOpen}
        onClose={() => setSignOutDialogOpen(false)}
      />
    </AppBar>
  );
};

export default Navbar; 