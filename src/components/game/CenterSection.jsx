'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Button, Divider, TextField, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TerminalIcon from '@mui/icons-material/Terminal';

// We don't need to import gameplay data directly anymore
// The processed data is passed from the parent component

// Function to clean text from markup tags
const cleanTextFromTags = (text) => {
  if (!text) return '';
  // Remove color tags like [cyan], [/cyan], [red bold], [/red bold], etc.
  return text.replace(/\[(\/?)([a-z\s]+)(\s[a-z]+)?\]/gi, '')
            .replace(/\[Sound:.*?\]/g, '') // Remove sound effects
            .replace(/\[Pause \d+\.\d+s\]/g, ''); // Remove pause instructions
};

const CenterSection = forwardRef(({ 
  title = "RCM LABS TERMINAL",
  onRunningChange = () => {},
  onAutoAdvanceChange = () => {},
  onTypingChange = () => {},
  onWaitingForInputChange = () => {},
  onTurnIndexChange = () => {},
  onMilestoneChange = () => {}, // New callback for milestone changes
  onDataTrackingUpdate = () => {}, // New callback for data tracking updates
}, ref) => {
  // Main game state
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputType, setInputType] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMonicaTyping, setIsMonicaTyping] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  // Game stats
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState("N/A");
  const [currentMilestone, setCurrentMilestone] = useState(null);
  
  // Refs
  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const currentCharIndexRef = useRef(0);
  const currentMessageRef = useRef("");
  
  // Define a local state to track gameplayData availability
  const [gameDataAvailable, setGameDataAvailable] = useState(false);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleStart,
    handlePause,
    handleReset,
    toggleAutoAdvance,
    handleNextTurn,
    jumpToTurn,
  }));
  
  // Notify parent component when running state changes
  useEffect(() => {
    onRunningChange(isRunning);
  }, [isRunning, onRunningChange]);
  
  // Notify parent component when autoAdvance state changes
  useEffect(() => {
    onAutoAdvanceChange(autoAdvance);
  }, [autoAdvance, onAutoAdvanceChange]);
  
  // Notify parent component when typing state changes
  useEffect(() => {
    onTypingChange(isTyping);
  }, [isTyping, onTypingChange]);
  
  // Notify parent component when waiting for input state changes
  useEffect(() => {
    onWaitingForInputChange(waitingForInput);
  }, [waitingForInput, onWaitingForInputChange]);
  
  // Notify parent component when turn index changes
  useEffect(() => {
    onTurnIndexChange(currentTurnIndex);
  }, [currentTurnIndex, onTurnIndexChange]);
  
  // Notify parent component when milestone changes
  useEffect(() => {
    onMilestoneChange(currentMilestone);
    
    // We'll add milestone announcements in a more controlled way in other functions
    // This useEffect should not add milestone announcements
  }, [currentMilestone, onMilestoneChange]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Scroll to bottom of console when output changes
  useEffect(() => {
    if (consoleEndRef.current) {
      // Immediate scroll to bottom without animation
      const scrollContainer = consoleEndRef.current.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [consoleOutput]);

  // Simplified auto-scroll function for immediate scrolling
  const autoScrollToBottom = () => {
    if (consoleEndRef.current) {
      const scrollContainer = consoleEndRef.current.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Focus input when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);
  
  // Process turn when currentTurnIndex changes
  useEffect(() => {
    if (isRunning && !isTyping && !waitingForInput && window.gameplayData && currentTurnIndex < window.gameplayData.length) {
      processTurn(currentTurnIndex);
    }
  }, [currentTurnIndex, isRunning]);
  
  // Auto-advance to next turn after processing is complete
  useEffect(() => {
    let autoAdvanceTimer;
    
    if (isRunning && autoAdvance && !isTyping && !waitingForInput && !isComplete) {
      autoAdvanceTimer = setTimeout(() => {
        handleNextTurn();
      }, 2000); // 2 second delay
    }
    
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [isRunning, autoAdvance, isTyping, waitingForInput, isComplete, currentTurnIndex]);
  
  // Handle data tracking updates
  const handleDataTrackingUpdate = (dataTracking) => {
    // Update local game stats if needed
    if (dataTracking.criticalThinkingScore) {
      setAccuracy(dataTracking.criticalThinkingScore);
    }
    
    // Pass data tracking to parent component for radar chart update
    onDataTrackingUpdate(dataTracking);
    
    // We don't need to add a message about the metrics update
  };
  
  // Function to process a specific turn
  const processTurn = (turnIndex) => {
    // Check if we've reached the end of the game
    if (!window.gameplayData || turnIndex >= window.gameplayData.length) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }
    
    // Get the current turn data
    const currentTurn = window.gameplayData[turnIndex];
    console.log(`Processing turn ${turnIndex}:`, currentTurn.turn_number, currentTurn.speaker, currentTurn.message_type);
    
    // Check for milestone change
    if (currentTurn.milestone && currentTurn.milestone !== currentMilestone) {
      console.log(`Turn ${turnIndex} changes milestone from ${currentMilestone} to ${currentTurn.milestone}`);
      
      // Add milestone announcement to console output, but only when the milestone actually changes
      setConsoleOutput(prev => [
        ...prev,
        {
          speaker: "system",
          content: `\n**** MILESTONE: ${currentTurn.milestone.toUpperCase()} ****\n`,
          type: "milestone_announcement"
        }
      ]);
      
      setCurrentMilestone(currentTurn.milestone);
    }
    
    // Handle data tracking updates
    if (currentTurn.message_type === "data_tracking" && currentTurn.dataTracking) {
      handleDataTrackingUpdate(currentTurn.dataTracking);
    }
    
    // Clean the content from tags
    const cleanedContent = cleanTextFromTags(currentTurn.content);
    
    // Handle different types of turns
    if (currentTurn.speaker === "monica") {
      handleMonicaResponse(cleanedContent, currentTurn);
    } else if (currentTurn.message_type === "challenge_setup") {
      handleChallengeSetup(cleanedContent, currentTurn);
    } else {
      handleRegularMessage(cleanedContent, currentTurn);
    }
  };
  
  // Handle challenge setup
  const handleChallengeSetup = (cleanedContent, currentTurn) => {
    setIsTyping(true);
    
    // Add challenge setup message to console output
    setConsoleOutput(prev => [
      ...prev,
      {
        speaker: "system",
        content: `Challenge: ${currentTurn.challenge_id}`,
        type: "challenge_setup"
      },
      {
        speaker: "system",
        content: `Scenario: ${currentTurn.scenario}`,
        type: "scenario"
      }
    ]);
    
    setIsTyping(false);
  };
  
  // Handle Monica's responses with more realistic typing animation
  const handleMonicaResponse = (cleanedContent, currentTurn) => {
    setIsTyping(true);
    setIsMonicaTyping(true);
    setUserInput("");
    
    // First, show the speaker name with a blinking cursor
    setConsoleOutput(prev => [
      ...prev,
      {
        speaker: "monica",
        content: "", // Start with empty content
        type: "response",
        showCursor: true // Flag to show blinking cursor
      }
    ]);
    
    // Artificially pause before typing starts (1-2 seconds)
    setTimeout(() => {
      // Reset character index
      currentCharIndexRef.current = 0;
      currentMessageRef.current = cleanedContent;
      
      // Calculate random typing speed for human-like effect
      const getRandomTypingSpeed = () => {
        // Base speed with random variation
        const baseSpeed = 40; // milliseconds
        const randomVariation = Math.random() * 80; // 0-80ms random variation
        
        // Occasionally add longer pauses (simulate thinking)
        if (Math.random() < 0.10) { // 10% chance of a longer pause
          return baseSpeed + randomVariation + Math.random() * 500; // Add 0-500ms extra
        }
        
        return baseSpeed + randomVariation;
      };
      
      // Function to type the next character with variable speed
      const typeNextChar = () => {
        if (currentCharIndexRef.current <= currentMessageRef.current.length) {
          setConsoleOutput(prev => {
            const updatedOutput = [...prev];
            const lastIndex = updatedOutput.length - 1;
            
            if (lastIndex >= 0) {
              updatedOutput[lastIndex] = {
                ...updatedOutput[lastIndex],
                content: currentMessageRef.current.substring(0, currentCharIndexRef.current),
                showCursor: true // Keep cursor visible while typing
              };
            }
            
            return updatedOutput;
          });
          
          currentCharIndexRef.current++;
          
          // Auto-scroll while typing
          autoScrollToBottom();
          
          // Schedule the next character with a random typing speed
          setTimeout(typeNextChar, getRandomTypingSpeed());
        } else {
          // Typing is complete, remove the cursor
          setConsoleOutput(prev => {
            const updatedOutput = [...prev];
            const lastIndex = updatedOutput.length - 1;
            
            if (lastIndex >= 0) {
              updatedOutput[lastIndex] = {
                ...updatedOutput[lastIndex],
                showCursor: false // Remove cursor when done typing
              };
            }
            
            return updatedOutput;
          });
          
          // Typing is complete
          setIsTyping(false);
          setIsMonicaTyping(false);
        }
      };
      
      // Start the typing animation
      typeNextChar();
      
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Handle regular messages
  const handleRegularMessage = (cleanedContent, currentTurn) => {
    setIsTyping(true);
    
    // Add empty message to console output
    setConsoleOutput(prev => [
      ...prev,
      {
        speaker: currentTurn.speaker,
        content: "",
        type: currentTurn.message_type
      }
    ]);
    
    // Reset character index
    currentCharIndexRef.current = 0;
    currentMessageRef.current = cleanedContent;
    
    // Start typing effect
    typingIntervalRef.current = setInterval(() => {
      if (currentCharIndexRef.current <= currentMessageRef.current.length) {
        setConsoleOutput(prev => {
          const updatedOutput = [...prev];
          const lastIndex = updatedOutput.length - 1;
          
          if (lastIndex >= 0) {
            updatedOutput[lastIndex] = {
              ...updatedOutput[lastIndex],
              content: currentMessageRef.current.substring(0, currentCharIndexRef.current)
            };
          }
          
          return updatedOutput;
        });
        
        currentCharIndexRef.current++;
        
        // Auto-scroll while typing - do it every character for more immediate feedback
        autoScrollToBottom();
      } else {
        // Clear the interval when typing is complete
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
        
        // Final scroll to bottom
        autoScrollToBottom();
        
        // Update stats for feedback messages
        if (currentTurn.message_type === "feedback") {
          setPoints(prev => prev + (currentTurn.points_awarded || 0));
          setStreak(currentTurn.streak_update || streak);
          if (currentTurn.skill_diagnosis?.accuracy) {
            setAccuracy(currentTurn.skill_diagnosis.accuracy);
          }
        }
        
        // If this turn requires user input, set the waiting state
        if (currentTurn.requires_input) {
          setWaitingForInput(true);
          setInputType(currentTurn.input_type || "text");
        }
        // Auto-advance logic is now handled in a separate useEffect
      }
    }, 15);
  };
  
  // Handle start button click
  const handleStart = () => {
    setIsRunning(true);
    setAutoAdvance(true); // Always set auto-advance to true when starting
    
    // If we're at the end, reset to the beginning
    if (!window.gameplayData || currentTurnIndex >= window.gameplayData.length) {
      setCurrentTurnIndex(0);
      setConsoleOutput([]);
      setIsComplete(false);
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    // Don't stop typing if in progress, just disable auto-advance
    setAutoAdvance(false);
    
    // If we're not typing, fully pause the game
    if (!isTyping) {
      setIsRunning(false);
    } else {
      // If typing is in progress, we'll let it finish
      // The game will be paused after typing completes via the useEffect below
    }
  };
  
  // Monitor typing state to complete pause after typing finishes
  useEffect(() => {
    // If we requested a pause (autoAdvance is false) but typing just finished
    if (!autoAdvance && !isTyping && isRunning) {
      setIsRunning(false);
    }
  }, [isTyping, autoAdvance, isRunning]);
  
  // Handle reset button click
  const handleReset = () => {
    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    // Reset the game state
    setIsRunning(false);
    setIsComplete(false);
    setCurrentTurnIndex(0);
    setConsoleOutput([]);
    setUserInput("");
    setWaitingForInput(false);
    setInputType(null);
    setPoints(0);
    setStreak(0);
    setAccuracy("N/A");
    setIsTyping(false);
    setIsMonicaTyping(false);
    setAutoAdvance(false);
  };
  
  // Handle next turn button click
  const handleNextTurn = () => {
    // Allow next turn even if game is paused, as long as we're not typing or waiting for input
    if (!isTyping && !waitingForInput) {
      const nextTurnIndex = currentTurnIndex + 1;
      
      // Check if we've reached the end of the game
      if (!window.gameplayData || nextTurnIndex >= window.gameplayData.length) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      
      // If game is paused, temporarily set it to running to process the turn
      const wasRunning = isRunning;
      if (!wasRunning) {
        setIsRunning(true);
      }
      
      // Move to the next turn
      setCurrentTurnIndex(nextTurnIndex);
      
      // If game was paused, set it back to paused after the turn is processed
      if (!wasRunning) {
        // We'll let the turn process and then pause again via the useEffect that monitors typing
      }
    }
  };
  
  // Toggle auto-advance mode
  const toggleAutoAdvance = () => {
    setAutoAdvance(prev => !prev);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  
  // Handle input submission
  const handleInputSubmit = () => {
    if (!waitingForInput || isTyping) return;
    
    // Add user input to console
    setConsoleOutput(prev => [
      ...prev,
      {
        speaker: "User",
        content: userInput || "[ENTER]",
        type: "user_input"
      }
    ]);
    
    setWaitingForInput(false);
    setUserInput("");
    
    // Immediate scroll to bottom
    autoScrollToBottom();
    
    // Move to the next turn after a delay
    setTimeout(() => {
      setCurrentTurnIndex(prev => prev + 1);
    }, 500);
  };
  
  // Handle key down events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && waitingForInput) {
      handleInputSubmit();
    }
  };
  
  // Render different console message styles
  const renderConsoleMessage = (message, index) => {
    // Properly capitalize speaker names for display
    const displaySpeaker = message.speaker === "monica" ? "Monica" : 
                         message.speaker === "rc" ? "R.C." : 
                         message.speaker === "system" ? "SYSTEM" :
                         message.speaker;
    
    // Base typography styles with larger font
    const baseStyles = {
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      fontSize: '1.3rem',  // 30% larger font size
      mb: 1.5,
      // Dim other messages when Monica is typing
      opacity: isMonicaTyping && message.speaker !== "monica" ? 0.6 : 1,
      transition: 'opacity 0.3s ease'
    };
    
    if (message.type === "milestone_announcement") {
      return (
        <Typography 
          key={index} 
          variant="body1" 
          sx={{ 
            ...baseStyles,
            color: '#FFFF00', 
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            my: 2,
            textShadow: '0 0 5px #FFFF00',
            borderTop: '1px dashed #FFFF00',
            borderBottom: '1px dashed #FFFF00',
            py: 1
          }}
        >
          {message.content}
        </Typography>
      );
    } else if (message.type === "system_message" || message.type === "challenge_setup" || message.type === "scenario") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#00CCFF' }}>
          {message.type === "challenge_setup" || message.type === "scenario" ? `[${displaySpeaker}]: ${message.content}` : message.content}
        </Typography>
      );
    } else if (message.type === "prompt") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#E0E0E0' }}>
          <strong>[{displaySpeaker}]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "response") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#00FF00', position: 'relative' }}>
          <strong>[{displaySpeaker}]:</strong> {message.content}
          {message.showCursor && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                position: 'relative',
                width: '0.6rem',
                height: '1.3rem',
                backgroundColor: '#00FF00',
                ml: '1px',
                animation: 'blink 1s step-end infinite',
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0 }
                },
                verticalAlign: 'text-bottom'
              }}
            />
          )}
        </Typography>
      );
    } else if (message.type === "feedback") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#FFFF00' }}>
          <strong>[{displaySpeaker}]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "user_input") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#FFFFFF' }}>
          <strong>[User]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "dashboard_report_snippet") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#00CCFF' }}>
          {message.content}
        </Typography>
      );
    } else if (message.type === "surprise") {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#FFAA00' }}>
          <strong>[{displaySpeaker}]:</strong> {message.content}
        </Typography>
      );
    } else {
      return (
        <Typography key={index} variant="body2" sx={{ ...baseStyles, color: '#CCCCCC' }}>
          <strong>[{displaySpeaker}]:</strong> {message.content}
        </Typography>
      );
    }
  };

  // Function to jump to a specific turn - logic for adding milestone announcements
  const jumpToTurn = (turnIndex) => {
    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    // Reset state
    setIsTyping(false);
    setIsMonicaTyping(false);
    setWaitingForInput(false);
    setUserInput("");
    
    // If we're jumping to the beginning, reset everything
    if (turnIndex === 0) {
      setConsoleOutput([]);
      setCurrentTurnIndex(0);
      setCurrentMilestone(null);
      return;
    }
    
    // Check if gameplayData exists
    if (!window.gameplayData) {
      console.warn("Cannot jump to turn: gameplayData is not initialized");
      setConsoleOutput([]);
      setCurrentTurnIndex(0);
      setCurrentMilestone(null);
      return;
    }
    
    // Ensure turnIndex doesn't exceed gameplayData length
    if (turnIndex >= window.gameplayData.length) {
      console.warn(`Turn index ${turnIndex} exceeds gameplayData length ${window.gameplayData.length}`);
      turnIndex = window.gameplayData.length - 1;
    }
    
    // Process all turns up to the selected turn without animations
    const newConsoleOutput = [];
    let latestMilestone = null;
    let milestoneAdded = false;
    
    for (let i = 0; i < turnIndex; i++) {
      const turn = window.gameplayData[i];
      const cleanedContent = cleanTextFromTags(turn.content);
      
      // Only add a milestone announcement when the milestone first changes
      if (turn.milestone && turn.milestone !== latestMilestone) {
        if (!milestoneAdded || turn.milestone !== latestMilestone) {
          // Add the milestone announcement just before the turn that introduces the milestone
          newConsoleOutput.push({
            speaker: "system",
            content: `\n**** MILESTONE: ${turn.milestone.toUpperCase()} ****\n`,
            type: "milestone_announcement"
          });
          milestoneAdded = true;
        }
        
        latestMilestone = turn.milestone;
      }
      
      // Add the normal turn message
      if (turn.speaker === "monica") {
        newConsoleOutput.push({
          speaker: "monica",
          content: cleanedContent,
          type: "response"
        });
      } else if (turn.message_type !== "data_tracking") { // Skip data_tracking messages
        newConsoleOutput.push({
          speaker: turn.speaker,
          content: cleanedContent,
          type: turn.message_type
        });
      }
      
      // Update stats for feedback messages
      if (turn.message_type === "feedback") {
        setPoints(turn.points_awarded || 0);
        setStreak(turn.streak_update || 0);
        if (turn.skill_diagnosis?.accuracy) {
          setAccuracy(turn.skill_diagnosis.accuracy);
        }
      }
      
      // Handle data tracking updates silently
      if (turn.message_type === "data_tracking" && turn.dataTracking) {
        onDataTrackingUpdate(turn.dataTracking);
      }
    }
    
    // Update milestone based on the jumpto position
    if (latestMilestone !== currentMilestone) {
      console.log(`Updating milestone from ${currentMilestone} to ${latestMilestone}`);
      setCurrentMilestone(latestMilestone);
    }
    
    // Set the new console output
    setConsoleOutput(newConsoleOutput);
    
    // Set the current turn index
    setCurrentTurnIndex(turnIndex);
    
    // Also check the current turn for milestone
    const currentTurn = window.gameplayData[turnIndex];
    if (currentTurn && currentTurn.milestone && currentTurn.milestone !== latestMilestone) {
      console.log(`Updating milestone from ${latestMilestone} to ${currentTurn.milestone} (current turn)`);
      setCurrentMilestone(currentTurn.milestone);
      
      // Only add a milestone announcement if this is a new milestone
      setConsoleOutput(prev => [
        ...prev,
        {
          speaker: "system",
          content: `\n**** MILESTONE: ${currentTurn.milestone.toUpperCase()} ****\n`,
          type: "milestone_announcement"
        }
      ]);
    }
    
    // If the current turn requires input, set waiting for input
    if (currentTurn && currentTurn.requires_input) {
      setWaitingForInput(true);
      setInputType(currentTurn.input_type || "text");
    }
    
    // Scroll to bottom after a short delay to ensure rendering is complete
    setTimeout(autoScrollToBottom, 100);
  };

  // Check for window.gameplayData availability
  useEffect(() => {
    const checkGameData = () => {
      if (window.gameplayData && window.gameplayData.length > 0) {
        setGameDataAvailable(true);
      } else {
        setTimeout(checkGameData, 100); // Check again after a short delay
      }
    };
    
    checkGameData();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Stats box at the bottom
  const renderStatsBox = () => (
    <Box
      sx={{
        padding: 1,
        borderTop: '1px solid #00FF00',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" sx={{ color: '#00CC00', fontFamily: 'var(--font-geist-mono), monospace' }}>
        Points: {points}
      </Typography>
      <Typography variant="body2" sx={{ color: '#00CC00', fontFamily: 'var(--font-geist-mono), monospace' }}>
        Streak: {streak}
      </Typography>
      <Typography variant="body2" sx={{ color: '#00CC00', fontFamily: 'var(--font-geist-mono), monospace' }}>
        Accuracy: {accuracy}
      </Typography>
      <Typography variant="body2" sx={{ color: '#00CC00', fontFamily: 'var(--font-geist-mono), monospace' }}>
        Turn: {currentTurnIndex + 1}/{window.gameplayData?.length || 1}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'black',
        border: '1px solid #00FF00',
        borderRadius: 1,
        boxShadow: '0 0 5px #00FF00',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Terminal header */}
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 1,
          borderBottom: '1px solid #00FF00',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
      </Box>
      
      {/* Terminal content - fixed height scrollable container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden', // Prevent outer container from scrolling
          minHeight: '200px', // Ensure minimum height
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 2,
            overflowY: 'auto',
            backgroundColor: 'black',
            color: '#00CC00',
            fontFamily: 'var(--font-geist-mono), monospace',
            // Remove smooth scrolling behavior
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 255, 0, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
              },
            },
            // Add a subtle scan line effect
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.02) 50%)',
            backgroundSize: '100% 4px',
          }}
        >
          {!gameDataAvailable ? (
            <Typography variant="body1" sx={{ color: '#00CC00', fontFamily: 'var(--font-geist-mono), monospace' }}>
              Initializing game data...
            </Typography>
          ) : (
            <>
              {consoleOutput.map((message, index) => renderConsoleMessage(message, index))}
              
              {/* Show typing indicator when typing */}
              {isTyping && (
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-geist-mono), monospace', color: '#00CC00' }}>
                  <span className="typing-indicator">_</span>
                </Typography>
              )}
            </>
          )}
          
          {/* Reference for auto-scrolling */}
          <div ref={consoleEndRef} style={{ height: '1px', width: '100%' }} />
        </Box>
      </Box>
      
      {/* Input area */}
      {waitingForInput && (
        <Box
          sx={{
            padding: 2,
            borderTop: '1px solid #00FF00',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            placeholder={inputType === 'press_enter' ? 'Press Enter to continue...' : 'Type your response...'}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00CC00',
                fontFamily: 'var(--font-geist-mono), monospace',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                '& fieldset': {
                  borderColor: '#00FF00',
                },
                '&:hover fieldset': {
                  borderColor: '#00FF00',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FF00',
                },
              },
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleInputSubmit}
            sx={{ ml: 1, backgroundColor: '#007700', '&:hover': { backgroundColor: '#00AA00' } }}
          >
            Send
          </Button>
        </Box>
      )}
      
      {/* Game stats */}
      {renderStatsBox()}
    </Box>
  );
});

CenterSection.displayName = 'CenterSection';

export default CenterSection; 