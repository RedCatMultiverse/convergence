'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Button, Divider, TextField, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TerminalIcon from '@mui/icons-material/Terminal';

// Import gameplay data from JSON file
import gameplayDataJson from '@/data/gameplay_data.json';

// Get the gameplay data from the imported JSON
const gameplayData = gameplayDataJson.gameplay_demo.turns;

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
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  // Game stats
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState("N/A");
  
  // Refs
  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const currentCharIndexRef = useRef(0);
  const currentMessageRef = useRef("");
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleStart,
    handlePause,
    handleReset,
    toggleAutoAdvance,
    handleNextTurn,
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
    if (isRunning && !isTyping && !waitingForInput && currentTurnIndex < gameplayData.length) {
      processTurn(currentTurnIndex);
    }
  }, [currentTurnIndex, isRunning]);
  
  // Function to process a specific turn
  const processTurn = (turnIndex) => {
    // Check if we've reached the end of the game
    if (turnIndex >= gameplayData.length) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }
    
    // Get the current turn data
    const currentTurn = gameplayData[turnIndex];
    console.log(`Processing turn ${turnIndex}:`, currentTurn.turn_number, currentTurn.speaker, currentTurn.message_type);
    
    // Clean the content from tags
    const cleanedContent = cleanTextFromTags(currentTurn.content);
    
    // Handle different types of turns
    if (currentTurn.speaker === "Monica") {
      handleMonicaResponse(cleanedContent, currentTurn);
    } else {
      handleRegularMessage(cleanedContent, currentTurn);
    }
  };
  
  // Handle Monica's responses
  const handleMonicaResponse = (cleanedContent, currentTurn) => {
    setIsTyping(true);
    setUserInput("");
    
    // Reset character index
    currentCharIndexRef.current = 0;
    currentMessageRef.current = cleanedContent;
    
    // Start typing effect for Monica's response
    typingIntervalRef.current = setInterval(() => {
      if (currentCharIndexRef.current <= currentMessageRef.current.length) {
        setUserInput(currentMessageRef.current.substring(0, currentCharIndexRef.current));
        currentCharIndexRef.current++;
      } else {
        // Clear the interval when typing is complete
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        
        // Add Monica's response to console output
        setTimeout(() => {
          setConsoleOutput(prev => [
            ...prev,
            {
              speaker: "Monica",
              content: currentMessageRef.current,
              type: "response"
            }
          ]);
          
          setUserInput("");
          setIsTyping(false);
          
          // Auto-advance if enabled
          if (autoAdvance) {
            setTimeout(() => {
              setCurrentTurnIndex(prev => prev + 1);
            }, currentTurn.delay_ms || 500);
          }
        }, 500);
      }
    }, 30);
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
            setAccuracy(currentTurn.skill_diagnosis.accuracy + "%");
          }
        }
        
        // Check if we need to wait for user input
        if (currentTurn.expected_response_type) {
          setWaitingForInput(true);
          setInputType(currentTurn.expected_response_type);
        } 
        // Auto-advance if enabled
        else if (autoAdvance) {
          setTimeout(() => {
            setCurrentTurnIndex(prev => prev + 1);
          }, currentTurn.delay_ms || 1000);
        }
      }
    }, 15);
  };
  
  // Handle start button click
  const handleStart = () => {
    if (!isRunning) {
      // Clear any existing interval
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      
      // Reset the game state
      setIsRunning(true);
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
      setAutoAdvance(false);
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    setIsRunning(false);
    
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };
  
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
    setAutoAdvance(false);
  };
  
  // Handle next turn button click
  const handleNextTurn = () => {
    if (isRunning && !isTyping && !waitingForInput) {
      const nextTurnIndex = currentTurnIndex + 1;
      
      // Check if we've reached the end of the game
      if (nextTurnIndex >= gameplayData.length) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      
      // Move to the next turn
      setCurrentTurnIndex(nextTurnIndex);
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
    if (message.type === "system_message") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'cyan', whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
      );
    } else if (message.type === "prompt") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'red', whiteSpace: 'pre-wrap' }}>
          <strong>[{message.speaker}]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "response") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'green', whiteSpace: 'pre-wrap' }}>
          <strong>[{message.speaker}]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "feedback") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'yellow', whiteSpace: 'pre-wrap' }}>
          <strong>[{message.speaker}]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "user_input") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'white', whiteSpace: 'pre-wrap' }}>
          <strong>[User]:</strong> {message.content}
        </Typography>
      );
    } else if (message.type === "dashboard_report_snippet") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'magenta', whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
      );
    } else if (message.type === "surprise") {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'orange', whiteSpace: 'pre-wrap' }}>
          <strong>[{message.speaker}]:</strong> {message.content}
        </Typography>
      );
    } else {
      return (
        <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'white', whiteSpace: 'pre-wrap' }}>
          <strong>[{message.speaker}]:</strong> {message.content}
        </Typography>
      );
    }
  };

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
          {consoleOutput.map((message, index) => renderConsoleMessage(message, index))}
          
          {/* Show typing indicator when typing */}
          {isTyping && (
            <Typography variant="body2" sx={{ fontFamily: 'var(--font-geist-mono), monospace', color: '#00CC00' }}>
              <span className="typing-indicator">_</span>
            </Typography>
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
          Turn: {currentTurnIndex + 1}/{gameplayData.length}
        </Typography>
      </Box>
    </Box>
  );
});

CenterSection.displayName = 'CenterSection';

export default CenterSection; 