import {useState } from 'react';
import styled from 'styled-components';
import DesignedButton1 from '../DesignedButton/DesignedButton1';
import ModalContent1 from './ModalContent1';
import ModalContent2 from './ModalContent2';
import ModalContent3 from './ModalContent3';
import ModalContent4 from './ModalContent4';
import ModalContent5 from './ModalContent5';
import ModalContent7 from './ModalContent7';

/*

모달 사용법 : 
text, component, on, event props 를 사용한다.

text
=> 문제명 넘겨주기

component
=> 번호 넘겨주기
1 : 문제 풀기 입장 모달
2 : 리뷰 방만들기 입장 모달
3 : 문제 풀기 성공 모달
4 : 문제 풀기 실패 모달
5 : 테스트케이스 셋팅 모달

on(모달 상태 [false 꺼짐, true:켜짐]), 
event(모달에서 자체적으로 닫기 위해 setState function)
=> 모달 컴포넌트를 위한 state 생성 
   const [isModalOpen, setIsModalOpen] = useState(false);
   다음과 같이 모달에 넘겨준다
   on={isModalOpen} event={setIsModalOpen}
*/

const Modal = ({
  title = '방제목',
  prob_title = '문제명',
  id = '',
  component,
  roomid,
  on = false,
  event,
  limitNum = 2,
}: any) => {
  const [nowcomponent, setNowcomponent] = useState(component);
  const [reset, setReset] = useState(false);


 

  const handleClose = () => {
    event(false);
    setReset(true); // Trigger the reset
    setTimeout(() => {
      setReset(false);
    }, 0); // Reset the state back to false immediately after
  };

  return (
    <>
      <Background className={on ? '' : 'hidden'}>
        <ModalWrap>
          {nowcomponent === 1 ? (
            <>
              <Title>{prob_title}</Title>
              <ModalContent1 id={id} />
            </>
          ) : nowcomponent === 2 ? (
            <>
              <Title>{'리뷰방 만들기'} </Title>
              <ModalContent2 reset={reset} />
            </>
          ) : nowcomponent === 3 ? (
            <>
              <Title>{'축하합니다!'}</Title>
              <ModalContent3 handleClose={handleClose} />
            </>
          ) : nowcomponent === 4 ? (
            <>
              <Title>{'다시 도전해보세요'}</Title>
              <ModalContent4
                event={setNowcomponent}
                handleClose={handleClose}
              />
            </>
          ) : nowcomponent === 5 ? (
            <>
              <Title>{'테스트 케이스 입력'}</Title>
              <ModalContent5 />
            </>
          ) : nowcomponent === 6 ? (
            <>
              <Title>{title}</Title>
              <ModalContent7
                id={id}
                title={prob_title}
                roomId={roomid}
                maxPerson={limitNum}
                event={event}
              />
            </>
          ) : (
            ''
          )}
          <DesignedButton1
            color="#D3DDE8"
            style={{ marginBottom: '35px' }}
            onClick={() => {
              handleClose();
              setNowcomponent(component);
            }}
          >
            <b>닫기</b>
          </DesignedButton1>
        </ModalWrap>
      </Background>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999999;
  background: #46464647;
  text-align: center;
  backdrop-filter: blur(5px);
  border-radius: 20px;
`;

const ModalWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  color: #ffffff;
  transform: translate(-50%, -50%);
  background: #324056;
  border-radius: 10px;
  border: 4px solid #d3dde816;
  //box-shadow: 10px 10px 10px 0 rgba(68, 68, 68, 0.836);
  /* filter: drop-shadow(5px 5px rgba(255, 255, 255, 0.336)); */
`;

const Title = styled.p`
  padding: 50px 0 0;
  font-weight: bold;
  font-size: 1.3rem;
  word-wrap: break-word; /* Deprecated, use overflow-wrap instead */
  word-break: break-word; /* For non-CJK text */
  overflow-wrap: break-word;
  width: 300px;
  margin: auto;
`;

export default Modal;
