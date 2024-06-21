import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedGameMenu: 0,
  selectedGameListId: 0,
  selectedGameListName: '',
  selectedGameListIcon: '',
  selectedSubGameList: '',
  activeMenuID: 1,
};
export const selectedMenuSlice = createSlice({
  name: 'selectedMenu',
  initialState,
  reducers: {
    updateSelectedMenu: (state, action) => {
      state.selectedGameMenu = action.payload.selectedGameMenu;
      state.selectedGameListId = action.payload.selectedGameListId;
      state.selectedGameListName = action.payload.selectedGameListName;
      state.selectedGameListIcon = action.payload.selectedGameListIcon;
      state.selectedSubGameList = action.payload.selectedSubGameList;
      state.activeMenuID = action.payload.activeMenuID;
    },
  },
});
export const { updateSelectedMenu } = selectedMenuSlice.actions;
export default selectedMenuSlice.reducer;
