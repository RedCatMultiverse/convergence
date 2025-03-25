'use client';

import { useSession } from 'next-auth/react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Divider
} from '@mui/material';
import Link from 'next/link';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from 'react';
import SanuraWelcome from '@/components/ui/SanuraWelcome';

const features = [
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
    title: 'PLAY GAMES',
    description: 'Engage in interactive games designed to develop your soft skills in a fun environment.'
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
    title: 'LEARN SKILLS',
    description: 'Develop essential soft skills through our carefully crafted learning experiences.'
  },
  {
    icon: <CodeIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
    title: 'TRACK PROGRESS',
    description: 'Monitor your skill development and achievements through our advanced tracking system.'
  }
];

// Typing effect component
const TypingEffect = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);
  
  return (
    <span>{displayText}<span className="cursor">_</span></span>
  );
};

export default function Home() {
  const { data: session, status } = useSession();
  const [typingComplete, setTypingComplete] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [sanuraComplete, setSanuraComplete] = useState(false);

  useEffect(() => {
    // Add blinking cursor effect
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .cursor {
        animation: blink 1s infinite;
      }
    `;
    document.head.appendChild(style);
    
    // Set a timeout to show features for non-authenticated users
    if (!session) {
      setTimeout(() => {
        setShowFeatures(true);
      }, 1500);
      
      // Set a timeout to show login prompt
      setTimeout(() => {
        setShowLoginPrompt(true);
      }, 3000);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, [session]);

  // Handle Sanura sequence completion
  const handleSanuraComplete = () => {
    setSanuraComplete(true);
    setShowFeatures(true);
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'relative',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'black',
          borderRadius: 0,
          borderBottom: '1px solid #00FF00',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h1" 
              component="h1" 
              color="#00FF00"
              gutterBottom
              sx={{ 
                fontWeight: 600, 
                textShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                letterSpacing: '0.05em',
                mb: 3
              }}
            >
              RED CAT MULTIVERSE
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              {session ? (
                <>
                  <TypingEffect 
                    text="WELCOME TO THE SYSTEM, " 
                    speed={50}
                    onComplete={() => setTimeout(() => setShowFeatures(true), 500)}
                  />
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: '#FFAA00', 
                      textShadow: '0 0 5px #FFAA00',
                      fontFamily: 'var(--font-geist-mono), monospace'
                    }}
                  >
                    {session.user.name.toUpperCase()}
                  </Typography>
                </>
              ) : (
                <TypingEffect 
                  text="INITIALIZING SYSTEM... ACCESS GRANTED TO PUBLIC INTERFACE" 
                  speed={50}
                />
              )}
            </Box>
            
            <Divider sx={{ 
              borderColor: 'rgba(0, 255, 0, 0.3)', 
              my: 4,
              '&::before, &::after': {
                borderColor: 'rgba(0, 255, 0, 0.3)',
              }
            }} />
            
            {session ? (
              <SanuraWelcome isAuthenticated={true} username={session.user.name} onComplete={handleSanuraComplete} />
            ) : (
              <>
                <Typography 
                  variant="h5" 
                  color="#00CC00" 
                  sx={{ 
                    mb: 4, 
                    maxWidth: 800,
                    fontFamily: 'var(--font-geist-mono), monospace',
                    letterSpacing: '0.02em',
                  }}
                >
                  LEVEL UP YOUR SOFT SKILLS IN THE DIGITAL REALM
                </Typography>
                
                {showLoginPrompt && (
                  <Button 
                    variant="outlined" 
                    size="large"
                    component={Link}
                    href="/auth/signin"
                    startIcon={<LockIcon />}
                    sx={{ 
                      borderColor: '#00FF00',
                      color: '#00FF00',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                      }
                    }}
                  >
                    LOGIN TO ACCESS FULL SYSTEM
                  </Button>
                )}
              </>
            )}
          </Box>
        </Container>
      </Paper>

      {/* Features Section - Only show when appropriate */}
      {(!session || (session && sanuraComplete)) && showFeatures && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            color="#00FF00"
            align="center"
            sx={{ 
              mb: 6, 
              fontFamily: 'var(--font-geist-mono), monospace',
              letterSpacing: '0.05em',
              textShadow: '0 0 5px #00FF00',
            }}
          >
            {'> SYSTEM CAPABILITIES'}
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid #00FF00',
                    boxShadow: '0 0 5px #00FF00',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                    }
                  }}
                >
                  <Box sx={{ 
                    color: '#00FF00',
                    mb: 2
                  }}>
                    {feature.icon}
                  </Box>
                  <CardContent>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 500,
                        color: '#00FF00',
                        fontFamily: 'var(--font-geist-mono), monospace',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="#00CC00"
                      sx={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography 
              variant="body1" 
              color="#00CC00"
              sx={{ 
                fontFamily: 'var(--font-geist-mono), monospace',
                letterSpacing: '0.02em',
                mb: 2
              }}
            >
              {session ? (
                '> READY TO BEGIN YOUR JOURNEY?'
              ) : (
                '> AUTHENTICATION REQUIRED FOR FULL ACCESS'
              )}
            </Typography>
            
            {session ? (
              <Button 
                variant="outlined" 
                component={Link}
                href="/profile"
                startIcon={<TerminalIcon />}
                sx={{ 
                  borderColor: '#00FF00',
                  color: '#00FF00',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                  }
                }}
              >
                ACCESS PROFILE
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                component={Link}
                href="/auth/signin"
                startIcon={<LockIcon />}
                sx={{ 
                  borderColor: '#00FF00',
                  color: '#00FF00',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                  }
                }}
              >
                LOGIN
              </Button>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
}
