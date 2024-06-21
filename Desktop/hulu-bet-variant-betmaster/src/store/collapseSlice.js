import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countryCollapseKey: 79,
};
export const collapseSlice = createSlice({
  name: 'collapseKey',
  initialState,
  reducers: {
    updateCountryCollapseKey: (state, action) => {
      state.countryCollapseKey = action.payload.countryCollapseKey;
    },
  },
});
export const { updateCountryCollapseKey } = collapseSlice.actions;
export default collapseSlice.reducer;
