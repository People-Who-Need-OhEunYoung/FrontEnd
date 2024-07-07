import { useState } from 'react';

export default function TestCase({ caseno, inputdata, outputdata }: any) {
  const [inputValue, setInputValue] = useState(inputdata);
  const [outputValue, setOutputValue] = useState(outputdata);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOutputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutputValue(e.target.value);
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
        <input
          style={{ width: '100%' }}
          type="text"
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
        <input
          style={{ width: '100%', marginBottom: '20px' }}
          type="text"
          id={'outdata' + caseno}
          name={'outdata' + caseno}
          value={outputValue}
          onChange={handleOutputChange}
        />
      </div>
    </div>
  );
}
