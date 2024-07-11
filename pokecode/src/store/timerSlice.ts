import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface TimerState {
  elapsedTime: number;
}

//초기상태 설정
const initialState: TimerState = {
  elapsedTime: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setElapsedTime(state, action: PayloadAction<number>) {
      state.elapsedTime = action.payload;
    },
    resetElapsedTime(state) {
      state.elapsedTime = 0;
    },
  },
});

export const { setElapsedTime, resetElapsedTime } = timerSlice.actions;
export default timerSlice.reducer;
