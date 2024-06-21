import { configureStore } from '@reduxjs/toolkit';
import collapseReducer from './collapseSlice';
import configurationReducer from './configurationSlice';
import coreDataReducer from './coreDataSlice';
import selectedMenuReducer from './selectedMenuSlice';
import slipReducer from './slipSlice';
import favReducer from './favSlice';
import eventReducer from './eventSlice';
import jackpotReducer from './jackpotSlice';
import userReducer from './userSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    coreData: coreDataReducer,
    configuration: configurationReducer,
    collapse: collapseReducer,
    selectedMenu: selectedMenuReducer,
    slip: slipReducer,
    fav: favReducer,
    Event: eventReducer,
    Jackpot: jackpotReducer,
  },
});
