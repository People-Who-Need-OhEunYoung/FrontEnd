import { useState, useEffect } from 'react';
import './EvolutionModal.css';
import { useSelector } from 'react-redux';
import { pokemonName, setEvolutionPokemon } from '../../utils/api/api';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { setPokemonId } from '../../store/userInfo';

const EvolutionModal = () => {
  const [isEvolving, setIsEvolving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showEvolved, setShowEvolved] = useState(false);
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
      console.log(
        '상태:',
        currentPokemonNumber,
        currentName,
        nextPokemonNumber,
        nextName
      );
    };
    fetchPokemonData();
  }, [currentPokemonNumber, nextPokemonNumber]);

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setIsEvolving(true);
    }, 2000); // 2초 후 진화 애니메이션 시작

    setTimeout(() => {
      setIsEvolving(false);
      setShowEvolved(true);
    }, 7000); // 7초 후 진화 완료 상태로 변경

    setTimeout(() => {
      setEvolutionPokemon(nextPokemonNumber);
      dispatch(setPokemonId(nextPokemonNumber));
      setIsVisible(false); // 10초 후 모달 숨기기
    }, 10000); // 10초 후 모달 숨기기
  }, []);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div
          className="pokemon-container"
          style={{ margin: 'auto', top: '50%', transform: 'translateY(50%)' }}
        >
          {!showEvolved && (
            <div className={`pokemon ${isEvolving ? 'fade-out' : 'fade-in'}`}>
              <img
                src={`/${currentPokemonNumber}.gif`}
                alt={currentPokemonName}
                className="pokemon-image"
              />
            </div>
          )}
          {showEvolved && (
            <div className={`pokemon`}>
              <img
                src={`/${nextPokemonNumber}.gif`}
                alt={nextPokemonName}
                className="pokemon-image"
              />
            </div>
          )}
        </div>
        <div className="text-box">
          <p>
            {showEvolved
              ? `${currentPokemonName}는 ${nextPokemonName}로 진화했다!`
              : `어라！？ ${currentPokemonName}의 상태가！`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvolutionModal;
