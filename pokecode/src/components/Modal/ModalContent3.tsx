import ReactConfetti from 'react-confetti';
import { CodeAIButton } from '../CodeAIButton';
import { DesignedButton1 } from '../DesignedButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';

const ModalContent3 = ({ onOff }: any) => {
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

      <DesignedButton1 color="cadetblue">
        <Link to={'/modal'}>AI 코드 피드백 확인</Link>
      </DesignedButton1>

      <div onClick={() => onOff(false)}>
        <CodeAIButton></CodeAIButton>
      </div>
    </div>
  );
};

export default ModalContent3;
