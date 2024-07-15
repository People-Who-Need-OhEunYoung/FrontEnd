import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';

const CodeSubmitButton = () => {
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
      console.error('제출과정 에러 발생', error);
    }
  };

  return (
    <>
      <Modal></Modal>
      <DesignedButton1
        className="submit-button"
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
        제출하기
      </DesignedButton1>
    </>
  );
};

export default CodeSubmitButton;
