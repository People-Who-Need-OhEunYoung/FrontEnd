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

  const elements = document.querySelectorAll('.remote-caret');

  // userInfo().then((res)=>{
  //   const allStates = provider.awareness.getStates();
  //   console.log("다른사람들 상태:", allStates);
  // })

  // useEffect(()=>{
  //   console.log("몬가 바뀜!");
  // },[editor])

  elements.forEach((element) => {
    const childElement = element.querySelector('div');
    console.log("자식 요소:", childElement); // 각 <span> 요소의 자식 <div> 요소를 출력합니다.
  });

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
    if (editorContainerRef.current && pokemonId !== 0) {
      if (editor == null) {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          'wss://api.poke-code.com:3333/room/?roomId=${roomId}',
          `codemirror_${roomId}`,
          ydoc
        );

        provider.awareness.on('update', () => {
          const allStates = provider.awareness.getStates();
          allStates.forEach((state, key) => {
            if (state.user && state.user.name) {
              console.log(`User ID: ${key}, Name: ${state.user.name}, pokemon:${state.user.pokemonid}`);

              const elements = document.querySelectorAll('.remote-caret');

              elements.forEach((element) => {
                const childElement = element.querySelector('div');
                // console.log("자식 요소:", childElement); // 각 <span> 요소의 자식 <div> 요소를 출력합니다.
                if (childElement !== null && state.user.name == childElement.textContent) {
                  (element as HTMLElement).style.background =
                    `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${state.user.pokemonid}.gif) no-repeat`;
                    // console.log("발동!");
                  (element as HTMLElement).style.backgroundSize = 'contain';
                }
              });

            }
          });
        });

        userInfo().then((res) => {
          provider.awareness.setLocalStateField('user', {
            color: 'white',
            name: res.nickName,
            pokemonid: pokemonId
          });
          const allStates = provider.awareness.getStates();
          console.log("다른사람들 상태:", allStates);
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

        return () => {
          binding.destroy();
          provider.disconnect();
        };
      }
    }
  }, [pokemonId]);
  return (
      <div ref={editorContainerRef} className="editor-container"></div>
  );
};

export default TestSharedEditor;
