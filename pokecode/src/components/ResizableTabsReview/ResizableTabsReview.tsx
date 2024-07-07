import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import { TestSharedEditor } from '../TestSharedEditor';
import background from '../../assets/images/background.jpg';
import problem1011 from '../../assets/images/1011번-Fly-me-to-the-Alpha-Centauri.png';
import terminal from '../../assets/images/터미널.png';
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
  background-color: #f0f0f0;
  height: 100%;
  border-right: none;
  flex-basis: ${({ width }) => width}%;
  z-index: 100;
`;

const Resizer = styled.div`
  opacity: 0;
  width: 20px;
  cursor: ew-resize;
  background-color: #8f0000;
  transform: translateX(-50%);
  height: 100px;
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

const ResizableTabsReview: React.FC = () => {
  const [width, setWidth] = useState<number>(25);
  const [width1, setWidth1] = useState<number>(25);
  const [position, setPosition] = useState({
    x: '50%',
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const handleDivClick = (e: any) => {
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX: any = e.clientX - containerRect.left;

    setPosition({ x: offsetX });
  };
  const getRandomPosition = () => ({
    x: Math.random() - Math.random() * 200,
  });

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

  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const animateRandomly = async () => {
      while (true) {
        // 무작위 위치로 애니메이션 시작
        const newPosition = getRandomPosition();
        await controls.start({
          ...newPosition,
          transition: { duration: 1 + Math.random() * 3 },
        });

        // 1초 동안 대기
        await sleep(1000);

        // 제자리 애니메이션 (사실상 이동이 없도록 함)
        await controls.start({
          x: newPosition.x,
          transition: { duration: 1 + Math.random() * 3 },
        });

        // 다시 1초 동안 대기
        await sleep(1000);
      }
    };
    animateRandomly();
  }, [controls]);
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
      <Container ref={containerRef}>
        <Tab style={{ width: `${width}%` }}>
          <div
            style={{
              width: '100%',
              height: '80%',
              overflow: 'auto',
            }}
          >
            <img src={problem1011} width={'100%'} alt="" />
          </div>
          <Home onClick={handleDivClick}>
            <motion.div
              animate={controls}
              style={{
                position: 'relative',
                transform: 'translate(50%, 50%)',
                top: '50%',
                left: position.x,
                display: 'inline-block',
                width: '4vw',
                transition: '1s',
              }}
              className="pokemon"
            >
              <Pokemon
                width={'100%'}
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/132.gif"
              ></Pokemon>
            </motion.div>
          </Home>
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
            <img src={problem1011} width={'100%'} alt="" />
          </div>
          <Home onClick={handleDivClick}>
            <motion.div
              animate={controls}
              style={{
                position: 'relative',
                transform: 'translate(50%, 50%)',
                top: '50%',
                left: position.x,
                display: 'inline-block',
                width: '4vw',
                transition: '1s',
              }}
              className="pokemon"
            >
              <Pokemon
                width={'100%'}
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/132.gif"
              ></Pokemon>
            </motion.div>
          </Home>
        </Tab>
      </Container>
    </motion.div>
  );
};
const Home = styled.div`
  width: 100%;
  height: 20%;
  margin: 0 auto;
  background: url(${background});
  overflow: hidden;
`;
export default ResizableTabsReview;
