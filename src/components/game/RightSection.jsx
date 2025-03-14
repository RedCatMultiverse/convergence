'use client';

import { Box, Typography, Divider, LinearProgress } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const RightSection = ({ title = "STATS MONITOR" }) => {
  const stats = [
    { label: 'COMMUNICATION', value: 65 },
    { label: 'PROBLEM SOLVING', value: 78 },
    { label: 'TEAMWORK', value: 42 },
    { label: 'LEADERSHIP', value: 55 },
    { label: 'ADAPTABILITY', value: 70 },
  ];

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
        <AssessmentIcon sx={{ color: '#00FF00', mr: 1 }} />
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
      
      <Box sx={{ flex: 1 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#00CC00',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  letterSpacing: '0.02em',
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#00FF00',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  letterSpacing: '0.02em',
                }}
              >
                {stat.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stat.value}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00FF00',
                  boxShadow: '0 0 5px #00FF00',
                },
              }}
            />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 255, 0, 0.3)' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#00CC00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.02em',
            display: 'block',
          }}
        >
          {'> OVERALL PROGRESS: 62%'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#FFAA00',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.02em',
            display: 'block',
            mt: 0.5,
          }}
        >
          {'> NEXT MILESTONE: 75%'}
        </Typography>
      </Box>
    </Box>
  );
};

export default RightSection; 