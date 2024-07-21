import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface UserState {
  userId: string;
  curRoom: string;
  credit: number | null;
  userNickname: string;
  pokemonId: number;
}

//초기상태 설정
const initialState: UserState = {
  userId: '',
  curRoom: '',
  credit: 0,
  userNickname: '',
  pokemonId: 0,
};

const UserInfo = createSlice({
  name: 'useinfo',
  initialState,
  reducers: {
    setUserNickname(state, action: PayloadAction<string>) {
      state.userNickname = action.payload;
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setUserCredit(state, action: PayloadAction<number>) {
      state.credit = action.payload;
    },
    setPokemonId(state, action: PayloadAction<number>) {
      state.pokemonId = action.payload;
    },
    setCurRoom(state, action: PayloadAction<string>) {
      state.curRoom = action.payload;
    },
    minusUserCredit(state) {
      if (state.credit != null && state.credit > 100) state.credit -= 100;
    },
  },
});

export const {
  setUserNickname,
  setUserCredit,
  minusUserCredit,
  setPokemonId,
  setUserId,
  setCurRoom,
} = UserInfo.actions;
export default UserInfo.reducer;
