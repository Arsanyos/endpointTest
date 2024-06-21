import { useDispatch, useSelector } from 'react-redux';
import {
  updateConfigurationsFilterTime,
  updateConfigurationsSportType,
} from '../store/configurationSlice';
import { updateSelectedMenu } from '../store/selectedMenuSlice';

import { useTranslation } from 'react-i18next';
import { useEvent } from './useEvent';

export const useDisplayLeagueMatches = () => {
  const dispatch = useDispatch();
  const { getEvent } = useEvent();

  const league_groups = useSelector((state) => state.coreData.league_groups);
  const leagues = useSelector((state) => state.coreData.leagues);

  const { i18n } = useTranslation();

  const displayLeagueMatches = (lid, sportTypeId) => {
    const currentGroups = league_groups[leagues[lid]?.league_group];
    var lgn =
      i18n.resolvedLanguage == 'Am' &&
      currentGroups.length != 0 &&
      currentGroups?.locales?.length > 0
        ? currentGroups?.locales[0]?.translation
        : currentGroups?.length != 0
        ? currentGroups?.name
        : '';

    const name =
      i18n.resolvedLanguage == 'Am' && leagues[lid].locales.length > 0
        ? leagues[lid].locales[0].translation
        : leagues[lid].name;
    dispatch(
      updateSelectedMenu({
        selectedGameMenu: 3,
        selectedSubGameList: lid,
        selectedGameListIcon: lgn.logo,
        selectedGameListName: lgn + ' ' + name,
        selectedGameListId: lid,
      })
    );

    // dispatch(updateConfigurationsFilterTime({ timeFilter: 'ALL' }));
    dispatch(updateConfigurationsSportType({ sportTypeId: sportTypeId }));
    getEvent(lid, 'ALL');
  };
  return displayLeagueMatches;
};
