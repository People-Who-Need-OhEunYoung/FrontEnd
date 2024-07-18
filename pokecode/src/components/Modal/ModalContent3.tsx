import ReactConfetti from 'react-confetti';
import { CodeAIButton } from '../CodeAIButton';
const ModalContent3 = ({
  onOff,
  poketmon = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif',
}: any) => {
  return (
    <div style={{ overflow: 'hidden', width: '400px' }}>
      <img src={poketmon} height={'150px'} style={{ padding: '30px 0' }} />
      <ReactConfetti
        width={400}
        height={450}
        numberOfPieces={100}
        colors={['#e85454', '#ff9eec', 'yellow']}
      />
      <div onClick={() => onOff(false)}>
        <CodeAIButton></CodeAIButton>
      </div>
    </div>
  );
};

export default ModalContent3;
