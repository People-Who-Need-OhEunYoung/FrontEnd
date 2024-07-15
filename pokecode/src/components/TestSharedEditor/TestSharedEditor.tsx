import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';

import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import * as Y from 'yjs';
import './TestSharedEditor.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const TestSharedEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  
  const {writtenCode} = useSelector((state: RootState) => state.probinfo);

  useEffect(()=> {
    console.log(writtenCode);
  },[writtenCode]);


  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'wss://api.poke-code.com',
      'codemirror1',
      ydoc
    );

    const yText = ydoc.getText('codemirror');

    // 기본 텍스트를 설정합니다.
    yText.insert(0, writtenCode);

    if (editorContainerRef.current) {
      const editor = CodeMirror(editorContainerRef.current, {
        theme: 'dracula',
        mode: 'javascript',
        lineNumbers: true,
      });
      
      setEditor(editor);

      const binding = new CodemirrorBinding(yText, editor, provider.awareness);
      console.log(provider.awareness.clientID);
      // 사용자 ID를 표시하는 로직 추가
      //   if (userIdRef.current) {
      //     userIdRef.current.innerText = `User ID: ${provider.awareness.clientID}`;
      //   }

      return () => {
        binding.destroy();
        provider.disconnect();
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

export default TestSharedEditor;
