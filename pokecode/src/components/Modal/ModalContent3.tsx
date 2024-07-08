import { DesignedButton1 } from '../DesignedButton';
import { Link } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
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
      <DesignedButton1 color="cadetblue" onClick={onOff}>
        <Link to={'/modal'}>AI 코드 피드백 확인</Link>
      </DesignedButton1>
    </div>
  );
};

export default ModalContent3;
