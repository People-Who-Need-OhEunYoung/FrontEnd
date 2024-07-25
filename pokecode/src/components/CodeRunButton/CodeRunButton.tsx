import { DesignedButton1 } from '../DesignedButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';

const CodeRunButton = () => {
  const { writtenCode, TestCases } = useSelector(
    (state: RootState) => state.probinfo
  );

  const { elapsedTime, limitTime } = useSelector(
    (state: RootState) => state.timer
  );

  const dispatch = useDispatch();

  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  const handleInit = () => {
    dispatch(setReturnCall(''));
  };

  type TestResult = {
    'cg-mem': string;
    time: string;
    expected_output: string;
    output: string;
    correct: boolean;
  };

  const handleSubmit = async () => {
    let editorContent = writtenCode || ' ';
    console.log('editorContent:', editorContent);
    if (!editorContent) {
      editorContent = ' ';
    }
    try {
      const response = await fetch(`http://192.168.1.18:3000/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: editorContent,
          lang: 'python',
          bojNumber: id,
          elapsed_time: elapsedTime,
          limit_time: limitTime,
          testCase: TestCases,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const dataArray = data.result.results;
          // 데이터 정제 로직 추가
          if (TestCases) {
            const formattedResults = dataArray
              .map((item: TestResult, index: number) => {
                // TestCases에서 input_case 가져오기 (optional chaining 사용)
                const inputCase =
                  TestCases[index]?.input_case || 'No input case available';

                return (
                  `[Test ${index + 1}]\n` +
                  '------------------------------------------\n' +
                  `Memory: ${item['cg-mem']}KB | Time: ${item.time}s\n` +
                  '------------------------------------------\n' +
                  `Input >\n` +
                  `${inputCase}` +
                  `Expected Output > \n` +
                  ` ${item.expected_output}\n` +
                  `Output > ${item.output}\n` +
                  `Result > ${item.correct ? 'Success!!' : 'Fail!!'}`
                );
              })
              .join('\n\n');
            console.log(formattedResults);
            dispatch(setReturnCall(formattedResults));
          } else {
            console.error('TestCases is undefined.');
          }
        });
    } catch (error) {
      console.error('테스트 케이스 과정 에러 발생 : ', error);
    }

    //   const response = await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     body: JSON.stringify({
    //       code: editorContent,
    //       bojNumber: id,
    //       elapsed_time: elapsedTime,
    //       limit_time: limitTime,
    //       testCase: TestCases,
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Error: ${response.statusText}`);
    //   }

    //   const data = await response.json();
    //   dispatch(setReturnCall(data.data2));
    //   console.log(data.data2);

    // } catch (error) {
    //   console.error('테스트 케이스 과정 에러 발생 : ', error);
    // }
  };

  return (
    <>
      <DesignedButton1
        onClick={() => {
          handleInit();
          handleSubmit();
        }}
        style={{
          margin: '0',
          width: '190px',
          fontSize: '1em',
          marginRight: '10px',
        }}
      >
        테스트케이스 실행
      </DesignedButton1>
    </>
  );
};

export default CodeRunButton;
