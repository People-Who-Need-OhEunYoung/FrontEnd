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

  const { pokemonId } = useSelector((state: RootState) => state.userinfo);

  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = (err) => reject(err);
    });
  };

  const updateCaretBackground = async (allStates) => {
    const elements = document.querySelectorAll('.remote-caret');
    for (const element of elements) {
      const childElement = element.querySelector('div');
      for (const [key, state] of allStates.entries()) {
        if (state.user && state.user.name === childElement?.textContent) {
          console.log('포켓몬아이디~!:',state.user.pokemonid);
          try {
            const imgUrl = await loadImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${state.user.pokemonid}.gif`);
            (element as HTMLElement).style.background = `url(${imgUrl}) no-repeat`;
            console.log("발동!");
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
    if (!roomId) {
      console.error('roomId가 존재하지 않음');
      return;
    }
    if (editorContainerRef.current ) {
      if (editor == null) {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          `wss://api.poke-code.com:3333/room/?roomId=${roomId}`,
          `codemirror_${roomId}`,
          ydoc
        );

        provider.awareness.on('update', async () => {
          const allStates = provider.awareness.getStates();
          console.log("여기1");
          await updateCaretBackground(allStates);
        });

        userInfo().then(async (res) => {
          provider.awareness.setLocalStateField('user', {
            color: 'white',
            name: res.nickName,
            pokemonid: pokemonId
          });
          const allStates = provider.awareness.getStates();
          console.log("여기2");
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

        const observer = new MutationObserver(async (mutations) => {
          const allStates = provider.awareness.getStates();
          console.log("여기3");
          await updateCaretBackground(allStates);
        });

        const config = { childList: true, subtree: true };
        observer.observe(editorContainerRef.current, config);

        const cleanup = () => {
          console.log('컴포넌트 언마운트');
          alert("언마운트!");
          setEditor(null);
          binding.destroy();
          provider.disconnect();
          observer.disconnect();
        };
  
        window.addEventListener('beforeunload', cleanup);


      }
    }

  }, []);

  return (
      <div ref={editorContainerRef} className="editor-container"></div>
  );
};

export default TestSharedEditor;