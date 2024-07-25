import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import styled from 'styled-components';
import { setReturnCall } from '../../store/codeCallerReducer';

const Terminal = () => {
  // ------- 타이핑 출력 start ---------
  // 텍스트 결과 셋팅용
  const [testcaseResult, setTestcaseResult] = useState('');
  // 한글자씩 글자를 추가할 빈문자열 변수 sequence를 선언합니다.
  const [sequence, setSequence] = useState<string[]>([]);
  // 현재까지 타이핑된 문자열의 위치(인덱스)를 나타내는 변수 textCount를 선언합니다.
  const [textCount, setTextCount] = useState<number>(0);
  // 모든 문자열이 타이핑된 후 일시정지인지 아닌지 여부를 나타내는 변수를 선언합니다.
  const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);
  // ------- 타이핑 출력 end ---------
  const { returnCall } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();

  // Ref to the pre element
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    dispatch(setReturnCall(''));
  }, []);
  useEffect(() => {
    // PDG 테스트 케이스 리턴 메세지를 받도록 수정
    setSequence([]);
    setTextCount(0);
    setTestcaseResult(returnCall);
  }, [returnCall]);

  useEffect(() => {
    const lines = testcaseResult.split('\n');
    const typingInterval = setInterval(() => {
      if (textCount >= lines.length) {
        clearInterval(typingInterval);
        return;
      }

      setSequence((prevSequence) => [...prevSequence, lines[textCount]]);
      setTextCount((prevCount) => prevCount + 1);
    }, 70);

    return () => clearInterval(typingInterval); //컴포넌트가 마운트 해제되거나, 재렌더링 될 때마다 setInterval를 정리하는 함수를 반환함.
    //텍스트결과, 컨텐츠, 타이핑 정지 여부 등의 변화로 타이핑 효과 연출
  }, [testcaseResult, textCount]);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [sequence]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Header>
        <Buttongroup back_color="#ff79c6 " />
        <Buttongroup back_color="#3bbe5c " pos="22px" />
        <Buttongroup back_color="#6366F1" pos="44px" />
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box',
            padding: '8px',
          }}
        >
          Terminal
        </p>
      </Header>
      <TerminalTxt ref={preRef}>
        {sequence.map((line: string, index: number) => (
          <React.Fragment key={index}>
            {line.startsWith('[Test') && index !== 0 && (
              <>
                <br />
                <br />
              </>
            )}
            <div>
              {line
                .split(
                  /(\[Test \d+\]|Memory: \d+KB|Time: \d+\.\d+s|Input >|Output >|Expected Output >|Result > Success!!|Result > Fail!!)/g
                )
                .map((part: string, i: number) => {
                  if (part.startsWith('[Test')) {
                    return (
                      <span key={i} style={{ color: '#ff79c6' }}>
                        {part}
                      </span>
                    );
                  } else if (
                    part.startsWith('Memory') ||
                    part.startsWith('Time')
                  ) {
                    const [label, value] = part.split(': ');
                    return (
                      <span key={i}>
                        {label}:{' '}
                        <span style={{ color: '#D5D166' }}>{value}</span>
                      </span>
                    );
                  } else if (part === 'Result > Success!!') {
                    return <ResultSuccess key={i}>{part}</ResultSuccess>;
                  } else if (part === 'Result > Fail!!') {
                    return <ResultFail key={i}>{part}</ResultFail>;
                  } else {
                    return part;
                  }
                })}
            </div>
          </React.Fragment>
        ))}
      </TerminalTxt>
    </div>
  );
};

const TerminalTxt = styled.pre`
  height: 86%;
  background: #273244;
  color: #d3dde886;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  white-space: break-spaces;
  word-break: break-all;
  font-family: 'D2Coding', sans-serif;
  font-size: 14px;
  & * {
    font-family: 'D2Coding', sans-serif;
  }
`;

const ResultSuccess = styled.span`
  color: #50fa7b;
  font-size: 1.3rem;
`;

const ResultFail = styled.span`
  color: #f16363;
  font-size: 1.2rem;
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  background-color: #111826;
  color: #d3dde8;
  box-sizing: border-box;
  line-height: 30px;
  & * {
    font-family: 'D2Coding', sans-serif;
  }
`;

const Buttongroup = styled.a<{ back_color?: string; pos?: string }>`
  position: absolute;
  width: 15px;
  height: 15px;
  margin: 12px;
  border-radius: 50%;
  left: ${(props) => props.pos || '0'};
  background-color: ${(props) => props.back_color || '#324056'};
`;

export default Terminal;
