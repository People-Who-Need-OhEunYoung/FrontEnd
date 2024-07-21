import { ChangeEvent, useEffect, useState } from 'react';
import { DesignedButton1 } from '../DesignedButton';
import TestCase from './TestCase';

import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setTestCases } from '../../store/problemSlice';

type TestDataType = {
  input_case: string;
  output_case: string;
};

const ModalContent5 = () => {
  const [testCase, setTestCase] = useState<TestDataType[]>([]);
  const dispatch = useDispatch();

  const problemDetails = useSelector(
    (state: RootState) => state.probinfo.problemDetails
  );

  const addTestCase = () => {
    const newTestCase = {
      input_case: '',
      output_case: '',
    };
    setTestCase([...testCase, newTestCase]);
  };

  const removeTestCase = () => {
    if (testCase.length > 0) {
      setTestCase(testCase.slice(0, testCase.length - 1)); // 마지막 요소를 제외하고 새 배열을 생성
      dispatch(setTestCases(testCase.slice(0, testCase.length - 1)));
    }
  };

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setTestCase((prevTestCases) =>
      prevTestCases.map((test, idx) => {
        if (idx === index - 1) {
          // index가 1부터 시작하므로 -1 해줍니다.
          return { ...test, input_case: newValue };
        }
        return test;
      })
    );
  };

  const handleOutputChange = (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setTestCase((prevTestCases) =>
      prevTestCases.map((test, idx) => {
        if (idx === index - 1) {
          return { ...test, output_case: newValue };
        }
        return test;
      })
    );
  };

  useEffect(() => {
    console.log('testCase: ', testCase);
    dispatch(setTestCases(testCase));
  }, [testCase]);

  useEffect(() => {
    if (problemDetails?.samples) {
      // problemDetails에서 samples가 있을 경우에만 실행
      const formattedSamples = problemDetails.samples.map((sample) => ({
        input_case: sample.input,
        output_case: sample.output,
      }));
      setTestCase(formattedSamples); // testCase 상태를 업데이트
    }
  }, [problemDetails?.samples]);

  return (
    <div style={{ width: '450px' }}>
      <div style={{ height: '300px', overflow: 'auto' }}>
        {testCase.length > 0 &&
          testCase.map((testdata: any, index: any) => (
            <TestCase
              key={index} // key prop은 각각의 컴포넌트가 고유하게 식별되도록 돕습니다.
              caseno={index + 1}
              inputdata={testdata.input_case}
              outputdata={testdata.output_case}
              onInputChange={(e: any) => handleInputChange(index + 1, e)}
              onOutputChange={(e: any) => handleOutputChange(index + 1, e)}
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
          style={{ margin: '10px 10px 20px', width: '25%' }}
          onClick={() => addTestCase()}
          back_color="#38bdf8;"
        >
          추가
        </DesignedButton1>
        <DesignedButton1
          style={{ margin: '10px 10px 20px', width: '25%' }}
          onClick={() => removeTestCase()}
          back_color="#38bdf8;"
        >
          제거
        </DesignedButton1>
      </div>
    </div>
  );
};

export default ModalContent5;
