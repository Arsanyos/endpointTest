import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  first_name: '',
  username: '',
  phone: '',
  balance: '',
  reciverPhoneHC: '',
  isLoggedIn: false,
  authData: {},
  data: {},
  userDetail: {},
  telegramData: {},
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.first_name = action.payload.first_name;
      state.reciverPhoneHC = action.payload.reciverPhoneHC;
      state.username = action.payload.username;
      state.phone = action.payload.phone;
      state.balance = action.payload.balance;
      state.data = action.payload.data;
      state.userDetail = action.payload.userDetail;
    },
    updateUserStatus: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    updateUserAuth: (state, action) => {
      state.authData = action.payload.authData;
    },
    updateTelegramData: (state, action) => {
      state.telegramData = action.payload.telegramData;
    },
  },
});
export const {
  updateUser,
  updateUserStatus,
  updateUserAuth,
  updateTelegramData,
} = userSlice.actions;
export default userSlice.reducer;
