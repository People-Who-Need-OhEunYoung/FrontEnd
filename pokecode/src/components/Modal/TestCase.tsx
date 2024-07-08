import { useState } from 'react';

export default function TestCase({ caseno, inputdata, outputdata }: any) {
  const [inputValue, setInputValue] = useState(inputdata);
  const [outputValue, setOutputValue] = useState(outputdata);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResizeTextarea(e.target);
  };

  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputValue(e.target.value);
    autoResizeTextarea(e.target);
  };

  const autoResizeTextarea = (textarea: any) => {
    textarea.style.height = 'auto'; // 기존 높이를 초기화
    textarea.style.height = textarea.scrollHeight + 'px'; // 새로운 높이를 scrollHeight로 설정
  };

  return (
    <div
      style={{
        width: '80%',
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      <div style={{ fontWeight: 'bold', padding: '0 0 10px' }}>
        테스트케이스{caseno}
      </div>
      <div style={{ textAlign: 'left' }}>
        <label htmlFor={'indata' + caseno}>입력</label>
      </div>
      <div>
        <textarea
          style={{ width: '100%', overflow: 'hidden' }}
          id={'indata' + caseno}
          name={'indata' + caseno}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div style={{ textAlign: 'left' }}>
        <label htmlFor={'outdata' + caseno}>출력</label>
      </div>
      <div>
        <textarea
          style={{ width: '100%', marginBottom: '20px' }}
          id={'outdata' + caseno}
          name={'outdata' + caseno}
          value={outputValue}
          onChange={handleOutputChange}
        />
      </div>
    </div>
  );
}
