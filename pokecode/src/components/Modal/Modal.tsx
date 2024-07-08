import { useState } from 'react';
import styled from 'styled-components';
import DesignedButton1 from '../DesignedButton/DesignedButton1';
import ModalContent1 from './ModalContent1';
import ModalContent2 from './ModalContent2';
import ModalContent3 from './ModalContent3';
import ModalContent4 from './ModalContent4';
import ModalContent5 from './ModalContent5';

const Modal = ({ text = '문제명', on, component = 4 }: any) => {
  const [flag, setFlag] = useState(false);
  const [nowcompnent, setNowcompnent] = useState(component);

  const onOff = () => {
    if (on == null) on = flag;
    setFlag(!on);
  };
  return (
    <>
      <Background className={flag ? '' : 'hidden'}>
        <ModalWrap>
          {nowcompnent === 1 ? (
            <>
              <Title>{text}</Title>
              <ModalContent1 onOff={onOff} />
            </>
          ) : nowcompnent === 2 ? (
            <>
              <Title>{'리뷰방 만들기'}</Title>
              <ModalContent2 />
            </>
          ) : nowcompnent === 3 ? (
            <>
              <Title>{'축하합니다!'}</Title>
              <ModalContent3 />
            </>
          ) : nowcompnent === 4 ? (
            <>
              <Title>{'다시 도전해보세요'}</Title>
              <ModalContent4 event={setNowcompnent} />
            </>
          ) : nowcompnent === 5 ? (
            <>
              <Title>{'테스트 케이스 입력'}</Title>
              <ModalContent5 />
            </>
          ) : (
            ''
          )}
          <DesignedButton1
            color="cadetblue"
            onClick={onOff}
            style={{ marginBottom: '10px' }}
          >
            닫기
          </DesignedButton1>
        </ModalWrap>
      </Background>
      <button
        onClick={() => {
          onOff();
          setNowcompnent(1);
        }}
      >
        test1
      </button>
      <button
        onClick={() => {
          onOff();
          setNowcompnent(2);
        }}
      >
        test2
      </button>
      <button
        onClick={() => {
          onOff();
          setNowcompnent(3);
        }}
      >
        test3
      </button>
      <button
        onClick={() => {
          onOff();
          setNowcompnent(4);
        }}
      >
        test4
      </button>
      <button
        onClick={() => {
          onOff();
          setNowcompnent(5);
        }}
      >
        test5
      </button>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #00000055;
  text-align: center;
`;

const ModalWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
  background: #914fbc;
  border-radius: 10px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
`;

const Title = styled.p`
  padding: 1em 0;
  font-weight: bold;
  font-size: 2em;
`;

export default Modal;
