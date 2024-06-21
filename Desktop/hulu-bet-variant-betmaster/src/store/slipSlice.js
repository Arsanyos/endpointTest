import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  slips: {
    1: [],
    2: [],
    3: [],
  },
  stake: {
    1: process.env.REACT_MIN_STAKE,
    2: process.env.REACT_MIN_STAKE,
    3: process.env.REACT_MIN_STAKE,
  },
  phone: {
    1: '',
    2: '',
    3: '',
  },
  selectedSlip: 1,
  maxmatches: 20,
  maxWin: 350000,
  maxStake: process.env.REACT_MAX_STAKE,
  minStake: process.env.REACT_MIN_STAKE,
  offLineMinStake: process.env.REACT_MIN_STAKE,
  onLineMinStake: process.env.REACT_MIN_STAKE,
};
export const slipSlice = createSlice({
  name: 'slip',
  initialState,
  reducers: {
    updateSlips: (state, action) => {
      state.slips = action.payload.slips;
      state.sportTypeId = action.payload.sportTypeId;
    },
    updateStake: (state, action) => {
      state.stake = action.payload.stake;
    },
    updateMaxWin: (state, action) => {
      state.maxWin = action.payload.maxWin;
    },
    updateMaxMatchs: (state, action) => {
      state.maxmatches = action.payload.maxmatches;
    },
    updatePhone: (state, action) => {
      state.phone = action.payload.phone;
    },
    updateMatchData: (state, action) => {
      state.maxmatches = action.payload.maxmatches;
      state.maxWin = action.payload.maxWin;
      state.maxStake = action.payload.maxStake;
      state.minStake = action.payload.minStake;
    },
    updateSelectedSlip: (state, action) => {
      state.selectedSlip = action.payload.selectedSlip;
    },
  },
});
export const {
  updateSlips,
  updateStake,
  updateMaxWin,
  updateMaxMatchs,
  updatePhone,
  updateSelectedSlip,
} = slipSlice.actions;
export default slipSlice.reducer;
