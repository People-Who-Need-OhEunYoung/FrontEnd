import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import background from '../../assets/images/background3.gif';
import { ProblemText } from '../ProblemText';
import { TestEditor } from '../TestEditor';
import { CodeAIWardBalloon } from '../CodeAIButton';
import { Terminal } from '../Terminal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';
import { useLocation } from 'react-router-dom';

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
  background-color: #171a25;
  height: 100%;
  border-right: none;
  /* min-width: 550px; */
  flex-basis: ${({ width }) => width}%;
  z-index: 100;
`;

const Resizer = styled.div`
  opacity: 0;
  width: 10px;
  cursor: ew-resize;
  background-color: #0000006d;
  transform: translateX(-50%);
  height: 100%;
  z-index: 200;
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
    z-index: 200;
  }
`;

interface ResizableTabsProps {
  id: string;
}

const ResizableTabs: React.FC<ResizableTabsProps> = ({ id }) => {
  const [width, setWidth] = useState<number>(30);
  const [width1, setWidth1] = useState<number>(30);
  const [position, setPosition] = useState({
    x: '50%',
  });
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDivClick = (e: any) => {
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX: any = e.clientX - containerRect.left;

    setPosition({ x: offsetX });
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
      if (newWidth < 30) {
        setWidth(30);
      } else if (newWidth > 50) {
        setWidth(50);
      } else {
        setWidth(newWidth);
      }
    }
  };
  const handleMouseMove1 = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const newWidth =
        ((containerRect.right - e.clientX) / containerWidth) * 100;
      if (newWidth < 10) {
        setWidth1(10);
      } else if (newWidth > 50) {
        setWidth1(50);
      } else {
        setWidth1(newWidth);
      }
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
    dispatch(setReturnCall(''));
  }, [location]);

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
      <Container ref={containerRef}>
        <Tab width={width}>
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <ProblemText id={id} isshowheader="true" size="calc(100% - 80px)" />
          </div>
        </Tab>
        <Resizer
          onMouseDown={handleMouseDown}
          style={{ left: width + '%', zIndex: '500' }}
        />
        <div
          style={{
            background: 'blue',
            width: 100 - width - width1 + '%',
            height: '100%',
          }}
        >
          <div style={{ background: 'green', width: '100%', height: '100%' }}>
            <TestEditor />
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
            <Home style={{ position: 'relative' }} onClick={handleDivClick}>
              <CodeAIWardBalloon
                position="absolute"
                width="100%"
                left="0"
                fontSize="1em"
                padding="20px 50px"
                right="50px"
                bottom="140px"
              />
              <motion.div
                animate={controls}
                style={{
                  position: 'relative',
                  transform: 'translateX(-50%)',
                  top: '80%',
                  left: position.x,
                  display: 'inline-block',
                  transition: '1s',
                }}
                className="pokemon"
              >
                <Pokemon
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`}
                ></Pokemon>
              </motion.div>
            </Home>
          </div>
          <div
            style={{
              width: '100%',
              height: '20%',
              overflow: 'auto',
            }}
          >
            <Terminal />
          </div>
        </Tab>
      </Container>
    </motion.div>
  );
};

const Home = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url(${background}) no-repeat;
  overflow: hidden;
  background-size: cover;
`;

export default ResizableTabs;
