import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';
import { SubmitCode } from '../../utils/api/api';
import { useState } from 'react';

const CodeSubmitButton = () => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const dispatch = useDispatch();
  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const handleInit = () => {
    dispatch(setReturnCall(''));
  };

  const handleSubmit = async () => {
    try {
      const res = await SubmitCode(writtenCode, id);
      dispatch(setReturnCall(res.data));
      if (res.isCorrect == '1') setIsSuccessModalOpen(true);
      else setIsFailModalOpen(true);
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Modal
        component={3}
        on={isSuccessModalOpen}
        event={setIsSuccessModalOpen}
      ></Modal>
      <Modal
        component={4}
        on={isFailModalOpen}
        event={setIsFailModalOpen}
      ></Modal>
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
