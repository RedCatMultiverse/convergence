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
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 1s ease-in;
`;

const Header = styled.div`
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: #000000;
`;

const HeaderText = styled.div`
  color: #CCFF00;
  font-size: 18px;
`;

const AsciiArt = styled.pre`
  color: #00FF00;
  font-size: 14px;
  line-height: 1.2;
  text-align: left;
  margin: 20px 0;
`;

const MessageContainer = styled.div`
  border: 1px solid #00FF00;
  border-radius: 1px;
  padding: 10px 20px;
  margin: 20px 0;
`;

const AlertBox = styled.div`
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #000000;
  color: #CCFF00;
  animation: ${glowPulse} 2s infinite;
`;

const MessageParagraph = styled.p`
  margin: 20px 0;
  line-height: 1.5;
  font-size: 14px;
`;

const SanuraHighlight = styled.span`
  color: #CCFF00;
  font-weight: bold;
`;

const PromptContainer = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const YesNoText = styled.div`
  color: #CCFF00;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const BlinkingCursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 20px;
  background-color: #CCFF00;
  margin-left: 10px;
  animation: ${blinkAnimation} 1s step-end infinite;
`;

const SanuraIntroduction = () => {
  const navigate = useNavigate();
  const [rainCharacters, setRainCharacters] = useState([]);
  const [showNextScreen, setShowNextScreen] = useState(false);
  
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

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'y') {
        setShowNextScreen(true);
        setTimeout(() => {
          navigate('/session-selection');
        }, 1000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

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
      
      <ContentContainer style={{ opacity: showNextScreen ? 0 : 1, transition: 'opacity 0.5s' }}>
        <Header>
          <HeaderText># TRANSMISSION INCOMING...</HeaderText>
          <HeaderText># SOURCE: NEXUS POINT 7.3.9</HeaderText>
          <HeaderText># CLEARANCE: ALPHA-OMEGA</HeaderText>
          <HeaderText>#</HeaderText>
        </Header>
        
        <AsciiArt>{`
# ███████╗ █████╗ ███╗   ██╗██╗   ██╗██████╗  █████╗ 
# ██╔════╝██╔══██╗████╗  ██║██║   ██║██╔══██╗██╔══██╗
# ███████╗███████║██╔██╗ ██║██║   ██║██████╔╝███████║
# ╚════██║██╔══██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║
# ███████║██║  ██║██║ ╚████║╚██████╔╝██║  ██║██║  ██║
# ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
        `}</AsciiArt>
        
        <Header>
          <HeaderText># CONNECTION ESTABLISHED...</HeaderText>
        </Header>
        
        <MessageContainer>
          <MessageParagraph>
            The RedCat Multiverse—sanctuary of wisdom for millennia—now fractures.
          </MessageParagraph>
        </MessageContainer>
        
        <AlertBox>
          [System Alert: Dimensional breach detected]
        </AlertBox>
        
        <MessageContainer>
          <MessageParagraph>
            I am <SanuraHighlight>Sanura</SanuraHighlight>, Guardian of the Convergence and Architect of the
            RedCat Multiverse. Something has escaped. A rogue intelligence born in Universe
            7.3.9 tears through the collective consciousness, attacking both cognitive
            frameworks and interpersonal bonds.
          </MessageParagraph>
          
          <MessageParagraph>
            Your world isn't immune. The fragmentation of reason and connection you've
            witnessed isn't coincidence.
          </MessageParagraph>
        </MessageContainer>
        
        <AlertBox>
          [System Alert: Contamination at 47% and accelerating]
        </AlertBox>
        
        <MessageContainer>
          <MessageParagraph>
            My associates gather the Gifted—those with the neural pathways to master
            the full spectrum of mind performance: critical thinking merely the first
            pillar in the architecture of complete consciousness.
          </MessageParagraph>
          
          <MessageParagraph>
            Logic, empathy, resilience, influence, collaboration—all must be fortified
            against this threat.
          </MessageParagraph>
        </MessageContainer>
        
        <AlertBox>
          [System Alert: Transmission unstable]
        </AlertBox>
        
        <MessageContainer>
          <MessageParagraph>
            Will you join us? Your mind contains the patterns for whole mind mastery
            that can heal the fracturing multiverse.
          </MessageParagraph>
          
          <MessageParagraph>
            The cognitive and emotional fabric of all reality awaits your answer.
          </MessageParagraph>
        </MessageContainer>
        
        <PromptContainer>
          <YesNoText>[Y/N]<BlinkingCursor /></YesNoText>
        </PromptContainer>
      </ContentContainer>
    </Container>
  );
};

export default SanuraIntroduction;

