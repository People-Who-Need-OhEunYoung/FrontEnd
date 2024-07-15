import { DesignedButton1 } from '../DesignedButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWordBalloon } from '../../store/codeCallerReducer';
import { setReturnAiCall } from '../../store/codeCallerReducer';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CodeAIButton = () => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const [abortController, setAbortController] =
    useState<AbortController | null>();
  const dispatch = useDispatch();
  const location = useLocation();

  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  // 프론트 AI 피드백 호출
  const handleAI = async () => {
    handleCancel();
    dispatch(setReturnAiCall('로딩중....'));
    const editorContent = writtenCode;

    const controller = new AbortController();
    setAbortController(controller);

    try {
      await callApi(id, editorContent, controller.signal);
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
            content: `${codedata}\n백준 ${problemNumber}번 문제에 대한 코드인데, 코드는 제외하고 정답여부 체크해서 반드시 5줄 안으로 구체적인 피드백 부탁해`,
            role: 'user',
          },
        ],
        model: 'deepseek-coder',
        frequency_penalty: 0,
        max_tokens: 2048,
        presence_penalty: 0,
        stop: null,
        stream: true,
        temperature: 1,
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
    } catch (error) {
      console.log('AI 에러가 발생했습니다 : ', error); // 에러 처리
      return 'AI 에러가 발생했습니다 : ' + error;
    }
  }

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  useEffect(() => {
    // Function to handle cleanup
    return () => {
      dispatch(setWordBalloon(false));
    };
  }, [location]);

  useEffect(() => {
    // Function to handle cleanup
    const cleanup = () => {
      if (abortController) {
        abortController.abort();
        setAbortController(null);
      }
    };
    return cleanup;
  }, [location]);

  return (
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
        width: '190px',
        fontSize: '1em',
        marginRight: '10px',
      }}
      color="#a62df1"
    >
      AI 피드백
    </DesignedButton1>
  );
};
export default CodeAIButton;
