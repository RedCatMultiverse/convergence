'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TopSection = ({ title = "MISSION BRIEFING", onToggleExpand = () => {} }) => {
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
        <IconButton 
          onClick={() => setExpanded(!expanded)} 
          sx={{ color: '#00FF00' }}
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
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