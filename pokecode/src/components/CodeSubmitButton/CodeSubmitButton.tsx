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

  const handleRun = async () => {
    //const editorContent = writtenCode || ' ';
    try {

      const response = await fetch(`https://api.poke-code.com/submit`, {
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
          testCase: [],
        }),
      });
      const data = await response.json();
      const dataArray = data.result.results;
      const isCorrect = dataArray.every((item: any) => item.correct);

      const res = await SubmitCode(
        editorContent,
        id,
        elapsedTime,
        limitTime,
        isCorrect
      );

      if (res.evolutionPoketmon) {
        let evol = res.evolutionPoketmon;
        for (let i = 0; i < evol.length; i++) {
          setTimeout(() => {
            evolEvent(evol[i].idx);
          }, 22000 * i + 1000);

      } else if (res.legendPoketmon) {

        setTimeout(() => {
          coinEvent(res.legendPoketmon[0]);
          if (res.legendPoketmon) {
            setTimeout(() => {
              coinEvent(res.legendPoketmon[1]);
            }, 6100);
          }
        }, 1000);
      }

      if (isCorrect == '1') setIsSuccessModalOpen(true);

      else setIsFailModalOpen(true);

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
