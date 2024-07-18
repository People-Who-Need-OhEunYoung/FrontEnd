import { DesignedButton1 } from '../DesignedButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWordBalloon, setReturnAiCall } from '../../store/codeCallerReducer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CodeAIButton = () => {
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { wordBalloon } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();
  const location = useLocation();

  // PDG URL 파라미터 받기
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || '';

  let controller = new AbortController();
  let signal = controller.signal;

  // 프론트 AI 피드백 호출
  const handleAI = async () => {
    controller = new AbortController();
    signal = controller.signal;
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
            content: `${codedata}\n백준 ${problemNumber}번 문제에 대한 코드인데, 
            만약 작성한 코드가 없다면 "작성되지 않은 코드입니다" 라는 문구를 출력해주고, 
            작성된 코드가 있다면 해당 코드의 실행 결과가 정답일 경우, 긍정적인 피드백과 함께 문제 풀이의 핵심 부분을 설명하고,
            정답이 아닐 경우, 어느 부분을 고치면 좋을지 구체적이면서 길지 않은 피드백을 해줘. 피드백은 문어체로 해주고 코드를 직접적으로 알려주지마.
            그리고 "가독성 및 기타 피드백은 제외"하고 논리적인 오류에 대한 피드백만 줘. "작성된 코드가 있으므로, 해당 코드에 대한 피드백을 제공하겠습니다." 라는 
            말은 제외해줘.
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
  // async function callApi2(problemNumber: string, codedata: string) {
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${import.meta.env.VITE_APP_AI}`,
  //     },
  //     body: JSON.stringify({
  //       messages: [
  //         {
  //           content: 'You are a helpful assistant',
  //           role: 'system',
  //         },
  //         {
  //           content: `${codedata}\n백준 ${problemNumber}번 문제에 대한 코드인데, 현재 사용자가 작성중인 코드임을 감안하면서 직접적인 코드는 제외하고 반드시 1줄 가량의 짧은 피드백을 귀여운 말투로 해줘`,
  //           role: 'user',
  //         },
  //       ],
  //       model: 'deepseek-coder',
  //       frequency_penalty: 0,
  //       max_tokens: 2048,
  //       presence_penalty: 0,
  //       stop: null,
  //       stream: true,
  //       temperature: 1,
  //       top_p: 1,
  //       logprobs: false,
  //       top_logprobs: null,
  //     }),
  //     signal,
  //   };

  //   try {
  //     const response: any = await fetch(
  //       'https://api.deepseek.com/chat/completions',
  //       options
  //     );
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let result = '';

  //     while (true) {
  //       const { done, value } = await reader.read();

  //       if (done) {
  //         break;
  //       }
  //       const parts = decoder
  //         .decode(value, { stream: true })
  //         .split('data: ')
  //         .filter((part) => part.trim() !== '')
  //         .map((item) => {
  //           try {
  //             return JSON.parse(item).choices[0].delta.content;
  //           } catch (error: any) {
  //             console.log('Error parsing JSON:', error.message);
  //             console.log('Invalid JSON part:', item);
  //             return ''; // 파싱 실패 시 빈 문자열 반환
  //           }
  //         })
  //         .join('');
  //       result += parts;
  //       console.log(result);
  //       dispatch(setReturnAiCall(result));
  //     }
  //     setTimeout(() => {
  //       dispatch(setWordBalloon(false));
  //     }, 2000);
  //     console.log('Response has ended.'); // 응답 종료 로그
  //     console.log(result); // 전체 응답 결과

  //     return result;
  //   } catch (error: any) {
  //     if (error.name === 'AbortError') {
  //       console.log('Fetch aborted');
  //     } else {
  //       console.error('AI 에러가 발생했습니다 : ', error); // 에러 처리
  //     }
  //     return 'AI 에러가 발생했습니다 : ' + error;
  //   }
  // }

  const handleCancel = () => {
    controller.abort();
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

  // // callApi2를 15초마다 실행 15초 동안 코드 입력이 없는 경우 피드백
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!wordBalloon) {
  //       dispatch(setReturnAiCall(''));
  //       dispatch(setWordBalloon(true));
  //       callApi2(id, writtenCode);
  //     }
  //   }, 15000); // 15초 간격
  //   return () => {
  //     clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 취소
  //   };
  // }, [id, writtenCode, wordBalloon]); // 의존성 배열 설정

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
