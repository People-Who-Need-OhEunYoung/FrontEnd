import { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';
import './TestEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWrittenCode } from '../../store/problemSlice';
import { setReturnCall } from '../../store/codeCallerReducer';

const TestEditor = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  // ------- 타이핑 출력 start ---------
  // 텍스트 결과 셋팅용
  const [testcaseResult, setTestcaseResult] = useState('');
  // 한글자씩 글자를 추가할 빈문자열 변수 sequence를 선언합니다.
  const [sequence, setSequence] = useState<string>('');
  // 현재까지 타이핑된 문자열의 위치(인덱스)를 나타내는 변수 textCount를 선언합니다.
  const [textCount, setTextCount] = useState<number>(0);
  // 모든 문자열이 타이핑된 후 일시정지인지 아닌지 여부를 나타내는 변수를 선언합니다.
  const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);
  // ------- 타이핑 출력 end ---------
  const [editorContent, setEditorContent] = useState('');
  const { isAcquireReview } = useSelector((state: RootState) => state.probinfo);
  const { returnCall, language } = useSelector(
    (state: RootState) => state.codecaller
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (editor != null) editor.setOption('mode', language);
  }, [language]);

  useEffect(() => {
    // PDG 테스트 케이스 리턴 메세지를 받도록 수정
    setSequence('');
    setTextCount(0);
    setTestcaseResult(returnCall);
  }, [returnCall]);

  useEffect(() => {
    // KHS 코드 리뷰방으로 이동을 위해 dispatch 작업
    dispatch(setWrittenCode(editorContent));
    // console.log(editorContent);
  }, [isAcquireReview, editorContent]);

  useEffect(() => {
    if (editorContainerRef.current) {
      if (editor == null && returnCall == '') {
        const cmEditor = CodeMirror(editorContainerRef.current, {
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

        cmEditor.on('change', (instance) => {
          const editedContent = instance.getValue();
          setEditorContent(editedContent);
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
    const typingInterval = setInterval(() => {
      if (isTypingPaused) {
        clearInterval(typingInterval);
      }

      if (textCount >= testcaseResult.length) {
        //text length 초과 시 undefind가 출력되는 것을 방지
        setIsTypingPaused(true);
        // console.log(isTypingPaused);
        return;
      }

      const nextChar = testcaseResult[textCount];
      setSequence((prevSequence) => prevSequence + nextChar);

      if (nextChar === '\n') {
        setTextCount((prevCount) => prevCount + 1);
      } else {
        setTextCount((prevCount) => prevCount + 1);
      }
    }, 30); // 설정한 초만큼 일정한 간격마다 실행된다

    return () => clearInterval(typingInterval); //컴포넌트가 마운트 해제되거나, 재렌더링 될 때마다 setInterval를 정리하는 함수를 반환함.
    //텍스트결과, 컨텐츠, 타이핑 정지 여부 등의 변화로 타이핑 효과 연출
  }, [testcaseResult, textCount, isTypingPaused, returnCall]);

  useEffect(() => {
    dispatch(setReturnCall(''));
    setSequence('');
    setTextCount(0);
    setTestcaseResult(returnCall);
  }, [dispatch]);

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
      </div>
    </>
  );
};

export default TestEditor;
