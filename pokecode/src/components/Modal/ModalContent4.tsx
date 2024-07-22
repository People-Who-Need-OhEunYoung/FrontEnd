import { DesignedButton1 } from '../DesignedButton';
import { RainEffect } from '../RainEffect';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CodeAIButton } from '../CodeAIButton';
const ModalContent4 = ({ event, handleClose }: any) => {
  const { user } = useSelector((state: RootState) => state.userinfo);

  return (
    <div style={{ width: '400px' }}>
      <RainEffect></RainEffect>
      <img
        src={'/' + user.cur_poke_id + '.gif'}
        height={'150px'}
        style={{ padding: '50px 0' }}
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
      <div>
        <DesignedButton1
          color="cadetblue"
          onClick={() => {
            event(2);
          }}
        >
          코드 리뷰 요청
        </DesignedButton1>
      </div>
    </div>
  );
};

export default ModalContent4;
