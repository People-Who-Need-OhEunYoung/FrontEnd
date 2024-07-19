import { DesignedButton1 } from '../DesignedButton';
import { Link } from 'react-router-dom';
import { RainEffect } from '../RainEffect';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
const ModalContent4 = ({ event }: any) => {
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  
  return (
    <div style={{ width: '400px' }}>
      <RainEffect></RainEffect>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`}
        height={'150px'}
        style={{ padding: '50px 0' }}
      />
      <DesignedButton1 color="cadetblue">
        <Link to={'/'}>AI 코드 피드백 확인</Link>
      </DesignedButton1>
      <DesignedButton1
        color="cadetblue"
        onClick={() => {
          event(2);
        }}
      >
        코드 리뷰 요청
      </DesignedButton1>
    </div>
  );
};

export default ModalContent4;
