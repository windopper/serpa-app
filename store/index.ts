import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import inquiriesReducer from './slices/inquiriesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    inquiries: inquiriesReducer,
  },
  // 필요한 경우 미들웨어 설정 추가 가능
});

// 스토어에서 RootState와 AppDispatch 타입 추출
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;