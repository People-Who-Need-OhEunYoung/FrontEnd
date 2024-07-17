import { useEffect, useRef, useState } from 'react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResizeTextarea(e.target);
    onInputChange(caseno, e.target.value);
    console.log(e.target.value);
  };

  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputValue(e.target.value);
    autoResizeTextarea(e.target);
    onOutputChange(caseno, e.target.value);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'; // 기존 높이를 초기화
    textarea.style.height = `${textarea.scrollHeight}px`; // 새로운 높이를 scrollHeight로 설정
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
  }, [inputValue, outputValue]);

  return (
    <div
      style={{
        width: '80%',
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      <div style={{ fontWeight: 'bold', padding: '0 0 10px', height: '40px' }}>
        테스트케이스{caseno}
      </div>
      <div style={{ textAlign: 'left', height: '50px' }}>
        <label htmlFor={'indata' + caseno}>입력</label>
      </div>
      <div>
        <textarea
          ref={inputRef}
          style={{
            width: '100%',
            minHeight: '100px',
            overflow: 'hidden',
            resize: 'none',
          }}
          id={'indata' + caseno}
          name={'indata' + caseno}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div style={{ textAlign: 'left', height: '50px' }}>
        <label htmlFor={'outdata' + caseno}>출력</label>
      </div>
      <div>
        <textarea
          ref={outputRef}
          style={{
            width: '100%',
            minHeight: '50px',
            marginBottom: '20px',
            overflow: 'hidden',
            resize: 'none',
          }}
          id={'outdata' + caseno}
          name={'outdata' + caseno}
          value={outputValue}
          onChange={handleOutputChange}
        />
      </div>
    </div>
  );
}
