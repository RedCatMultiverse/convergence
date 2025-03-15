'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import TopSection from '@/components/game/TopSection';
import LeftSection from '@/components/game/LeftSection';
import RightSection from '@/components/game/RightSection';
import CenterSection from '@/components/game/CenterSection';

export default function GameDemo() {
  const [topSectionExpanded, setTopSectionExpanded] = useState(true);
  
  // Handle toggle expand from TopSection
  const handleTopSectionToggle = (expanded) => {
    setTopSectionExpanded(expanded);
  };
  
  return (
    <Box
      sx={{
        backgroundColor: 'black',
        minHeight: 'calc(100vh - 80px)', // Subtract navbar height
        height: 'calc(100vh - 80px)', // Fixed height
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
          height: '100%',
          position: 'relative',
          zIndex: 1,
          p: 2,
          gap: 2,
        }}
      >
        {/* Top Section */}
        <Box 
          sx={{ 
            height: topSectionExpanded ? '30%' : 'auto', 
            width: '100%', 
            minHeight: topSectionExpanded ? '200px' : 'auto',
            transition: 'height 0.3s ease, min-height 0.3s ease',
          }}
        >
          <TopSection onToggleExpand={handleTopSectionToggle} />
        </Box>
        
        {/* Bottom Sections - fills remaining height */}
        <Box 
          sx={{ 
            flex: 1, 
            width: '100%', 
            display: 'flex', 
            gap: 2,
            transition: 'flex-grow 0.3s ease',
          }}
        >
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