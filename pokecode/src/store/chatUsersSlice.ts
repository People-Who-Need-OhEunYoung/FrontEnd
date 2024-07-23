import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface ChatUsers {
  userLen: number;
  chatUsers: any;
}
//초기상태 설정
const initialState: ChatUsers = {
  userLen: 0,
  chatUsers: [],
};

const UserInfo = createSlice({
  name: 'useinfo',
  initialState,
  reducers: {
    setUserLen(state, action: PayloadAction<any>) {
      state.chatUsers = action.payload;
    },
    setChatUsers(state, action: PayloadAction<number>) {
      state.userLen = action.payload;
    },
  },
});

export const { setUserLen, setChatUsers } = UserInfo.actions;
export default UserInfo.reducer;
