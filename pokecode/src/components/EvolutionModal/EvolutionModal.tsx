import { useState, useEffect, useRef } from 'react';
import './EvolutionModal.css';
import { pokemonName, setEvolutionPokemon } from '../../utils/api/api';
import { useDispatch } from 'react-redux';
import { setPokemonId } from '../../store/userInfo';

const EvolutionModal = ({ nextPokemonNumber }: any) => {
  const [isEvolving, setIsEvolving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showEvolved, setShowEvolved] = useState(false);
  const [currentPokemonName, setCurrentPokemonName] = useState('');
  const [nextPokemonName, setNextPokemonName] = useState('');
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  const dispatch = useDispatch();

  let currentPokemonNumber =
    nextPokemonNumber === 25 ? 172 : nextPokemonNumber - 1;

  useEffect(() => {
    const fetchPokemonData = async () => {
      const currentName = await pokemonName(currentPokemonNumber);
      const nextName = await pokemonName(nextPokemonNumber);
      setCurrentPokemonName(currentName);
      setNextPokemonName(nextName);
    };
    fetchPokemonData();
  }, [currentPokemonNumber, nextPokemonNumber]);

  useEffect(() => {
    const evolveSequence = () => {
      setTimeout(() => setIsEvolving(true), 3000);
      setTimeout(() => {
        setIsEvolving(false);
        setShowEvolved(true);
      }, 16000);
      setTimeout(() => {
        setEvolutionPokemon(nextPokemonNumber);
        dispatch(setPokemonId(nextPokemonNumber));
        setIsVisible(false);
      }, 20000);
    };
    evolveSequence();
  }, [dispatch, nextPokemonNumber]);

  useEffect(() => {
    const playSoundForDuration = () => {
      const audioElement = audioRefs.current;
      if (audioElement) {
        audioElement.play();
      }
    };
    playSoundForDuration();
  }, []);

  if (nextPokemonNumber == null) {
    return;
  }

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="pokemon-container">
          {!showEvolved ? (
            <div className={`pokemon ${isEvolving ? 'fade-out' : 'fade-in'}`}>
              <img
                src={`/${currentPokemonNumber}.gif`}
                alt={currentPokemonName}
                className="pokemon-image"
              />
            </div>
          ) : (
            <div className="pokemon">
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
      <audio
        src="/voice/evol.mp3"
        autoPlay
        ref={audioRefs}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default EvolutionModal;
