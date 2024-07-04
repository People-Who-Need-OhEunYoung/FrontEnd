import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import * as Y from 'yjs';
//import './TestSharedEditor.css';

const TestSharedEditor: React.FC = () => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const userIdRef = useRef<HTMLDivElement>(null); // 사용자 ID를 표시할 ref 추가


    useEffect(() => {
        const ydoc = new Y.Doc(); 
        const provider = new WebsocketProvider('ws://192.168.1.18:1236', 'codemirror', ydoc); 

        const yText = ydoc.getText('codemirror'); 

        if (editorContainerRef.current) {
            const editor = CodeMirror(editorContainerRef.current, {
                mode: 'javascript',
                lineNumbers: true
            });

            const binding = new CodemirrorBinding(yText, editor, provider.awareness);
            console.log(provider.awareness.clientID);
            // 사용자 ID를 표시하는 로직 추가
            if (userIdRef.current) {
                userIdRef.current.innerText = `User ID: ${provider.awareness.clientID}`;
            }
      
            return () => {
                binding.destroy();
                provider.disconnect();
            };
        }
    }, []);

    return (
        <div>
            <div ref={userIdRef} className="user-id"></div> {/* 사용자 ID를 표시할 요소 */}
            <div ref={editorContainerRef} className="editor-container"></div>
        </div>
    );
};

export default TestSharedEditor;
