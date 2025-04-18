'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider, LinearProgress } from '@mui/material';

// Initial default game data
const initialGameData = {
  leaderboard: [
    { name: 'SHADOWCODE', score: 14560, isUser: false },
    { name: 'NEONBYTE', score: 13270, isUser: false },
    { name: 'YOU', score: 12450, isUser: true },
    { name: 'MATRIXRUNNER', score: 11720, isUser: false },
    { name: 'CYBERWOLF', score: 10890, isUser: false }
  ],
  stats: {
    xp: 12450,
    streak: '5 DAYS',
    decisionSpeed: '+20%',
    badges: '3/12',
    isXpUpdating: false
  },
  cognitiveMeasures: {
    criticalThinkingScore: 80,
    problemSolvingSpeed: 75,
    practicalApplicationScore: 78,
    adaptabilityScore: 76,
    patternRecognitionScore: 77,
    currentFocus: 'criticalThinking'
  },
  performanceMetrics: {
    traditional: '90% ACCURACY',
    keywordMatching: '95% ACCURACY',
    statementArrangement: '88% ACCURACY'
  },
  nextBadge: {
    name: 'ASSUMPTION HUNTER',
    progress: 70
  }
};

const RightSection = ({ dataTracking = null }) => {
  const [gameData, setGameData] = useState(initialGameData);
  const [animatedValues, setAnimatedValues] = useState({
    criticalThinkingScore: { value: 80, isUpdating: false },
    problemSolvingSpeed: { value: 75, isUpdating: false },
    practicalApplicationScore: { value: 78, isUpdating: false },
    adaptabilityScore: { value: 76, isUpdating: false },
    patternRecognitionScore: { value: 77, isUpdating: false }
  });
  
  // Handle XP updates
  useEffect(() => {
    if (!dataTracking) return;

    // If xpGained is present, it's a forward move
    if (dataTracking.xpGained) {
      const newXp = gameData.stats.xp + dataTracking.xpGained;
      updateGameDataWithXp(newXp);
    } 
    // If xp is present directly, it's from slider movement
    else if (dataTracking.xp !== undefined) {
      updateGameDataWithXp(dataTracking.xp);
    }
  }, [dataTracking]);

  // Helper function to update XP and leaderboard
  const updateGameDataWithXp = (newXp) => {
    setGameData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        xp: newXp,
        isXpUpdating: true
      },
      leaderboard: prev.leaderboard.map(item => 
        item.isUser ? { ...item, score: newXp } : item
      ).sort((a, b) => b.score - a.score) // Sort leaderboard by score
    }));

    // Reset animation after delay
    setTimeout(() => {
      setGameData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          isXpUpdating: false
        }
      }));
    }, 1000);
  };
  
  // Animation effect for radar chart values
  useEffect(() => {
    if (!dataTracking) return;
    
    // Get the current values
    const currentValues = { ...animatedValues };
    
    // Define target values - only take those that are actually in the dataTracking
    const targetValues = {};
    const properties = [
      'criticalThinkingScore', 
      'problemSolvingSpeed', 
      'practicalApplicationScore',
      'adaptabilityScore',
      'patternRecognitionScore',
      'deductiveReasoningScore',
      'analyticalDepthScore'
    ];
    
    // Map any differently named properties from dataTracking
    const propertyMap = {
      'evaluationScore': 'criticalThinkingScore',
      'inferenceScore': 'criticalThinkingScore',
      'interpretationScore': 'criticalThinkingScore',
      'assumptionIdentificationScore': 'criticalThinkingScore'
    };
    
    // Check for properties in dataTracking and set target values
    properties.forEach(prop => {
      if (dataTracking[prop] !== undefined) { // Changed from if (dataTracking[prop]) to handle zero values
        targetValues[prop] = {
          value: dataTracking[prop],
          isUpdating: true
        };
      }
    });
    
    // Check for mapped properties
    Object.entries(propertyMap).forEach(([dataProp, localProp]) => {
      if (dataTracking[dataProp] !== undefined) { // Changed from if (dataTracking[dataProp])
        targetValues[localProp] = {
          value: dataTracking[dataProp],
          isUpdating: true
        };
      }
    });
    
    // If no target values, reset any values not present in dataTracking to 0
    if (Object.keys(targetValues).length === 0) {
      const resetValues = {};
      Object.keys(currentValues).forEach(key => {
        if (!dataTracking[key]) {
          resetValues[key] = {
            value: 0,
            isUpdating: true
          };
        }
      });
      if (Object.keys(resetValues).length > 0) {
        setAnimatedValues(prev => ({
          ...prev,
          ...resetValues
        }));
      }
      return;
    }
    
    // Update values that have changed
    setAnimatedValues(prev => {
      const newValues = { ...prev };
      Object.entries(targetValues).forEach(([prop, target]) => {
        if (newValues[prop]?.value !== target.value) {
          newValues[prop] = {
            value: target.value,
            isUpdating: true
          };
        }
      });
      return newValues;
    });
    
    // Reset isUpdating after animation
    setTimeout(() => {
      setAnimatedValues(prev => {
        const newValues = { ...prev };
        Object.keys(targetValues).forEach(prop => {
          if (newValues[prop]) {
            newValues[prop] = {
              ...newValues[prop],
              isUpdating: false
            };
          }
        });
        return newValues;
      });
    }, 1000);
  }, [dataTracking]);

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
          // PERFORMANCE METRICS
        </Typography>
      </Box>
      
      {/* Alert Box */}
      <Box 
        sx={{
          backgroundColor: '#000000',
          border: '1px solid #CCFF00',
          borderRadius: '2px',
          padding: 1.5,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            color: '#CCFF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          [ALPHA CONTINUUM CHALLENGE]
        </Typography>
      </Box>
      
      {/* Leaderboard */}
      <Box 
        sx={{
          border: '1px solid #33FF33',
          padding: 2,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            color: '#CCFF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            mb: 1,
          }}
        >
          WEEKLY LEADERBOARD:
        </Typography>
        
        {gameData.leaderboard.map((item) => (
          <Box 
            key={item.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                color: item.isUser ? '#CCFF00' : '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
              }}
            >
              {item.name}
            </Typography>
            <Typography
              sx={{
                color: item.isUser ? '#CCFF00' : '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
              }}
            >
              {item.score} XP
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Stats Section */}
      <Box 
        sx={{
          border: '1px solid #33FF33',
          padding: 2,
          mb: 2.5,
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
        }}
      >
        <Typography
          sx={{
            color: '#CCFF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            mb: 1,
          }}
        >
          AGENT STATUS:
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {/* XP */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              XP:
            </Typography>
            <Typography
              sx={{
                color: gameData.stats.isXpUpdating ? '#FFFF00' : '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
                fontWeight: gameData.stats.isXpUpdating ? 'bold' : 'normal',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {gameData.stats.xp}
            </Typography>
          </Box>
          
          {/* Streak */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              STREAK:
            </Typography>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              {gameData.stats.streak}
            </Typography>
          </Box>
          
          {/* Decision Speed */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              SPEED:
            </Typography>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              {gameData.stats.decisionSpeed}
            </Typography>
          </Box>
          
          {/* Badges */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              BADGES:
            </Typography>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.875rem',
              }}
            >
              {gameData.stats.badges}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Cognitive Map */}
      <Box 
        sx={{
          border: '1px solid #33FF33',
          padding: 2,
          mb: 2.5,
          position: 'relative',
        }}
      >
        <Typography
          sx={{
            color: '#CCFF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            mb: 2,
          }}
        >
          CRITICAL THINKING RADAR:
        </Typography>
        
        {/* Radar visualization */}
        <Box sx={{ height: '180px', position: 'relative', mb: 1 }}>
          {/* Reference Lines */}
          <Box sx={{ position: 'absolute', left: 0, right: 0, height: '100%' }}>
            {/* 100% line */}
            <Box sx={{ 
              position: 'absolute', 
              top: '20px',
              left: '40px',
              right: '20px',
              borderTop: '2px dashed #FFFF00',
              opacity: 0.5
            }}>
              <Typography sx={{ 
                position: 'absolute',
                left: '-30px',
                top: '-10px',
                color: '#FFFF00',
                fontSize: '0.7rem',
                fontFamily: 'monospace'
              }}>
                100%
              </Typography>
            </Box>
            
            {/* 50% line */}
            <Box sx={{ 
              position: 'absolute', 
              top: '75px',
              left: '40px',
              right: '20px',
              borderTop: '2px dashed #FFFF00',
              opacity: 0.5
            }}>
              <Typography sx={{ 
                position: 'absolute',
                left: '-25px',
                top: '-10px',
                color: '#FFFF00',
                fontSize: '0.7rem',
                fontFamily: 'monospace'
              }}>
                50%
              </Typography>
            </Box>

            {/* 0% line */}
            <Box sx={{ 
              position: 'absolute', 
              top: '130px',
              left: '40px',
              right: '20px',
              borderTop: '2px dashed #FFFF00',
              opacity: 0.5
            }}>
              <Typography sx={{ 
                position: 'absolute',
                left: '-25px',
                top: '-10px',
                color: '#FFFF00',
                fontSize: '0.7rem',
                fontFamily: 'monospace'
              }}>
                0%
              </Typography>
            </Box>
          </Box>

          {/* Skill pillars */}
          {Object.entries(animatedValues).map(([skill, value], index) => {
            const position = index * 40 + 55; // Reduced spacing between bars from 50 to 40
            const displaySkill = skill.substring(0, 3).toUpperCase();
            const effectiveValue = Math.min(Math.max(Math.round(value.value), 0), 100); // Clamp between 0-100
            const barHeight = (effectiveValue / 100) * 110; // Scale to the 110px range
            
            return (
              <Box 
                key={skill}
                sx={{ 
                  position: 'absolute',
                  bottom: -4,
                  left: `${position}px`,
                  width: '34px', // Increased from 32px to 34px (5% larger)
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Bar */}
                <Box sx={{ 
                  width: '100%',
                  height: '110px',
                  position: 'relative',
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  marginBottom: '-1px',
                }}>
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: `${barHeight}px`,
                    backgroundColor: '#00FF00',
                    transition: 'all 0.5s ease-in-out',
                    animation: value.isUpdating ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { backgroundColor: '#00FF00' },
                      '50%': { backgroundColor: '#FFFF00' },
                      '100%': { backgroundColor: '#00FF00' }
                    }
                  }} />
                </Box>
                
                {/* Label */}
                <Box sx={{ 
                  width: '100%',
                  height: '30px',
                  backgroundColor: '#111',
                  border: '1px solid #00FF00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography sx={{ 
                    color: '#00FF00',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace'
                  }}>
                    {displaySkill}
                  </Typography>
                </Box>
                
                {/* Value */}
                <Typography sx={{ 
                  color: '#00FF00',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  mt: 0.5
                }}>
                  {effectiveValue}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
      
      {/* Performance Metrics */}
      <Box 
        sx={{
          border: '1px solid #33FF33',
          padding: 2,
        }}
      >
        <Typography
          sx={{
            color: '#CCFF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.875rem',
            mb: 1,
          }}
        >
          CHALLENGE METRICS:
        </Typography>
        
        {Object.entries(gameData.performanceMetrics).map(([key, value]) => (
          <Box 
            key={key}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
              }}
            >
              {key.toUpperCase()}:
            </Typography>
            <Typography
              sx={{
                color: '#00FF00',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
        
        {/* Next Badge Progress */}
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Typography
            sx={{
              color: '#00FF00',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.75rem',
              mb: 0.5,
            }}
          >
            NEXT BADGE: {gameData.nextBadge.name}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={gameData.nextBadge.progress}
            sx={{
              height: 10,
              backgroundColor: '#222222',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#CCFF00',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RightSection; 