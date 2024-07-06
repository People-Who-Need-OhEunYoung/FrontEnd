import { useState } from 'react';
import styled from 'styled-components';
import './Modal.css';
const Modal = ({ width = '450px', text = '테스트', on }: any) => {
  const [flag, setFlag] = useState(false);
  const onOff = () => {
    if (on == null) on = flag;
    setFlag(!on);
  };
  return (
    <>
      <Background className={flag ? '' : 'hidden'}>
        <ModalWrap>
          <Title>{text}</Title>
          <ModalContent1 width={width} onOff={onOff}></ModalContent1>
          <CustomButtom color="blue" onClick={onOff}>
            닫기
          </CustomButtom>
        </ModalWrap>
      </Background>
      <button onClick={onOff}>test</button>
    </>
  );
};

const ModalContent1 = ({ width, onOff }: any) => {
  const [timeCk, setTimeCk] = useState('OFF');
  return (
    <>
      <div
        style={{
          width: width,
          display: 'inline-flex',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '30px 0 20px',
          fontWeight: 'bold',
        }}
      >
        <p>시간제한</p>
        <Test
          onClick={() => {
            setTimeCk('ON');
          }}
        >
          <Test1></Test1>
          <span
            style={{
              position: 'absolute',
              top: '-1px',
              color: 'white',
              right: '10px',
            }}
          >
            {}
          </span>
        </Test>
      </div>
      <CustomButtom color="blue" onClick={onOff}>
        시 작
      </CustomButtom>
    </>
  );
};

const Test = styled.div`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
  pointer-events: auto;
  height: 1.5rem;
  line-height: 1.5rem;
  width: 4rem;
  border-radius: 9999px;
  background: rgba(79, 70, 229, 1);
  padding: 0.25rem;

  margin: 0 10px;
  &:hover > div {
    transform: translateX(40px);
  }
  &:hover span {
    transform: translateX(-15px);
  }
`;
const Test1 = styled.div`
  height: 1rem;
  width: 1rem;
  color: white;
  text-align: right;
  border-radius: 9999px;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
`;

const onoffButton = styled.div``;

const ModalContent2 = ({
  p1 = '',
  p2 = '',
  button = [
    { color: 'cadetblue', text: '테스트1' },
    { color: 'cadetblue', text: '테스트2' },
  ],
  onOff,
}: any) => {
  return (
    <>
      <img src="" alt="" />
      <p>{p1}</p>
      <p>{p2}</p>
      {button.map((item: any, index: any) => (
        <CustomButtom key={index} color={item.color} onClick={onOff}>
          {item.text}
        </CustomButtom>
      ))}
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
const ModalWrap = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  padding: 1em 0;
  font-weight: bold;
  font-size: 2em;
`;
export default Modal;
