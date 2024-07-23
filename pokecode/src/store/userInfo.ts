import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//createSlice: Redux 리듀서와 액션 크리에이터를 동시에 정의하도록 함.
//PayloadAction: 액션 페이로드 타입을 지정할 때 사용

export interface User {
  bakjoon_id: string;
  cur_poke_id: number;
  data_coin: number;
  data_exp: number;
  dp_coin: number;
  dp_exp: number;
  exp_index: number;
  graph_coin: number;
  graph_exp: number;
  impl_coin: number;
  impl_exp: number;
  last_login: string;
  math_coin: number;
  math_exp: number;
  nick_name: string;
  user_exp: number;
  user_level: number;
  poke_title: string;
  poke_eval: number;
  poke_legend_yn: number;
  poke_type: string;
  poke_name: string;
  poke_img: string;
  poke_profile_img: string;
}

export interface UserState {
  user: User;
}

//초기상태 설정
const initialState: UserState = {
  user: {
    bakjoon_id: '',
    cur_poke_id: 0,
    data_coin: 0,
    data_exp: 0,
    dp_coin: 0,
    dp_exp: 0,
    exp_index: 0,
    graph_coin: 0,
    graph_exp: 0,
    impl_coin: 0,
    impl_exp: 0,
    last_login: '',
    math_coin: 0,
    math_exp: 0,
    nick_name: '',
    user_exp: 0,
    user_level: 0,
    poke_title: '',
    poke_eval: 1,
    poke_legend_yn: 0,
    poke_type: '',
    poke_name: '',
    poke_img: '',
    poke_profile_img: '',
  },
};

const UserInfo = createSlice({
  name: 'useinfo',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setUserNickname(state, action: PayloadAction<string>) {
      state.user.nick_name = action.payload;
    },
    setPokemonId(state, action: PayloadAction<number>) {
      state.user.cur_poke_id = action.payload;
    },
    minusUserCoin(state, action: PayloadAction<number>) {
      switch (action.payload) {
        case 0:
          state.user.math_coin -= 1;
          break;
        case 1:
          state.user.impl_coin -= 1;
          break;
        case 2:
          state.user.dp_coin -= 1;
          break;
        case 3:
          state.user.data_coin -= 1;
          break;
        case 4:
          state.user.graph_coin -= 1;
          break;
        default:
          console.error('Invalid coin type');
      }
    },
  },
});

export const { setUser, minusUserCoin, setUserNickname, setPokemonId } =
  UserInfo.actions;
export default UserInfo.reducer;
