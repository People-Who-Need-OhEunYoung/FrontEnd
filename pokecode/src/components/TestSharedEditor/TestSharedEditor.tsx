import React, { useEffect, useRef } from 'react';
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
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { language } = useSelector((state: RootState) => state.codecaller);

  useEffect(() => {
    console.log(writtenCode);
  }, [writtenCode]);

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
        mode: language,
        lineNumbers: true,
        spellcheck: true,
        autocorrect: true,
        autoCloseBrackets: true, // 자동 괄호 닫기
        matchBrackets: true, // 괄호 매칭
        showHint: true, // 자동 완성 힌트
        extraKeys: {
          'Ctrl-Space': 'autocomplete', // 자동 완성 키 설정
        },
      });
      //setEditor(editor);

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
