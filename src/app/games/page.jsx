'use client';

import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

export default function GamesPage() {
  const games = [
    {
      title: 'SOFT SKILLS SIMULATOR',
      description: 'Experience our flagship simulation designed to enhance your communication and teamwork abilities.',
      icon: <SportsEsportsIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
      href: '/games/demo',
    },
    {
      title: 'LEADERSHIP CHALLENGE',
      description: 'Test your leadership skills in a series of increasingly complex scenarios.',
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
      href: '/games/demo',
    },
    {
      title: 'PROBLEM SOLVER',
      description: 'Sharpen your analytical thinking with our problem-solving simulation.',
      icon: <CodeIcon sx={{ fontSize: 40, color: '#00FF00' }} />,
      href: '/games/demo',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        minHeight: 'calc(100vh - 80px)', // Subtract navbar height
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{
            color: '#00FF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
            mb: 6,
          }}
        >
          {'> AVAILABLE SIMULATIONS'}
        </Typography>

        <Grid container spacing={4}>
          {games.map((game, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid #00FF00',
                  boxShadow: '0 0 5px #00FF00',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
                  },
                }}
              >
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {game.icon}
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        color: '#00FF00',
                        fontFamily: 'var(--font-geist-mono), monospace',
                        letterSpacing: '0.05em',
                        ml: 1,
                      }}
                    >
                      {game.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#00CC00',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      letterSpacing: '0.02em',
                      mb: 3,
                    }}
                  >
                    {game.description}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      component={Link}
                      href={game.href}
                      fullWidth
                      sx={{
                        borderColor: '#00FF00',
                        color: '#00FF00',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 0, 0.1)',
                          boxShadow: '0 0 10px #00FF00',
                        },
                      }}
                    >
                      LAUNCH
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 