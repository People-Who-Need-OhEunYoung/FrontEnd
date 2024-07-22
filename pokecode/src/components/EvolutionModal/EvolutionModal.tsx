import { useState, useEffect } from 'react';
import './EvolutionModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { pokemonName } from '../../utils/api/api';
import { RootState } from '../../store';

const EvolutionModal = () => {
  const [isEvolving, setIsEvolving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPokemonName, setCurrentPokemonName] = useState('');
  const [nextPokemonName, setNextPokemonName] = useState('');
  const { user } = useSelector((state: RootState) => state.userinfo);

  let currentPokemonNumber = user.cur_poke_id;
  let nextPokemonNumber = currentPokemonNumber + 1;

  useEffect(() => {
    const fetchPokemonData = async () => {
      const currentName = await pokemonName(currentPokemonNumber);
      const nextName = await pokemonName(nextPokemonNumber);
      setCurrentPokemonName(currentName);
      setNextPokemonName(nextName);
      console.log("상태:", currentPokemonNumber, currentName, nextPokemonNumber, nextName);
    };
    fetchPokemonData();
  }, [currentPokemonNumber, nextPokemonNumber]);

  useEffect(() => {
    setTimeout(() => {
      setIsEvolving(true);
    }, 2000); // 2초 후 진화 애니메이션 시작
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // 7초 후 모달 숨기기
    }, 7000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, []);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="pokemon-container">
          {!isEvolving && (
            <>
              <div className="text-box">
                <p>어라！？<br />{currentPokemonName}의 상태가！</p>
              </div>
              <img 
                src={`/${currentPokemonNumber}.gif`} 
                alt={currentPokemonName} 
                className="pokemon"
              />
            </>
          )}
          {isEvolving && (
            <>
              <div className="text-box">
                <p>{currentPokemonName}은 진화해<br />{nextPokemonName}이 되었다！</p>
              </div>
              <img 
                src={`/${nextPokemonNumber}.gif`} 
                alt={nextPokemonName} 
                className="pokemon evolve"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvolutionModal;
