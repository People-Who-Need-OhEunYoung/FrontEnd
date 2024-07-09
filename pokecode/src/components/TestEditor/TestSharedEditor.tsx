import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';

import './TestSharedEditor.css';

const TestEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {


    if (editorContainerRef.current) {
      const editor = CodeMirror(editorContainerRef.current, {
        theme: 'dracula',
        mode: 'javascript',
        lineNumbers: true,
      });

      const handleChange = useRef((instance: any, changeObj: any) => {
        const editedContent = instance.getValue();
        // Fetch를 사용하여 서버로 변경된 내용 전송
        fetch('/problem/editor-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editedContent })
        })
        .then(response => response.json())
        .then(data => console.log('Data sent successfully', data))
        .catch(error => console.error('Error sending data:', error));
      });
       // CodeMirror 에디터에 Change 이벤트 리스너를 추가, 해당 리스너는 에디터 내용이 변경될 때마다 호출
       editor.on('change', handleChange.current);
      return () => {
        editor.off('change', handleChange.current);  // 이벤트 리스너를 제거할 때 핸들러 함수를 함께 제공
      };
    }
  }, []);

  return (
    <>
      {/* <div ref={userIdRef} className="user-id"></div>{' '} */}
      <div ref={editorContainerRef} className="editor-container"></div>
    </>
  );
};

export default TestEditor;
