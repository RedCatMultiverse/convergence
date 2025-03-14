'use client';

import { Box } from '@mui/material';
import TopSection from '@/components/game/TopSection';
import LeftSection from '@/components/game/LeftSection';
import RightSection from '@/components/game/RightSection';
import CenterSection from '@/components/game/CenterSection';

export default function GameDemo() {
  return (
    <Box
      sx={{
        backgroundColor: 'black',
        minHeight: 'calc(100vh - 80px)', // Subtract navbar height
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CRT screen effect overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      
      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 80px)', // Subtract navbar height
          position: 'relative',
          zIndex: 1,
          p: 2,
          gap: 2,
        }}
      >
        {/* Top Section - 30% height */}
        <Box sx={{ height: '30%', width: '100%' }}>
          <TopSection />
        </Box>
        
        {/* Bottom Sections - 70% height */}
        <Box sx={{ height: '70%', width: '100%', display: 'flex', gap: 2 }}>
          {/* Left Section - 25% width */}
          <Box sx={{ width: '25%', height: '100%' }}>
            <LeftSection />
          </Box>
          
          {/* Center Section - 50% width */}
          <Box sx={{ width: '50%', height: '100%' }}>
            <CenterSection />
          </Box>
          
          {/* Right Section - 25% width */}
          <Box sx={{ width: '25%', height: '100%' }}>
            <RightSection />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 