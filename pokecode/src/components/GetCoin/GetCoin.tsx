import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
const GetCoin = ({ coin }: any) => {
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  const [testOne, setTextOne] = useState(false);
  const [testTwo, setTextTwo] = useState(false);
  const [onModal, setOnModal] = useState(false);

  useEffect(() => {
    setOnModal(true);
    setTextOne(true);
    setTimeout(() => {
      setTextOne(false);
      setTextTwo(true);
    }, 3000);
    setTimeout(() => {
      setTextTwo(false);
      setOnModal(false);
    }, 6000);
  }, [coin]);

  return (
    <ModalUi className={onModal ? '' : 'hidden'}>
      {testOne && (
        <motion.div
          initial={{ opacity: 0 }}
          transition={{
            duration: 1,
          }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          [{coin}] 유형을 일정 레벨 달성했습니다.
        </motion.div>
      )}
      {testTwo && (
        <motion.div
          initial={{ opacity: 0 }}
          transition={{
            duration: 1,
          }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          보상으로 [{coin}] 토큰를 1개 획득
        </motion.div>
      )}
      <audio
        src="/voice/gacha2.mp3"
        autoPlay
        ref={audioRefs}
        style={{ display: 'none' }}
      />
    </ModalUi>
  );
};

const ModalUi = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  text-align: center;
  background: url('/coinrun.gif') no-repeat;
  text-align: center;
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  z-index: 9999;
`;
export default GetCoin;
