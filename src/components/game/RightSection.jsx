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
    criticalThinkingScore: 80,
    problemSolvingSpeed: 75,
    practicalApplicationScore: 78,
    adaptabilityScore: 76,
    patternRecognitionScore: 77
  });
  
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
      if (dataTracking[prop]) {
        targetValues[prop] = dataTracking[prop];
      }
    });
    
    // Check for mapped properties
    Object.entries(propertyMap).forEach(([dataProp, localProp]) => {
      if (dataTracking[dataProp]) {
        targetValues[localProp] = dataTracking[dataProp];
      }
    });
    
    // If no target values, don't animate
    if (Object.keys(targetValues).length === 0) return;
    
    // Start animation
    let animationFrame;
    let startTime;
    const duration = 1000; // 1 second animation
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate intermediate values
      const newValues = { ...currentValues };
      Object.entries(targetValues).forEach(([key, targetValue]) => {
        if (currentValues[key] !== undefined) {
          newValues[key] = currentValues[key] + (targetValue - currentValues[key]) * progress;
        }
      });
      
      // Update state with interpolated values
      setAnimatedValues(newValues);
      
      // Continue animation if not complete
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Update game data with final values
        setGameData(prevData => ({
          ...prevData,
          cognitiveMeasures: {
            ...prevData.cognitiveMeasures,
            ...Object.fromEntries(
              Object.entries(newValues).map(([key, value]) => [key, Math.round(value)])
            )
          }
        }));
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
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
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
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
        <Box sx={{ height: '200px', position: 'relative', mb: 1 }}>
          {/* Skill pillars */}
          {Object.entries(animatedValues).map(([skill, value], index) => {
            const position = index * 50 + 20; // Distribute evenly
            const displaySkill = skill.substring(0, 3).toUpperCase();
            const effectiveValue = Math.min(Math.max(Math.round(value), 0), 100); // Clamp between 0-100
            
            return (
              <Box 
                key={skill}
                sx={{ 
                  position: 'absolute',
                  bottom: '30px',
                  left: `${position}px`,
                  width: '40px',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Pillar fill - taller means better score */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: '40px',
                    height: `${effectiveValue * 1.3}px`,
                    backgroundColor: effectiveValue > 85 ? '#00FF00' : effectiveValue > 75 ? '#00DD00' : '#00BB00',
                    transition: 'height 0.3s ease-out',
                  }} 
                />
                
                {/* Pillar base */}
                <Box sx={{ 
                  height: '30px',
                  width: '40px',
                  backgroundColor: '#222222',
                  border: '1px solid #00FF00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography sx={{ 
                    color: '#00FF00',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.75rem',
                  }}>
                    {displaySkill}
                  </Typography>
                </Box>
                
                {/* Score label */}
                <Typography sx={{ 
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  textAlign: 'center',
                  color: '#CCFF00',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.625rem',
                  mt: 1,
                  transform: 'translateY(24px)'
                }}>
                  {effectiveValue}
                </Typography>
              </Box>
            );
          })}
          
          {/* Reference lines */}
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            right: '10px', 
            bottom: '100px', 
            height: '1px', 
            borderTop: '2px dashed #CCFF00'
          }} />
          <Typography sx={{ 
            position: 'absolute', 
            left: '2px', 
            bottom: '105px', 
            color: '#CCFF00', 
            fontSize: '0.625rem'
          }}>
            70%
          </Typography>
          
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            right: '10px', 
            bottom: '130px', 
            height: '1px', 
            borderTop: '2px dashed #CCFF00'
          }} />
          <Typography sx={{ 
            position: 'absolute', 
            left: '2px', 
            bottom: '135px', 
            color: '#CCFF00', 
            fontSize: '0.625rem'
          }}>
            100%
          </Typography>
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