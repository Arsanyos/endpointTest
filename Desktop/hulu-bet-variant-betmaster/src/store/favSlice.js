import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favGamesList: [],
};
export const favSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFavGamesList: (state, action) => {
      state.favGamesList = action.payload.favGamesList;
    },
  },
});
export const { updateFavGamesList } = favSlice.actions;
export default favSlice.reducer;
