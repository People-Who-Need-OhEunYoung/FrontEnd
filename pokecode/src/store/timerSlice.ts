import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface TimerState {
  elapsedTime: number; //경과 시간
  startTime: number | null; //시작 시간
  limitTime: number;
}

//초기상태 설정
const initialState: TimerState = {
  elapsedTime: 0,
  startTime: 0,
  limitTime: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer(state) {
      state.startTime = Date.now();
      state.elapsedTime = 0;
    },
    setElapsedTime(state, action: PayloadAction<number>) {
      state.elapsedTime = action.payload;
    },
    resetElapsedTime(state) {
      state.elapsedTime = 0;
      state.startTime = 0;
    },
    setStartTime(state, action: PayloadAction<number>) {
      state.startTime = action.payload;
    },
    
    setLimitTime(state, action: PayloadAction<number>) {
      state.limitTime = action.payload;
    }
  },
});

export const { startTimer, setElapsedTime, resetElapsedTime, setStartTime, setLimitTime } = timerSlice.actions;
export default timerSlice.reducer;
