import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allJackpotList: [],
  jackpots: [],
  jackpotSelectedList: [],
  selectedJackpotMonth: '',
  selectedJackpotYear: '',
  jackpotData: {},
  selectedPage: 0,
  totalPage: 1,
  selectedPicks: [],
};
export const jackpotSlice = createSlice({
  name: 'Jackpot',
  initialState,
  reducers: {
    updateJackpot: (state, action) => {
      state.jackpots = action.payload.jackpots;
    },
    updateSelectedPicks: (state, action) => {
      state.selectedPicks = action.payload.selectedPicks;
    },
    updateJackpotHistory: (state, action) => {
      state.jackpotHistory = action.payload.jackpotHistory;
    },
    updateJackpotArchive: (state, action) => {
      state.allJackpotList = action.payload.allJackpotList;
      state.jackpotData = action.payload.jackpotData;
      state.jackpotSelectedList = action.payload.jackpotSelectedList;
      state.selectedJackpotMonth = action.payload.selectedJackpotMonth;
      state.selectedJackpotYear = action.payload.selectedJackpotYear;
    },
  },
});
export const {
  updateJackpot,
  updateSelectedPicks,
  updateJackpotHistory,
  updateJackpotArchive,
} = jackpotSlice.actions;
export default jackpotSlice.reducer;
