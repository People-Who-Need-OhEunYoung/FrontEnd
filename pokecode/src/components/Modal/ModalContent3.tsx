import ReactConfetti from 'react-confetti';
import { CodeAIButton } from '../CodeAIButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const ModalContent3 = () => {
  const { pokemonId } = useSelector(
    (state: RootState) => state.userinfo
  );


  return (
    <div style={{ overflow: 'hidden', width: '400px' }}>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`}
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
