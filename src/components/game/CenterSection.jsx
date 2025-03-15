'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Divider, TextField, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

// Simulated gameplay data (in a real app, this would be imported from the JSON files)
const gameplayData = {
  turns: [
    {
      turn_number: 1,
      speaker: "R.C.",
      message_type: "system_message",
      content: "+---------------------------+\n| RCM Labs CLI - v2.0 ⚡️ |",
      delay_ms: 500
    },
    {
      turn_number: 2,
      speaker: "R.C.",
      message_type: "prompt",
      content: "RCM Labs – your solution for *critical thinking at scale*. R.C. here, your guide. AXA needs *resilience*—driven by *sharp minds*. Monica's about to show you how *our program* cultivates *next-gen critical thinkers* in just 12 weeks. Five skill pillars, laser-focused drills, 20-min sprints—*boost AXA's cognitive edge* and debug market chaos? Hit Enter to see *critical thinking in action.*",
      expected_response_type: "press_enter",
      delay_ms: 1800
    },
    {
      turn_number: 3,
      speaker: "Monica",
      message_type: "response",
      input_type: "press_enter",
      content: "[Engage Critical Thinking Program - Ready to think!]",
      delay_ms: 300
    },
    {
      turn_number: 4,
      speaker: "R.C.",
      message_type: "prompt",
      content: "*Monica's stepping into the arena—*critical thinking sandbox activated*. We're benchmarking against industry standards—Team A & B—but Monica's specs? *Top percentile*. This 12-week sprint—AXA's workforce *cognitively upgraded*. Sharpen minds, cut through market noise—*critical insights*, AXA's future. Ready to see *data-driven critical thinking insights*? Hit Enter…",
      expected_response_type: "press_enter",
      delay_ms: 1800
    },
    {
      turn_number: 5,
      speaker: "Monica",
      message_type: "response",
      input_type: "press_enter",
      content: "[Initiate Critical Thinking Drill Sequence - Let's begin.]",
      delay_ms: 800
    },
    {
      turn_number: 6,
      speaker: "R.C.",
      message_type: "prompt",
      content: "*Strategic move*! Caliban's *Market Meltdown*—perfect *critical thinking stress test*. 3 Base Cuts to calibrate, then League 10 drills for 12 weeks. Points, streaks—Team A's at 92% critical thinking accuracy… *Monica's about to redefine 'high performance'*. Ready to witness *AXA's critical thinking potential unleashed*? Smash Enter—*Let's code for a smarter workforce!*",
      expected_response_type: "press_enter",
      delay_ms: 2200
    },
    {
      turn_number: 7,
      speaker: "Monica",
      message_type: "response",
      input_type: "press_enter",
      content: "[Launch Critical Thinking Calibration - Starting calibration.]",
      delay_ms: 300
    },
    {
      turn_number: 8,
      speaker: "R.C.",
      message_type: "system_message",
      content: "+---------------------------+\n| League 10 - Critical Thinking Calibration |\n+---------------------------+\n| Base Calibration (3 Cuts) |\n| [O] Cut 1 - [ ] Cut 2 - [ ] Cut 3",
      delay_ms: 1000
    },
    {
      turn_number: 9,
      speaker: "R.C.",
      message_type: "prompt",
      content: "+------------- Base Cut 1/3 - Critical Thinking Calibration -------------+\n| Score: 0 | Cut 1—Caliban whispers: 'Risky trades… clients *love the gamble*.' |\n| Streak: 0 | *Apply critical thinking*, Monica. Debunk or confirm—is this legit? |\n| Acc: N/A | > |\n| Team A: 92%| You: N/A |\n+-----------------------------------------------------------------+\n> ",
      question_type: "base_level",
      skill_assessed: "assumptions",
      correct_answer_keywords: ["losses", "lose loyalty", "risk"],
      delay_ms: 1500
    },
    {
      turn_number: 10,
      speaker: "Monica",
      message_type: "response",
      input_type: "open_text",
      content: "No, that's simply incorrect. Banks rely on client trust, not speculative risks.",
      delay_ms: 700
    },
    {
      turn_number: 11,
      speaker: "R.C.",
      message_type: "feedback",
      content: "*Assumption – DEBUNKED with Critical Precision!* 🔥 *Textbook* critical thinking, Monica. Risky trades *erode* client trust—+10 points, critical streak's *ignited* at 1! -- Calibration: [O-----] 1/3 Cuts [Assumptions Icon - Critical Thinking Skill]",
      feedback_type: "positive",
      points_awarded: 10,
      streak_update: 1,
      delay_ms: 1500
    },
    {
      turn_number: 12,
      speaker: "R.C.",
      message_type: "system_message",
      content: "+---------------------------+\n| League 10 - Critical Thinking Calibration |\n+---------------------------+\n| Base Calibration (2/3) [X] Cut 1 - [ ] Cut 2 - [ ] Cut 3",
      delay_ms: 500
    },
    {
      turn_number: 13,
      speaker: "R.C.",
      message_type: "prompt",
      content: "+------------- Base Cut 2/3 - Critical Deduction Drill -------------+\n| Score: 10| Cut 2—Caliban's drop: '$2M trade, 20% risk—*solo greenlight*.' |\n| Streak: 1 | *Critical deduction* needed, Monica. Logic gap—spot it. |\n| Acc: 90% | > |\n| Team A: 92%| You: 90% |\n+-----------------------------------------------------------------+\n> ",
      question_type: "base_level",
      skill_assessed: "deduction",
      correct_answer_keywords: ["VP check", "approval", "overreach"],
      delay_ms: 1500
    },
    {
      turn_number: 14,
      speaker: "Monica",
      message_type: "response",
      input_type: "open_text",
      content: "Is VP approval not required for trades of that magnitude? That deviates from standard procedure.",
      delay_ms: 700
    },
    {
      turn_number: 15,
      speaker: "R.C.",
      message_type: "feedback",
      content: "*Critical Deduction – FLAWLESS!* 🧠 *Correct*—protocol *breach* is the critical flaw. +10, critical streak *surging* to 2! Your logic engine's *calibrated for critical insight*. -- Calibration: [OX----] 2/3 Cuts [Deduction Icon - Critical Thinking Skill]",
      feedback_type: "positive",
      points_awarded: 10,
      streak_update: 2,
      delay_ms: 1500
    },
    {
      turn_number: 16,
      speaker: "R.C.",
      message_type: "system_message",
      content: "+---------------------------+\n| League 10 - Critical Thinking Calibration |\n+---------------------------+\n| Base Calibration (3/3) [X] Cut 1 - [X] Cut 2 - [ ] Cut 3",
      delay_ms: 500
    },
    {
      turn_number: 17,
      speaker: "R.C.",
      message_type: "prompt",
      content: "+------------- Base Cut 3/3 - EQ Check for Critical Leadership -------------+\n| Score: 20| Cut 3—*Urgent!* Fake spike *panics* your squad—'Market's *collapsing!*' |\n| Streak: 2 | Team's losing critical focus, Monica. Apply *EQ-driven critical leadership*. Guide them. |\n| Acc: 95% | > *Command critical calm, Leader!* |\n| Team A: 92%| You: 95% |\n+------------------------------------------------------------------------------+\n> ",
      question_type: "base_level",
      skill_assessed: "interpretation/eq",
      correct_answer_keywords: ["data off", "stay sharp", "got this", "reassure team"],
      delay_ms: 2000
    },
    {
      turn_number: 18,
      speaker: "Monica",
      message_type: "response",
      input_type: "open_text",
      content: "Team, everyone take a breath. This looks like a data anomaly. We need to focus on verified metrics and our established strategy.",
      delay_ms: 700
    },
    {
      turn_number: 19,
      speaker: "R.C.",
      message_type: "feedback",
      content: "*EQ-Powered Critical Leadership - BOSS LEVEL!* 🚀 '*Data glitch*'—*critically calm* command, Leader Monica. Team *re-engaging critical thinking*—morale *stabilized*! +15, critical streak *unstoppable* at 3, *Crew Stabilizer* badge—*lead with that critical EQ and a *growth-focused mindset*!*! -- Calibration: [XXX] 3/3 Cuts - BASE CRITICAL THINKING CALIBRATION COMPLETE! [EQ Icon - Critical Leadership Skill]",
      feedback_type: "badge_earned",
      points_awarded: 15,
      streak_update: 3,
      badges_earned: ["Crew Stabilizer"],
      delay_ms: 1500
    },
    {
      turn_number: 20,
      speaker: "R.C.",
      message_type: "system_message",
      content: "+---------------------------+\n| CALIBRATION COMPLETE - CRITICAL THINKING PROFILE GENERATED |\n+---------------------------+\n| Monica - AXA Manager - Critical Thinker Profile |\n| Critical Thinking: 95% (Team A: 92%, Team B: 89%) |\n| EQ Leadership: 90% |\n| Growth Mindset: HIGH |\n| League Status: READY FOR LEAGUE 10",
      delay_ms: 2000
    },
    {
      turn_number: 21,
      speaker: "R.C.",
      message_type: "prompt",
      content: "*Calibration complete*! Monica's critical thinking profile is *exceptional*. Ready to see how this translates to *real ROI* for AXA? Hit Enter to view the *projected impact* of scaling this program to 100 managers...",
      expected_response_type: "press_enter",
      delay_ms: 1800
    }
  ]
};

const CenterSection = ({ title = "RCM LABS TERMINAL" }) => {
  const [gameState, setGameState] = useState({
    isRunning: false,
    isComplete: false,
    currentTurnIndex: 0,
    consoleOutput: [],
    userInput: "",
    waitingForInput: false,
    inputType: null,
    points: 0,
    streak: 0,
    accuracy: "N/A",
    isTyping: false
  });
  
  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const currentCharIndexRef = useRef(0);
  const currentMessageRef = useRef("");

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
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.consoleOutput]);

  // Focus input when waiting for input
  useEffect(() => {
    if (gameState.waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.waitingForInput]);

  // Process the next turn
  const processNextTurn = () => {
    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    if (gameState.currentTurnIndex >= gameplayData.turns.length) {
      setGameState(prev => ({ ...prev, isRunning: false, isComplete: true }));
      return;
    }

    const currentTurn = gameplayData.turns[gameState.currentTurnIndex];
    
    // If it's a system message or R.C. speaking, add to console output with typing effect
    if (currentTurn.speaker === "R.C." || currentTurn.message_type === "system_message") {
      // Add empty message to console output to start typing effect
      setGameState(prev => ({
        ...prev,
        isTyping: true,
        consoleOutput: [
          ...prev.consoleOutput,
          {
            speaker: currentTurn.speaker,
            content: "",
            type: currentTurn.message_type
          }
        ]
      }));
      
      // Reset character index
      currentCharIndexRef.current = 0;
      currentMessageRef.current = currentTurn.content;
      
      // Start typing effect after a short delay to ensure state is updated
      setTimeout(() => {
        typingIntervalRef.current = setInterval(() => {
          if (currentCharIndexRef.current <= currentMessageRef.current.length) {
            setGameState(prev => {
              const updatedOutput = [...prev.consoleOutput];
              const lastIndex = updatedOutput.length - 1;
              
              if (lastIndex >= 0) {
                updatedOutput[lastIndex] = {
                  ...updatedOutput[lastIndex],
                  content: currentMessageRef.current.substring(0, currentCharIndexRef.current)
                };
                
                return {
                  ...prev,
                  consoleOutput: updatedOutput
                };
              }
              return prev;
            });
            
            currentCharIndexRef.current++;
          } else {
            // Clear the interval when typing is complete
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            
            // Check if we need to wait for user input
            if (currentTurn.expected_response_type) {
              setGameState(prev => ({
                ...prev,
                waitingForInput: true,
                inputType: currentTurn.expected_response_type,
                isTyping: false
              }));
            } else {
              // Move to next turn after delay
              setTimeout(() => {
                setGameState(prev => ({
                  ...prev,
                  currentTurnIndex: prev.currentTurnIndex + 1,
                  isTyping: false
                }));
                processNextTurn();
              }, currentTurn.delay_ms || 1000);
            }
          }
        }, 15); // typing speed
      }, 50);
    }
    // If it's Monica's response, simulate typing it
    else if (currentTurn.speaker === "Monica") {
      setGameState(prev => ({ 
        ...prev, 
        isTyping: true,
        userInput: "" 
      }));
      
      // Reset character index
      currentCharIndexRef.current = 0;
      currentMessageRef.current = currentTurn.content;
      
      // Start typing effect after a short delay
      setTimeout(() => {
        typingIntervalRef.current = setInterval(() => {
          if (currentCharIndexRef.current <= currentMessageRef.current.length) {
            setGameState(prev => ({
              ...prev,
              userInput: currentMessageRef.current.substring(0, currentCharIndexRef.current)
            }));
            
            currentCharIndexRef.current++;
          } else {
            // Clear the interval when typing is complete
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            
            // Add Monica's response to console output
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                consoleOutput: [
                  ...prev.consoleOutput,
                  {
                    speaker: "Monica",
                    content: currentMessageRef.current,
                    type: "response"
                  }
                ],
                userInput: "",
                isTyping: false,
                currentTurnIndex: prev.currentTurnIndex + 1
              }));
              
              // Process next turn after delay
              setTimeout(() => {
                processNextTurn();
              }, currentTurn.delay_ms || 500);
            }, 500);
          }
        }, 30); // typing speed for Monica
      }, 50);
    }
    // If it's feedback, update stats and add to console
    else if (currentTurn.message_type === "feedback") {
      // Add empty message to console output to start typing effect
      setGameState(prev => ({
        ...prev,
        isTyping: true,
        consoleOutput: [
          ...prev.consoleOutput,
          {
            speaker: "R.C.",
            content: "",
            type: "feedback"
          }
        ]
      }));
      
      // Reset character index
      currentCharIndexRef.current = 0;
      currentMessageRef.current = currentTurn.content;
      
      // Start typing effect after a short delay
      setTimeout(() => {
        typingIntervalRef.current = setInterval(() => {
          if (currentCharIndexRef.current <= currentMessageRef.current.length) {
            setGameState(prev => {
              const updatedOutput = [...prev.consoleOutput];
              const lastIndex = updatedOutput.length - 1;
              
              if (lastIndex >= 0) {
                updatedOutput[lastIndex] = {
                  ...updatedOutput[lastIndex],
                  content: currentMessageRef.current.substring(0, currentCharIndexRef.current)
                };
                
                return {
                  ...prev,
                  consoleOutput: updatedOutput
                };
              }
              return prev;
            });
            
            currentCharIndexRef.current++;
          } else {
            // Clear the interval when typing is complete
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            
            // Update stats
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                points: prev.points + (currentTurn.points_awarded || 0),
                streak: currentTurn.streak_update || prev.streak,
                accuracy: currentTurn.skill_diagnosis?.accuracy + "%" || prev.accuracy,
                isTyping: false,
                currentTurnIndex: prev.currentTurnIndex + 1
              }));
              
              // Process next turn after delay
              setTimeout(() => {
                processNextTurn();
              }, currentTurn.delay_ms || 1000);
            }, 500);
          }
        }, 15); // typing speed
      }, 50);
    }
  };

  const handleStart = () => {
    if (!gameState.isRunning) {
      // Clear any existing interval
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      
      setGameState({
        isRunning: true,
        isComplete: false,
        currentTurnIndex: 0,
        consoleOutput: [],
        userInput: "",
        waitingForInput: false,
        inputType: null,
        points: 0,
        streak: 0,
        accuracy: "N/A",
        isTyping: false
      });
      
      setTimeout(() => {
        processNextTurn();
      }, 500);
    }
  };

  const handlePause = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    setGameState(prev => ({ ...prev, isRunning: false }));
  };

  const handleReset = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    setGameState({
      isRunning: false,
      isComplete: false,
      currentTurnIndex: 0,
      consoleOutput: [],
      userInput: "",
      waitingForInput: false,
      inputType: null,
      points: 0,
      streak: 0,
      accuracy: "N/A",
      isTyping: false
    });
  };

  const handleInputChange = (e) => {
    setGameState(prev => ({ ...prev, userInput: e.target.value }));
  };

  const handleInputSubmit = () => {
    if (!gameState.waitingForInput || gameState.isTyping) return;
    
    const currentTurn = gameplayData.turns[gameState.currentTurnIndex];
    
    // Add user input to console
    setGameState(prev => ({
      ...prev,
      consoleOutput: [
        ...prev.consoleOutput,
        {
          speaker: "User",
          content: prev.userInput || "[ENTER]",
          type: "user_input"
        }
      ],
      waitingForInput: false,
      currentTurnIndex: prev.currentTurnIndex + 1
    }));
    
    // Process next turn after delay
    setTimeout(() => {
      processNextTurn();
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && gameState.waitingForInput) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#00FF00',
              fontFamily: 'var(--font-geist-mono), monospace',
              letterSpacing: '0.02em',
            }}
          >
            SCORE: {gameState.points}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#00FF00',
              fontFamily: 'var(--font-geist-mono), monospace',
              letterSpacing: '0.02em',
            }}
          >
            STREAK: {gameState.streak}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#00FF00',
              fontFamily: 'var(--font-geist-mono), monospace',
              letterSpacing: '0.02em',
            }}
          >
            ACC: {gameState.accuracy}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0, 255, 0, 0.3)', mb: 2 }} />
      
      <Box 
        sx={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          p: 2, 
          borderRadius: 1,
          border: '1px solid rgba(0, 255, 0, 0.3)',
          overflow: 'auto',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.875rem',
          color: '#00CC00',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 200px)', // Set a max height to enable scrolling
          height: '400px', // Fixed height to ensure scrolling works
          overflowY: 'auto', // Enable vertical scrolling
          scrollBehavior: 'smooth', // Smooth scrolling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderRadius: '4px',
          },
        }}
      >
        {gameState.consoleOutput.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: '#00CC00',
              fontFamily: 'var(--font-geist-mono), monospace',
              opacity: 0.7,
            }}
          >
            {'> WELCOME TO RCM LABS TERMINAL. PRESS START TO BEGIN THE SIMULATION.'}
          </Typography>
        ) : (
          gameState.consoleOutput.map((line, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: line.speaker === 'R.C.' ? '#00FF00' : 
                       line.speaker === 'Monica' ? '#FFAA00' : 
                       line.type === 'system_message' ? '#55AAFF' : 
                       line.type === 'feedback' ? '#00FF00' : '#00CC00',
                fontFamily: 'var(--font-geist-mono), monospace',
                mb: 1,
                whiteSpace: 'pre-wrap',
                fontWeight: line.type === 'feedback' ? 'bold' : 'normal',
              }}
            >
              {line.speaker !== 'System' && `[${line.speaker}]: `}{line.content}
            </Typography>
          ))
        )}
        {gameState.isTyping && (
          <Box sx={{ display: 'inline-block', ml: 1 }}>
            <Typography
              component="span"
              sx={{
                color: '#00FF00',
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0 },
                },
              }}
            >
              _
            </Typography>
          </Box>
        )}
        <div ref={consoleEndRef} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {gameState.waitingForInput ? (
          <>
            <TextField
              ref={inputRef}
              variant="outlined"
              value={gameState.userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={gameState.inputType === 'press_enter' ? 'Press Enter to continue...' : 'Type your response...'}
              disabled={gameState.isTyping}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#00FF00',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: 'rgba(0, 255, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00FF00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00FF00',
                  },
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleInputSubmit}
              disabled={gameState.isTyping}
              startIcon={<SendIcon />}
              sx={{
                borderColor: '#00FF00',
                color: '#00FF00',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 5px #00FF00',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 255, 0, 0.3)',
                  color: 'rgba(0, 255, 0, 0.3)',
                }
              }}
            >
              SEND
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              onClick={handleStart}
              disabled={gameState.isRunning || gameState.isTyping}
              sx={{
                borderColor: '#00FF00',
                color: '#00FF00',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 5px #00FF00',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 255, 0, 0.3)',
                  color: 'rgba(0, 255, 0, 0.3)',
                }
              }}
            >
              START
            </Button>
            <Button
              variant="outlined"
              startIcon={<PauseIcon />}
              onClick={handlePause}
              disabled={!gameState.isRunning || gameState.isTyping}
              sx={{
                borderColor: '#00FF00',
                color: '#00FF00',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 5px #00FF00',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 255, 0, 0.3)',
                  color: 'rgba(0, 255, 0, 0.3)',
                }
              }}
            >
              PAUSE
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              disabled={gameState.isTyping}
              sx={{
                borderColor: '#FFAA00',
                color: '#FFAA00',
                '&:hover': {
                  backgroundColor: 'rgba(255, 170, 0, 0.1)',
                  boxShadow: '0 0 5px #FFAA00',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(255, 170, 0, 0.3)',
                  color: 'rgba(255, 170, 0, 0.3)',
                }
              }}
            >
              RESET
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CenterSection; 