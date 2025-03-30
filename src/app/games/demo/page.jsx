'use client';

import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import TopSection from '@/components/game/TopSection';
import LeftSection from '@/components/game/LeftSection';
import RightSection from '@/components/game/RightSection';
import CenterSection from '@/components/game/CenterSection';

// Import gameplay data to get total turns
import gameplayDataJson from '@/data/gameplay_data.json';

// Get the gameplay data from the imported JSON
const gameplayData = gameplayDataJson.gameplay_demo.turns;

export default function GameDemo() {
  const [topSectionExpanded, setTopSectionExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  // Reference to the CenterSection component
  const centerSectionRef = useRef(null);
  
  // Handle toggle expand from TopSection
  const handleTopSectionToggle = (expanded) => {
    setTopSectionExpanded(expanded);
  };
  
  // Handle start button click
  const handleStart = () => {
    if (centerSectionRef.current && centerSectionRef.current.handleStart) {
      // First, execute the next move
      if (centerSectionRef.current.handleNextTurn) {
        centerSectionRef.current.handleNextTurn();
      }
      
      // Then set the game to running state
      centerSectionRef.current.handleStart();
      setIsRunning(true);
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    if (centerSectionRef.current && centerSectionRef.current.handlePause) {
      centerSectionRef.current.handlePause();
      // We don't immediately set isRunning to false here
      // The CenterSection will notify us when it's actually paused via onRunningChange
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    if (centerSectionRef.current && centerSectionRef.current.handleReset) {
      centerSectionRef.current.handleReset();
      setIsRunning(false);
      setCurrentTurnIndex(0);
    }
  };
  
  // Handle next turn button click
  const handleNextTurn = () => {
    if (centerSectionRef.current && centerSectionRef.current.handleNextTurn) {
      centerSectionRef.current.handleNextTurn();
    }
  };
  
  // Handle toggle auto advance
  const handleToggleAutoAdvance = () => {
    if (centerSectionRef.current && centerSectionRef.current.toggleAutoAdvance) {
      centerSectionRef.current.toggleAutoAdvance();
      setAutoAdvance(!autoAdvance);
    }
  };
  
  // Handle turn slider change
  const handleTurnSliderChange = (turnIndex) => {
    if (centerSectionRef.current && centerSectionRef.current.jumpToTurn) {
      centerSectionRef.current.jumpToTurn(turnIndex);
      setCurrentTurnIndex(turnIndex);
    }
  };
  
  // Update currentTurnIndex when it changes in CenterSection
  const handleTurnIndexChange = (turnIndex) => {
    setCurrentTurnIndex(turnIndex);
  };
  
  return (
    <Box
      sx={{
        backgroundColor: 'black',
        minHeight: 'calc(100vh - 64px)', // Subtract only copyright height
        height: 'calc(100vh - 64px)', // Subtract only copyright height
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
          <TopSection 
            onToggleExpand={handleTopSectionToggle}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            autoAdvance={autoAdvance}
            onToggleAutoAdvance={handleToggleAutoAdvance}
            onNextTurn={handleNextTurn}
            isTyping={isTyping}
            waitingForInput={waitingForInput}
            currentTurnIndex={currentTurnIndex}
            totalTurns={gameplayData.length}
            onTurnSliderChange={handleTurnSliderChange}
          />
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
            <CenterSection 
              ref={centerSectionRef}
              onRunningChange={(running) => setIsRunning(running)}
              onAutoAdvanceChange={(auto) => setAutoAdvance(auto)}
              onTypingChange={(typing) => setIsTyping(typing)}
              onWaitingForInputChange={(waiting) => setWaitingForInput(waiting)}
              onTurnIndexChange={handleTurnIndexChange}
            />
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