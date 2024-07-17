import { DesignedButton1 } from '../DesignedButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';

const CodeRunButton = () => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);

  const dispatch = useDispatch();

  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  const handleInit = () => {
    dispatch(setReturnCall(''));
  };
  
  const handleSubmit = async () => {
    const editorContent = writtenCode;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code: editorContent, bojNumber: id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setReturnCall(data.data));
      console.log(data);
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
        color="#a62df1"
      >
        테스트케이스 실행
      </DesignedButton1>
    </>
  );
};

export default CodeRunButton;
