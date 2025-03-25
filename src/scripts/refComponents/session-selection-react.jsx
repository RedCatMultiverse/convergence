import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
const Container = styled.div`
  background-color: #000000;
  color: #00FF00;
  min-height: 100vh;
  font-family: monospace;
  padding: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatrixRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.2;
`;

const RainCharacter = styled.div`
  position: absolute;
  color: #00FF00;
  font-size: 12px;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 1s ease-in;
`;

const Header = styled.h1`
  color: #33FF33;
  font-size: 30px;
  text-align: center;
  margin-bottom: 10px;
`;

const SubHeader = styled.div`
  color: #CCFF00;
  font-size: 16px;
  text-align: center;
  margin-bottom: 30px;
`;

const AlertBox = styled.div`
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #000000;
  color: #CCFF00;
  width: 600px;
  align-self: center;
`;

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
`;

const ModuleBox = styled.div`
  position: relative;
  border: ${props => props.isActive ? '2px solid #33FF33' : '1px solid #333333'};
  border-radius: 5px;
  background-color: #111111;
  padding: 20px;
  cursor: ${props => props.isActive ? 'pointer' : 'default'};
  opacity: ${props => props.isActive ? '1' : '0.5'};
  
  &:hover {
    background-color: ${props => props.isActive ? '#222222' : '#111111'};
  }
`;

const UnlockedModule = styled(ModuleBox)`
  border: 3px solid #00FF00;
  animation: ${glowPulse} 2s infinite;
  opacity: 1;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${props => props.unlocked ? '#00AA00' : '#333333'};
  color: ${props => props.unlocked ? '#000000' : '#777777'};
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
`;

const LockIcon = styled.div`
  display: ${props => props.isVisible ? 'inline-block' : 'none'};
  margin-right: 5px;
  font-size: 12px;
`;

const ModuleTitle = styled.h2`
  color: ${props => props.isActive ? '#CCFF00' : '#777777'};
  font-size: 18px;
  font-weight: bold;
  margin-top: 0;
  margin-left: 150px;
  margin-bottom: 10px;
`;

const ModuleDescription = styled.p`
  color: ${props => props.isActive ? '#00FF00' : '#555555'};
  font-size: 14px;
  margin-left: 150px;
  margin-bottom: 0;
`;

const EnterButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #00AA00;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 5px 20px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  &:hover {
    background-color: #00CC00;
  }
`;

const Cursor = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #CCFF00;
  font-size: 24px;
  animation: ${blinkAnimation} 1s step-end infinite;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const FooterBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #33FF33;
`;

const StatusInfo = styled.div`
  color: #00FF00;
  font-size: 14px;
`;

const InstructionInfo = styled.div`
  color: #00FF00;
  font-size: 14px;
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

const SessionSelectionScreen = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState('critical-thinking');
  const [rainCharacters, setRainCharacters] = useState([]);
  
  // Generate Matrix rain effect
  useEffect(() => {
    const characters = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Mix of binary and Japanese characters
      const charPool = [
        '0101サヌラ011010010',
        '10101レッドキャット010',
        '010マルチバース01010',
        '01010ギフテッド01010',
        '0101共感01010110',
        '1010協力0101010100',
        '01回復力10101',
        '01論理的思考01010',
        '10影響力010101',
        '01010認知的01010',
        '1010感情的0101',
        '01対人関係01',
        '0101批判的思考010',
        '10解釈101010',
        '01010推論010',
        '10101検証01',
        '0101収束0101',
        '1010守護者101',
        '01建築家01',
        '0101多元宇宙0',
        '10危機10'
      ];
      
      const char = charPool[Math.floor(Math.random() * charPool.length)];
      
      characters.push({
        id: i,
        x,
        y,
        text: char
      });
    }
    
    setRainCharacters(characters);
  }, []);

  const handleModuleClick = (moduleId) => {
    if (moduleId === 'critical-thinking') {
      setSelectedModule(moduleId);
    }
  };

  const handleEnter = () => {
    if (selectedModule === 'critical-thinking') {
      navigate('/game-interface');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && selectedModule === 'critical-thinking') {
      handleEnter();
    } else if (e.key === 'Escape') {
      navigate('/sanura-intro');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModule]);

  return (
    <Container>
      <MatrixRain>
        {rainCharacters.map(char => (
          <RainCharacter 
            key={char.id} 
            style={{ 
              left: `${char.x}px`, 
              top: `${char.y}px` 
            }}
          >
            {char.text}
          </RainCharacter>
        ))}
      </MatrixRain>
      
      <ContentContainer>
        <Header>RCM Labs</Header>
        <SubHeader>Strategic Talent Intelligence Platform</SubHeader>
        
        <AlertBox>
          [DIMENSIONAL FLUX: Choose your cognitive development pathway]
        </AlertBox>
        
        <ModuleContainer>
          {sessionModules.map(module => {
            if (module.status === 'unlocked') {
              return (
                <UnlockedModule 
                  key={module.id}
                  isActive={true}
                  onClick={() => handleModuleClick(module.id)}
                >
                  <Cursor isVisible={selectedModule === module.id}>{'>'}</Cursor>
                  <StatusBadge unlocked={true}>DIMENSIONAL RIFT</StatusBadge>
                  <ModuleTitle isActive={true}>{module.title}</ModuleTitle>
                  <ModuleDescription isActive={true}>{module.description}</ModuleDescription>
                  <EnterButton 
                    isVisible={selectedModule === module.id}
                    onClick={handleEnter}
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
      </ContentContainer>
      
      <FooterBar>
        <StatusInfo>PLAYER STATUS: GIFTED | XP: 1450 | BADGES: 3/12</StatusInfo>
        <InstructionInfo>PRESS ENTER TO BEGIN | ESC TO RETURN TO SANURA</InstructionInfo>
      </FooterBar>
    </Container>
  );
};

export default SessionSelectionScreen;

