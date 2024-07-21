import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function TestCase({
  caseno,
  inputdata,
  outputdata,
  onInputChange,
  onOutputChange,
}: any) {
  const [inputValue, setInputValue] = useState<string>(inputdata);
  const [outputValue, setOutputValue] = useState<string>(outputdata);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'; // 기존 높이를 초기화
    textarea.style.height = `${textarea.scrollHeight}px`; // 새로운 높이를 scrollHeight로 설정
    console.log('textarea.scrollHeight:', textarea.scrollHeight);
    setInputValue(inputdata);
    setOutputValue(outputdata);
  };

  useEffect(() => {
    setInputValue(inputdata);
    setOutputValue(outputdata);
  }, [inputdata, outputdata]);

  useEffect(() => {
    if (inputRef.current) {
      autoResizeTextarea(inputRef.current);
    }
    if (outputRef.current) {
      autoResizeTextarea(outputRef.current);
    }
  }, [inputValue, outputValue, inputdata, outputdata, inputRef]);

  return (
    <div
      style={{
        width: '90%',
        margin: '0 auto',
        textAlign: 'left',
        lineHeight: '40px',
      }}
    >
      <Badges> 예시 {caseno} </Badges>
      <InoutWrap>
        <label
          style={{ textAlign: 'left', height: '50px' }}
          htmlFor={'indata' + caseno}
        >
          입력
        </label>
        <div>
          <InOutput
            id={'indata' + caseno}
            name={'indata' + caseno}
            value={inputValue}
            style={{
              width: '100%',
              minHeight: '100px',
              overflow: 'hidden',
              resize: 'none',
              border: 'none',
            }}
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onInputChange(e);
            }}
            rows={1}
          />
        </div>
        <div style={{ textAlign: 'left', height: '50px' }}>
          <label htmlFor={'outdata' + caseno}>출력</label>
        </div>
        <div>
          <InOutput
            ref={outputRef}
            style={{
              width: '100%',
              minHeight: '50px',
              marginBottom: '20px',
              overflow: 'hidden',
              resize: 'none',
              border: 'none',
            }}
            id={'outdata' + caseno}
            name={'outdata' + caseno}
            value={outputValue}
            onChange={(e) => {
              setOutputValue(e.target.value);
              onOutputChange(e);
            }}
          />
        </div>
      </InoutWrap>
    </div>
  );
}

const Badges = styled.p`
  font-weight: bold;
  background-color: #38bdf8;
  text-align: center;
  width: 20%;
  height: 40px;
  border-radius: 10px;
`;

const InoutWrap = styled.div`
  padding: 0 20px;
  margin: 10px 0 40px;
  background-color: #46464647;
  border-radius: 10px;
  border: 2px solid #38bdf8;
`;

const InOutput = styled.textarea`
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
`;
