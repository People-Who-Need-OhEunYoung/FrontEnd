import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MainWrapper } from '../../components/MainWrapper';
import garchimg from '../../assets/images/gachaimg.gif';
import { DesignedButton1 } from '../../components/DesignedButton';
import { Link } from 'react-router-dom';
import gacha1 from '../../assets/images/가챠1.gif';
import gacha2 from '../../assets/images/가챠2.gif';
import gacha3 from '../../assets/images/가챠3.gif';
import gacha4 from '../../assets/images/가챠4.gif';
import gacha5 from '../../assets/images/가챠5.gif';
import gacha6 from '../../assets/images/가챠6.gif';
import { useRef, useState } from 'react';
import { getGachaPokemon } from '../../utils/api/api';
import { pokemonName } from '../../utils/api/api';
import { updateMyPokemon } from '../../utils/api/api';
import { minusUserCoin } from '../../store/userInfo';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setPokemonId } from '../../store/userInfo';
import { PokeAudioGacha } from '../../components/PokeAudio';

const gachaKind = [
  {
    kind: '[수학]',
    kindDb: 'math_coin',
    coin: '수학코인',
    styleSet: 'hue-rotate(70deg)',
  },
  {
    kind: '[구현]',
    kindDb: 'impl_coin',
    coin: '구현코인',
    styleSet: 'hue-rotate(33deg)',
  },
  {
    kind: '[DP]',
    kindDb: 'dp_coin',
    coin: 'DP코인',
    styleSet: 'hue-rotate(318deg)',
  },
  {
    kind: '[자료구조]',
    kindDb: 'data_coin',
    coin: '자료구조코인',
    styleSet: 'hue-rotate(137deg)',
  },
  {
    kind: '[그래프]',
    kindDb: 'graph_coin',
    coin: '그래프코인',
    styleSet: 'hue-rotate(228deg)',
  },
];

const gachaArray = [gacha1, gacha2, gacha3, gacha4, gacha5, gacha6];
const Gacha = () => {
  const [background, setBackground] = useState(gachaArray[0]);
  const [gachaRun, setGachaRun] = useState(false);
  const [gachaResult, setGachaResult] = useState(false);
  const [getPokemon, setGetPokemon] = useState(0);
  const [getpokemonName, setGetpokemonName] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgmSet, setBgmSet] = useState(3);
  const prevIndexRef = useRef(currentIndex);

  const nextSlide = () => {
    prevIndexRef.current = currentIndex;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gachaKind.length);
  };

  const prevSlide = () => {
    prevIndexRef.current = currentIndex;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + gachaKind.length) % gachaKind.length
    );
  };

  const getDirection = () => {
    const direction = currentIndex > prevIndexRef.current ? -1 : 1;
    const isBoundaryCrossing =
      (prevIndexRef.current === gachaKind.length - 1 && currentIndex === 0) ||
      (prevIndexRef.current === 0 && currentIndex === gachaKind.length - 1);

    return isBoundaryCrossing ? -direction : direction;
  };

  const slideVariants: Variants = {
    initial: (custom: number) => ({ x: custom * 100 + '%', opacity: 0 }),
    animate: { x: '0%', opacity: 1 },
    exit: (custom: number) => ({ x: custom * -100 + '%', opacity: 0 }),
  };

  const dispatch = useDispatch();

  const gachaRunning = async (index: number) => {
    setBgmSet(2);
    const pokemonObj = await getGachaPokemon(gachaKind[currentIndex].kindDb);
    console.log(pokemonObj);
    if (pokemonObj.result == 'fail') {
      setBgmSet(3);
      alert(pokemonObj.message);
      setGachaRun(false);
      setIsDisabled(false);
      return;
    }
    dispatch(minusUserCoin(index));
    setTimeout(async () => {
      setGetPokemon(pokemonObj.poke_id);
      setGetpokemonName(await pokemonName(pokemonObj.poke_id));
      setGachaResult(true);
      setIsDisabled(false);
      setBgmSet(1);
      setTimeout(() => {
        setBgmSet(3);
      }, 3000);
    }, Math.random() * 4000 + 3000);
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
      <MainWrapper style={{ flexDirection: 'column' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={gachaKind[currentIndex].kind}
            custom={getDirection()}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: '#FFBBD3',
              borderRadius: '30px',
              textAlign: 'center',
              filter: `${gachaKind[currentIndex].styleSet}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <h1
                style={{
                  color: '#80495C',
                  fontWeight: 'bold',
                  fontSize: '2.5em',
                }}
              >
                {gachaKind[currentIndex].kind + '전설의 포켓몬 뽑기'}
              </h1>
              <div
                style={{
                  width: '70%',
                  overflow: 'hidden',
                  margin: 'auto',
                  borderRadius: '50% 50% 50% 50%',
                }}
              >
                <GachaImg src={garchimg} />
              </div>

              {isDisabled ? (
                <div style={{ height: '155px' }} />
              ) : (
                <>
                  <div>
                    <DesignedButton1
                      style={{ width: '400px', margin: '10px 0' }}
                      color="#fff"
                      onClick={(e) => {
                        e.preventDefault();
                        gachaRunning(currentIndex);
                        setBackground(
                          gachaArray[Math.floor(Math.random() * 6)]
                        );
                        setGachaRun(true);
                        setGachaResult(false);
                        setIsDisabled(true);
                      }}
                    >
                      뽑기 크래딧 ({gachaKind[currentIndex].coin} 소모)
                    </DesignedButton1>
                  </div>
                  <div>
                    <DesignedButton1
                      style={{ width: '400px', margin: '20px 0' }}
                      color="#80495C"
                    >
                      <Link
                        style={{
                          display: 'inline-block',
                          width: '100%',
                          color: 'white',
                        }}
                        to={'/usermain'}
                      >
                        나가기
                      </Link>
                    </DesignedButton1>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <div>
          <MainWrapper
            style={{
              display: `${gachaRun ? 'block' : 'none'}`,
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '450px',
              height: '400px',
              transform: 'translate(-50%, -50%)',
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'none',
            }}
          ></MainWrapper>
        </div>
        <div>
          <MainWrapper
            style={{
              display: `${gachaResult ? 'block' : 'none'}`,
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '450px',
              height: '400px',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              filter: 'none',
            }}
          >
            <h1 style={{ paddingTop: '20px' }}>다음 포켓몬이 뽑혔습니다</h1>
            <img
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '30%',
              }}
              src={'/' + getPokemon + '.gif'}
            />
            <h1
              style={{
                position: 'absolute',
                bottom: '110px',
                width: '100%',
              }}
            >
              {getpokemonName}
            </h1>
            <DesignedButton1
              color=""
              style={{
                position: 'absolute',
                left: '0',
                bottom: '60px',
                width: '60%',
                boxSizing: 'border-box',
                margin: '0 20%',
              }}
              onClick={() => {
                updateMyPokemon(getPokemon);
                dispatch(setPokemonId(getPokemon));
                setGachaRun(false);
                setGachaResult(false);
              }}
            >
              현재 포켓몬으로 변경
            </DesignedButton1>
            <DesignedButton1
              color="white"
              style={{
                position: 'absolute',
                left: '0',
                bottom: '10px',
                width: '60%',
                boxSizing: 'border-box',
                margin: '0 20%',
                color: 'white',
              }}
              onClick={() => {
                setGachaRun(false);
                setGachaResult(false);
              }}
            >
              닫기
            </DesignedButton1>
          </MainWrapper>
        </div>
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            zIndex: 1,
            border: 'none',
            cursor: 'inherit',
            background: 'none',
          }}
        >
          <svg
            style={{ width: '40px' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            zIndex: 1,
            border: 'none',
            cursor: 'inherit',
            background: 'none',
          }}
        >
          <svg
            style={{ width: '40px' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
          </svg>
        </button>
        <PokeAudioGacha runButton={bgmSet} event={bgmSet} />
      </MainWrapper>
    </motion.div>
  );
};

const GachaImg = styled.img`
  width: 100%;
`;

export default Gacha;
