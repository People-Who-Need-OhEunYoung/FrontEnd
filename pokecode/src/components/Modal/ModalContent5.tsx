import { useState } from 'react';
import { DesignedButton1 } from '../DesignedButton';
import TestCase from './TestCase';
let testdata = [
  {
    caseno: '1',
    indata: '1',
    outdata: '1',
  },
  {
    caseno: '2',
    indata: '1',
    outdata: '1',
  },
];
const ModalContent5 = () => {
  const [casecount, setCasecount] = useState<number>(testdata.length);
  const addTestCase = () => {
    testdata.push({
      caseno: (testdata.length + 1).toString(),
      indata: '',
      outdata: '',
    });
    setCasecount(testdata.length + 1);
  };
  const removeTestCase = () => {
    testdata.pop();
    setCasecount(testdata.length - 1);
  };
  return (
    <div style={{ width: '800px' }}>
      <div style={{ height: '400px', overflow: 'auto' }}>
        {testdata.map((testCase: any, index: any) => (
          <TestCase
            key={index} // key prop은 각각의 컴포넌트가 고유하게 식별되도록 돕습니다.
            caseno={testCase.caseno}
            inputdata={testCase.indata}
            outputdata={testCase.outdata}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
        }}
      >
        <DesignedButton1
          style={{ margin: '0 10px 20px', width: '29%' }}
          color="cadetblue"
          onClick={() => addTestCase()}
        >
          테스트케이스 추가
        </DesignedButton1>
        <DesignedButton1
          style={{ margin: '0 10px 20px', width: '29%' }}
          color="cadetblue"
          onClick={() => removeTestCase()}
        >
          테스트케이스 제거
        </DesignedButton1>
      </div>
    </div>
  );
};

export default ModalContent5;
