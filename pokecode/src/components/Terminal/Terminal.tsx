import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const Terminal = () => {
  // ------- 타이핑 출력 start ---------
  // 텍스트 결과 셋팅용
  const [testcaseResult, setTestcaseResult] = useState('');
  // 한글자씩 글자를 추가할 빈문자열 변수 sequence를 선언합니다.
  const [sequence, setSequence] = useState<string>('');
  // 현재까지 타이핑된 문자열의 위치(인덱스)를 나타내는 변수 textCount를 선언합니다.
  const [textCount, setTextCount] = useState<number>(0);
  // 모든 문자열이 타이핑된 후 일시정지인지 아닌지 여부를 나타내는 변수를 선언합니다.
  const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);
  // ------- 타이핑 출력 end ---------
  const { returnCall } = useSelector((state: RootState) => state.codecaller);
  //const dispatch = useDispatch();
  useEffect(() => {
    // PDG 테스트 케이스 리턴 메세지를 받도록 수정
    setSequence('');
    setTextCount(0);
    setTestcaseResult(returnCall);
  }, [returnCall]);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTypingPaused) {
        clearInterval(typingInterval);
      }

      if (textCount >= testcaseResult.length) {
        //text length 초과 시 undefind가 출력되는 것을 방지
        setIsTypingPaused(true);
        // console.log(isTypingPaused);
        return;
      }

      const nextChar = testcaseResult[textCount];
      setSequence((prevSequence) => prevSequence + nextChar);

      if (nextChar === '\n') {
        setTextCount((prevCount) => prevCount + 1);
      } else {
        setTextCount((prevCount) => prevCount + 1);
      }
    }, 30); // 설정한 초만큼 일정한 간격마다 실행된다

    return () => clearInterval(typingInterval); //컴포넌트가 마운트 해제되거나, 재렌더링 될 때마다 setInterval를 정리하는 함수를 반환함.
    //텍스트결과, 컨텐츠, 타이핑 정지 여부 등의 변화로 타이핑 효과 연출
  }, [testcaseResult, textCount, isTypingPaused, returnCall]);

  return (
    <div
      style={{
        background: 'yellow',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <pre
        style={{
          height: '100%',
          background: '#000',
          color: 'white',
          overflow: 'auto',
        }}
      >
        {sequence}
      </pre>
    </div>
  );
};

export default Terminal;
