import styled from 'styled-components';
import wordballoon from '../../assets/images/wordballoon.png';
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
        width: width,
        background: `url(${wordballoon}) no-repeat`,
        backgroundSize: '100% 100%',
        color: 'black',
        overflow: 'auto',
        padding: padding,
        boxSizing: 'border-box',
        fontSize: fontSize,
        fontWeight: 'bold',
      }}
    >
      <a
        style={{
          position: 'absolute',
          right: right,
          top: '15px',
          cursor: 'pointer',
          fontSize: '1.3em',
        }}
        onClick={() => {
          dispatch(setReturnAiCall(''));
          dispatch(setWordBalloon(false));
        }}
      >
        X
      </a>
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
export default CodeAIWardBalloon;
