import { useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';
import CodeMirror from 'codemirror';
import './TestSharedEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { userInfo } from '../../utils/api/api';
import { setWrittenCode } from '../../store/problemSlice';

const TestSharedEditor = ({ editorRoom = 'notice' }) => {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { language } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();
  //우현변수start
  const roomId = localStorage.getItem('roomId');
  //우현변수end

  console.log(editorRoom);

  const element = document.querySelector('.remote-caret');
  if (element) {
    (element as HTMLElement).style.background =
      'url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/119.gif)';
    (element as HTMLElement).style.backgroundSize = 'contain';
  }

  useEffect(() => {
    // KHS 코드 리뷰방으로 이동을 위해 dispatch 작업
    dispatch(setWrittenCode(editorContent));
  }, [editorContent]);

  useEffect(() => {
    if (editor != null) editor.setOption('mode', language);
  }, [language]);

  useEffect(() => {
    //우현코드s
    if (!roomId) {
      console.error('roomId가 존재하지 않음');
      return;
    }
    //우현코드e
    if (editorContainerRef.current) {
      if (editor == null) {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          'wss://api.poke-code.com:3333/room/?roomId=${roomId}',
          `codemirror_${roomId}`,
          ydoc
        );
        userInfo().then((res) => {
          console.log(res.nickName);
          provider.awareness.setLocalStateField('user', {
            color: 'white',
            name: res.nickName,
          });
        });

        const yText = ydoc.getText(`codemirror_${roomId}`);

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

        seteditor.on('change', (instance) => {
          const editedContent = instance.getValue();
          setEditorContent(editedContent);
        });

        setEditor(seteditor);

        const binding = new CodemirrorBinding(
          yText,
          seteditor,
          provider.awareness
        );
        console.log(provider.awareness.clientID);

        return () => {
          alert("언마운트 됨");
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