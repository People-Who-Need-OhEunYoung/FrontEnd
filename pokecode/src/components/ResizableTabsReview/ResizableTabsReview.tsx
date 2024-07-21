import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import { TestSharedEditor } from '../TestSharedEditor';
import { DesignedButton1 } from '../DesignedButton';
import { ProblemText } from '../ProblemText';
// 진욱이 소스 import { VoiceChat } from '../VoiceChat';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ChatRoom from './ChatRoom';
import VoiceChatOV from './VoiceChatOV';
import { setRoomId, setUsername } from '../../store/roomdataSlice';
import { CodeAIWardBalloon } from '../CodeAIButton';
// import { Terminal } from '../Terminal';

import backGR from '../../assets/images/background.jpg';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  border: none;
`;

interface TabProps {
  width: number;
}

const Tab = styled.div<TabProps>`
  background-color: #111826;
  height: 100%;
  border-right: none;
  flex-basis: ${({ width }) => width}%;
  z-index: 100;
`;

const Resizer = styled.div`
  opacity: 0;
  width: 10px;
  cursor: ew-resize;
  background-color: #00000089;
  transform: translateX(-50%);
  height: 100%;
  z-index: 9999;
  position: absolute;
  border-radius: 20px;
  transition: 0.5s;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  &:hover {
    opacity: 1;
  }
`;

interface ResizableTabsProps {
  id: string;
  title: string;
  editorRoom: string;
}

const ResizableTabsReview: React.FC<ResizableTabsProps> = ({
  id,
  title,
  editorRoom = '1000',
}: any) => {
  const [width, setWidth] = useState<number>(25);
  const [width1, setWidth1] = useState<number>(25);
  const [tabWidth, setTabWidth] = useState(0); // Tab의 초기 너비 상태
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const dragControls = useDragControls();
  const animationControls = useAnimation();

  const setIdData = localStorage.getItem('username');
  const setRoomIdData = localStorage.getItem('roomId');

  if (setIdData != null) {
    dispatch(setUsername(setIdData));
  }
  if (setRoomIdData != null) {
    dispatch(setRoomId(setRoomIdData));
  }

  const handleDragEnd = () => {
    animationControls.start({
      x: 0,
      y: 0,
      transition: { duration: 0.5 }, // 이동하는 시간 설정 (예: 0.5초)
    });
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown1 = () => {
    document.addEventListener('mousemove', handleMouseMove1);
    document.addEventListener('mouseup', handleMouseUp1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const newWidth =
        ((e.clientX - containerRef.current.getBoundingClientRect().left) /
          containerWidth) *
        100;
      setWidth(newWidth);
    }
  };
  const handleMouseMove1 = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const newWidth =
        ((containerRect.right - e.clientX) / containerWidth) * 100;
      setWidth1(newWidth);
    }
  };
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp1 = () => {
    document.removeEventListener('mousemove', handleMouseMove1);
    document.removeEventListener('mouseup', handleMouseUp1);
  };

  useEffect(() => {
    const tabElement = tabRef.current;
    if (tabElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width } = entry.contentRect;
          setTabWidth(width); // 너비 상태 업데이트
        }
      });
      console.log('tabWidth: ', tabWidth);
      resizeObserver.observe(tabElement); // 탭 요소 관찰 시작
      return () => resizeObserver.disconnect(); // 컴포넌트 언마운트 시 관찰 중단
    }
  }, [tabWidth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', height: 'calc(100vh - 160px)' }}
    >
      <motion.div
        drag
        dragControls={dragControls}
        animate={animationControls} // 애니메이션 컨트롤 적용
        style={{
          position: 'fixed',
          display: 'inline-block',
          width: '5vw',
          zIndex: 9999,
          bottom: '80px',
          right: '48%',
          transform: 'translateX(0px) translateY(0px) translateZ(0px)',
          transition: '0.1s',
        }}
        className="pokemon"
      >
        <CodeAIWardBalloon
          width="300px"
          left="-100px"
          fontSize="1em"
          padding="30px"
          right="30px"
          bottom="100px"
          position="absolute"
        />
        <Pokemon
          width={'100%'}
          src={
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' +
            pokemonId +
            '.gif'
          }
        ></Pokemon>
      </motion.div>
      <Container ref={containerRef}>
        <Tab width={width}>
          <HeaderTxt>
            {id}번 {title}
          </HeaderTxt>
          <ProblemText
            id={id}
            isshowheader="false"
            size={'calc(100% - 80px)'}
            tabwidth={tabWidth}
          />
        </Tab>
        <Resizer onMouseDown={handleMouseDown} style={{ left: width + '%' }} />
        <div
          style={{
            background: 'blue',
            width: 100 - width - width1 + '%',
            height: '100%',
          }}
        >
          <div style={{ background: 'green', width: '100%', height: '80%' }}>
            <TestSharedEditor />
          </div>
          <div
            style={{
              width: '100%',
              height: '20%',
              overflow: 'auto',
            }}
          >
            <Home style={{ background: `url(${backGR})`, textAlign: 'center' }}>
              <DesignedButton1
                style={{ width: '150px', height: '30px', lineHeight: '20px' }}
                color="rgb(65, 0, 109)"
                onClick={handleDragEnd}
              >
                원 위치로
              </DesignedButton1>
            </Home>
          </div>
        </div>
        <Resizer
          onMouseDown={handleMouseDown1}
          style={{ left: 100 - width1 + '%' }}
        />
        <Tab width={width1}>
          <div
            style={{
              background: '#5F6275',
              width: '100%',
              height: '80%',
              overflow: 'auto',
            }}
          >
            <ChatRoom />
          </div>
          <div
            style={{
              width: '100%',
              height: '20%',
              overflow: 'auto',
            }}
          >
            <VoiceChatOV />
            {/* 진욱이 소스 <VoiceChat /> */}
          </div>
        </Tab>
      </Container>
    </motion.div>
  );
};

const HeaderTxt = styled.p`
  height: 80px;
  box-sizing: border-box;
  display: flex;
  line-height: 60px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  border-bottom: 2px solid gray;
  padding: 10px;
  padding-left: 5%;
`;

const Home = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
`;
export default ResizableTabsReview;
