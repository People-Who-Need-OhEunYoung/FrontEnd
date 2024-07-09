import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/theme/dracula.css';
import './TestEditor.css';
import { DesignedButton1 } from '../DesignedButton';

const TestEditor: React.FC = (id: any) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const [testcaseResult, setTestcaseResult] = useState('');
  const [sequence, setSequence] = useState<string>('');
  // 한글자씩 글자를 추가할 빈문자열 변수 sequence를 선언합니다.
  const [textCount, setTextCount] = useState<number>(0);
  // 현재까지 타이핑된 문자열의 위치(인덱스)를 나타내는 변수 textCount를 선언합니다.
  const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);
  // 모든 문자열이 타이핑된 후 일시정지인지 아닌지 여부를 나타내는 변수를 선언합니다.

  if (editorContainerRef.current) {
    if (editor == null) {
      const cmEditor = CodeMirror(editorContainerRef.current, {
        theme: 'dracula',
        mode: 'python',
        lineNumbers: true,
      });
      setEditor(cmEditor);
    }

    //---------- 실시간으로 에디터 변경사항이 생기면 바로 서버에게 전송하는 로직 폴리싱 ------------//
    // const handleChange = useRef((instance: any, changeObj: any) => {
    //   const editedContent = instance.getValue();
    //   // Fetch를 사용하여 서버로 변경된 내용 전송
    //   fetch('/problem/editor-content', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ content: editedContent })
    //   })
    //   .then(response => response.json())
    //   .then(data => console.log('Data sent successfully', data))
    //   .catch(error => console.error('Error sending data:', error));
    // });
    //  // CodeMirror 에디터에 Change 이벤트 리스너를 추가, 해당 리스너는 에디터 내용이 변경될 때마다 호출
    //  editor.on('change', handleChange.current);
    // return () => {
    //   //editor.off('change', handleChange.current);  // 이벤트 리스너를 제거할 때 핸들러 함수를 함께 제공
    // };
  }
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTypingPaused) {
        clearInterval(typingInterval);
      }

      if (textCount >= testcaseResult.length) {
        //text length 초과 시 undefind가 출력되는 것을 방지
        setIsTypingPaused(true);
        return;
      }

      const nextChar = testcaseResult[textCount];
      setSequence((prevSequence) => prevSequence + nextChar);

      if (nextChar === '\n') {
        setTextCount((prevCount) => prevCount + 1);
      } else {
        setTextCount((prevCount) => prevCount + 1);
      }
    }, 50); // 설정한 초만큼 일정한 간격마다 실행된다

    return () => clearInterval(typingInterval); //컴포넌트가 마운트 해제되거나, 재렌더링 될 때마다 setInterval를 정리하는 함수를 반환함.
  }, [testcaseResult, textCount, isTypingPaused]);
  const handleSubmit = async () => {
    setSequence('');
    setTextCount(0);
    if (editor) {
      const editorContent = editor.getValue();
      try {
        const response = await fetch('http://52.79.197.126:3000/runCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiSldUIiwiaWQiOiJ5c2s5NTI2IiwiaWF0IjoxNzIwNTA2MzgzLCJleHAiOjE3MjA1OTI3ODMsImlzcyI6InlzayJ9.NUPm6Jo0dtRrhmuSz-WJHEJ31r_Z138RHppLZCKq9Wk',
          },
          body: JSON.stringify({ code: editorContent, bojNumber: id }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setTestcaseResult(data.data);
        console.log(data);
      } catch (error) {
        console.error('제출과정 에러 발생', error);
      }
    }
  };

  return (
    <>
      <div
        style={{ height: '80%' }}
        ref={editorContainerRef}
        className="editor-container"
      ></div>
      <div
        style={{
          background: 'yellow',
          width: '100%',
          height: '20%',
          overflow: 'hidden',
        }}
      >
        <pre
          style={{
            height: '100%',
            background: '#000',
            color: 'white',
            overflow: 'auto',
          }}
        >
          {sequence}
        </pre>
        <DesignedButton1
          className="submit-button"
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            margin: '0',
            width: '190px',
            fontSize: '1em',
            bottom: '-55px',
            marginRight: '10px',
            right: '200px',
            zIndex: 999999,
          }}
          color="#a62df1"
        >
          테스트케이스 실행
        </DesignedButton1>
        <DesignedButton1
          className="submit-button"
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            margin: '0',
            width: '190px',
            fontSize: '1em',
            bottom: '-55px',
            marginRight: '10px',
            right: '0',
            zIndex: 999999,
          }}
          color="#a62df1"
        >
          제출하기
        </DesignedButton1>
      </div>
    </>
  );
};

export default TestEditor;
