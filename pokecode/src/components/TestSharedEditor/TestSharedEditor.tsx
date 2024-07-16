import { useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
// 임시 주석 처리
// import * as Y from 'yjs';
// import { CodemirrorBinding } from 'y-codemirror';
// import { WebsocketProvider } from 'y-websocket';
// import CodeMirror from 'codemirror';
import './TestSharedEditor.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// YJS 재 테스트
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from 'y-webrtc';
import CodeMirror from 'codemirror';

const TestSharedEditor = ({ editorRoom = 'notice' }) => {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { language } = useSelector((state: RootState) => state.codecaller);
  const { userNickname } = useSelector((state: RootState) => state.userinfo);

  useEffect(() => {
    document.body.onload = addElement;
    function addElement() {
      // create a new div element
      let newDiv = document.createElement('div');
      // and give it some content
      setTimeout(() => {
        let newContent = document.createTextNode(editorRoom + userNickname);
        // add the text node to the newly created div
        newDiv.appendChild(newContent);
      }, 1000);

      // add the newly created element and its content into the DOM
      var currentDiv = document.getElementById('div1');
      document.body.insertBefore(newDiv, currentDiv);
    }
  });

  useEffect(() => {
    if (editor != null) editor.setOption('mode', language);
  }, [language]);

  useEffect(() => {
    if (editorContainerRef.current) {
      if (editor == null) {
        const ydoc = new Y.Doc();
        const provider = new WebrtcProvider('wss://api.poke-code.com', ydoc);
        setTimeout(() => {
          provider.awareness.setLocalStateField('user', {
            color: 'white',
            name: userNickname,
          });
        }, 5000);

        const yText = ydoc.getText('codemirror');

        // 기본 텍스트를 설정합니다.
        yText.insert(0, writtenCode);
        const seteditor = CodeMirror(editorContainerRef.current, {
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
        setEditor(seteditor);

        const binding = new CodemirrorBinding(
          yText,
          seteditor,
          provider.awareness
        );
        console.log(provider.awareness.clientID);

        return () => {
          binding.destroy();
          provider.disconnect();
        };
      }
    }
  }, []);

  return (
    <>
      <div ref={editorContainerRef} className="editor-container"></div>
    </>
  );
};

export default TestSharedEditor;
