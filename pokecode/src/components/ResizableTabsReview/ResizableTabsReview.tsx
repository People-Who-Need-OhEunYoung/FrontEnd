import { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import { TestSharedEditor } from '../TestSharedEditor';
import background from '../../assets/images/background.jpg';
import terminal from '../../assets/images/터미널.png';

import { DesignedButton1 } from '../DesignedButton';
import { ProblemText } from '../ProblemText';
import { VoiceChat } from '../VoiceChat';

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
}) => {
  const [width, setWidth] = useState<number>(25);
  const [width1, setWidth1] = useState<number>(25);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const dragControls = useDragControls();
  const animationControls = useAnimation();

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', height: 'calc(100vh - 180px)' }}
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
          bottom: '30%',
          right: 100,
          transform: 'translateX(0px) translateY(0px) translateZ(0px)',
          transition: '0.1s',
        }}
        className="pokemon"
      >
        <Pokemon
          width={'100%'}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/136.gif"
        ></Pokemon>
      </motion.div>
      <motion.div
        drag
        dragControls={dragControls}
        animate={animationControls} // 애니메이션 컨트롤 적용
        style={{
          position: 'fixed',
          display: 'inline-block',
          width: '4vw',
          zIndex: 9999,
          bottom: '30%',
          right: 150,
          transform: 'translateX(0px) translateY(0px) translateZ(0px)',
          transition: '0.1s',
        }}
        className="pokemon"
      >
        <Pokemon
          width={'100%'}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif"
        ></Pokemon>
      </motion.div>
      <motion.div
        drag
        dragControls={dragControls}
        animate={animationControls} // 애니메이션 컨트롤 적용
        style={{
          position: 'fixed',
          display: 'inline-block',
          width: '4vw',
          zIndex: 9999,
          bottom: '30%',
          right: 200,
          transform: 'translateX(0px) translateY(0px) translateZ(0px)',
          transition: '0.1s',
        }}
        className="pokemon"
      >
        <Pokemon
          width={'100%'}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/134.gif"
        ></Pokemon>
      </motion.div>
      <motion.div
        drag
        dragControls={dragControls}
        animate={animationControls} // 애니메이션 컨트롤 적용
        style={{
          position: 'fixed',
          display: 'inline-block',
          width: '6vw',
          zIndex: 9999,
          bottom: '30%',
          right: 250,
          transform: 'translateX(0px) translateY(0px) translateZ(0px)',
          transition: '0.1s',
        }}
        className="pokemon"
      >
        <Pokemon
          width={'100%'}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif"
        ></Pokemon>
      </motion.div>
      <Container ref={containerRef}>
        <Tab width={width}>
          <HeaderTxt>
            {id}번 {title}
          </HeaderTxt>
          <ProblemText
            id={id}
            isShowHeader="false"
            size={'calc(100% - 80px)'}
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
            <TestSharedEditor editorRoom={editorRoom} />
          </div>
          <div
            style={{
              background: 'yellow',
              width: '100%',
              height: '20%',
              overflow: 'hidden',
            }}
          >
            <img src={terminal} width={'100%'} />{' '}
          </div>
        </div>
        <Resizer
          onMouseDown={handleMouseDown1}
          style={{ left: 100 - width1 + '%' }}
        />
        <Tab width={width1}>
          <div
            style={{
              width: '100%',
              height: '80%',
              overflow: 'auto',
            }}
          >
            <Home>
              <DesignedButton1 color="rgb(65, 0, 109)" onClick={handleDragEnd}>
                원 위치로
              </DesignedButton1>
            </Home>
          </div>
          <div
            style={{
              width: '100%',
              height: '20%',
              overflow: 'auto',
            }}
          >
            <VoiceChat />
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
  background: url(${background});
  overflow: hidden;
`;
export default ResizableTabsReview;
