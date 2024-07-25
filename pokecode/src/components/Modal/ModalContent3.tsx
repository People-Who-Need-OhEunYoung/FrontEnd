import ReactConfetti from 'react-confetti';
import { CodeAIButton } from '../CodeAIButton';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useEffect, useRef } from 'react';
const ModalContent3 = ({ handleClose, on }: any) => {
  const { user } = useSelector((state: RootState) => state.userinfo);
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (on == true) {
      audioRefs.current?.play();
    }
  }, [on]);
  return (
    <div style={{ overflow: 'hidden', width: '400px' }}>
      <img
        src={'/' + user.cur_poke_id + '.gif'}
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
      <audio
        src="/voice/answer.mp3"
        style={{ display: 'none' }}
        ref={audioRefs}
      ></audio>
    </div>
  );
};

export default ModalContent3;
