'use client';

import { Box, Typography, Divider, LinearProgress } from '@mui/material';

// Mock data - in a real app, this would come from props or a data store
const gameData = {
  leaderboard: [
    { name: 'SHADOWCODE', score: 14560, isUser: false },
    { name: 'NEONBYTE', score: 13270, isUser: false },
    { name: 'YOU', score: 12450, isUser: true },
    { name: 'MATRIXRUNNER', score: 11720, isUser: false },
    { name: 'CYBERWOLF', score: 10890, isUser: false }
  ],
  cognitiveMeasures: {
    inference: 88,
    assumption: 81,
    deduction: 75,
    interpretation: 77,
    evaluation: 78,
    currentFocus: 'assumption'
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

const RightSection = () => {
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
          [CHALLENGE 2 OF 3: ASSUMPTION]
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
          {Object.entries(gameData.cognitiveMeasures).filter(([key]) => key !== 'currentFocus').map(([skill, value], index) => {
            const position = index * 50 + 30; // Distribute evenly
            const displaySkill = skill.substring(0, 3).toUpperCase();
            const isFocused = gameData.cognitiveMeasures.currentFocus === skill;
            
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
                {/* Pillar fill */}
                <Box sx={{ 
                  position: 'relative',
                  width: '40px',
                  height: `${(100 - value) * 0.7}%`,
                  backgroundColor: value > 85 ? '#00AA00' : value > 75 ? '#009900' : '#008800',
                }} />
                
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
                
                {/* Highlight for focused skill */}
                {isFocused && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: '2px solid #FFFF00',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 1 }
                      }
                    }}
                  />
                )}
              </Box>
            );
          })}
          
          {/* Reference lines */}
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            right: '10px', 
            top: '40px', 
            height: '1px', 
            borderTop: '2px dashed #CCFF00'
          }} />
          <Typography sx={{ 
            position: 'absolute', 
            left: '10px', 
            top: '35px', 
            color: '#CCFF00', 
            fontSize: '0.625rem'
          }}>
            100%
          </Typography>
          
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            right: '10px', 
            top: '100px', 
            height: '1px', 
            borderTop: '1px solid #00FF00'
          }} />
          <Typography sx={{ 
            position: 'absolute', 
            left: '10px', 
            top: '95px', 
            color: '#00FF00', 
            fontSize: '0.625rem'
          }}>
            50%
          </Typography>
          
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            right: '10px', 
            top: '160px', 
            height: '1px', 
            borderTop: '1px solid #00FF00'
          }} />
          <Typography sx={{ 
            position: 'absolute', 
            left: '10px', 
            top: '155px', 
            color: '#00FF00', 
            fontSize: '0.625rem'
          }}>
            0%
          </Typography>
          
          <Typography sx={{ 
            position: 'absolute', 
            top: '60px', 
            right: '10px', 
            color: '#CCFF00', 
            fontSize: '0.625rem',
            textAlign: 'right',
          }}>
            CURRENT FOCUS:<br/>ASSUMPTION
          </Typography>
        </Box>
      </Box>
      
      {/* Performance Box */}
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
          CHALLENGE TYPE PERFORMANCE:
        </Typography>
        
        {Object.entries(gameData.performanceMetrics).map(([type, value]) => (
          <Typography
            key={type}
            sx={{
              color: '#00FF00',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.6875rem',
              mb: 0.5,
            }}
          >
            {type.toUpperCase().replace('_', ' ')}: {value}
          </Typography>
        ))}
      </Box>
      
      {/* Badge Box */}
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
          NEXT BADGE: {gameData.nextBadge.name}
        </Typography>
        
        <Box 
          sx={{
            width: '100%',
            height: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #00FF00',
            mt: 0.5,
            mb: 0.5,
            position: 'relative',
          }}
        >
          <Box 
            sx={{
              height: '100%',
              width: `${gameData.nextBadge.progress}%`,
              backgroundColor: '#00FF00',
            }}
          />
        </Box>
        
        <Typography
          sx={{
            color: '#00FF00',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.625rem',
            textAlign: 'right',
          }}
        >
          {gameData.nextBadge.progress}% COMPLETE
        </Typography>
      </Box>
    </Box>
  );
};

export default RightSection; 