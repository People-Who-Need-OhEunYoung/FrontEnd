import { useState } from 'react';
import styled from 'styled-components';
import './Modal.css';
const Modal = ({
  width = '25%',
  height = '50%',
  text = '테스트',
  p1 = '',
  p2 = '',
  button = [
    { color: 'cadetblue', text: '테스트1' },
    { color: 'cadetblue', text: '테스트2' },
  ],
  on,
}: any) => {
  const [flag, setFlag] = useState(false);
  const onOff = () => {
    if (on == null) on = flag;
    setFlag(!on);
  };
  return (
    <>
      <Background className={flag ? '' : 'hidden'}>
        <ModalWrap width={width} height={height}>
          <Title>{text}</Title>
          <img src="" alt="" />
          <p>{p1}</p>
          <p>{p2}</p>
          {button.map((item: any, index: any) => (
            <CustomButtom key={index} color={item.color} onClick={onOff}>
              {item.text}
            </CustomButtom>
          ))}
          <CustomButtom color="blue" onClick={onOff}>
            닫기
          </CustomButtom>
        </ModalWrap>
      </Background>
      <button onClick={onOff}>test</button>
    </>
  );
};

const ModalContent1 = () => {
  return (
    <>
      <div></div>
    </>
  );
};
const ModalContent2 = () => {
  return (
    <>
      <div></div>
    </>
  );
};
const ModalContent3 = () => {
  return (
    <>
      <div></div>
    </>
  );
};
const ModalContent4 = () => {
  return (
    <>
      <div></div>
    </>
  );
};
const ModalContent5 = () => {
  return (
    <>
      <div></div>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #00000055;
  text-align: center;
`;
const ModalWrap = styled.div<{ width: string; height: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background: #fff;
  border-radius: 10px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
`;

const CustomButtom = styled.button<{ color: string }>`
  position: relative;
  color: white;
  width: 60%;
  margin: 5px 20%;
  padding: 0.5em 2em;
  font-size: 1.2em;
  border-radius: 30px;
  background-color: ${(props) => (props.color ? 'cadetblue' : props.color)};
  border: none;
`;
const Title = styled.p`
  padding: 1.5em 0;
  font-weight: bold;
  font-size: 2em;
`;
export default Modal;
