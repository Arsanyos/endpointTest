import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/API';
import Utils from '../services/utils';
import {
  updateConfigurationsFilterTime,
  updateConfigurationsSportType,
  updateConfigurations,
} from '@ReduxStore/configurationSlice';
import { updateEvent, updateEventGames } from '@ReduxStore/eventSlice';
import { updateSelectedMenu } from '@ReduxStore/selectedMenuSlice';
import { useEvent } from './useEvent';
import { message } from 'antd';
import {
  addAllEvents,
  updateBetGroup,
  updateBetTypes,
  updateCoreData,
  updateFavGamesList,
  updateLeagueGroupLeagues,
  updateLeagueGroups,
  updateLeagues,
  updateMarketFilters,
  updateSportTypeLeagueGroups,
  updateTopBets,
} from '@ReduxStore/coreDataSlice';
import ClientSession from '@services/client-session';
import {
  updateMaxMatchs,
  updateMaxWin,
  updateStake,
} from '@ReduxStore/slipSlice';

export function useCoreData() {
  const allEvents = useSelector((state) => state.coreData.allEvents);
  const coreData = useSelector((state) => state.coreData);
  const selectedGameMenu = useSelector(
    (state) => state.selectedMenu.selectedGameMenu
  );
  const stake = useSelector((state) => state.slip.stake);

  const dispatch = useDispatch();
  const { getSportType } = useEvent();
  const { i18n } = useTranslation();

  const getData = (id, sportTypeId = 1) => {
    let selectedPage = 0;
    let totalPage = 0;
    let data = [];
    if (id == 0) {
      data =
        coreData.coreData &&
        coreData.coreData.highlights &&
        coreData.coreData.highlights.length != 0
          ? coreData.coreData.highlights.filter((l) => getSportType(l.league))
          : [];

      totalPage = Math.ceil(data.length / 20);

      dispatch(
        updateSelectedMenu({
          selectedSubGameList: 0,
          selectedGameMenu: 1,
          selectedGameList: 0,
          activeMenuID: 5,
        })
      );
      dispatch(
        updateEventGames({
          selectedEventGames2: data.highlights,
          selectedEventGames: data,
        })
      );
      dispatch(
        updateEvent({ selectedPage: selectedPage, totalPage: totalPage })
      );
    } else if (id == 1) {
      data =
        coreData.coreData &&
        coreData.coreData.highlights &&
        coreData.coreData.highlights.length != 0
          ? coreData?.coreData?.highlights?.filter(
              (l) => getSportType(l.league) == sportTypeId
            )
          : [];
      totalPage = Math.ceil(data?.length / 20);
      dispatch(
        updateSelectedMenu({
          selectedSubGameList: 0,
          selectedGameMenu: id,
          selectedGameList: 0,
        })
      );
      dispatch(
        updateEventGames({
          selectedEventGames2: data.highlights,
          selectedEventGames: data,
        })
      );
      dispatch(
        updateEvent({ selectedPage: selectedPage, totalPage: totalPage })
      );
    } else if (id == 2) {
      dispatch(updateConfigurationsSportType({ sportTypeId: sportTypeId }));
      data = allEvents.filter((l) => getSportType(l.league) == sportTypeId);
      totalPage = Math.ceil(data.length / 20);
      let group = data.reduce((r, a) => {
        r[a.league] = [...(r[a.league] || []), a];
        return r;
      }, {});

      let leageIds = Object.keys(group);
      let groupedData = [...coreData.coreData.leagues]
        .map((l) => {
          if (leageIds.includes(l.id + '')) {
            return {
              text:
                (i18n.resolvedLanguage == 'Am' &&
                coreData.coreData.league_groups.find(
                  (lg) => lg.id == l.league_group
                ).locales[0] != null
                  ? coreData.coreData.league_groups.find(
                      (lg) => lg.id == l.league_group
                    ).locales[0].translation
                  : coreData.coreData.league_groups.find(
                      (lg) => lg.id == l.league_group
                    )?.name) +
                ' ' +
                (i18n.resolvedLanguage == 'Am' && l.locales[0] != null
                  ? l.locales[0].translation
                  : l.name),
              icon: Utils.validURL(
                coreData.coreData?.league_groups?.filter(
                  (lg) => lg.id == l.league_group
                )[0]?.logo
              )
                ? coreData.coreData.league_groups.filter(
                    (lg) => lg.id == l.league_group
                  )[0].logo
                : API.API_BASE_URL +
                  '' +
                  coreData.coreData.league_groups.filter(
                    (lg) => lg.id == l.league_group
                  )[0]?.logo,
              id: l.id,
              order: l.order,
              events: group[l.id],
              sport_type: l.sport_type,
            };
          } else {
            return null;
          }
        })
        .filter((g) => g != null && g.sport_type == sportTypeId)
        .sort((a, b) => (a.order > b.order ? 1 : -1));

      dispatch(
        updateSelectedMenu({
          selectedSubGameList: 0,
          selectedGameMenu: id,
          selectedGameList: 0,
        })
      );
      dispatch(
        updateEventGames({
          selectedEventGames2: data.highlights,
          selectedEventGames: data,
        })
      );
      dispatch(
        updateEvent({
          selectedPage: selectedPage,
          totalPage: totalPage,
          groupedData: groupedData,
        })
      );
    } else if (id == 3) {
      dispatch(updateSelectedMenu({ selectedGameMenu: id }));
    } else if (id == 4) {
      data =
        coreData &&
        coreData.coreData.highlights &&
        coreData.coreData.highlights.length != 0
          ? coreData.coreData.highlights.filter((l) => getSportType(l.league))
          : [];
      coreData.coreData.highlights.filter(
        (l) => getSportType(l.league) == sportTypeId
      );
      dispatch(
        updateSelectedMenu({
          selectedSubGameList: 0,
          selectedGameMenu: 1,
          selectedGameList: 0,
        })
      );
      dispatch(updateEvent({ highlightSportTypeId: 1 }));
      dispatch(
        updateEventGames({
          selectedEventGames2: data.highlights,
          selectedEventGames: data,
        })
      );
      dispatch(
        updateEvent({
          selectedPage: selectedPage,
          totalPage: totalPage,
          // groupedData: groupedData,
        })
      );
    }
    // dispatch(updateConfigurationsFilterTime({ timeFilter: 'ALL' }));
    if (sportTypeId && selectedGameMenu != 1) {
      dispatch(updateConfigurationsSportType({ sportTypeId: sportTypeId }));
    }
  };
  const getSportEvents = (id, closable, sportTypeId = 1) => {
    let data = allEvents
      .filter(
        (e) =>
          moment(e.schedule).subtract(6, 'hours').format('YYYY-DD-MM') ==
          moment(coreData ? coreData.coreData.time : null).format('YYYY-DD-MM')
      )
      .filter((l) => getSportType(l.league) == sportTypeId);
    let group = data.reduce((r, a) => {
      r[a.league] = [...(r[a.league] || []), a];
      return r;
    }, {});

    let leageIds = Object.keys(group);
    let groupedData = [...coreData.coreData.leagues]
      .map((l) => {
        if (leageIds.includes(l.id + '')) {
          return {
            text:
              (i18n.resolvedLanguage == 'Am' &&
              coreData.coreData.league_groups.filter(
                (lg) => lg.id == l.league_group
              )[0].locales[0] != null
                ? coreData.coreData.league_groups.filter(
                    (lg) => lg.id == l.league_group
                  )[0].locales[0].translation
                : coreData.coreData.league_groups.filter(
                    (lg) => lg.id == l.league_group
                  )[0].name) +
              ' ' +
              (i18n.resolvedLanguage == 'Am' && l.locales[0] != null
                ? l.locales[0].translation
                : l.name),
            icon: Utils.validURL(
              coreData.coreData.league_groups.filter(
                (lg) => lg.id == l.league_group
              )[0].logo
            )
              ? coreData.coreData.league_groups.filter(
                  (lg) => lg.id == l.league_group
                )[0].logo
              : API.API_BASE_URL +
                '' +
                coreData.coreData.league_groups.filter(
                  (lg) => lg.id == l.league_group
                )[0].logo,
            id: l.id,
            order: l.order,
            events: group[l.id],
            sport_type: l.sport_type,
          };
        } else {
          return null;
        }
      })
      .filter((g) => g != null && g.sport_type == sportTypeId)
      .sort((a, b) => (a.order > b.order ? 1 : -1));
  };
  const getAllEvents = () => {
    API.createNoToken(
      `sport-data/matches/?ln=${i18n.resolvedLanguage.toLowerCase()}`,
      null,
      null
    )
      .then((response) => {
        if (response.data) {
          dispatch(addAllEvents({ allEvents: response.data }));
        }
      })
      .catch((err) => {
        if (err.code == 'ERR_NETWORK') {
          return message.error(err.message);
        }
        if (!err.response) {
          return message.error('Error While Loading Data', 5);
        }
        return message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
      });
  };

  const getCoreData = () => {
    API.findWithNoToken(
      `sport-data/coredata/?ln=${i18n.resolvedLanguage.toLowerCase()}`,
      null,
      null
    )
      .then((response) => {
        if (response.data) {
          let core_Data = response.data;
          dispatch(updateCoreData({ coreData: core_Data }));
          let tl = response.data.top_bets
            .map((le) => {
              let l = response.data.leagues.filter((l) => l.id == le.league)[0];

              if (l == null) {
                return null;
              } else {
                let lgi = l.league_group;
                let lgl =
                  response?.data?.league_groups &&
                  response.data.league_groups.filter((lg) => lg.id == lgi)[0]
                    .logo;
                return {
                  id: l.id,
                  text:
                    i18n.resolvedLanguage == 'Am' && l.locales[0]
                      ? l.locales[0].translation
                      : l.name,
                  icon:
                    (Utils.validURL(lgl) ? '' : API.API_BASE_URL) + '' + lgl,
                  extra: false,
                  order: l.order,
                  name: l.name,
                  locales: l.locales,
                  sport_type: l.sport_type,
                };
              }
            })
            .filter((d) => d != null);
          dispatch(updateTopBets({ top_bets: tl }));
        }
      })
      .catch((err) => {
        // console.log(err);
        if (err.code == 'ERR_NETWORK') {
          // return message.error(err.message);
          return console.error(err.message);
        }
        if (!err.response) {
          // return message.error('Error While Loading Data', 5);
          return console.error('Error While Loading Data');
        }
      });
  };

  const processedCoredata = () => {
    const league_groups = { ...league_groups };
    const sport_type_league_groups = { ...sport_type_league_groups };
    coreData?.coreData?.league_groups &&
      coreData.coreData.league_groups.forEach((league_group) => {
        league_groups[league_group.id] = league_group;
        if (!sport_type_league_groups[league_group['sport_type']]) {
          sport_type_league_groups[league_group['sport_type']] = [];
        }
        sport_type_league_groups[league_group['sport_type']].push(league_group);
      });

    const leagues = { ...leagues };
    const league_group_leagues = { ...league_group_leagues };
    coreData.coreData.leagues.forEach((league) => {
      leagues[league.id] = league;

      if (!league_group_leagues[league['league_group']]) {
        league_group_leagues[league['league_group']] = [];
      }
      league_group_leagues[league['league_group']].push(league);
    });

    // bet_type
    const bet_types = {};
    coreData.coreData.bet_types.forEach((bt) => {
      bet_types[bt.id] = bt;
    });

    const bet_group = {};
    coreData.coreData.bet_groups.forEach((bg) => {
      bet_group[bg.id] = bg;
    });
    // market types
    const market_filters = { ...market_filters };
    coreData.coreData.market_filters.forEach((mf) => {
      // market_filters[mf.id]=mf;
      if (!market_filters[mf['filter_type']]) {
        market_filters[mf['filter_type']] = [];
      }
      market_filters[mf['filter_type']].push(mf.bet_group);
    });

    // sort if required
    dispatch(updateSportTypeLeagueGroups({ sport_type_league_groups }));
    dispatch(updateLeagueGroupLeagues({ league_group_leagues }));
    dispatch(updateLeagues({ leagues }));
    dispatch(updateMarketFilters({ market_filters }));
    dispatch(updateBetGroup({ bet_group }));
    dispatch(updateLeagueGroups({ league_groups }));
    dispatch(updateBetTypes({ bet_types }));
  };

  const getConfiguration = () => {
    const url = `configurations/${process.env.REACT_CONFIGURATION_URL ?? ''}`;
    return new Promise((resolve, reject) =>
      API.findWithNoToken(url, null, null)
        .then((response) => {
          if (response.data) {
            dispatch(
              updateConfigurations({
                configurations: response.data,
              })
            );
            // console.log(response.data);
            const newStake = { ...stake };
            const valid_stake = ClientSession.isAuth()
              ? response.data?.online_minimum_stake ?? stake[1]
              : response.data?.offline_minimum_stake ?? stake[1];

            newStake[1] = valid_stake;
            newStake[2] = valid_stake;
            newStake[3] = valid_stake;
            dispatch(updateStake({ stake: newStake }));
            dispatch(
              updateMaxMatchs({
                maxmatches: response.data.maxmatches,
              })
            );
            dispatch(
              updateMaxWin({
                maxWin: response.data.maxWin,
              })
            );
            dispatch(
              updateConfigurationsSportType({
                sportTypeId: response.data.main_sport_type,
              })
            );
            resolve();
          }
        })
        .catch((err) => {
          if (err.code == 'ERR_NETWORK') {
            // message.error(err.message);
            reject();
          }
          if (!err.response || !err.response.data) {
            // message.error('Error While Loading Data');
            reject();
          }
          // message.error(
          //   err.response.data[Object.keys(err.response.data)[0]][0],
          //   5
          // );
          reject();
        })
    );
  };

  return {
    getData,
    getCoreData,
    processedCoredata,
    getConfiguration,
    getAllEvents,
  };
}
