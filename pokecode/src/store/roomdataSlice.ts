import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface RoomdataState {
  username: string | null;
  roomId: string | null;
  userArray: string[];
}

//초기상태 설정
const initialState: RoomdataState = {
  username: '',
  roomId: '',
  userArray: [], // 빈 배열로 초기화
};

const roomdataSlice = createSlice({
  name: 'roomdata',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },

    setRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    setUserArray(state, action: PayloadAction<string[]>) {
      state.userArray = action.payload;
    },
  },
});

export const { setUsername, setRoomId, setUserArray } = roomdataSlice.actions;
export default roomdataSlice.reducer;

