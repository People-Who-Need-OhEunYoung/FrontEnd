import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import background from '../../assets/images/background2.jpg';
import { useEffect, useState } from 'react';
import art from '../../assets/images/Vector.png';
import { MainWrapper } from '../../components/MainWrapper';
import poo from '../../assets/images/poo.png';
import pokeball from '../../assets/images/poke-ball.png';

import {
  pokemonName,
  getPooCount,
  removePoo,
  showPokemonBook,
} from '../../utils/api/api';

import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const UserMain = () => {
  const [position, setPosition] = useState({
    x: '50%',
    y: '50%',
  });

  const [pooset, setPooset] = useState<{ x: number; y: number }[]>([]);

  const [pokemonname, setPokemonname] = useState('');
  const [pokemonExp, setPokemonExp] = useState(0);
  const { user } = useSelector((state: RootState) => state.userinfo);
  const controls = useAnimation();
  const controlsPoo = useAnimation();

  //포켓몬 무빙 핸들러
  const handleDivClick = (e: any) => {
    const containerRect = e.currentTarget.getBoundingClientRect();
    const offsetX: any = e.clientX - containerRect.left;
    const offsetY: any = e.clientY - containerRect.top;
    controls.start({
      x: 0,
      y: 0,
      transition: { duration: 1 + Math.random() * 3 },
    });
    setPosition({ x: offsetX, y: offsetY });
  };

  const getRandomPosition = () => ({
    x: Math.random() - Math.random() * 200,
    y: Math.random() - Math.random() * 200,
  });

  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
  //똥 갯수 가져오는 로직
  const pooCount = () => {
    getPooCount().then((res) => {
      let newPositions: any = [];
      for (let i = 0; i < res.poo; i++) {
        const x = Math.random() * 90;
        const y = Math.random() * 50 + 40;
        newPositions.push({ x, y });
      }
      if (res.poo !== 0 && pooset.length === 0) setPooset(newPositions);
    });
  };

  const pokemonnameSet = async (name: number) => {
    setPokemonname(await pokemonName(name));
  };

  const animateRandomly = async () => {
    try {
      while (true) {
        // 무작위 위치로 애니메이션 시작
        const newPosition = getRandomPosition();

        await controls.start({
          ...newPosition,
          transition: { duration: 1 + Math.random() * 3 },
        });

        const newNewPosition = getRandomPosition();

        await controls.start({
          ...newNewPosition,
          transition: { duration: 1 + Math.random() * 3 },
        });

        // 1초 동안 대기
        await sleep(1000);

        // 제자리 애니메이션 (사실상 이동이 없도록 함)
        controls.start({
          ...newNewPosition,
          transition: { duration: 1 + Math.random() * 3 },
        });
        // 다시 1초 동안 대기
        await sleep(1000);
      }
    } catch {
      console.log('화면이동 감지');
    }
  };

  const fetchPokeBook = async () => {
    try {
      const res = await showPokemonBook();
      const foundPokemon = res.book.find(
        (poke: any) => poke.poke_id === user.cur_poke_id
      );
      if (foundPokemon) {
        console.log(foundPokemon.poke_Exp);
        setPokemonExp(foundPokemon.poke_Exp);
      }
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPokeBook().then((res) => {
      console.log(res);
    });
  }, []);

  useEffect(() => {
    if (user.cur_poke_id) pokemonnameSet(user.cur_poke_id);
  }, [user.cur_poke_id]);

  useEffect(() => {
    pooCount();
    animateRandomly();
  }, [controls]);

  const handlePooClick = () => {
    controlsPoo.start({
      transform: 'translateY(-30%)',
      opacity: 0,
      transition: { duration: 1 },
    });
  };

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
      <MainWrapper>
        <Home onClick={handleDivClick}>
          {pooset.map((item: any, index: any) => (
            <motion.img
              key={index}
              src={poo}
              alt="Poo"
              initial={{ opacity: 1 }}
              animate={controlsPoo}
              draggable="false"
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: '100px',
                height: '100px',
                userSelect: 'none',
              }}
            />
          ))}

          <motion.div
            animate={controls}
            style={{
              position: 'absolute',
              transform: 'translateX(0px) translateY(0px) translateZ(0px)',
              top: position.y,
              left: position.x,
              display: 'inline-block',
              transition: '1s',
            }}
            className="pokemon"
          >
            <Pokemon
              style={{ transform: 'scale(2.5)' }}
              src={
                user.cur_poke_id == 0 ? pokeball : `/${user.cur_poke_id}.gif`
              }
            ></Pokemon>
          </motion.div>
          <PokeNameWrap>
            <PokeName>{user.cur_poke_id == 0 ? 'error' : pokemonname}</PokeName>
          </PokeNameWrap>
          <LevelWrap>
            <Level>
              LV {Math.floor(pokemonExp / 100) + 1}
              <br />
              <StyledBase>
                <StyledRange setprogress={pokemonExp % 100} />
              </StyledBase>
            </Level>
          </LevelWrap>
          <ButtonWrap>
            <Button
              to={''}
              onClick={() => {
                handlePooClick();
                removePoo();
              }}
            >
              <svg
                fill="rgb(212, 134, 207)"
                width={40}
                style={{ margin: '0 0 10px 0' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M254.4 6.6c3.5-4.3 9-6.5 14.5-5.7C315.8 7.2 352 47.4 352 96c0 11.2-1.9 22-5.5 32H352c35.3 0 64 28.7 64 64c0 19.1-8.4 36.3-21.7 48H408c39.8 0 72 32.2 72 72c0 23.2-11 43.8-28 57c34.1 5.7 60 35.3 60 71c0 39.8-32.2 72-72 72H72c-39.8 0-72-32.2-72-72c0-35.7 25.9-65.3 60-71c-17-13.2-28-33.8-28-57c0-39.8 32.2-72 72-72h13.7C104.4 228.3 96 211.1 96 192c0-35.3 28.7-64 64-64h16.2c44.1-.1 79.8-35.9 79.8-80c0-9.2-1.5-17.9-4.3-26.1c-1.8-5.2-.8-11.1 2.8-15.4z" />
              </svg>
            </Button>
            <Button to={'/book'}>
              <svg
                width={40}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="rgb(196, 144, 86)"
              >
                <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
              </svg>
            </Button>
          </ButtonWrap>
        </Home>
      </MainWrapper>
    </motion.div>
  );
};

const Home = styled.div`
  position: relative;
  width: 80%;
  margin: auto;
  height: calc(100% - 4em);
  background: url(${background}) no-repeat;
  background-size: cover;
  overflow: hidden;
  border-radius: 10px;
  margin: 2em auto;
`;
export const Pokemon = styled.img`
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
`;

const PokeNameWrap = styled.div`
  position: absolute;
  width: 10vw;
  top: 0;
  right: 0;
  font-weight: 500;
  padding: 0 0 20px 20px;
  background: #111826;
  border-radius: 0px 0px 0px 20px;

  @media (max-width: 750px) {
    display: none;
  }
  &:before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    left: -20px;
    background: url(${art});
  }
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    bottom: -20px;
    background: url(${art});
  }
`;

const PokeName = styled.div`
  border-radius: 30px;
  height: 40px;
  line-height: 40px;
  font-size: 1.2rem;
  color: white;
  text-align: center;
  background-color: #6366f1;
  //border: 4px solid #6366f1;
`;

const LevelWrap = styled.div`
  position: absolute;
  width: 10vw;
  bottom: 0;
  left: 0;
  font-weight: 500;
  padding: 10px;
  background: #111826;
  border-radius: 0px 20px 0px 0px;

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: -18px;
    left: -1px;
    transform: rotate(-180deg);
    background: url(${art});
  }
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    right: -18px;
    bottom: -2px;
    transform: rotate(-180deg);
    background: url(${art});
  }
`;

const Level = styled.div`
  border-radius: 30px;
  text-align: center;
`;

const ButtonWrap = styled.div`
  position: absolute;
  width: 4vw;
  bottom: 0;
  right: 0;
  font-weight: 500;
  padding: 15px;
  background: #111826;
  border-radius: 20px 0px 0px 0;

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    right: -1px;
    top: -19px;
    transform: rotate(90deg);
    background: url(${art});
  }
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    left: -19px;
    bottom: 0;
    transform: rotate(90deg);
    background: url(${art});
  }
`;
const Button = styled(Link)`
  display: inline-block;
  width: 100%;
  border-radius: 30px;
  text-align: center;
`;
// 테두리 코드
const StyledBase = styled.div`
  height: 10px;
  border: 3px solid;
  border-radius: 10px;
  margin-right: 15%;
  margin-left: 15%;
`;

const StyledRange = styled.div<{ setprogress: number }>`
  width: ${(props) => `${props.setprogress}%`};
  height: 10px;
  border-radius: 10px;
  background: linear-gradient(to right, #38bdf8, #6366f1);
`;
export default UserMain;
