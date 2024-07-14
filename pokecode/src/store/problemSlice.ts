import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface ProblemState {
  problemId: string;
  writtenCode: string;
  isAcquireReview: boolean;
}

//초기상태 설정
const initialState: ProblemState = {
  problemId: '',
  writtenCode: '',
  isAcquireReview: false,
};

const ProblemSlice = createSlice({
  name: 'probinfo',
  initialState,
  reducers: {
    setProblemId(state, action: PayloadAction<string>) {
      state.problemId = action.payload;
    },
    setWrittenCode(state, action: PayloadAction<string>) {
      state.writtenCode = action.payload;
    },
    setAcquireReview(state, action: PayloadAction<boolean>) {
      state.isAcquireReview = action.payload;
    }
  },
});

export const {setProblemId, setWrittenCode, setAcquireReview} = ProblemSlice.actions;
export default ProblemSlice.reducer;
