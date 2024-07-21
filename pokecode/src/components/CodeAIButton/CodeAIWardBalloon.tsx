import styled from 'styled-components';
// import wordballoon from '../../assets/images/wordballoon.png';
import closebox from '../../assets/images/close-box (2).png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWordBalloon } from '../../store/codeCallerReducer';
import { setReturnAiCall } from '../../store/codeCallerReducer';
import { useEffect, useRef } from 'react';

interface WordBalwrapProps {
  position: 'absolute' | 'relative' | 'fixed' | 'static' | 'sticky';
  left: string;
  right: string;
  bottom: string;
  width: string;
  padding: string;
  fontSize: string;
}

const CodeAIWardBalloon: React.FC<WordBalwrapProps> = ({
  width = '50%',
  left = 0,
  fontSize = '1.5em',
  padding = '20px 4%',
  right = '70px',
  bottom = '150px',
  position = 'fixed',
}) => {
  const { wordBalloon } = useSelector((state: RootState) => state.codecaller);
  const { returnAiCall } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();

  const messagesEndRef = useRef<HTMLAnchorElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [returnAiCall]);

  return (
    <WordBalwrap
      className={wordBalloon ? '' : 'hidden'}
      style={{
        position: position,
        left: left,
        bottom: bottom,
        maxHeight: '300px',
        width: '80%',
        margin: 'auto',
        marginLeft:'40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        color: 'black',
        overflow: 'none',
        padding: padding,
        boxSizing: 'border-box',
        fontSize: fontSize,
        fontWeight: 'bold',
      }}
    >
      <img
        src={closebox}
        style={{
          position: 'absolute',
          right: '15px',
          top: '15px',
          cursor: 'pointer',
          width: '30px'
          // background: `url(${closebox}) no-repeat`,
        }}
        onClick={() => {
          dispatch(setReturnAiCall(''));
          dispatch(setWordBalloon(false));
        }}
      >
        {/* X */}
      </img>
      <WordBal
        style={{
          width: '95%',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflow: 'scroll',
        }}
      >
        {returnAiCall}
        <a ref={messagesEndRef}></a>
      </WordBal>
    </WordBalwrap>
  );
};
const WordBalwrap = styled.pre`
  &::-webkit-scrollbar {
    display: none;
  }
`;
const WordBal = styled.pre`
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Ballon = styled.pre`
  position: absolute;
  background: #ffffff; /* 말풍선 배경 색상 */
  padding: 10px; /* 말풍선 내용 여백 */
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  color: #000000;
  font-size: 14px;
  margin: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 말풍선 그림자 */

  &::-webkit-scrollbar {
    display: none;
  }

  &::after {
    position: absolute;
    bottom: -10px; /* 삼각형을 말풍선 아래쪽에 배치 */
    left: 50%;
    margin-left: -10px;
    border: solid transparent;
    border-color: rgba(51, 51, 51, 0);
    border-top-color: #000; /* 말풍선 배경과 동일한 색상 */
    border-width: 10px;
    pointer-events: none;
    content: ' ';
  }
`;
export default CodeAIWardBalloon;
