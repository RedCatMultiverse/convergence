'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button, Slider, Avatar, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CodeIcon from '@mui/icons-material/Code';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { SignOutDialog } from '../auth/SignOutDialog';

const TopSection = ({ 
  title = "MISSION BRIEFING", 
  onToggleExpand = () => {},
  isRunning = false,
  onStart = () => {},
  onPause = () => {},
  onReset = () => {},
  autoAdvance = false,
  onToggleAutoAdvance = () => {},
  onNextTurn = () => {},
  isTyping = false,
  waitingForInput = false,
  currentTurnIndex = 0,
  totalTurns = 0,
  onTurnSliderChange = () => {},
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [milestoneMarks, setMilestoneMarks] = useState([]);
  
  // Debug session
  useEffect(() => {
    console.log('Session in TopSection:', session);
    console.log('Auth status:', status);
  }, [session, status]);
  
  // Calculate milestone markers for the slider
  useEffect(() => {
    if (window.gameplayData && window.gameplayData.length > 0 && totalTurns > 0) {
      // Find the turn index where each milestone starts
      const marks = [];
      const milestones = new Set(); // Track which milestones we've seen
      
      window.gameplayData.forEach((turn, index) => {
        if (turn.milestone && !milestones.has(turn.milestone)) {
          milestones.add(turn.milestone);
          
          // Get a readable milestone name
          const milestoneName = turn.milestone.charAt(0).toUpperCase() + turn.milestone.slice(1);
          
          marks.push({
            value: index,
            label: milestoneName // Keep label for tooltip
          });
        }
      });
      
      setMilestoneMarks(marks);
      console.log('Milestone marks:', marks);
    }
  }, [totalTurns]); // Recalculate when total turns changes (indicates game data loaded)
  
  // Always ensure the parent knows we're collapsed
  useEffect(() => {
    onToggleExpand(false);
  }, [onToggleExpand]);
  
  // Update slider value when currentTurnIndex changes
  useEffect(() => {
    setSliderValue(currentTurnIndex);
  }, [currentTurnIndex]);
  
  // Handle slider change
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };
  
  // Check if the slider value is near a milestone mark
  const shouldSnapToMilestone = (value) => {
    // Find the closest milestone mark
    const closestMark = milestoneMarks.reduce((closest, mark) => {
      const currentDistance = Math.abs(mark.value - value);
      const closestDistance = Math.abs(closest.value - value);
      return currentDistance < closestDistance ? mark : closest;
    }, { value: -Infinity, distance: Infinity });
    
    // If we're within 2 turns of a milestone, snap to it
    if (Math.abs(closestMark.value - value) <= 2) {
      return closestMark.value;
    }
    
    return value;
  };
  
  // Handle slider change commit
  const handleSliderChangeCommitted = (event, newValue) => {
    // Check if we should snap to a milestone
    const snappedValue = shouldSnapToMilestone(newValue);
    if (snappedValue !== newValue) {
      setSliderValue(snappedValue);
      onTurnSliderChange(snappedValue);
    } else {
      onTurnSliderChange(newValue);
    }
  };
  
  // User profile menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
    handleMenuClose();
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
        padding: 1,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <TerminalIcon sx={{ color: '#00FF00', mr: 1, cursor: 'pointer' }} />
          </Link>
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
        
        {/* Turn slider */}
        <Box sx={{ flex: 1, mx: 2, display: 'flex', alignItems: 'center' }}>
          <Slider
            value={sliderValue}
            min={0}
            max={totalTurns > 0 ? totalTurns - 1 : 0}
            step={1}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            disabled={isTyping || waitingForInput}
            marks={milestoneMarks.map(mark => ({
              value: mark.value,
              // Empty label to avoid showing text under marks
              label: ""
            }))}
            sx={{
              color: '#00FF00',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: '#00FF00',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(0, 255, 0, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(0, 255, 0, 0.3)',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#00FF00',
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#FFFF00',
                height: 12,
                width: 4,
                marginTop: -5,
                borderRadius: '1px',
                zIndex: 1,
                '&:hover': {
                  height: 16,
                  width: 5,
                  marginTop: -7,
                  boxShadow: '0 0 5px #FFFF00',
                }
              },
              '& .MuiSlider-markLabel': {
                display: 'none', // Hide labels
              }
            }}
          />
          
          {/* Milestone tooltips */}
          {milestoneMarks.map((mark, index) => (
            <Tooltip
              key={`tooltip-${index}`}
              title={`Milestone: ${mark.label}`}
              placement="top"
              arrow
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `calc(${mark.value / Math.max(totalTurns - 1, 1) * 100}% + 2px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 10,
                  height: 20,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  zIndex: 2
                }}
                onClick={() => {
                  setSliderValue(mark.value);
                  onTurnSliderChange(mark.value);
                }}
              />
            </Tooltip>
          ))}
          
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 1, 
              color: '#00FF00', 
              fontFamily: 'var(--font-geist-mono), monospace',
              minWidth: '60px',
              textAlign: 'center',
            }}
          >
            {`${sliderValue + 1}/${totalTurns}`}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Control buttons */}
          {!isRunning ? (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<PlayArrowIcon />}
              onClick={(e) => {
                e.preventDefault();
                onStart();
              }}
              sx={{ 
                mr: 1, 
                backgroundColor: '#007700', 
                '&:hover': { backgroundColor: '#00AA00' },
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: '60px',
              }}
            >
              Start
            </Button>
          ) : (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<PauseIcon />}
              onClick={(e) => {
                e.preventDefault();
                onPause();
              }}
              sx={{ 
                mr: 1, 
                backgroundColor: '#770000', 
                '&:hover': { backgroundColor: '#AA0000' },
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: '60px',
              }}
            >
              Pause
            </Button>
          )}
          
          {/* Next button - always visible */}
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<SkipNextIcon />}
            onClick={(e) => {
              e.preventDefault();
              onNextTurn();
            }}
            disabled={isTyping || waitingForInput}
            sx={{ 
              mr: 1, 
              backgroundColor: '#007777', 
              '&:hover': { backgroundColor: '#00AAAA' },
              fontSize: '0.7rem',
              py: 0.5,
              minWidth: '60px',
            }}
          >
            Next
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<RefreshIcon />}
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            sx={{ 
              mr: 1,
              backgroundColor: '#000077', 
              '&:hover': { backgroundColor: '#0000AA' },
              fontSize: '0.7rem',
              py: 0.5,
              minWidth: '60px',
            }}
          >
            Reset
          </Button>
          
          {/* User Avatar - always show avatar, with or without session */}
          <Avatar
            alt={session?.user?.name || "User"}
            src={session?.user?.image}
            onClick={session ? handleMenuOpen : undefined}
            sx={{ 
              cursor: session ? 'pointer' : 'default',
              width: 36,
              height: 36,
              border: '1px solid #00FF00',
              backgroundColor: 'black',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 0 5px #00FF00',
              '&:hover': session ? {
                boxShadow: '0 0 10px #00FF00, 0 0 15px #00FF00',
              } : {}
            }}
          >
            <CodeIcon sx={{ color: '#00FF00' }} />
          </Avatar>
        </Box>
      </Box>
      
      {/* Menu - only render if we have a session */}
      {session && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          disableScrollLock
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 200,
                backgroundColor: 'black',
                border: '1px solid #00FF00',
                boxShadow: '0 0 10px #00FF00',
              }
            }
          }}
        >
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 255, 0, 0.3)' }}>
            <Typography variant="subtitle2" color="#00CC00" sx={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
              USER:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>
              {session.user.name}
            </Typography>
            <Typography 
              variant="caption" 
              color="#00CC00"
              sx={{ 
                display: 'block',
                fontSize: '0.7rem',
                lineHeight: 1.2,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-geist-mono), monospace'
              }}
            >
              {session.user.email}
            </Typography>
          </Box>
          
          <MenuItem 
            component={Link} 
            href="/profile"
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: '#00FF00' }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>PROFILE</Typography>
          </MenuItem>
          
          <MenuItem 
            onClick={handleSignOutClick}
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" sx={{ color: '#00FF00' }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ color: '#00FF00', fontFamily: 'var(--font-geist-mono), monospace' }}>LOGOUT</Typography>
          </MenuItem>
        </Menu>
      )}
      
      {/* SignOutDialog */}
      <SignOutDialog 
        open={signOutDialogOpen} 
        onClose={() => setSignOutDialogOpen(false)} 
      />
    </Box>
  );
};

export default TopSection; 