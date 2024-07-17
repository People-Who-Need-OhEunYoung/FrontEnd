import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface CodeCallerState {
  returnCall: string;
  returnAiCall: string;
  language: string;
  textEditor: string;
  wordBalloon: boolean;
  typingPause: boolean;
}

//초기상태 설정
const initialState: CodeCallerState = {
  returnCall: '',
  returnAiCall: '로딩중.....',
  language: 'python',
  textEditor: '',
  wordBalloon: false,
  typingPause: false,
};

const CodeCallerSlice = createSlice({
  name: 'codecaller',
  initialState,
  reducers: {
    setReturnCall(state, action: PayloadAction<string>) {
      state.returnCall = action.payload;
    },
    setReturnAiCall(state, action: PayloadAction<string>) {
      state.returnAiCall = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setTextEditor(state, action: PayloadAction<string>) {
      state.textEditor = action.payload;
    },
    setWordBalloon(state, action: PayloadAction<boolean>) {
      state.wordBalloon = action.payload;
    },
    setTypingPause(state, action:PayloadAction<boolean>) {
      state.typingPause = action.payload;
    },
  },
});

export const {
  setReturnCall,
  setReturnAiCall,
  setLanguage,
  setTextEditor,
  setWordBalloon,
  setTypingPause,
} = CodeCallerSlice.actions;
export default CodeCallerSlice.reducer;
