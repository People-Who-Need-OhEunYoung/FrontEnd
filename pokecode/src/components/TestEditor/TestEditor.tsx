import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';

import './TestEditor.css';

const TestEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);

  useEffect(() => {
    if (editorContainerRef.current) {
      const cmEditor = CodeMirror(editorContainerRef.current, {
        theme: 'dracula',
        mode: 'javascript',
        lineNumbers: true,
      });

      setEditor(cmEditor);

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
  }, []);

  const handleSubmit = async () => {
    if (editor) {
      const editorContent = editor.getValue();
      try {
        const response = await fetch('http://52.79.197.126:3000/runCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiSldUIiwiaWQiOiJ5c2s5NTI2IiwiaWF0IjoxNzIwNTA2MzgzLCJleHAiOjE3MjA1OTI3ODMsImlzcyI6InlzayJ9.NUPm6Jo0dtRrhmuSz-WJHEJ31r_Z138RHppLZCKq9Wk'
          },
          body: JSON.stringify({ code: editorContent, bojNumber : '0000' }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('제출과정 에러 발생', error);
      }
    }
  };

  return (
    <>
      <div ref={editorContainerRef} className="editor-container"></div>
      <button onClick={handleSubmit} className="submit-button">Submit</button>
    </>
  );
};

export default TestEditor;
