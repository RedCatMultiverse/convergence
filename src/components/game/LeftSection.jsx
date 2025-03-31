'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';

// Dynamic game data based on current milestone
const getGameData = (currentMilestone) => {
  // Default status for all milestones
  const allMilestones = [
    { id: 'base', name: 'BASE', status: 'unlocked' },
    { id: 'inference', name: 'INFERENCE', status: 'unlocked' },
    { id: 'assumption', name: 'ASSUMPTION', status: 'unlocked' },
    { id: 'deduction', name: 'DEDUCTION', status: 'unlocked' },
    { id: 'interpretation', name: 'INTERPRETATION', status: 'unlocked' },
    { id: 'evaluation', name: 'EVALUATION', status: 'unlocked' }
  ];
  
  // Map of milestone IDs to their index in the array
  const milestoneIndexMap = {
    'base': 0,
    'inference': 1,
    'assumption': 2,
    'deduction': 3,
    'interpretation': 4,
    'evaluation': 5
  };
  
  // Update statuses based on current milestone
  if (currentMilestone) {
    const currentIndex = milestoneIndexMap[currentMilestone];
    
    allMilestones.forEach((milestone, index) => {
      if (index < currentIndex) {
        milestone.status = 'completed';
      } else if (index === currentIndex) {
        milestone.status = 'active';
      } else {
        milestone.status = 'unlocked';
      }
    });
  }
  
  return {
    universe: {
      progress: [
        { id: 'base', name: 'BASE LEVEL', status: 'completed' },
        { id: 'alpha', name: 'ALPHA CONTINUUM', status: 'current' },
        { id: 'beta', name: 'BETA NEXUS', status: 'locked' },
        { id: 'gamma', name: 'GAMMA SECTOR', status: 'locked' }
      ]
    },
    milestones: allMilestones,
    objective: 'Identify patterns and make inferences to navigate the Alpha Continuum challenges.'
  };
};

const LeftSection = ({ title = "STATUS MONITOR", currentMilestone = null }) => {
  const [gameData, setGameData] = useState(getGameData(currentMilestone));
  
  // Update game data when currentMilestone changes
  useEffect(() => {
    setGameData(getGameData(currentMilestone));
  }, [currentMilestone]);
  
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
        overflow: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#33FF33',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 5px #00FF00',
          }}
        >
          // UNIVERSE LEVELS
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
      {/* Universe Progress Path */}
      <Box sx={{ mb: 3 }}>
        {gameData.universe.progress.map((level, index) => (
          <Box key={level.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  width: level.status === 'current' ? '14px' : '10px',
                  height: level.status === 'current' ? '14px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: level.status === 'completed' ? '#555555' : (level.status === 'current' ? '#00FF00' : '#222222'),
                  border: level.status === 'current' ? '3px solid #CCFF00' : (level.status === 'completed' ? '1px solid #00FF00' : '1px solid #33FF33'),
                  mr: 2
                }}
              />
              <Typography
                sx={{
                  color: level.status === 'completed' ? '#555555' : (level.status === 'current' ? '#CCFF00' : '#33FF33'),
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.875rem',
                  fontWeight: level.status === 'current' ? 'bold' : 'normal',
                }}
              >
                {level.name} [{level.status.toUpperCase()}]
              </Typography>
            </Box>
            
            {index < gameData.universe.progress.length - 1 && (
              <Box 
                sx={{ 
                  width: '2px',
                  height: '20px',
                  backgroundColor: level.status !== 'locked' ? '#00FF00' : '#33FF33',
                  ml: '5px',
                  mb: 0,
                  borderLeft: gameData.universe.progress[index + 1].status === 'locked' ? '2px dashed #33FF33' : 'none',
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      
      <Typography
        variant="h6"
        sx={{
          color: '#33FF33',
          fontFamily: 'var(--font-geist-mono), monospace',
          letterSpacing: '0.05em',
          textShadow: '0 0 5px #00FF00',
          mt: 2,
          mb: 2,
        }}
      >
        // CRITICAL THINKING MILESTONES
      </Typography>
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
      {/* Milestones */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {gameData.milestones.map((milestone) => (
          <Box 
            key={milestone.id}
            sx={{
              backgroundColor: milestone.status === 'completed' ? '#222222' : '#111111',
              border: milestone.status === 'completed' ? '1px solid #555555' : 
                     milestone.status === 'active' ? '2px solid #FFFF00' : 
                     milestone.status === 'next' ? '2px solid #CCFF00' : '1px solid #33FF33',
              padding: 1.5,
            }}
          >
            <Typography
              sx={{
                color: milestone.status === 'completed' ? '#555555' : 
                       milestone.status === 'active' ? '#FFFF00' : 
                       milestone.status === 'next' ? '#CCFF00' : '#33FF33',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              {milestone.name} [{milestone.status.toUpperCase()}]
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Mission Objective */}
      <Box 
        sx={{ 
          border: '1px solid #33FF33',
          padding: 2,
          mt: 2
        }}
      >
        <Typography
          sx={{
            color: '#33FF33',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            mb: 1,
          }}
        >
          MISSION OBJECTIVE:
        </Typography>
        <Typography
          sx={{
            color: '#00FF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {gameData.objective}
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftSection; 