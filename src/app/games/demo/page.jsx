'use client';

import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import TopSection from '@/components/game/TopSection';
import LeftSection from '@/components/game/LeftSection';
import RightSection from '@/components/game/RightSection';
import CenterSection from '@/components/game/CenterSection';

// Import alphaContinuum data instead of gameplay data
import alphaContinuumJson from '@/data/alphaContinuum.json';

// Process alphaContinuum data to create game moves
const processAlphaContinuumData = () => {
  const { alphaContinuum } = alphaContinuumJson;
  const moves = [];
  let moveIndex = 0;
  
  // Process intro - ensure R.C. speaks first
  if (alphaContinuum.intro) {
    // Sort the intro so that "rc" speaker comes first
    const sortedIntro = [...alphaContinuum.intro].sort((a, b) => {
      if (a.speaker === "rc") return -1;
      if (b.speaker === "rc") return 1;
      return 0;
    });
    
    sortedIntro.forEach(item => {
      moves.push({
        turn_number: ++moveIndex,
        speaker: item.speaker,
        message_type: "system_message",
        content: item.text,
        delay_ms: 1500
      });
    });
  }
  
  // Process each milestone
  const processMilestone = (milestone, milestoneName) => {
    // Process milestone intro - ensure speaker is properly attributed
    if (milestone.intro) {
      milestone.intro.forEach(item => {
        moves.push({
          turn_number: ++moveIndex,
          speaker: item.speaker, // Speaker is already correctly attributed in JSON
          message_type: "system_message",
          content: item.text,
          delay_ms: 1500,
          milestone: milestoneName
        });
      });
    }
    
    // Process challenges
    if (milestone.challenges) {
      let i = 0;
      while (i < milestone.challenges.length) {
        const item = milestone.challenges[i];
        
        if (item.id) {
          // It's a challenge setup - create setup move only
          moves.push({
            turn_number: ++moveIndex,
            speaker: "system",
            message_type: "challenge_setup",
            content: `Challenge: ${item.id}`,
            challenge_id: item.id,
            challenge_type: item.type || "traditional",
            delay_ms: 1000
          });
          
          // Have R.C. present the scenario and challenge text in one move
          moves.push({
            turn_number: ++moveIndex,
            speaker: "rc",
            message_type: "prompt",
            content: `${item.scenario}\n\n${item.text}`,
            delay_ms: 1500
          });
          
          i++; // Move to next item
          
          // Process Monica's response if it follows
          if (i < milestone.challenges.length && milestone.challenges[i].speaker === "monica") {
            moves.push({
              turn_number: ++moveIndex,
              speaker: milestone.challenges[i].speaker,
              message_type: "response",
              content: milestone.challenges[i].text,
              delay_ms: 1500
            });
            i++; // Move to next item
            
            // Process R.C.'s feedback if it follows
            if (i < milestone.challenges.length && milestone.challenges[i].speaker === "rc") {
              moves.push({
                turn_number: ++moveIndex,
                speaker: milestone.challenges[i].speaker,
                message_type: "prompt",
                content: milestone.challenges[i].text,
                delay_ms: 1500
              });
              i++; // Move to next item
            }
            
            // Process dataTracking if it follows
            if (i < milestone.challenges.length && milestone.challenges[i].dataTracking) {
              moves.push({
                turn_number: ++moveIndex,
                speaker: "system",
                message_type: "data_tracking",
                content: "Updating critical thinking metrics...",
                delay_ms: 1000,
                dataTracking: milestone.challenges[i].dataTracking
              });
              i++; // Move to next item
            }
          }
        } else if (item.speaker) {
          // It's a regular dialogue move
          moves.push({
            turn_number: ++moveIndex,
            speaker: item.speaker,
            message_type: item.speaker === "rc" ? "prompt" : "response",
            content: item.text,
            delay_ms: 1500
          });
          i++; // Move to next item
        } else if (item.dataTracking) {
          // It's a data tracking update
          moves.push({
            turn_number: ++moveIndex,
            speaker: "system",
            message_type: "data_tracking",
            content: "Updating critical thinking metrics...",
            delay_ms: 1000,
            dataTracking: item.dataTracking
          });
          i++; // Move to next item
        } else {
          // Unknown item type, skip it
          console.warn("Unknown item type in challenges:", item);
          i++; // Move to next item
        }
      }
    }
  };
  
  // Process each milestone
  if (alphaContinuum.baseMilestone) processMilestone(alphaContinuum.baseMilestone, "base");
  if (alphaContinuum.inferenceMilestone) processMilestone(alphaContinuum.inferenceMilestone, "inference");
  if (alphaContinuum.assumptionMilestone) processMilestone(alphaContinuum.assumptionMilestone, "assumption");
  if (alphaContinuum.deductionMilestone) processMilestone(alphaContinuum.deductionMilestone, "deduction");
  if (alphaContinuum.interpretationMilestone) processMilestone(alphaContinuum.interpretationMilestone, "interpretation");
  if (alphaContinuum.evaluationMilestone) processMilestone(alphaContinuum.evaluationMilestone, "evaluation");
  
  // Process weekly review if exists
  if (alphaContinuum.weeklyReview) {
    alphaContinuum.weeklyReview.forEach(item => {
      if (item.speaker) {
        moves.push({
          turn_number: ++moveIndex,
          speaker: item.speaker,
          message_type: item.speaker === "system" ? "system_message" : (item.speaker === "rc" ? "prompt" : "response"),
          content: item.text,
          delay_ms: 1500
        });
      } else if (item.dataTracking) {
        moves.push({
          turn_number: ++moveIndex,
          speaker: "system",
          message_type: "data_tracking",
          content: "Weekly review metrics...",
          delay_ms: 1000,
          dataTracking: item.dataTracking
        });
      }
    });
  }
  
  return moves;
};

// Get the game moves from processed alphaContinuum data
const gameplayData = processAlphaContinuumData();

export default function GameDemo() {
  const [topSectionExpanded, setTopSectionExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [dataTracking, setDataTracking] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  
  // Reference to the CenterSection component
  const centerSectionRef = useRef(null);
  
  // Make gameplayData available globally
  useEffect(() => {
    // Only set window.gameplayData if it's valid and not empty
    if (gameplayData && gameplayData.length > 0) {
      window.gameplayData = gameplayData;
      setDataReady(true);
      console.log("Game data initialized with", gameplayData.length, "moves");
    } else {
      console.error("Error: gameplayData is invalid", gameplayData);
    }
    
    return () => {
      delete window.gameplayData;
    };
  }, []);

  useEffect(() => {
    if (currentMilestone) {
      console.log("Main page: Current milestone changed to", currentMilestone);
    }
  }, [currentMilestone]);
  
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
      setCurrentMilestone(null);
      setDataTracking(null);
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
      
      // The milestone update will be handled by the center section
      // It will call onMilestoneChange which will update our state
    }
  };
  
  // Update currentTurnIndex when it changes in CenterSection
  const handleTurnIndexChange = (turnIndex) => {
    setCurrentTurnIndex(turnIndex);
  };
  
  // Update currentMilestone when it changes in CenterSection
  const handleMilestoneChange = (milestone) => {
    if (milestone !== currentMilestone) {
      console.log(`Main: Updating milestone from ${currentMilestone} to ${milestone}`);
      setCurrentMilestone(milestone);
    }
  };
  
  // Update dataTracking when it changes in CenterSection
  const handleDataTrackingUpdate = (data) => {
    setDataTracking(data);
  };
  
  // Render game UI only when data is ready
  if (!dataReady) {
    return (
      <Box
        sx={{
          backgroundColor: 'black',
          minHeight: 'calc(100vh - 64px)',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#00FF00',
          fontFamily: 'var(--font-geist-mono), monospace',
        }}
      >
        Loading game data...
      </Box>
    );
  }

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
            <LeftSection 
              currentMilestone={currentMilestone}
            />
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
              onMilestoneChange={handleMilestoneChange}
              onDataTrackingUpdate={handleDataTrackingUpdate}
            />
          </Box>
          
          {/* Right Section - 25% width */}
          <Box sx={{ width: '25%', height: '100%' }}>
            <RightSection 
              dataTracking={dataTracking}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 