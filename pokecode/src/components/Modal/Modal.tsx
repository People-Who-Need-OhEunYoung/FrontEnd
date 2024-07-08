import { useState } from 'react';
import styled from 'styled-components';
import DesignedButton1 from '../DesignedButton/DesignedButton1';
import ModalContent1 from './ModalContent1';
import ModalContent2 from './ModalContent2';
import ModalContent3 from './ModalContent3';
import ModalContent4 from './ModalContent4';
import ModalContent5 from './ModalContent5';

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
const Modal = ({ text = '문제명', component, on = false, event }: any) => {
  const [nowcomponent, setNowcomponent] = useState(component);

  return (
    <>
      <Background className={on ? '' : 'hidden'}>
        <ModalWrap>
          {nowcomponent === 1 ? (
            <>
              <Title>{text}</Title>
              <ModalContent1 />
            </>
          ) : nowcomponent === 2 ? (
            <>
              <Title>{'리뷰방 만들기'}</Title>
              <ModalContent2 />
            </>
          ) : nowcomponent === 3 ? (
            <>
              <Title>{'축하합니다!'}</Title>
              <ModalContent3 />
            </>
          ) : nowcomponent === 4 ? (
            <>
              <Title>{'다시 도전해보세요'}</Title>
              <ModalContent4 event={setNowcomponent} />
            </>
          ) : nowcomponent === 5 ? (
            <>
              <Title>{'테스트 케이스 입력'}</Title>
              <ModalContent5 />
            </>
          ) : (
            ''
          )}
          <DesignedButton1
            color="cadetblue"
            style={{ marginBottom: '10px' }}
            onClick={() => event(false)}
          >
            닫기
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
