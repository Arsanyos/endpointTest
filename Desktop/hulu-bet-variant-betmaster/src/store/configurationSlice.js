import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  configurations: {},
  maxWin: 350000,
  minWithdraw: 100,
  maxWithdraw: 350000,
  minDeposit: 100,
  maxDeposit: 350000,
  maxStake: 5000,
  minStake: 20,
  minLogInStake: 5,
  maxmatches: 20,
  timeFilter: 0,
  countryTimeFilter: 0,
  sortBy: 'LEAGUE',
  sportTypeId: 79,
  countryType: 'All',
  leagueId: null,
  selectedMenu: null,
  selectedEvent: {},
  isRightBarOpen: false,
  UIMode: null,
};
export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    updateConfigurations: (state, action) => {
      state.configurations = action.payload.configurations;
      state.minStake = action.payload.minStake;
      state.minLogInStake = action.payload.minLogInStake;
      state.maxmatches = action.payload.maxmatches;
      state.maxStake = action.payload.maxStake;
      state.maxWin = action.payload.maxWin;
    },
    updateConfigurationsSportType: (state, action) => {
      state.sportTypeId = action.payload.sportTypeId;
    },
    updateConfigurationsFilterTime: (state, action) => {
      state.timeFilter = action.payload.timeFilter;
    },
    updateConfigurationsCountryFilterTime: (state, action) => {
      state.countryTimeFilter = action.payload.countryTimeFilter;
    },
    updateConfigurationsSortBy: (state, action) => {
      state.sortBy = action.payload.sortBy;
    },
    updateIsRightBarOpen: (state, action) => {
      state.isRightBarOpen = action.payload.isRightBarOpen;
    },
    updateConfigurationsMinStake: (state, action) => {
      state.minStake = action.payload.minStake;
    },
    updateConfigurationsLeagueId: (state, action) => {
      state.leagueId = action.payload.leagueId;
    },
    updateConfigurationsCountryType: (state, action) => {
      state.countryType = action.payload.countryType;
    },
    updateConfigurationsSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload.selectedMenu;
    },
    updateConfigurationsselectedEvent: (state, action) => {
      state.selectedEvent = action.payload.selectedEvent;
    },
    updateUIMode: (state, action) => {
      state.UIMode = action.payload.UIMode;
    },
  },
});
export const {
  updateConfigurations,
  updateConfigurationsSportType,
  updateConfigurationsFilterTime,
  updateConfigurationsSortBy,
  updateConfigurationsMinStake,
  updateIsRightBarOpen,
  updateConfigurationsLeagueId,
  updateConfigurationsCountryType,
  updateConfigurationsSelectedMenu,
  updateConfigurationsselectedEvent,
  updateConfigurationsCountryFilterTime,
  updateUIMode,
} = configurationSlice.actions;
export default configurationSlice.reducer;
