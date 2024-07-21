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

  // useEffect(() => {
  //   console.log('TestCases', TestCases);
  //   console.log('elapsedTime', elapsedTime);
  //   console.log('limitTime', limitTime);
  // }, [TestCases]);

  const handleSubmit = async () => {
    const editorContent = writtenCode;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: editorContent,
          bojNumber: id,
          elapsed_time: elapsedTime,
          limit_time: limitTime,
          testCase: TestCases,
        }),
      });
      console.log('TestCases:', TestCases);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setReturnCall(data.data2));
      console.log(data.data2);
    } catch (error) {
      console.error('테스트 케이스 과정 에러 발생 : ', error);
    }
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
