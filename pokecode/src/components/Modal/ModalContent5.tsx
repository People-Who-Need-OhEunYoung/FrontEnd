import { useEffect, useState } from 'react';
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
  const [testCase, setTestCase] = useState<TestDataType[]>([]); // 테스트케이스 데이터를 저장할 배열
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

  const handleInputChange = ({ index, newValue }: any) => {
    const updatedTestCases = testCase.map((test, idx) => {
      if (idx === index - 1) {
        // index가 1부터 시작하므로 -1 해줍니다.
        return { ...test, input_case: newValue };
      }
      return test;
    });
    console.log('updatedTestCases', updatedTestCases);
    setTestCase(updatedTestCases);
  };

  const handleOutputChange = ({ index, newValue }: any) => {
    const updatedTestCases = testCase.map((test, idx) => {
      if (idx === index - 1) {
        return { ...test, output_case: newValue };
      }
      return test;
    });
    setTestCase(updatedTestCases);
  };

  useEffect(() => {
    console.log('testCase: ', testCase);
  }, [testCase]);

  useEffect(() => {
    if (problemDetails?.samples) {
      // problemDetails에서 samples가 있을 경우에만 실행
      const formattedSamples = problemDetails.samples.map((sample) => ({
        input_case: sample.input,
        output_case: sample.output,
      }));
      console.log(formattedSamples);
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
              onInputChange={handleInputChange}
              onOutputChange={handleOutputChange}
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
          style={{ margin: '0 10px 20px', width: '35%' }}
          color="cadetblue"
          onClick={() => addTestCase()}
        >
          테스트케이스 추가
        </DesignedButton1>
        <DesignedButton1
          style={{ margin: '0 10px 20px', width: '35%' }}
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
