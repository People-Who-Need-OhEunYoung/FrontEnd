import { DesignedButton1 } from '../DesignedButton';
import { Link } from 'react-router-dom';
import { RainEffect } from '../RainEffect';
const ModalContent4 = ({
  onOff,
  poketmon = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif',
  event,
}: any) => {
  return (
    <div style={{ width: '400px' }}>
      <RainEffect></RainEffect>
      <img src={poketmon} height={'150px'} style={{ padding: '50px 0' }} />
      <DesignedButton1 color="cadetblue" onClick={onOff}>
        <Link to={'/'}>AI 코드 피드백 확인</Link>
      </DesignedButton1>
      <DesignedButton1
        color="cadetblue"
        onClick={() => {
          event(2);
          onOff();
        }}
      >
        코드 리뷰 요청
      </DesignedButton1>
    </div>
  );
};

export default ModalContent4;
