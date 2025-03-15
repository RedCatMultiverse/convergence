'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Button } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const TopSection = ({ 
  title = "MISSION BRIEFING", 
  onToggleExpand = () => {},
  isRunning = false,
  onStart = () => {},
  onPause = () => {},
  onReset = () => {},
  autoAdvance = false,
  onToggleAutoAdvance = () => {},
  onNextTurn = () => {},
  isTyping = false,
  waitingForInput = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  
  // Notify parent component when expanded state changes
  useEffect(() => {
    onToggleExpand(expanded);
  }, [expanded, onToggleExpand]);
  
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
        padding: expanded ? 3 : 1,
        overflow: 'hidden',
        transition: 'padding 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: expanded ? 2 : 0, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TerminalIcon sx={{ color: '#00FF00', mr: 1 }} />
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
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Control buttons */}
          {!isRunning ? (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<PlayArrowIcon />}
              onClick={(e) => {
                e.preventDefault();
                onStart();
              }}
              sx={{ 
                mr: 1, 
                backgroundColor: '#007700', 
                '&:hover': { backgroundColor: '#00AA00' },
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: '60px',
              }}
            >
              Start
            </Button>
          ) : (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<PauseIcon />}
              onClick={(e) => {
                e.preventDefault();
                onPause();
              }}
              sx={{ 
                mr: 1, 
                backgroundColor: '#770000', 
                '&:hover': { backgroundColor: '#AA0000' },
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: '60px',
              }}
            >
              Pause
            </Button>
          )}
          
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<RefreshIcon />}
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            sx={{ 
              mr: 1,
              backgroundColor: '#000077', 
              '&:hover': { backgroundColor: '#0000AA' },
              fontSize: '0.7rem',
              py: 0.5,
              minWidth: '60px',
            }}
          >
            Reset
          </Button>
          
          {isRunning && !autoAdvance && (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<SkipNextIcon />}
              onClick={(e) => {
                e.preventDefault();
                onNextTurn();
              }}
              disabled={isTyping || waitingForInput}
              sx={{ 
                mr: 1, 
                backgroundColor: '#007777', 
                '&:hover': { backgroundColor: '#00AAAA' },
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: '60px',
              }}
            >
              Next
            </Button>
          )}
          
          <Button 
            variant="contained" 
            size="small" 
            onClick={(e) => {
              e.preventDefault();
              onToggleAutoAdvance();
            }}
            sx={{ 
              mr: 1,
              backgroundColor: autoAdvance ? '#007700' : '#770000', 
              '&:hover': { backgroundColor: autoAdvance ? '#00AA00' : '#AA0000' },
              fontSize: '0.7rem',
              py: 0.5,
              minWidth: '60px',
            }}
          >
            {autoAdvance ? 'Auto' : 'Manual'}
          </Button>
          
          {/* Expand/Collapse button */}
          <IconButton 
            onClick={() => setExpanded(!expanded)} 
            sx={{ color: '#00FF00' }}
            size="small"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      
      {expanded && (
        <>
          <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
          
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#00CC00',
                fontFamily: 'var(--font-geist-mono), monospace',
                letterSpacing: '0.02em',
                lineHeight: 1.6,
              }}
            >
              {'> WELCOME TO THE SIMULATION ENVIRONMENT'}<br />
              {'> OBJECTIVE: COMPLETE THE ASSIGNED TASKS TO IMPROVE YOUR SOFT SKILLS'}<br />
              {'> CURRENT STATUS: INITIALIZING...'}<br /><br />
              
              This interactive simulation is designed to enhance your communication, 
              problem-solving, and teamwork abilities through practical scenarios.
              Navigate through the interface using the control panels on the left and right.
              Monitor your progress in the central display area.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TopSection; 