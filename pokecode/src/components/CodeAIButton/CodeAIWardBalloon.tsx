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
}

const CodeAIWardBalloon: React.FC<WordBalwrapProps> = ({
  width = '80%',
  left = 0,
  fontSize = '1.5em',
  padding = '20px 4%',
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
        margin: 'auto',
        marginLeft: '40px',
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

export default CodeAIWardBalloon;
