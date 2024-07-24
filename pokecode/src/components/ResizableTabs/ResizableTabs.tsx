import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import background from '../../assets/images/background2.jpg';
import { ProblemText } from '../ProblemText';
import { TestEditor } from '../TestEditor';
import { CodeAIWardBalloon } from '../CodeAIButton';

import { Terminal } from '../Terminal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PokeAudioOne } from '../PokeAudio';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  border: none;
  background-color: #111826;
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
  resize: horizontal;
  padding: 10px 0;
  box-sizing: border-box;

  border-radius: 10px;
`;

const Resizer = styled.div`
  opacity: 0;
  width: 10px;
  cursor: ew-resize;
  background-color: #0000006d;
  transform: translateX(-50%);
  height: 100%;
  z-index: 100;
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
    z-index: 100;
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
  const { user } = useSelector((state: RootState) => state.userinfo);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const tabRef = useRef<HTMLDivElement | null>(null);
  const [tabWidth, setTabWidth] = useState(0); // Tab의 초기 너비 상태
  const [cry, setCry] = useState(false);

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
      resizeObserver.observe(tabElement); // 탭 요소 관찰 시작
      return () => resizeObserver.disconnect(); // 컴포넌트 언마운트 시 관찰 중단
    }
  }, [tabWidth]);

  // const userSet = async () => {
  //   setUser(await userInfo());
  // };

  // useEffect(() => {
  //   userSet();
  // }, [controls]);

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
        <Tab width={width} ref={tabRef}>
          <ProblemText
            id={id}
            isshowheader="true"
            size="calc(100% - 60px)"
            tabwidth={tabWidth}
          />
        </Tab>
        <Resizer
          onMouseDown={handleMouseDown}
          style={{ left: width + '%', zIndex: '500' }}
        />
        <div
          style={{
            width: 100 - width - width1 + '%',
            height: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              padding: '10px',
            }}
          >
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
              height: '60%',
              overflow: 'auto',
              borderRadius: '10px',
            }}
          >
            <Home style={{ position: 'relative' }} onClick={handleDivClick}>
              <CodeAIWardBalloon
                position="absolute"
                width="95%"
                left="2.5%"
                fontSize="1em"
                padding="20px 50px"
                bottom="35%"
                maxHightSet="70%"
                maxHightSet1="150px"
              />
              <motion.div
                animate={controls}
                style={{
                  position: 'relative',
                  transform: 'translateX(-50%)',
                  top: '70%',
                  left: position.x,
                  display: 'inline-block',
                  transition: '1s',
                }}
                className="pokemon"
              >
                <Pokemon
                  onClick={() => {
                    setCry(!cry);
                  }}
                  src={`/${user.cur_poke_id}.gif`}
                ></Pokemon>
              </motion.div>
            </Home>
          </div>
          <div
            style={{
              width: '100%',
              height: '40%',
              overflow: 'auto',
            }}
          >
            <Terminal />
          </div>
        </Tab>
      </Container>
      <PokeAudioOne runButton={user.cur_poke_id} event={cry}></PokeAudioOne>
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
