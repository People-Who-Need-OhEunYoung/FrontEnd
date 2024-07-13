import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import userinfoReducer from './userInfo';

const store = configureStore({
  reducer: {
    timer: timerReducer,
    userinfo: userinfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
