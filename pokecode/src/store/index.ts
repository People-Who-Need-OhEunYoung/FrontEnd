import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import userinfoReducer from './userInfo';
import problemReducer from './problemSlice';
import codeCallerReducer from './codeCallerReducer';
import roomdataSlice from './roomdataSlice';

const store = configureStore({
  reducer: {
    timer: timerReducer,
    userinfo: userinfoReducer,
    probinfo: problemReducer,
    codecaller: codeCallerReducer,
    roomdata: roomdataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
