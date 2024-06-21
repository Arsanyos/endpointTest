import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEventGames: [],
  selectedEventGames2: [],
  highlightSportTypeId: '',
  selectedPage: 0,
  totalPage: 1,
  groupedData: [],
  eventDetailCatch: {},
};
export const eventSlice = createSlice({
  name: 'Event',
  initialState,
  reducers: {
    updateEventGames: (state, action) => {
      state.selectedEventGames = action.payload.selectedEventGames;
      state.selectedEventGames2 = action.payload.selectedEventGames2;
    },
    updateEvent: (state, action) => {
      state.totalPage = action.payload.totalPage;
      state.groupedData = action.payload.groupedData;
      state.highlightSportTypeId = action.payload.highlightSportTypeId;
    },
    updateEventDetailCatch: (state, action) => {
      state.eventDetailCatch = action.payload.eventDetailCatch;
    },
    updateEventPage: (state, action) => {
      state.selectedPage = action.payload.selectedPage;
    },
  },
});
export const {
  updateEventGames,
  updateEvent,
  updateEventDetailCatch,
  updateEventPage,
} = eventSlice.actions;
export default eventSlice.reducer;
