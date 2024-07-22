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

const TestSharedEditor = () => {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { writtenCode } = useSelector((state: RootState) => state.probinfo);
  const { language } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();
  const roomId = localStorage.getItem('roomId');

  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = (err) => reject(err);
    });
  };

  const updateCaretBackground = async (allStates: any) => {
    const elements = document.querySelectorAll('.remote-caret');
    for (const element of elements) {
      const childElement = element.querySelector('div');
      for (const [_, state] of allStates.entries()) {
        if (state.user && state.user.name === childElement?.textContent) {
          try {
            const imgUrl = await loadImage(`/${state.user.pokemonid}.gif`);
            (
              element as HTMLElement
            ).style.background = `url(${imgUrl}) no-repeat`;
            (element as HTMLElement).style.backgroundSize = 'contain';
          } catch (error) {
            console.error('Image load error:', error);
          }
        }
      }
    }
  };

  useEffect(() => {
    dispatch(setWrittenCode(editorContent));
  }, [editorContent]);

  useEffect(() => {
    if (editor != null) editor.setOption('mode', language);
  }, [language]);

  useEffect(() => {
    // pokemonId = useSelector((state: RootState) => state.userinfo.pokemonId);
    if (!roomId) {
      console.error('roomId가 존재하지 않음');
      return;
    }
    if (editorContainerRef.current) {
      if (editor == null) {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          `wss://api.poke-code.com:3333/room/?roomId=${roomId}`,
          `codemirror_${roomId}`,
          ydoc
        );

        provider.awareness.on('update', async () => {
          const allStates = provider.awareness.getStates();
          await updateCaretBackground(allStates);
        });

        provider.awareness.on('change', ({ added, removed }: any) => {
          if (added.length > 0) {
            // 새로운 사용자가 접속함
            console.log('New user connected:', added);
            // 필요한 처리 작업 수행
          }

          if (removed.length > 0) {
            // 사용자가 접속을 끊음
            console.log('User disconnected:', removed);
            // 필요한 처리 작업 수행
          }
        });

        // 내 정보 등록
        userInfo().then(async (res) => {
          console.log('정보등록!!!!');
          provider.awareness.setLocalStateField('user', {
            color: 'white',
            name: res.nick_name,
            pokemonid: res.cur_poke_id,
          });
          const allStates = provider.awareness.getStates();
          await updateCaretBackground(allStates);
        });

        const yText = ydoc.getText(`codemirror_${roomId}`);

        yText.insert(0, writtenCode);
        const seteditor = CodeMirror(editorContainerRef.current, {
          theme: 'dracula',
          mode: language,
          lineNumbers: true,
          spellcheck: true,
          autocorrect: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          showHint: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
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

        //다른사람 움직이면 반응
        const observer = new MutationObserver(async () => {
          const allStates = provider.awareness.getStates();
          await updateCaretBackground(allStates);
        });

        const config = { childList: true, subtree: true };
        observer.observe(editorContainerRef.current, config);

        return () => {
          console.log('정보 해지');
          setEditor(null);
          binding.destroy();
          provider.disconnect();
          observer.disconnect();
        };
      }
    }
  }, []);
  return (
    <div
      style={{ boxSizing: 'border-box', padding: '5px' }}
      ref={editorContainerRef}
      className="editor-container"
    ></div>
  );
};

export default TestSharedEditor;
