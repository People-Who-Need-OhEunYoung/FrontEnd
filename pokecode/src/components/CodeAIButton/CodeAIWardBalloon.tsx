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
  bottom: string;
  width: string;
  padding: string;
  fontSize: string;
  maxHightSet: string;
  maxHightSet1: string;
}

const CodeAIWardBalloon: React.FC<WordBalwrapProps> = ({
  width = '80%',
  left = 0,
  fontSize = '1.5em',
  padding = '20px 4%',
  bottom = '150px',
  position = 'fixed',
  maxHightSet = '300px',
  maxHightSet1 = '200px',
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
        maxHeight: maxHightSet,
        width: width,
        margin: 'auto',
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
          width: '30px',
        }}
        onClick={() => {
          dispatch(setReturnAiCall(''));
          dispatch(setWordBalloon(false));
        }}
      >
        {/* X */}
      </img>
      <WordBal
        maxHeightSet={maxHightSet1}
        style={{
          width: '95%',
          whiteSpace: 'pre-wrap',
          overflow: 'scroll',
          userSelect: 'all',
          textAlign: 'left',
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
const WordBal = styled.pre<{ maxHeightSet: string }>`
  max-height: 300px;

  @media (max-height: 950px) {
    max-height: ${(props) => props.maxHeightSet};
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default CodeAIWardBalloon;
