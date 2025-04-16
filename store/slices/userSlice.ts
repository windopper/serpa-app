import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

const initialState: UserState = {
  theme: 'system',
  language: 'ko',
  notifications: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
  },
});

export const { setTheme, setLanguage, toggleNotifications } = userSlice.actions;

export default userSlice.reducer;