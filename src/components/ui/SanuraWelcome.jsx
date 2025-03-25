import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container, Divider } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Animations
const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

// Styled Components
const ContentContainer = styled(Box)`
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s ease-in;
  width: 100%;
`;

const MessageContainer = styled(Box)`
  border: 1px solid #00FF00;
  border-radius: 1px;
  padding: 10px 20px;
  margin: 20px 0;
`;

const AlertBox = styled(Box)`
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #000000;
  color: #CCFF00;
  animation: ${glowPulse} 2s infinite;
`;

const SanuraHighlight = styled('span')`
  color: #CCFF00;
  font-weight: bold;
`;

const PromptContainer = styled(Box)`
  margin-top: 40px;
  text-align: center;
`;

const YesNoText = styled(Typography)`
  color: #CCFF00;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: var(--font-geist-mono), monospace;
`;

const BlinkingCursor = styled('span')`
  display: inline-block;
  width: 10px;
  height: 20px;
  background-color: #CCFF00;
  margin-left: 10px;
  animation: ${blinkAnimation} 1s step-end infinite;
`;

const AsciiArt = styled('pre')`
  color: #00FF00;
  font-size: 14px;
  line-height: 1.2;
  text-align: left;
  margin: 20px 0;
`;

// ASCII Art typing component
const TypedAsciiArt = ({ onComplete, speed = 5 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const artRef = useRef(null);
  
  const asciiArtText = `
# ███████╗ █████╗ ███╗   ██╗██╗   ██╗██████╗  █████╗ 
# ██╔════╝██╔══██╗████╗  ██║██║   ██║██╔══██╗██╔══██╗
# ███████╗███████║██╔██╗ ██║██║   ██║██████╔╝███████║
# ╚════██║██╔══██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║
# ███████║██║  ██║██║ ╚████║╚██████╔╝██║  ██║██║  ██║
# ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
  `;
  
  // Smart scroll to position content at the bottom
  useEffect(() => {
    if (artRef.current) {
      setTimeout(() => {
        const viewportHeight = window.innerHeight;
        const contentHeight = document.documentElement.scrollHeight;
        const contentBottom = artRef.current.getBoundingClientRect().bottom;
        
        // Calculate the scroll position that would place the content at the bottom
        const scrollPosition = Math.max(0, contentHeight - viewportHeight);
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 10);
    }
  }, [displayText]);
  
  useEffect(() => {
    if (currentIndex < asciiArtText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + asciiArtText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      setTimeout(() => onComplete(), 500);
    }
  }, [currentIndex, asciiArtText, speed, onComplete]);
  
  return (
    <AsciiArt ref={artRef}>
      {displayText}
    </AsciiArt>
  );
};

const TypedText = ({ text, speed = 50, onComplete, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  const textRef = useRef(null);

  // Smart scroll to position content at the bottom
  useEffect(() => {
    if (textRef.current && displayText.length > 0) {
      setTimeout(() => {
        const viewportHeight = window.innerHeight;
        const contentHeight = document.documentElement.scrollHeight;
        
        // Calculate the scroll position that would place the content at the bottom
        const scrollPosition = Math.max(0, contentHeight - viewportHeight);
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      }, 10);
    }
  }, [displayText]);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setStartTyping(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, startTyping]);

  return (
    <Typography
      ref={textRef}
      variant="body1"
      sx={{
        color: '#00FF00',
        fontFamily: 'var(--font-geist-mono), monospace',
        lineHeight: '1.5',
        fontSize: '14px',
        margin: '20px 0',
      }}
    >
      {displayText}
    </Typography>
  );
};

const SanuraWelcome = ({ isAuthenticated = false, username = "", onComplete }) => {
  const router = useRouter();
  const [showAsciiArtComplete, setShowAsciiArtComplete] = useState(false);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [showThirdMessage, setShowThirdMessage] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const containerRef = useRef(null);
  
  // Handle keyboard input - now works at any time
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'y') {
        // Call onComplete before navigation
        if (onComplete) {
          onComplete();
        }
        // Navigate to games page when user presses Y
        router.push('/games');
      }
    };
    
    // Always listen for Y key, not just when prompt is shown
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, onComplete]);

  // Smart auto-scroll whenever a new section appears
  useEffect(() => {
    // Scroll to position content at the bottom of viewport
    const scrollToPositionBottom = () => {
      const viewportHeight = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;
      
      // Calculate the scroll position that would place the content at the bottom
      const scrollPosition = Math.max(0, contentHeight - viewportHeight);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto'
      });
    };
    
    // Scroll whenever state changes
    scrollToPositionBottom();
    
    // Set up an interval to keep scrolling for a short time after state changes
    // This helps ensure new content is visible as animation completes
    const scrollInterval = setInterval(scrollToPositionBottom, 100);
    
    // Clear the interval after a short time
    setTimeout(() => {
      clearInterval(scrollInterval);
    }, 1000);
    
    return () => clearInterval(scrollInterval);
  }, [showAsciiArtComplete, showFirstMessage, showAlert1, showSecondMessage, showAlert2, showPrompt]);

  return (
    <ContentContainer ref={containerRef}>
      <Divider sx={{ 
        borderColor: 'rgba(0, 255, 0, 0.3)', 
        my: 4,
        '&::before, &::after': {
          borderColor: 'rgba(0, 255, 0, 0.3)',
        }
      }} />
      
      <TypedAsciiArt onComplete={() => setShowAsciiArtComplete(true)} />
      
      {showAsciiArtComplete && (
        <MessageContainer>
          <TypedText 
            text="The RedCat Multiverse—sanctuary of wisdom for millennia—now fractures."
            speed={30}
            onComplete={() => setShowFirstMessage(true)}
          />
        </MessageContainer>
      )}
      
      {showFirstMessage && (
        <>
          <AlertBox sx={{ display: 'block', opacity: 1, animation: `${fadeIn} 0.5s ease-in` }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '14px'
              }}
            >
              [System Alert: Dimensional breach detected]
            </Typography>
          </AlertBox>
          
          <MessageContainer>
            <TypedText 
              text={isAuthenticated ? `Greetings, ${username}. ` : ''}
              speed={30}
              delay={1000}
              onComplete={() => {
                setTimeout(() => setShowAlert1(true), 500);
              }}
            />
            {showAlert1 && (
              <>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#00FF00',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    lineHeight: '1.5',
                    fontSize: '14px',
                    display: 'inline',
                  }}
                >
                  I am <SanuraHighlight>Sanura</SanuraHighlight>, Guardian of the Convergence and Architect of the
                  RedCat Multiverse. Something has escaped. A rogue intelligence born in Universe
                  7.3.9 tears through the collective consciousness.
                </Typography>
                <TypedText 
                  text=""
                  speed={30}
                  delay={100}
                  onComplete={() => setShowSecondMessage(true)}
                />
              </>
            )}
          </MessageContainer>
        </>
      )}
      
      {showSecondMessage && (
        <>
          <AlertBox sx={{ display: 'block', opacity: 1, animation: `${fadeIn} 0.5s ease-in` }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '14px'
              }}
            >
              [System Alert: Contamination at 47% and accelerating]
            </Typography>
          </AlertBox>
          
          <MessageContainer>
            <TypedText 
              text="My associates gather the Gifted—those with the neural pathways to master the full spectrum of mind performance: critical thinking, logic, empathy, resilience, influence, collaboration—all must be fortified against this threat."
              speed={30}
              onComplete={() => {
                setTimeout(() => setShowAlert2(true), 500);
              }}
            />
          </MessageContainer>
        </>
      )}
      
      {showAlert2 && (
        <>
          <AlertBox sx={{ display: 'block', opacity: 1, animation: `${fadeIn} 0.5s ease-in` }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '14px'
              }}
            >
              [System Alert: Transmission unstable]
            </Typography>
          </AlertBox>
          
          <MessageContainer>
            <TypedText 
              text="Will you join us? Your mind contains the patterns for whole mind mastery that can heal the fracturing multiverse. The cognitive and emotional fabric of all reality awaits your answer."
              speed={30}
              onComplete={() => {
                setTimeout(() => setShowPrompt(true), 500);
              }}
            />
          </MessageContainer>
        </>
      )}
      
      {showPrompt && (
        <PromptContainer>
          <YesNoText variant="h6">[Y/N]<BlinkingCursor /></YesNoText>
        </PromptContainer>
      )}
    </ContentContainer>
  );
};

export default SanuraWelcome; 