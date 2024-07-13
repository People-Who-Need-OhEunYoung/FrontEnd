import { motion } from 'framer-motion';
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
import { useState } from 'react';
import { getGachaPokemon, setGachaPokemon } from '../../utils/api/api';
import { pokemonName } from '../../utils/api/api';
import { updateMyPokemon } from '../../utils/api/api';
import { minusUserCredit } from '../../store/userInfo';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';


const gachaArray = [gacha1, gacha2, gacha3, gacha4, gacha5, gacha6];
const Gacha = () => {
  const [background, setBackground] = useState(gachaArray[0]);
  const [gachaRun, setGachaRun] = useState(false);
  const [gachaResult, setGachaResult] = useState(false);
  const [getPokemon, setGetPokemon] = useState(0);
  const [getpokemonName, setGetpokemonName] = useState(0);
  const [duplication, setDuplication] = useState(false);

  const dispatch = useDispatch();

  const gachaRunning = async () => {
    const pokemonObj = await getGachaPokemon().then(async (res) => {
      return await setGachaPokemon(res);
    });
    if (pokemonObj.result == 'fail') {
      alert('크래딧 부족입니다.');
      setGachaRun(false);
      return;
    }
    setTimeout(async () => {
      if (pokemonObj.message == '중복 포켓몬') {
        setDuplication(true);
      } else {
        setDuplication(false);
      }
      setGetPokemon(pokemonObj.poke_id);
      setGetpokemonName(await pokemonName(pokemonObj.poke_id));
      setGachaResult(true);
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
      style={{ position: 'relative', height: 'calc(100vh - 180px)' }}
    >
      <MainWrapper style={{ background: '#FFBBD3', flexDirection: 'column' }}>
        <h1 style={{ color: '#80495C', fontWeight: 'bold', fontSize: '3em' }}>
          새로운 포켓몬 뽑기
        </h1>
        <div
          style={{
            width: '40%',
            overflow: 'hidden',
            borderRadius: '50% 50% 50% 0',
          }}
        >
          <img src={garchimg} width={'100%'} />
        </div>
        <div>
          <DesignedButton1
            style={{ width: '400px', margin: '20px 0' }}
            color="#80495C"
            onClick={() => {
              dispatch(minusUserCredit());
              setGachaRun(true);
              setBackground(gachaArray[Math.floor(Math.random() * 6)]);
              gachaRunning();
            }}
          >
            뽑기 크래딧 (100)
          </DesignedButton1>
        </div>
        <div>
          <DesignedButton1
            style={{ width: '400px', margin: '20px 0' }}
            color="#80495C"
          >
            <Link to={'/usermain'}>나가기</Link>
          </DesignedButton1>
        </div>
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
            }}
          >
            <h1 style={{ paddingTop: '20px' }}>
              {duplication
                ? '이미 뽑힌 포켓몬입니다'
                : '다음 포켓몬이 뽑혔습니다'}
            </h1>
            <img
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '30%',
              }}
              src={
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' +
                getPokemon +
                '.gif'
              }
            />
            <h1
              style={{ position: 'absolute', bottom: '110px', width: '100%' }}
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
                color: 'black',
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
      </MainWrapper>
    </motion.div>
  );
};

export default Gacha;
