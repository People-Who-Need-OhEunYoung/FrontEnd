import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLimitTime } from '../../store/timerSlice';

const ModalContent1 = ({ width, id }: any) => {
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
    dispatch(setLimitTime(time*60));

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
        <TimeLimit onClick={switchButton} timeck={timeck}>
          <TimeLimitCk timeck={timeck}></TimeLimitCk>
          <OnOffText timeck={timeck}>{timeck}</OnOffText>
        </TimeLimit>
      </div>
      <TimeSelecter timeck={timeck}>
        <span
          style={{ width: '40px', cursor: 'pointer', userSelect: 'none' }}
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
          style={{ width: '40px', cursor: 'pointer', userSelect: 'none' }}
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
  border-radius: 30px;
  border: none;
  background-color: #d6d4d4;
  box-sizing: border-box;
  cursor: pointer;
`;

const TimeLimit = styled.div<{ timeck: string }>`
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
  background: #6e6e6e;
  padding: 0.25rem;
  margin: 0 10px;
  cursor: pointer;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      background: rgba(79, 70, 229, 1);
    `}
`;

const TimeLimitCk = styled.div<{ timeck: string }>`
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
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(40px);
    `}
`;

const OnOffText = styled.span<{ timeck: string }>`
  position: absolute;
  color: white;
  top: -1px;
  right: 10px;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(-15px);
    `}
`;

const TimeSelecter = styled.ul<{ timeck: string }>`
  display: none;
  background: #f0f0f0;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
  width: 50%;
  margin: 0 auto 50px;
  height: 40px;
  line-height: 40px;
  border-radius: 40px;
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
  font-size:1.2rem;
  width: 40px;
  color: #000000;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
`;

export default ModalContent1;
