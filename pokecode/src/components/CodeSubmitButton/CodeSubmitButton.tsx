import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setReturnCall } from '../../store/codeCallerReducer';
import { SubmitCode } from '../../utils/api/api';
import { useState } from 'react';

const CodeSubmitButton = ({ evolEvent, coinEvent }: any) => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { elapsedTime, limitTime } = useSelector(
    (state: RootState) => state.timer
  );
  const dispatch = useDispatch();
  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const handleInit = () => {
    dispatch(setReturnCall(''));
  };

  // const handleSubmit = async () => {
  //   try {
  //     const res = await SubmitCode(writtenCode, id, elapsedTime, limitTime);
  //     dispatch(setReturnCall(res.data));
  //     if (res.isCorrect == '1') setIsSuccessModalOpen(true);
  //     else setIsFailModalOpen(true);
  //     return res;
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handleRun = async () => {
    const editorContent = writtenCode || ' ';
    try {
      const res = await SubmitCode(writtenCode, id, elapsedTime, limitTime);
      if (res.evolutionPoketmon) {
        let evol = res.evolutionPoketmon;
        for (let i = 0; i < evol.length; i++)
          setTimeout(() => {
            evolEvent(evol[i].idx);
          }, 20000 * i + 1000);
      }
      if (res.legendPoketmon1) {
        setTimeout(() => {
          coinEvent(res.legendPoketmon1);
          if (res.legendPoketmon2) {
            setTimeout(() => {
              coinEvent(res.legendPoketmon2);
            }, 6100);
          }
        }, 1000);
      }
      dispatch(setReturnCall(res.data));
      if (res.isCorrect == '1') setIsSuccessModalOpen(true);
      else setIsFailModalOpen(true);

      // return dataArray.every((item: any) => item.correct);
      return res;
    } catch (error) {
      console.error('테스트 케이스 과정 에러 발생 : ', error);
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
          handleRun();
        }}
        style={{
          margin: '0',
          width: '190px',
          fontSize: '1em',
          marginRight: '10px',
        }}
      >
        제출하기
      </DesignedButton1>
    </>
  );
};

export default CodeSubmitButton;
