'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';

const CenterSection = ({ title = "MAIN DISPLAY" }) => {
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(0);

  // Simulate console output
  useEffect(() => {
    if (isRunning) {
      const messages = [
        "Initializing simulation module...",
        "Loading scenario parameters...",
        "Establishing connection to virtual environment...",
        "Calibrating response metrics...",
        "Analyzing previous performance data...",
        "Generating adaptive challenge sequence...",
        "Preparing interactive elements...",
        "Simulation ready for user engagement.",
        "Monitoring user responses...",
        "Adjusting difficulty based on performance...",
      ];

      const interval = setInterval(() => {
        if (counter < messages.length) {
          setConsoleOutput(prev => [...prev, messages[counter]]);
          setCounter(prev => prev + 1);
        } else {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, counter]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setConsoleOutput([]);
    setCounter(0);
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        border: '1px solid #00FF00',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        boxShadow: '0 0 5px #00FF00',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00FF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 5px #00FF00',
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
      <Box 
        sx={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          p: 2, 
          borderRadius: 1,
          border: '1px solid rgba(0, 255, 0, 0.3)',
          overflow: 'auto',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.875rem',
          color: '#00CC00',
          mb: 2
        }}
      >
        {consoleOutput.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: '#00CC00',
              fontFamily: 'var(--font-geist-mono), monospace',
              opacity: 0.7,
            }}
          >
            {'> SIMULATION READY. PRESS START TO BEGIN.'}
          </Typography>
        ) : (
          consoleOutput.map((line, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: '#00CC00',
                fontFamily: 'var(--font-geist-mono), monospace',
                mb: 1,
                display: 'flex',
              }}
            >
              <span style={{ color: '#00FF00', marginRight: '8px' }}>{'>'}</span>
              {line}
            </Typography>
          ))
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PlayArrowIcon />}
          onClick={handleStart}
          disabled={isRunning}
          sx={{
            borderColor: '#00FF00',
            color: '#00FF00',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              boxShadow: '0 0 5px #00FF00',
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(0, 255, 0, 0.3)',
              color: 'rgba(0, 255, 0, 0.3)',
            }
          }}
        >
          START
        </Button>
        <Button
          variant="outlined"
          startIcon={<PauseIcon />}
          onClick={handlePause}
          disabled={!isRunning}
          sx={{
            borderColor: '#00FF00',
            color: '#00FF00',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              boxShadow: '0 0 5px #00FF00',
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(0, 255, 0, 0.3)',
              color: 'rgba(0, 255, 0, 0.3)',
            }
          }}
        >
          PAUSE
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          sx={{
            borderColor: '#FFAA00',
            color: '#FFAA00',
            '&:hover': {
              backgroundColor: 'rgba(255, 170, 0, 0.1)',
              boxShadow: '0 0 5px #FFAA00',
            }
          }}
        >
          RESET
        </Button>
      </Box>
    </Box>
  );
};

export default CenterSection; 