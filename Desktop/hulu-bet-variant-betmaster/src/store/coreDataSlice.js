import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coreData: {},
  allEvents: [],
  league_events: {},
  events: {},
  sportTypeEvents: {},
  sport_countries: {},
  sport_highlights: {},
  league_groups: [],
  bet_groups: [],
  sport_type_league_groups: {},
  leagues: [],
  league_group_leagues: {},
  bet_types: [],
  available_sport_types: [],
  sport_hasGamesToday: {},
  market_filters: [],
  top_bets: [],
  favGamesList: [],
  marketTypeFav: [],
};
const coreDataSlice = createSlice({
  name: 'coreData',
  initialState,
  reducers: {
    updateCoreData: (state, action) => {
      state.coreData = action.payload.coreData;
    },
    addAllEvents: (state, action) => {
      state.allEvents = action.payload.allEvents;
    },
    updateEvents: (state, action) => {
      state.events = action.payload.events;
    },
    updateSportTypeEvents: (state, action) => {
      state.sportTypeEvents = action.payload.sportTypeEvents;
    },
    updateTopBets: (state, action) => {
      state.top_bets = action.payload.top_bets;
    },
    updateLeagueGroups: (state, action) => {
      state.league_groups = action.payload.league_groups;
    },
    updateBetGroup: (state, action) => {
      state.bet_group = action.payload.bet_group;
    },
    updateBetTypes: (state, action) => {
      state.bet_types = action.payload.bet_types;
    },
    updateLeagueEvents: (state, action) => {
      state.league_events = action.payload.league_events;
    },
    updateSportCountries: (state, action) => {
      state.sport_countries = action.payload.sport_countries;
    },
    updateSportTypeLeagueGroups: (state, action) => {
      state.sport_type_league_groups = action.payload.sport_type_league_groups;
    },
    updateLeagueGroupLeagues: (state, action) => {
      state.league_group_leagues = action.payload.league_group_leagues;
    },
    updateLeagues: (state, action) => {
      state.leagues = action.payload.leagues;
    },
    updateSportHighlights: (state, action) => {
      state.sport_highlights = action.payload.sport_highlights;
    },
    updateFavGamesList: (state, action) => {
      state.favGamesList = action.payload.favGamesList;
    },
    updateMarketTypeFavs: (state, action) => {
      state.marketTypeFav = action.payload.marketTypeFav;
    },
    updateMarketFilters: (state, action) => {
      state.market_filters = action.payload.market_filters;
    },
    updateAvailableSportTypes: (state, action) => {
      state.available_sport_types = action.payload.available_sport_types;
    },
    updateSportHasGamesToday: (state, action) => {
      state.sport_hasGamesToday = action.payload.sport_hasGamesToday;
    },
  },
});

export const {
  addAllEvents,
  updateEvents,
  updateSportTypeEvents,
  updateCoreData,
  updateLeagueGroups,
  updateBetGroup,
  updateBetTypes,
  updateTopBets,
  updateLeagues,
  updateSportCountries,
  updateLeagueEvents,
  updateSportTypeLeagueGroups,
  updateLeagueGroupLeagues,
  updateSportHighlights,
  updateAvailableSportTypes,
  updateMarketFilters,
  updateFavGamesList,
  updateMarketTypeFavs,
  updateSportHasGamesToday,
} = coreDataSlice.actions;
export default coreDataSlice.reducer;
