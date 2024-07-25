import { DesignedButton1 } from '../DesignedButton';
import { RainEffect } from '../RainEffect';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CodeAIButton } from '../CodeAIButton';
import { useEffect, useRef } from 'react';
const ModalContent4 = ({ event, handleClose, on }: any) => {
  const { user } = useSelector((state: RootState) => state.userinfo);
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (on == true) {
      audioRefs.current?.play();
    }
  }, [on]);
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
      <audio
        src="/voice/noanswer.mp3"
        style={{ display: 'none' }}
        ref={audioRefs}
      ></audio>
    </div>
  );
};

export default ModalContent4;
