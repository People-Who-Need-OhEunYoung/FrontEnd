import ReactConfetti from 'react-confetti';
import { CodeAIButton } from '../CodeAIButton';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
const ModalContent3 = ({ handleClose }: any) => {

  const { pokemonId } = useSelector((state: RootState) => state.userinfo);

  return (
    <div style={{ overflow: 'hidden', width: '400px' }}>
      <img
        src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' +
                  pokemonId + '.gif'}
        height={'150px'}
        style={{ padding: '30px 0' }}
      />
      <ReactConfetti
        width={400}
        height={450}
        numberOfPieces={100}
        colors={['#e85454', '#ff9eec', 'yellow']}
      />
      <div
        onClick={() => {
          handleClose();
        }}
      >
        <CodeAIButton
          marginRight="0px"
          width="55%"
          fontSize="1.2em"
        ></CodeAIButton>
      </div>
    </div>
  );
};

export default ModalContent3;
