'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
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
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 1s ease-in;
  margin: 0 auto;
`;

const Header = styled(Typography)`
  color: #33FF33;
  font-size: 30px;
  text-align: center;
  margin-bottom: 10px;
  font-family: var(--font-geist-mono), monospace;
`;

const SubHeader = styled(Typography)`
  color: #CCFF00;
  font-size: 16px;
  text-align: center;
  margin-bottom: 30px;
  font-family: var(--font-geist-mono), monospace;
`;

const AlertBox = styled(Box)`
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #000000;
  color: #CCFF00;
  width: 600px;
  align-self: center;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in forwards;
`;

const ModuleContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
`;

const ModuleBox = styled(Box)`
  position: relative;
  border: ${props => props.isActive ? '2px solid #33FF33' : '1px solid #333333'};
  border-radius: 5px;
  background-color: #111111;
  padding: 20px;
  cursor: ${props => props.isActive ? 'pointer' : 'default'};
  opacity: ${props => props.isActive ? '1' : '0.5'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? '#222222' : '#111111'};
  }
`;

const UnlockedModule = styled(ModuleBox)`
  border: 3px solid #00FF00;
  animation: ${glowPulse} 2s infinite;
  opacity: 1;
`;

const StatusBadge = styled(Box)`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${props => props.unlocked ? '#00AA00' : '#333333'};
  color: ${props => props.unlocked ? '#000000' : '#777777'};
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-family: var(--font-geist-mono), monospace;
`;

const LockIcon = styled(Box)`
  display: ${props => props.isVisible ? 'inline-block' : 'none'};
  margin-right: 5px;
  font-size: 12px;
`;

const ModuleTitle = styled(Typography)`
  color: ${props => props.isActive ? '#CCFF00' : '#777777'};
  font-size: 18px;
  font-weight: bold;
  margin-top: 0;
  margin-left: 150px;
  margin-bottom: 10px;
  font-family: var(--font-geist-mono), monospace;
`;

const ModuleDescription = styled(Typography)`
  color: ${props => props.isActive ? '#00FF00' : '#555555'};
  font-size: 14px;
  margin-left: 150px;
  margin-bottom: 0;
  font-family: var(--font-geist-mono), monospace;
`;

const EnterButton = styled('button')`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #00AA00;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 5px 20px;
  font-family: var(--font-geist-mono), monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  &:hover {
    background-color: #00CC00;
  }
`;

const Cursor = styled(Box)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #CCFF00;
  font-size: 24px;
  animation: ${blinkAnimation} 1s step-end infinite;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const FooterBar = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #33FF33;
  z-index: 2;
`;

const StatusInfo = styled(Typography)`
  color: #00FF00;
  font-size: 14px;
  font-family: var(--font-geist-mono), monospace;
`;

const InstructionInfo = styled(Typography)`
  color: #00FF00;
  font-size: 14px;
  font-family: var(--font-geist-mono), monospace;
`;

// Session data
const sessionModules = [
  {
    id: 'critical-thinking',
    title: 'R.C. vs Caliban: Multiverse Critical Thinking Odyssey',
    description: 'Core framework introducing critical thinking skills across the five dimensions',
    status: 'unlocked'
  },
  {
    id: 'ethical-judgment',
    title: 'The Convergence Council: Ethical Judgment Trials',
    description: 'Ethical decision-making within the multiverse tribunal framework',
    status: 'locked'
  },
  {
    id: 'risk-assessment',
    title: 'Oracle vs Entropy: Predictive Risk Assessment',
    description: 'Risk assessment as a battle between order and chaos in financial systems',
    status: 'locked'
  },
  {
    id: 'collaboration',
    title: 'Nexus Protocol: Collaborative Intelligence Forge',
    description: 'Team collaboration skills essential in financial institutions',
    status: 'locked'
  },
  {
    id: 'information-analysis',
    title: 'Tag vs Maroc: Information Distortion Analysis',
    description: 'Distinguishing genuine information from noise/misinformation',
    status: 'locked'
  },
  {
    id: 'client-relations',
    title: 'Quantum Diplomat: Client Relations Mastery',
    description: 'Client-facing communication skills essential in financial services',
    status: 'locked'
  }
];

const TypedText = ({ text, speed = 30, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <Typography
      ref={textRef}
      variant="body1"
      sx={{
        color: '#00FF00',
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: '14px',
      }}
    >
      {displayText}
    </Typography>
  );
};

const SessionSelection = () => {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState('critical-thinking');
  const [showHeader, setShowHeader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // Handle module click or any interaction
  const handleAnyInteraction = () => {
    router.push('/games/demo');
  };

  // Sequence the animations
  useEffect(() => {
    const headerTimeout = setTimeout(() => setShowHeader(true), 500);
    const alertTimeout = setTimeout(() => setShowAlert(true), 1500);
    const modulesTimeout = setTimeout(() => setShowModules(true), 2500);
    const footerTimeout = setTimeout(() => setShowFooter(true), 3500);

    return () => {
      clearTimeout(headerTimeout);
      clearTimeout(alertTimeout);
      clearTimeout(modulesTimeout);
      clearTimeout(footerTimeout);
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'y' || e.key === 'Y') {
        handleAnyInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ContentContainer>
      {showHeader && (
        <>
          <Header variant="h1">RCM Labs</Header>
          <SubHeader variant="h2">Strategic Talent Intelligence Platform</SubHeader>
        </>
      )}
      
      {showAlert && (
        <AlertBox>
          <TypedText 
            text="[DIMENSIONAL FLUX: Choose your cognitive development pathway]"
            onComplete={() => {}}
          />
        </AlertBox>
      )}
      
      {showModules && (
        <ModuleContainer>
          {sessionModules.map(module => {
            if (module.status === 'unlocked') {
              return (
                <UnlockedModule 
                  key={module.id}
                  isActive={true}
                  onClick={handleAnyInteraction}
                >
                  <Cursor isVisible={selectedModule === module.id}>{'>'}</Cursor>
                  <StatusBadge unlocked={true}>DIMENSIONAL RIFT</StatusBadge>
                  <ModuleTitle isActive={true}>{module.title}</ModuleTitle>
                  <ModuleDescription isActive={true}>{module.description}</ModuleDescription>
                  <EnterButton 
                    isVisible={selectedModule === module.id}
                    onClick={handleAnyInteraction}
                  >
                    TRAVERSE RIFT
                  </EnterButton>
                </UnlockedModule>
              );
            } else {
              return (
                <ModuleBox 
                  key={module.id}
                  isActive={false}
                >
                  <StatusBadge unlocked={false}>
                    <LockIcon isVisible={true}>○</LockIcon>
                    SEALED NEXUS
                  </StatusBadge>
                  <ModuleTitle isActive={false}>{module.title}</ModuleTitle>
                  <ModuleDescription isActive={false}>{module.description}</ModuleDescription>
                </ModuleBox>
              );
            }
          })}
        </ModuleContainer>
      )}
      
      {showFooter && (
        <FooterBar>
          <StatusInfo>PLAYER STATUS: GIFTED | XP: 1450 | BADGES: 3/12</StatusInfo>
          <InstructionInfo>PRESS ENTER TO BEGIN | ANY KEY TO CONTINUE</InstructionInfo>
        </FooterBar>
      )}
    </ContentContainer>
  );
};

export default SessionSelection; 