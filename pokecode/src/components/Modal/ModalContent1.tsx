import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLimitTime } from '../../store/timerSlice';
import { resolveCall } from '../../utils/api/api';

const ModalContent1 = ({ width, id, prob_title }: any) => {
  const [timeck, setTimeck] = useState('OFF');
  const [time, setTime] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const switchButton = () => {
    setTimeck(timeck === 'ON' ? 'OFF' : 'ON');
  };

  const timeUp = () => {
    setTime(time - 0 + 10);
  };

  const timeDown = () => {
    if (time >= 10) {
      setTime(time - 10);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: any) => {
    if (e.target.value >= 0 && e.target.value != '' && e.target.value <= 6400) {
      let number: number = e.target.value.replace(/^0+/, '');
      setTime(number);
    } else {
      setTime(0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const gotoSolve = (id: number) => {
    dispatch(setLimitTime(time * 60));
    resolveCall(id.toString(), prob_title, time * 60);
    console.log(prob_title);
    navigate(`/problem?id=${id}`);
  };

  return (
    <div style={{ width: '400px' }}>
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
        <p>시간제한(분)</p>
        <CheckSlide onClick={switchButton} timeck={timeck}>
          <TimeLimitCk timeck={timeck}></TimeLimitCk>
          <OnOffText timeck={timeck}>{timeck}</OnOffText>
        </CheckSlide>
      </div>
      <TimeSelecter timeck={timeck}>
        <span
          style={{ width: '40px', cursor: 'inherit', userSelect: 'none' }}
          onClick={timeDown}
        >
          -
        </span>
        <div onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <Time
              type="number"
              value={time}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.keyCode === 13) setIsEditing(false);
              }}
              autoFocus
            />
          ) : (
            <span>{time}</span>
          )}
        </div>
        <span
          style={{ width: '40px', cursor: 'inherit', userSelect: 'none' }}
          onClick={timeUp}
        >
          +
        </span>
      </TimeSelecter>
      <SolveBtn onClick={() => gotoSolve(id)}>
        <b>문제풀기</b>
      </SolveBtn>
    </div>
  );
};

const SolveBtn = styled.button`
  position: relative;
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  border-radius: 10px;
  border: none;
  background-color: #6366f1;
  color: white;
  box-sizing: border-box;
  cursor: inherit;
`;

const CheckSlide = styled.div<{ timeck: string }>`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  border-width: 2px;
  border-style: solid;
  border-color: #d3dde8;
  pointer-events: auto;
  height: 2rem;
  line-height: 1.7rem;
  width: 4.4rem;
  border-radius: 9999px;
  padding: 0.25rem;
  margin: 0 10px;
  cursor: inherut;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      border-color: #ff79c6;
    `}

  &:hover + p {
    display: block;
  }
`;

// const CheckDoc = styled.p`
//   display: none;
//   position: absolute;
//   width: 130px;
//   padding: 8px;
//   right: -8%;
//   top: 100%;
//   -webkit-border-radius: 8px;
//   -moz-border-radius: 8px;
//   border-radius: 8px;
//   background: #646464;
//   color: #fff;
//   font-size: 14px;

//   &::after {
//     position: absolute;
//     bottom: 100%;
//     left: 50%;
//     width: 0;
//     height: 0;
//     margin-left: -10px;
//     border: solid transparent;
//     border-color: rgba(51, 51, 51, 0);
//     border-bottom-color: #646464;
//     border-width: 10px;
//     pointer-events: none;
//     content: ' ';
//   }
// `;

const TimeLimitCk = styled.div<{ timeck: string }>`
  height: 1rem;
  width: 1rem;
  color: white;
  margin: 2px;
  text-align: right;
  border-radius: 50%;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  background: #d3dde8;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(40px);
      background: #ff79c6;
    `}
`;

const OnOffText = styled.span<{ timeck: string }>`
  position: absolute;
  color: #d3dde8;
  font-weight: bold;
  top: 0px;
  right: 7px;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(-23px);
      color: #ff79c6;
    `}
`;

const TimeSelecter = styled.ul<{ timeck: string }>`
  display: none;
  /* background: #f0f0f0; */
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  width: 50%;
  margin: 0 auto 50px;
  height: 40px;
  line-height: 40px;
  border: 3px solid #d3dde8;
  border-radius: 20px;
  justify-content: space-around;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      display: flex;
    `}
`;
const Time = styled.input`
  text-align: center;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1.2rem;
  width: 40px;
  color: #000000;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
`;

export default ModalContent1;
