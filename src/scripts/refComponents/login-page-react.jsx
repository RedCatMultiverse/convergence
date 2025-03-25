import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', monospace;
    background: black;
    color: #00FF00;
    overflow: hidden;
  }
`;

// Animations
const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

// Matrix digital rain effect
const MatrixRain = ({ children }) => {
  const [raindrops, setRaindrops] = useState([]);
  
  useEffect(() => {
    // Generate randomized matrix rain characters
    const generateRain = () => {
      const drops = [];
      const characters = [
        ...Array.from({ length: 50 }, (_, i) => 
          `${Math.random().toString(2).substring(2, 12)}${i % 3 === 0 ? 'サヌラ' : ''}${i % 5 === 0 ? 'レッドキャット' : ''}${i % 7 === 0 ? 'マルチバース' : ''}${i % 11 === 0 ? 'ギフテッド' : ''}`
        ),
        ...Array.from({ length: 20 }, (_, i) => 
          `${i % 2 === 0 ? '共感' : ''}${i % 3 === 0 ? '協力' : ''}${i % 4 === 0 ? '回復力' : ''}${i % 5 === 0 ? '論理的思考' : ''}${i % 6 === 0 ? '影響力' : ''}${i % 7 === 0 ? '全精神' : ''}`
        ),
        ...Array.from({ length: 20 }, (_, i) => 
          `${i % 2 === 0 ? '認知的' : ''}${i % 3 === 0 ? '感情的' : ''}${i % 4 === 0 ? '対人関係' : ''}${i % 5 === 0 ? '批判的思考' : ''}${i % 6 === 0 ? '解釈' : ''}${i % 7 === 0 ? '推論' : ''}${i % 8 === 0 ? '検証' : ''}`
        ),
        ...Array.from({ length: 20 }, (_, i) => 
          `${i % 2 === 0 ? '収束' : ''}${i % 3 === 0 ? '守護者' : ''}${i % 4 === 0 ? '建築家' : ''}${i % 5 === 0 ? '多元宇宙' : ''}${i % 6 === 0 ? '危機' : ''}`
        ),
      ];
      
      // Position characters randomly across the screen
      for (let i = 0; i < 100; i++) {
        drops.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          text: characters[Math.floor(Math.random() * characters.length)],
        });
      }
      
      setRaindrops(drops);
    };
    
    generateRain();
    
    // Regenerate rain every 30 seconds to keep the animation fresh
    const interval = setInterval(generateRain, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <RainContainer>
      {raindrops.map(drop => (
        <RainDrop key={drop.id} style={{ left: drop.x, top: drop.y }}>
          {drop.text}
        </RainDrop>
      ))}
      {children}
    </RainContainer>
  );
};

// Styled Components
const RainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const RainDrop = styled.div`
  position: absolute;
  color: #00FF00;
  font-size: 12px;
  opacity: 0.2;
  user-select: none;
  pointer-events: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
`;

const Logo = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 20px;
`;

const LogoCircle = styled.div`
  width: 160px;
  height: 160px;
  background-color: #E6E6E6;
  border-radius: 50%;
  position: absolute;
`;

const Title = styled.h1`
  font-size: 40px;
  color: #00FF00;
  margin: 10px 0 5px;
  font-weight: bold;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 20px;
  color: #CCFF00;
  margin: 0 0 40px;
  font-weight: normal;
  text-align: center;
`;

const LoginBox = styled.div`
  background-color: #111111;
  border: 2px solid #00FF00;
  border-radius: 5px;
  width: 400px;
  padding: 20px;
  position: relative;
`;

const Alert = styled.div`
  background-color: #000000;
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 20px;
  color: #CCFF00;
  font-size: 14px;
`;

const FormLabel = styled.label`
  display: block;
  color: #33FF33;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const FormInput = styled.input`
  width: 100%;
  height: 40px;
  background-color: #222222;
  border: 1px solid #33FF33;
  color: #00FF00;
  font-family: 'Courier New', monospace;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #00FF00;
  }
`;

const LoginButton = styled.button`
  background-color: #00AA00;
  border: 2px solid #00FF00;
  color: #000000;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  width: 140px;
  height: 40px;
  border-radius: 5px;
  margin: 20px auto 0;
  display: block;
  cursor: pointer;
  animation: ${pulseAnimation} 2s infinite;
  
  &:hover {
    background-color: #00CC00;
  }
  
  &:focus {
    outline: none;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  color: #33FF33;
  font-size: 12px;
  line-height: 1.5;
`;

const Cursor = styled.span`
  display: inline-block;
  background-color: #00FF00;
  width: 8px;
  height: 16px;
  animation: ${blinkAnimation} 1s step-end infinite;
`;

// SVG Components
const LogoSVG = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    {/* Circle background already handled by LogoCircle styled component */}
    
    {/* Red bear shape */}
    <path d="M60,60 C30,70 20,110 40,130 C50,140 70,140 80,130 C90,140 110,140 120,130 C140,110 130,70 100,60 C90,40 70,40 60,60 Z" 
      fill="#FF3333" />
    
    {/* White triangle - bear ear */}
    <path d="M110,55 L120,65 L100,65 Z" fill="#FFFFFF" />
    
    {/* Plus signs */}
    <line x1="40" y1="40" x2="40" y2="60" stroke="#777777" strokeWidth="2" />
    <line x1="30" y1="50" x2="50" y2="50" stroke="#777777" strokeWidth="2" />
    
    <line x1="120" y1="120" x2="120" y2="140" stroke="#777777" strokeWidth="2" />
    <line x1="110" y1="130" x2="130" y2="130" stroke="#777777" strokeWidth="2" />
  </svg>
);

// Main Login Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [securityPhrase, setSecurityPhrase] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, securityPhrase });
    // Navigate to next screen after successful login
  };
  
  return (
    <>
      <GlobalStyle />
      <Container>
        <MatrixRain />
        <MainContent>
          <Logo>
            <LogoCircle />
            <LogoSVG />
          </Logo>
          
          <Title>RCM Labs</Title>
          <Subtitle>Strategic Talent Intelligence Platform</Subtitle>
          
          <LoginBox>
            <Alert>[EXECUTIVE PREVIEW ACCESS]</Alert>
            
            <form onSubmit={handleSubmit}>
              <FormLabel htmlFor="email">EMAIL ADDRESS:</FormLabel>
              <FormInput 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setShowCursor(false)}
                onBlur={() => setShowCursor(true)}
                required
              />
              
              <FormLabel htmlFor="securityPhrase">SECURITY PHRASE:</FormLabel>
              <FormInput 
                id="securityPhrase"
                type="password" 
                value={securityPhrase} 
                onChange={(e) => setSecurityPhrase(e.target.value)}
                onFocus={() => setShowCursor(false)}
                onBlur={() => setShowCursor(true)}
                required
              />
              
              <LoginButton type="submit">ENTER</LoginButton>
            </form>
            
            {showCursor && email.length === 0 && <Cursor style={{ position: 'absolute', top: '125px', left: '20px' }} />}
          </LoginBox>
          
          <Footer>
            <div>RCM LABS | STRATEGIC TALENT INTELLIGENCE</div>
            <div>EXECUTIVE DEMONSTRATION | VERSION 2.0.0</div>
          </Footer>
        </MainContent>
      </Container>
    </>
  );
};

export default LoginPage;

