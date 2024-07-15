import styled from 'styled-components';
import wordballoon from '../../assets/images/wordballoon.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWordBalloon } from '../../store/codeCallerReducer';
import { setReturnAiCall } from '../../store/codeCallerReducer';

const CodeAIWardBalloon = () => {
  const { wordBalloon } = useSelector((state: RootState) => state.codecaller);
  const { returnAiCall } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();

  return (
    <WordBalwrap
      className={wordBalloon ? '' : 'hidden'}
      style={{
        position: 'fixed',
        left: 0,
        bottom: '150px',
        height: '300px',
        width: '50%',
        background: `url(${wordballoon})`,
        backgroundSize: '100% 100%',
        color: 'black',
        overflow: 'auto',
        padding: '20px 4%',
        boxSizing: 'border-box',
        fontSize: '1.5em',
        fontWeight: 'bold',
      }}
    >
      <a
        style={{
          position: 'absolute',
          right: '70px',
          top: '0',
          cursor: 'pointer',
          fontSize: '2em',
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
          height: '60%',
          overflow: 'scroll',
        }}
      >
        {returnAiCall}
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
