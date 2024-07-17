import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface ProblemDetails {
  title: string;
  description: string;
  input: string;
  output: string;
  samples: Array<{ input: string; output: string }>;
}

export interface TestCases {
  input_case: string;
  output_case: string;
}

export interface ProblemState {
  problemId: string;
  writtenCode: string;
  isAcquireReview: boolean;
  problemDetails?: ProblemDetails;  // Optional로 정의
  TestCases?: TestCases[];
}

//초기상태 설정
const initialState: ProblemState = {
  problemId: '',
  writtenCode: '',
  isAcquireReview: false,
  problemDetails: undefined,
  TestCases: undefined,
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
    },
    // problemDetails 상태 업데이트를 위한 액션 추가
    setProblemDetail(state, action: PayloadAction<ProblemDetails>) {
      state.problemDetails = action.payload;
    },
    setTestCases(state, action: PayloadAction<TestCases[]>) {
      state.TestCases = action.payload;
    },
  },
});

export const {setProblemId, setWrittenCode, setAcquireReview, setProblemDetail, setTestCases} = ProblemSlice.actions;
export default ProblemSlice.reducer;
