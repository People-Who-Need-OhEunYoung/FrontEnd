import { DesignedButton1 } from '../DesignedButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWordBalloon, setReturnAiCall } from '../../store/codeCallerReducer';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CodeAIButton = ({
  width = '190px',
  fontSize = '1em',
  marginRight = '10px',
}) => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const dispatch = useDispatch();
  const location = useLocation();

  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  // let controller = new AbortController();
  // let signal = controller.signal;
  const controllerRef = useRef<AbortController | null>(null);

  // 프론트 AI 피드백 호출
  const handleAI = async () => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;
    dispatch(setReturnAiCall('로딩중....'));
    const editorContent = writtenCode;
    try {
      await callApi(id, editorContent, signal);
    } catch (error) {
      console.error('AI 요청 과정 에러 발생 : ', error);
    }
  };

  async function callApi(
    problemNumber: string,
    codedata: string,
    signal: AbortSignal
  ) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_APP_AI}`,
      },
      body: JSON.stringify({
        messages: [
          {
            content: 'You are a helpful assistant',
            role: 'system',
          },
          {
            content: `백준 ${problemNumber}번 문제를 풀고있고, ${codedata}\n 위의 코드가 지금 현재 내 코드야
            이 문제를 푸는데 내 코드에 문법적이나 논리적인 오류가 있으면 5줄 이내로 짧게 설명해줘
             `,
            role: 'user',
          },
        ],
        model: 'deepseek-coder',
        frequency_penalty: 0,
        max_tokens: 2048,
        presence_penalty: 0,
        stop: null,
        stream: true,
        temperature: 0,
        top_p: 1,
        logprobs: false,
        top_logprobs: null,
      }),
      signal,
    };

    try {
      const response: any = await fetch(
        'https://api.deepseek.com/chat/completions',
        options
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        console.log('시그널:', signal.aborted);
        if (signal.aborted) {
          console.log('Request aborted by user');
          break;
        }
        if (done) {
          break;
        }
        const parts = decoder
          .decode(value, { stream: true })
          .split('data: ')
          .filter((part) => part.trim() !== '')
          .map((item) => {
            try {
              return JSON.parse(item).choices[0].delta.content;
            } catch (error: any) {
              console.log('Error parsing JSON:', error.message);
              console.log('Invalid JSON part:', item);
              return ''; // 파싱 실패 시 빈 문자열 반환
            }
          })
          .join('');
        result += parts;
        console.log(result);
        dispatch(setReturnAiCall(result));
      }

      console.log('Response has ended.'); // 응답 종료 로그
      console.log(result); // 전체 응답 결과

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('AI 에러가 발생했습니다 : ', error); // 에러 처리
      }
      return 'AI 에러가 발생했습니다 : ' + error;
    }
  }

  const handleCancel = () => {
    if (controllerRef.current !== null) {
      controllerRef.current.abort();
    }
    console.log('can cancle-------------------');
  };

  useEffect(() => {
    // 라우터 변경 시 요청 취소
    dispatch(setWordBalloon(false));

    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      handleCancel();
    };
  }, [location]);

  return (
    <>
      <DesignedButton1
        className="submit-button"
        onClick={() => {
          handleCancel();
          dispatch(setWordBalloon(true));
          dispatch(setReturnAiCall(''));
          handleAI();
        }}
        style={{
          margin: '0',
          width: width,
          fontSize: fontSize,
          marginRight: marginRight,
        }}
      >
        AI 피드백
      </DesignedButton1>
    </>
  );
};
export default CodeAIButton;
