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
    let editorContent = writtenCode;
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
          const resultString = dataArray.map((item: any) => item.result).join('\n\n');
          console.log(resultString);
          dispatch(setReturnCall(resultString));
        });
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
