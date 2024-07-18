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

const TestEditor = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);

  const [editorContent, setEditorContent] = useState('');
  const { isAcquireReview } = useSelector((state: RootState) => state.probinfo);
  const { language } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editor != null) editor.setOption('mode', language);
  }, [language]);

  useEffect(() => {
    // KHS 코드 리뷰방으로 이동을 위해 dispatch 작업
    dispatch(setWrittenCode(editorContent));
    // console.log(editorContent);
  }, [isAcquireReview, editorContent]);

  useEffect(() => {
    if (editorContainerRef.current) {
      if (editor == null) {
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
    }
  }, []);

  return (
    <>
      <div
        style={{ height: '100%' }}
        ref={editorContainerRef}
        className="editor-container"
      ></div>
    </>
  );
};

export default TestEditor;
