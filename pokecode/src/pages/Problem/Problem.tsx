import { motion, useAnimation } from 'framer-motion';
import { Pokemon } from '../UserMain/UserMain';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TestSharedEditor } from '../../components/TestSharedEditor';
import background from '../../assets/images/background.jpg';
import problem1011 from '../../assets/images/1011번-Fly-me-to-the-Alpha-Centauri.png';
import terminal from '../../assets/images/터미널.png';
const Problem = () => {
  const [position, setPosition] = useState({
    x: '50%',
  });
  const controls = useAnimation();
  const handleDivClick = (e: any) => {
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX: any = e.clientX - containerRect.left;

    setPosition({ x: offsetX });
  };
  const getRandomPosition = () => ({
    x: Math.random() - Math.random() * 200,
  });

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
      <div
        style={{
          position: 'absolute',
          width: '50%',
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
            position: 'absolute',
            transform: 'translate(50%, 50%)',
            top: '50%',
            left: position.x,
            display: 'inline-block',
            width: '5%',
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

      <div
        style={{
          position: 'absolute',
          background: 'blue',
          left: '50%',
          width: '50%',
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
    </motion.div>
  );
};

const Home = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: auto;
  height: 20%;
  background: url(${background});
  overflow: hidden;
`;
export default Problem;
