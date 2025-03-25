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

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  background-color: #000000;
  color: #00FF00;
  min-height: 100vh;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MatrixRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.1;
  pointer-events: none;
`;

const RainCharacter = styled.div`
  position: absolute;
  color: #00FF00;
  font-size: 10px;
`;

// Top Panel
const TopPanel = styled.div`
  height: 80px;
  border-bottom: 2px solid #00FF00;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-in;
  background-color: #000000;
`;

const TopPanelBorder = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid #CCFF00;
  border-radius: 2px;
  pointer-events: none;
`;

const GameTitle = styled.h1`
  color: #CCFF00;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  padding: 0 10px;
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 40px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const StatLabel = styled.div`
  color: #CCFF00;
  font-size: 12px;
`;

const StatValue = styled.div`
  color: #CCFF00;
  font-size: 12px;
`;

const CycleCounter = styled.div`
  color: #FF3366;
  font-size: 12px;
`;

// Main Content Area
const ContentArea = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  z-index: 1;
`;

// Left Panel
const LeftPanel = styled.div`
  width: 300px;
  border-right: 2px solid #00FF00;
  padding: 20px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-in;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  color: #33FF33;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const ProgressPath = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const PathItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const PathNode = styled.div`
  width: ${props => props.isCurrent ? '14px' : '10px'};
  height: ${props => props.isCurrent ? '14px' : '10px'};
  border-radius: 50%;
  background-color: ${props => props.isCompleted ? '#555555' : (props.isCurrent ? '#00FF00' : '#222222')};
  border: ${props => props.isCurrent ? '3px solid #CCFF00' : (props.isCompleted ? '1px solid #00FF00' : '1px solid #33FF33')};
  margin-right: 20px;
`;

const PathConnector = styled.div`
  width: 2px;
  height: 20px;
  background-color: ${props => props.isActive ? '#00FF00' : '#33FF33'};
  margin-left: 5px;
  margin-top: -20px;
  margin-bottom: 0;
  ${props => props.isDashed && 'border-left: 2px dashed #33FF33;'}
`;

const PathLabel = styled.div`
  color: ${props => props.isCompleted ? '#555555' : (props.isCurrent ? '#CCFF00' : '#33FF33')};
  font-size: 14px;
  font-weight: ${props => props.isCurrent ? 'bold' : 'normal'};
`;

const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
`;

const MilestoneItem = styled.div`
  background-color: ${props => props.status === 'completed' ? '#222222' : '#111111'};
  border: ${props => {
    if (props.status === 'completed') return '1px solid #555555';
    if (props.status === 'active') return '2px solid #00FF00';
    if (props.status === 'next') return '2px solid #CCFF00';
    return '1px solid #33FF33';
  }};
  padding: 10px;
  border-radius: 0;
`;

const MilestoneLabel = styled.div`
  color: ${props => {
    if (props.status === 'completed') return '#555555';
    if (props.status === 'active') return '#00FF00';
    if (props.status === 'next') return '#CCFF00';
    return '#33FF33';
  }};
  font-size: 14px;
`;

const ObjectiveBox = styled.div`
  border: 1px solid #33FF33;
  padding: 15px;
  margin-top: 10px;
`;

const ObjectiveTitle = styled.div`
  color: #33FF33;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ObjectiveText = styled.div`
  color: #00FF00;
  font-size: 12px;
  line-height: 1.5;
`;

// Center Panel
const CenterPanel = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeIn} 0.7s ease-in;
  overflow-y: auto;
`;

const ChallengeHeader = styled.div`
  background-color: #222222;
  border: 1px solid #33FF33;
  padding: 15px;
`;

const ChallengeTitle = styled.h3`
  color: #33FF33;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const DialogueBox = styled.div`
  border: 1px solid ${props => props.isCaliban ? '#FF3366' : '#33FF33'};
  padding: 15px;
  margin-bottom: 10px;
`;

const SpeakerName = styled.div`
  color: ${props => props.isCaliban ? '#FF3366' : '#CCFF00'};
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const DialogueText = styled.div`
  color: ${props => props.isCaliban ? '#AAAAAA' : '#00FF00'};
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const ChallengeInputArea = styled.div`
  background-color: #111111;
  border: 1px solid #00FF00;
  padding: 15px;
  margin-top: 10px;
`;

const ChallengePrompt = styled.div`
  color: #00FF00;
  font-size: 14px;
  margin-bottom: 15px;
`;

const ResponseArea = styled.div`
  background-color: #111111;
  border: 1px solid #333333;
  padding: 10px;
  min-height: 140px;
`;

const ResponseText = styled.div`
  color: #00FF00;
  font-size: 14px;
  line-height: 1.5;
`;

const CursorBlink = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: #CCFF00;
  margin-left: 4px;
  animation: ${blinkAnimation} 1s step-end infinite;
`;

// Right Panel
const RightPanel = styled.div`
  width: 300px;
  border-left: 2px solid #00FF00;
  padding: 20px;
  animation: ${fadeIn} 0.8s ease-in;
  overflow-y: auto;
`;

const AlertBox = styled.div`
  background-color: #000000;
  border: 1px solid #CCFF00;
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 20px;
`;

const AlertText = styled.div`
  color: #CCFF00;
  font-size: 14px;
  text-align: center;
`;

const LeaderboardBox = styled.div`
  border: 1px solid #33FF33;
  padding: 15px;
  margin-bottom: 20px;
`;

const LeaderboardTitle = styled.div`
  color: #CCFF00;
  font-size: 14px;
  margin-bottom: 10px;
`;

const LeaderboardItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const LeaderboardName = styled.div`
  color: ${props => props.isUser ? '#CCFF00' : '#00FF00'};
  font-size: 12px;
`;

const LeaderboardScore = styled.div`
  color: ${props => props.isUser ? '#CCFF00' : '#00FF00'};
  font-size: 12px;
`;

const CognitiveMapBox = styled.div`
  border: 1px solid #33FF33;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
`;

const CognitiveMapTitle = styled.div`
  color: #CCFF00;
  font-size: 14px;
  margin-bottom: 15px;
`;

const CognitiveMap = styled.div`
  height: 200px;
  position: relative;
`;

const MapBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
`;

const SkillPillar = styled.div`
  position: absolute;
  bottom: 30px;
  width: 40px;
  height: 130px;
  display: flex;
  flex-direction: column;
`;

const PillarBase = styled.div`
  height: 30px;
  width: 40px;
  background-color: #222222;
  border: 1px solid #00FF00;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PillarLabel = styled.div`
  color: #00FF00;
  font-size: 12px;
`;

const PillarFill = styled.div`
  width: 40px;
  height: ${props => props.percentage}%;
  background-color: ${props => {
    if (props.percentage > 85) return '#00AA00';
    if (props.percentage > 75) return '#009900';
    return '#008800';
  }};
`;

const PillarHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #FFFF00;
  animation: ${pulseAnimation} 2s infinite;
  display: ${props => props.isActive ? 'block' : 'none'};
`;

const HorizontalLine = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  height: 1px;
  border-top: ${props => props.isDashed ? '2px dashed' : '1px solid'} ${props => props.color || '#00FF00'};
`;

const LineLabel = styled.div`
  position: absolute;
  left: 10px;
  color: ${props => props.color || '#00FF00'};
  font-size: 10px;
`;

const FocusLabel = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  color: #CCFF00;
  font-size: 10px;
  text-align: right;
`;

const PerformanceBox = styled.div`
  border: 1px solid #33FF33;
  padding: 15px;
  margin-bottom: 20px;
`;

const PerformanceTitle = styled.div`
  color: #CCFF00;
  font-size: 14px;
  margin-bottom: 10px;
`;

const PerformanceItem = styled.div`
  color: #00FF00;
  font-size: 11px;
  margin-bottom: 5px;
`;

const BadgeBox = styled.div`
  border: 1px solid #33FF33;
  padding: 15px;
`;

const BadgeTitle = styled.div`
  color: #CCFF00;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: transparent;
  border: 1px solid #00FF00;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: #00FF00;
`;

const ProgressLabel = styled.div`
  color: #00FF00;
  font-size: 10px;
  text-align: right;
`;

// Status Bar
const StatusBar = styled.div`
  height: 15px;
  border-top: 1px solid #CCFF00;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  animation: ${fadeIn} 0.9s ease-in;
`;

const StatusText = styled.div`
  color: #CCFF00;
  font-size: 12px;
`;

// Game data - typically would come from API or context
const gameData = {
  player: {
    xp: 1450,
    level: 'ALPHA CONTINUUM',
    streak: 5,
    decisionSpeed: '+20%',
    badges: 3,
    latestBadge: 'INFERENCE SLICER'
  },
  universe: {
    current: 'ALPHA CONTINUUM',
    progress: [
      { id: 'base', name: 'BASE LEVEL', status: 'completed' },
      { id: 'alpha', name: 'ALPHA CONTINUUM', status: 'current' },
      { id: 'beta', name: 'BETA NEXUS', status: 'locked' },
      { id: 'gamma', name: 'GAMMA SECTOR', status: 'locked' }
    ]
  },
  milestones: [
    { id: 'base', name: 'BASE', status: 'completed' },
    { id: 'inference', name: 'INFERENCE', status: 'completed' },
    { id: 'assumption', name: 'ASSUMPTION', status: 'active' },
    { id: 'deduction', name: 'DEDUCTION', status: 'unlocked' },
    { id: 'interpretation', name: 'INTERPRETATION', status: 'unlocked' },
    { id: 'evaluation', name: 'EVALUATION', status: 'unlocked' }
  ],
  objective: 'Identify hidden assumptions in Caliban\'s market data claims to fortify cognitive defenses.',
  challenge: {
    title: 'ASSUMPTION RECOGNITION CHALLENGE 2/3',
    dialogue: [
      {
        speaker: 'R.C.',
        text: 'Gifted One, I\'ve intercepted a statement from Caliban.\nStrategist: "Double ESG investments—demand\'s up 20%, promising €2M in new funds."',
        isCaliban: false
      },
      {
        speaker: 'CALIBAN',
        text: 'Your strategic edge is dull, Gifted One. The market signals are clear - trends like this are guaranteed to continue. Only a fool would question such an obvious opportunity.',
        isCaliban: true
      },
      {
        speaker: 'R.C.',
        text: 'Spot the assumptions, Gifted One! What\'s hidden behind this strategy recommendation? Cut through the noise!',
        isCaliban: false
      }
    ],
    prompt: 'IDENTIFY THE ASSUMPTIONS (Select all that apply):',
    response: [
      'Assumes demand growth will continue at the same rate.',
      'Assumes ESG investments will outperform other options.',
      'Assumes current demand represents a lasting trend rather than a temporary interest.'
    ]
  },
  leaderboard: [
    { name: 'SHADOWCODE', score: 14560, isUser: false },
    { name: 'NEONBYTE', score: 13270, isUser: false },
    { name: 'YOU', score: 12450, isUser: true },
    { name: 'MATRIXRUNNER', score: 11720, isUser: false },
    { name: 'CYBERWOLF', score: 10890, isUser: false }
  ],
  cognitiveMeasures: {
    inference: 88,
    assumption: 81,
    deduction: 75,
    interpretation: 77,
    evaluation: 78,
    currentFocus: 'assumption'
  },
  performanceMetrics: {
    traditional: '90% ACCURACY',
    keywordMatching: '95% ACCURACY',
    statementArrangement: '88% ACCURACY'
  },
  nextBadge: {
    name: 'ASSUMPTION HUNTER',
    progress: 70
  },
  streakStatus: 'PERFECT STREAK: 5 DAYS'
};

const GameInterface = () => {
  const navigate = useNavigate();
  const [rainCharacters, setRainCharacters] = useState([]);
  
  // Generate Matrix rain effect
  useEffect(() => {
    const characters = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Mix of binary and Japanese characters
      const charPool = [
        '0101010111',
        '1010101010',
        '01110101',
        '01010サヌラ0',
        '10101レッドキャット',
        '010マルチバース',
        '01010認知的',
        '1010感情的',
        '01対人関係',
        '0101批判',
        '10解釈',
        '01010推論',
        '10101検証'
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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      navigate('/session-selection');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      
      {/* Top Panel */}
      <TopPanel>
        <TopPanelBorder />
        <GameTitle>DIMENSIONAL RIFT: Multiverse Critical Thinking Odyssey</GameTitle>
        
        <StatsGroup>
          <StatItem>
            <StatLabel>XP: {gameData.player.xp}</StatLabel>
            <StatValue>LEVEL: {gameData.player.level}</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>STREAK: {gameData.player.streak} DAYS</StatLabel>
            <StatValue>DECISION SPEED: {gameData.player.decisionSpeed}</StatValue>
          </StatItem>
          
          <StatItem>
            <StatLabel>BADGES: {gameData.player.badges}/12</StatLabel>
            <StatValue>LATEST: {gameData.player.latestBadge}</StatValue>
          </StatItem>
          
          <CycleCounter>WEEK: 2/12</CycleCounter>
        </StatsGroup>
      </TopPanel>
      
      <ContentArea>
        {/* Left Panel */}
        <LeftPanel>
          <SectionTitle>// UNIVERSE LEVELS</SectionTitle>
          
          <ProgressPath>
            {gameData.universe.progress.map((level, index) => (
              <React.Fragment key={level.id}>
                <PathItem>
                  <PathNode 
                    isCompleted={level.status === 'completed'}
                    isCurrent={level.status === 'current'}
                  />
                  <PathLabel
                    isCompleted={level.status === 'completed'}
                    isCurrent={level.status === 'current'}
                  >
                    {level.name} [{level.status.toUpperCase()}]
                  </PathLabel>
                </PathItem>
                
                {index < gameData.universe.progress.length - 1 && (
                  <PathConnector 
                    isActive={level.status !== 'locked'}
                    isDashed={gameData.universe.progress[index + 1].status === 'locked'}
                  />
                )}
              </React.Fragment>
            ))}
          </ProgressPath>
          
          <SectionTitle>// CRITICAL THINKING MILESTONES</SectionTitle>
          
          <MilestoneList>
            {gameData.milestones.map(milestone => (
              <MilestoneItem 
                key={milestone.id}
                status={milestone.status}
              >
                <MilestoneLabel status={milestone.status}>
                  {milestone.name} [{milestone.status.toUpperCase()}]
                </MilestoneLabel>
              </MilestoneItem>
            ))}
          </MilestoneList>
          
          <ObjectiveBox>
            <ObjectiveTitle>MISSION OBJECTIVE:</ObjectiveTitle>
            <ObjectiveText>{gameData.objective}</ObjectiveText>
          </ObjectiveBox>
        </LeftPanel>
        
        {/* Center Panel */}
        <CenterPanel>
          <ChallengeHeader>
            <ChallengeTitle>// {gameData.challenge.title}</ChallengeTitle>
          </ChallengeHeader>
          
          {gameData.challenge.dialogue.map((dialogue, index) => (
            <DialogueBox key={index} isCaliban={dialogue.isCaliban}>
              <SpeakerName isCaliban={dialogue.isCaliban}>{dialogue.speaker}:</SpeakerName>
              <DialogueText isCaliban={dialogue.isCaliban}>
                {dialogue.text.split('\n').map((text, i) => (
                  <React.Fragment key={i}>
                    {text}
                    {i < dialogue.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </DialogueText>
            </DialogueBox>
          ))}
          
          <ChallengeInputArea>
            <ChallengePrompt>{gameData.challenge.prompt}</ChallengePrompt>
            
            <ResponseArea>
              {gameData.challenge.response.map((line, index) => (
                <ResponseText key={index}>
                  {line}
                  {index < gameData.challenge.response.length - 1 && <br />}
                </ResponseText>
              ))}
              <CursorBlink />
            </ResponseArea>
          </ChallengeInputArea>
        </CenterPanel>
        
        {/* Right Panel */}
        <RightPanel>
          <SectionTitle>// PERFORMANCE METRICS</SectionTitle>
          
          <AlertBox>
            <AlertText>[CHALLENGE 2 OF 3: ASSUMPTION]</AlertText>
          </AlertBox>
          
          <LeaderboardBox>
            <LeaderboardTitle>WEEKLY LEADERBOARD:</LeaderboardTitle>
            
            {gameData.leaderboard.map(item => (
              <LeaderboardItem key={item.name}>
                <LeaderboardName isUser={item.isUser}>{item.name}</LeaderboardName>
                <LeaderboardScore isUser={item.isUser}>{item.score} XP</LeaderboardScore>
              </LeaderboardItem>
            ))}
          </LeaderboardBox>
          
          <CognitiveMapBox>
            <CognitiveMapTitle>CRITICAL THINKING RADAR:</CognitiveMapTitle>
            
            <CognitiveMap>
              <MapBackground>
                {/* Neural network style background */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1="20" y1="40" x2="70" y2="60" stroke="#00FF00" strokeWidth="1" />
                    <line x1="70" y1="60" x2="120" y2="40" stroke="#00FF00" strokeWidth="1" />
                    <line x1="120" y1="40" x2="170" y2="60" stroke="#00FF00" strokeWidth="1" />
                    <line x1="170" y1="60" x2="220" y2="40" stroke="#00FF00" strokeWidth="1" />
                  </React.Fragment>
                ))}
              </MapBackground>
              
              {/* Skill Pillars */}
              <SkillPillar style={{ left: '30px' }}>
                <PillarFill percentage={(100 - gameData.cognitiveMeasures.inference) * 0.7} />
                <PillarBase>
                  <PillarLabel>INF</PillarLabel>
                </PillarBase>
              </SkillPillar>
              
              <SkillPillar style={{ left: '80px' }}>
                <PillarFill percentage={(100 - gameData.cognitiveMeasures.assumption) * 0.7} />
                <PillarBase>
                  <PillarLabel>ASM</PillarLabel>
                </PillarBase>
                <PillarHighlight isActive={gameData.cognitiveMeasures.currentFocus === 'assumption'} />
              </SkillPillar>
              
              <SkillPillar style={{ left: '130px' }}>
                <PillarFill percentage={(100 - gameData.cognitiveMeasures.deduction) * 0.7} />
                <PillarBase>
                  <PillarLabel>DED</PillarLabel>
                </PillarBase>
              </SkillPillar>
              
              <SkillPillar style={{ left: '180px' }}>
                <PillarFill percentage={(100 - gameData.cognitiveMeasures.interpretation) * 0.7} />
                <PillarBase>
                  <PillarLabel>INT</PillarLabel>
                </PillarBase>
              </SkillPillar>
              
              <SkillPillar style={{ left: '230px' }}>
                <PillarFill percentage={(100 - gameData.cognitiveMeasures.evaluation) * 0.7} />
                <PillarBase>
                  <PillarLabel>EVL</PillarLabel>
                </PillarBase>
              </SkillPillar>
              
              {/* Reference Lines */}
              <HorizontalLine style={{ top: '40px' }} color="#CCFF00" isDashed={true} />
              <LineLabel style={{ top: '35px' }} color="#CCFF00">100%</LineLabel>
              
              <HorizontalLine style={{ top: '100px' }} />
              <LineLabel style={{ top: '95px' }}>50%</LineLabel>
              
              <HorizontalLine style={{ top: '160px' }} />
              <LineLabel style={{ top: '155px' }}>0%</LineLabel>
              
              <FocusLabel>
                CURRENT FOCUS:<br />ASSUMPTION
              </FocusLabel>
            </CognitiveMap>
          </CognitiveMapBox>
          
          <PerformanceBox>
            <PerformanceTitle>CHALLENGE TYPE PERFORMANCE:</PerformanceTitle>
            
            {Object.entries(gameData.performanceMetrics).map(([type, value]) => (
              <PerformanceItem key={type}>
                {type.toUpperCase().replace('_', ' ')}: {value}
              </PerformanceItem>
            ))}
          </PerformanceBox>
          
          <BadgeBox>
            <BadgeTitle>NEXT BADGE: {gameData.nextBadge.name}</BadgeTitle>
            
            <ProgressBar>
              <ProgressFill percentage={gameData.nextBadge.progress} />
            </ProgressBar>
            
            <ProgressLabel>{gameData.nextBadge.progress}% COMPLETE</ProgressLabel>
          </BadgeBox>
        </RightPanel>
      </ContentArea>
      
      <StatusBar>
        <StatusText>[{gameData.streakStatus}]</StatusText>
      </StatusBar>
    </Container>
  );
};

export default GameInterface;

