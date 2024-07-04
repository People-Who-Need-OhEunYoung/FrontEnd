declare module 'y-codemirror' {
    import * as Y from 'yjs';
    import { Editor } from 'codemirror';
    import { WebsocketProvider } from 'y-websocket';
  
    export class CodemirrorBinding {
      constructor(yText: Y.Text, editor: Editor, awareness: WebsocketProvider['awareness']);
      destroy(): void;
    }
  }
  