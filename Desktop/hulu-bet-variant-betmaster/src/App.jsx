import { message } from 'antd';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Home from '@pages/Home';
import Layout from '@components/Layout';
import JackpotArchiveList from '@pages/JackpotArchiveList';
import Leagues from '@pages/Leagues';
import PageNotFound from '@pages/PageNotFound';

import { updateConfigurationsSportType } from '@ReduxStore/configurationSlice';
import {
  addAllEvents,
  updateAvailableSportTypes,
  updateBetGroup,
  updateBetTypes,
  updateCoreData,
  updateEvents,
  updateFavGamesList,
  updateLeagueEvents,
  updateLeagueGroupLeagues,
  updateLeagueGroups,
  updateLeagues,
  updateMarketFilters,
  updateSportCountries,
  updateSportHasGamesToday,
  updateSportHighlights,
  updateSportTypeEvents,
  updateSportTypeLeagueGroups,
  updateTopBets,
} from '@ReduxStore/coreDataSlice';
import { updateEvent, updateEventGames } from '@ReduxStore/eventSlice';
import { updateSelectedMenu } from '@ReduxStore/selectedMenuSlice';
import Events from '@components/Events';
import API from '@services/API';
import ClientSession from '@services/client-session';
import Utils from '@services/utils';
import { useDispatch, useSelector } from 'react-redux';
// import MatchDetail from '@components/MatchDetail';
import HighLights from '@components/HighLights';
import TodayMatchView from '@components/TodayMatchView';
// import Accumulator from '@pages/Accumulator';
// import Trending from '@pages/Trending';
// import Wallet from '@pages/Wallet';
import PrivateLayout from '@components/PrivateLayout';
// import Profile from '@pages/Profile';
// import History from '@pages/History';
// import BetHistory from '@pages/BetHistory';
// import BetHistoryDetail from '@pages/BetHistoryDetail';
// import JackpotBetHistory from '@pages/JackpotBetHistory';
// import JackpotBetHistoryDetail from '@pages/JackpotBetHistoryDetail';
// import Transaction from '@pages/Transaction';
// import Balance from '@pages/Balance';
// import JackpotArchiveDetail from '@pages/JackpotArchiveDetail';
import Apps from '@pages/Apps';
// import FAQ from '@pages/FAQ';
// import Promotions from '@pages/Promotions';
// import PromotionsDetail from '@pages/PromotionsDetail';
// import Terms from '@pages/Terms';
// import HowToPlay from '@pages/HowToPlay';
// import UpComing from '@components/UpComing';
import ErrorBoundary from '@components/ErrorBoundary';
import PageLoader from '@components/LoaderPages/PageLoader';
import MatchList from '@components/MatchList';
import RightBar from '@components/RightBar';
import { useCoreData } from '@hooks/useCoreData';
import CreateAccount from '@pages/CreateAccount';
import Login from '@pages/Login';
import ReferInfo from '@pages/ReferInfo';
import Search from '@pages/Search';
import ValidAge from '@pages/Valide-age';
import GameView from '@pages/GameView';
import { NARROW_TEMPLATE } from '@services/constants';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
const About = React.lazy(() => import('@pages/AboutUs'));
const Wallet = React.lazy(() => import('@pages/Wallet'));
const BetForMeWallet = React.lazy(() => import('@pages/BetForMeWallet'));
const Profile = React.lazy(() => import('@pages/Profile'));
// const PrivateLayout = React.lazy(() => import('@components/PrivateLayout'));
const BetHistory = React.lazy(() => import('@pages/BetHistory'));
const BetHistoryDetail = React.lazy(() => import('@pages/BetHistoryDetail'));
const JackpotBetHistory = React.lazy(() => import('@pages/JackpotBetHistory'));
const Jackpots = React.lazy(() => import('@pages/Jackpots'));
const JackpotDetail = React.lazy(() => import('@pages/JackpotDetail'));
const JackpotBetHistoryDetail = React.lazy(() =>
  import('@pages/JackpotBetHistoryDetail')
);
const Transaction = React.lazy(() => import('@pages/Transaction'));
const Balance = React.lazy(() => import('@pages/Balance'));
const JackpotArchiveDetail = React.lazy(() =>
  import('@pages/JackpotArchiveDetail')
);

import MulaFooter from '@pages/MulaFooter';
import GameViewLight from '@pages/GameViewLight';
import MobileLite from '@pages/MobileLite';

// const Apps = React.lazy(() => import('@pages/Apps'));
// const Footer = React.lazy(()=> import ('@pages/Footer'))
// const LanguageContext = React.lazy(()=> import ('@contexts/LanguageContext'))
const FAQ = React.lazy(() => import('@pages/FAQ'));
const Promotions = React.lazy(() => import('@pages/Promotions'));
const PromotionsDetail = React.lazy(() => import('@pages/PromotionsDetail'));
const Terms = React.lazy(() => import('@pages/Terms'));
const Responsible = React.lazy(() => import('@pages/Responsible'));
const PrivacyPolicy = React.lazy(() => import('@pages/PrivacyPolicy'));
const HowToPlay = React.lazy(() => import('@pages/HowToPlay'));
const Help = React.lazy(() => import('@pages/Help'));
const UpComing = React.lazy(() => import('@components/UpComing'));
const Trending = React.lazy(() => import('@pages/Trending'));
const Accumulator = React.lazy(() => import('@pages/Accumulator'));
// const TodayMatchView = React.lazy(() => import('@components/TodayMatchView'));
const MatchDetail = React.lazy(() => import('@components/MatchDetail'));
// const MobileNavBar = React.lazy(()=> import ('@components/MobileNavBar'))
// const RightBar = React.lazy(() => import('@components/RightBar'));

export const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = ClientSession.isAuth();

  if (isAuth) return children;
  return <Navigate to="/signin" replace state={{ redirectTo: location }} />;
};

export default function App() {
  const dispatch = useDispatch();

  const allEvents = useSelector((state) => state.coreData.allEvents);
  const coreData = useSelector((state) => state.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);
  // const sportTypeId = useSelector((state) => state.coreData.sportTypeId);
  const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const selectedGameMenu = useSelector(
    (state) => state.selectedMenu.selectedGameMenu
  );
  const sport_type_league_groups = useSelector(
    (state) => state.coreData.sport_type_league_groups
  );
  const league_group_leagues = useSelector(
    (state) => state.coreData.league_group_leagues
  );
  const userDetail = useSelector((state) => state.user.userDetail);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { i18n } = useTranslation();
  const location = useLocation();
  const { getConfiguration } = useCoreData();

  const MEDIA_SIZE_SM = 768;
  const stake = useSelector((state) => state.slip.stake);
  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  //TODO: load core data
  useEffect(() => {
    // if (window.localStorage.getItem('previous-version') < process.env.VERSION) {
    //   // TODO: reload
    //   // window.location.reload();
    // }
    if (coreData.coreData?.leagues) {
      setInterval(() => getCoreData(), 2 * 60 * 1000); // Every 2 mins
    } else getCoreData();
    // getCoreData();
    // getAllEvents();
    // getConfiguration();
    return clearInterval();
  }, []);

  // TODO: RealTime Data updates
  // useEffect(() => {
  //   const eventSource = new EventSource(`${API.API_BASE_URL}/realtime-price`);
  //   eventSource.onmessage = (e) => {
  //     console.log(e.data);
  //   };
  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  useEffect(() => {
    if (
      coreData &&
      coreData.coreData.leagues &&
      coreData.coreData.leagues.length > 0
    ) {
      getAllEvents();
      processedCoredata();
    }
  }, [coreData.coreData?.leagues]);

  useEffect(() => {
    if (allEvents?.length > 0) {
      processedEvents();
    }
  }, [allEvents]);

  useEffect(() => {
    if (coreData?.coreData?.highlights) {
      getData(0, sportTypeId);
    }
  }, [coreData.coreData]);

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
          getFavs(response.data);

          let lg =
            core_Data?.league_groups &&
            core_Data.league_groups.map((l) => {
              return {
                id: l.id,
                text:
                  i18n.resolvedLanguage == 'Am' && l.locales[0]
                    ? l.locales[0].translation
                    : l.name,
                icon: l.logo,
                extra: true,
                order: l.order,
                name: l.name,
                locales: l.locales,
              };
            });
          let l = lg
            .map((lg) => {
              let league = lg;

              league.child = core_Data.leagues.filter(
                (l) => l.league_group == lg.id
              );

              league.child = league.child.map((l) => {
                let league = { ...l };
                league.text =
                  i18n.resolvedLanguage == 'Am' && league.locales[0]
                    ? league.locales[0].translation
                    : league.name;
                return league;
              });

              return league;
            })
            .filter((l) => l.child.length != 0)
            .sort((a, b) => (a.order < b.order ? -1 : 1));

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
                  icon: Utils.validURL(lgl)
                    ? lgl
                    : new URL(lgl, API.API_BASE_URL),
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
          // TODO: Confirm the obsoluteness of gamesList
        }
      })
      .catch((err) => {
        // console.log(err);
        if (err.code == 'ERR_NETWORK') {
          return message.error(err.message);
        }
        if (!err.response) {
          return message.error('Error While Loading Data', 5);
        }
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
      });
  };

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

      coreData?.coreData?.highlights?.filter(
        (l) => getSportType(l.league) == sportTypeId
      );
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
      data = coreData.coreData.highlights.filter(
        (l) => getSportType(l.league) == sportTypeId
      );
      totalPage = Math.ceil(data.length / 20);
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
      data = allEvents
        .filter(
          (e) =>
            moment(e.schedule).subtract(6, 'hours').format('YYYY-DD-MM') ==
            moment(coreData ? coreData.coreData.time : null).format(
              'YYYY-DD-MM'
            )
        )
        .filter((l) => getSportType(l.league) == sportTypeId);
      totalPage = Math.ceil(data.length / 20);
      let group = data.reduce((r, a) => {
        r[a.league] = [...(r[a.league] || []), a];
        return r;
      }, {});

      var leageIds = Object.keys(group);
      var groupedData = coreData.leagues
        .map((l) => {
          if (leageIds.includes(l.id + '')) {
            return {
              text:
                (i18n.resolvedLanguage == 'Am' &&
                coreData.league_groups.filter(
                  (lg) => lg.id == l.league_group
                )[0].locales[0] != null
                  ? coreData.league_groups.filter(
                      (lg) => lg.id == l.league_group
                    )[0].locales[0].translation
                  : coreData.league_groups.filter(
                      (lg) => lg.id == l.league_group
                    )[0].name) +
                ' ' +
                (i18n.resolvedLanguage == 'Am' && l.locales[0] != null
                  ? l.locales[0].translation
                  : l.name),
              icon: Utils.validURL(
                coreData.league_groups.filter(
                  (lg) => lg.id == l.league_group
                )[0].logo
              )
                ? new URL(
                    coreData.league_groups.filter(
                      (lg) => lg.id == l.league_group
                    )[0].logo,
                    API.API_BASE_URL
                  )
                : new URL(
                    coreData.league_groups.filter(
                      (lg) => lg.id == l.league_group
                    )[0].logo,
                    API.API_BASE_URL
                  ),
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
          groupedData: groupedData,
        })
      );
    }

    // dispatch(updateConfigurationsFilterTime({ timeFilter: 'ALL' }));
    if (sportTypeId && selectedGameMenu != 1) {
      dispatch(updateConfigurationsSportType({ sportTypeId: sportTypeId }));
    }
  };

  const getSportType = (lid) => {
    var lg = coreData.coreData.leagues.filter((l) => l.id == lid)[0];
    if (lg == null) {
      // console.log(lid,"error leage id")
      return -1;
    } else {
      return lg.sport_type;
    }
  };

  const getFavs = (core_Data) => {
    ClientSession.getFav((err, data) => {
      if (data == null) return;
      let fl = [];
      data.forEach((f) => {
        let a = Object.assign({}, f);
        let l =
          core_Data?.leagues &&
          core_Data.leagues.filter((l) => l.id == f.id)[0];
        if (l != null) {
          let lgi = l.league_group;
          let lg =
            core_Data?.league_groups &&
            core_Data.league_groups.filter((lg) => lg.id == lgi)[0];
          a.name = l.name;
          a.locales = l.locales;
          a.logo = lg.logo;
          a.icon = lg.logo;
          fl.push(a);
        }
      });
      dispatch(updateFavGamesList({ favGamesList: fl }));
    });
  };

  const processedEvents = () => {
    const league_events = {};
    const events = {};
    const sport_hasGamesToday = {};
    const sport_type_events = {};
    allEvents?.forEach((event) => {
      events[event.id] = event;
      if (!league_events[event['league']]) {
        league_events[event['league']] = [];
      }
      league_events[event['league']].push(event);

      if (!sport_type_events[leagues[event?.league]?.sport_type]) {
        sport_type_events[leagues[event?.league]?.sport_type] = [];
      }
      sport_type_events[leagues[event?.league]?.sport_type]?.push(event);
      if (
        moment(event.schedule).subtract(6, 'hours').format('YYYY-DD-MM') ==
          moment(coreData ? coreData.coreData.time : null).format(
            'YYYY-DD-MM'
          ) &&
        leagues[event.league] &&
        leagues[event.league].sport_type
      ) {
        if (
          leagues[event.league] &&
          !sport_hasGamesToday[leagues[event?.league]?.sport_type]
        ) {
          sport_hasGamesToday[leagues[event.league]?.sport_type] = [];
        }
        sport_hasGamesToday[leagues[event.league]?.sport_type].push(event);
      }
    });

    let sport_countries = {};

    let sport_highlights = {};
    coreData.coreData?.highlights?.forEach((hl) => {
      if (!leagues[hl.league] || !leagues[hl.league]) return null;
      if (!sport_highlights[leagues[hl.league].sport_type]) {
        sport_highlights[leagues[hl.league].sport_type] = [];
      }
      sport_highlights[leagues[hl.league].sport_type].push(hl);
    });
    const available_sport_types = [];
    const sport_types = {};
    coreData.coreData?.sport_types?.forEach((st) => {
      sport_types[st.id] = st;
      if (
        !sport_type_league_groups[st.id] ||
        !sport_type_league_groups[st.id].some(
          (lg) =>
            league_group_leagues[lg.id] &&
            league_group_leagues[lg.id].length != 0 &&
            league_group_leagues[lg.id].some((l) => l.match_count != 0)
        )
      ) {
        return null;
      }
      available_sport_types.push(st);
    });
    const sorted_available_sport_types = available_sport_types.sort((a, b) =>
      a.order > b.order ? 1 : -1
    );

    dispatch(updateLeagueEvents({ league_events }));
    dispatch(updateEvents({ events }));
    dispatch(updateSportTypeEvents({ sportTypeEvents: sport_type_events }));
    dispatch(updateSportCountries({ sport_countries }));
    dispatch(updateSportHighlights({ sport_highlights }));
    dispatch(
      updateAvailableSportTypes({
        available_sport_types: sorted_available_sport_types,
      })
    );
    dispatch(updateSportHasGamesToday({ sport_hasGamesToday }));
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
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
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

  //TODO: Notification
  // const showNotification = (title, body, icon) => {
  //   const notification = new Notification('Hi there!');
  //   const notification = new Notification(title, { body, icon });
  // };

  //TODO: check for update
  // const checkPageStatus = (message, user) => {
  //   if (!('Notification' in window)) {
  //     alert('This browser does not support system notifications!');
  //   } else if (Notification.permission === 'granted') {
  //     showNotification(message, user);
  //   } else if (Notification.permission !== 'denied') {
  //     Notification.requestPermission((permission) => {
  //       if (permission === 'granted') {
  //         showNotification(message, user);
  //       }
  //     });
  //   }
  // };

  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <ErrorBoundary>
      <div
        className={classNames(
          `flex w-full flex-col overflow-hidden bg-body-container `,
          configurations.frontend_template == NARROW_TEMPLATE &&
            location.pathname.toLowerCase() != '/virtual'
            ? 'h-full'
            : ' min-h-screen'
        )}
      >
        {/* {false && <div>Notinifaction bar</div>} */}
        {/* {location.pathname != '/signup' &&
          location.pathname != '/login' &&
          location.pathname != '/check-coupon' &&
          location.pathname != '/slips' && (
            <Header
              loginVisible={loginVisible}
              setLoginVisible={setLoginVisible}
            />
          )} */}
        {/* {configurations?.frontend_template == WIDE_TEMPLATE && <SliderTop />} */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/referer/:id" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/league" element={<Leagues />} />
            <Route path="/matchs/:id" element={<Events />} />
            <Route path="/Today/:id" element={<TodayMatchView />} />
            {windowWidth > MEDIA_SIZE_SM && (
              <Route path="/slips/:slipID" element={<Home />} />
            )}
            <Route
              path="/upcoming/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <UpComing />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/matchs/:sportId/:countryId"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <MatchList />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route path="/Highlights/:id" element={<HighLights />} />
            <Route
              path="/match/detail/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <MatchDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/jackpots"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Jackpots />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/jackpot/:jackpot_id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <JackpotDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/archiveDetail/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <JackpotArchiveDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/jackpot/archives"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <JackpotArchiveList />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/accumulator"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Accumulator />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            {/* <Route
              path="/games"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Games />
                  </ErrorBoundary>
                </Suspense>
              }
            />*/}
            <Route
              path="/kironlite"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <MobileLite />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/trending"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Trending />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/apps"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Apps />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/faq"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <FAQ />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/promotion"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Promotions />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/terms"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Terms />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/responsible"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Responsible />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/age"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <ValidAge />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <About />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <PrivacyPolicy />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/rules"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <HowToPlay />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/help"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Help />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/promotion/:selectedPromotion"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <PromotionsDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route
            // path="/auth"
            element={
              <PrivateRoute>
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <PrivateLayout />
                  </ErrorBoundary>
                </Suspense>
              </PrivateRoute>
            }
          >
            <Route
              path="/profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/refer"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <ReferInfo />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/wallet"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Wallet />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            {userDetail?.member?.member_type == 2 && (
              <Route
                path="/betforme"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary>
                      <BetForMeWallet />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
            )}
            <Route
              path="/balance"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Balance />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/transaction"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Transaction />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/history"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <BetHistory />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/history/detail/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <BetHistoryDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/history/jackpot"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <JackpotBetHistory />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/history/jackpotDetail/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <JackpotBetHistoryDetail />
                  </ErrorBoundary>
                </Suspense>
              }
            />
          </Route>
          {/* <Route path="/about" element={<span> about </span>} /> */}
          {/* <Route path="/virtual" element={<Virtual />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route
            path="/games-virtual/games/:gameID/detail"
            element={
              <GameView
                loginVisible={loginVisible}
                setLoginVisible={setLoginVisible}
              />
            }
          />
          <Route
            path="/mobile-lite/games/:mobileLiteID/detail"
            element={
              <Suspense fallback={<PageLoader />}>
                <ErrorBoundary>
                  <GameViewLight />
                </ErrorBoundary>
              </Suspense>
            }
          />
          {windowWidth <= MEDIA_SIZE_SM && (
            <Route path="/slips" element={<RightBar />} />
          )}
          {windowWidth <= MEDIA_SIZE_SM && (
            <Route path="/slips/:slipID" element={<RightBar />} />
          )}
          {windowWidth <= MEDIA_SIZE_SM && (
            <Route path="/check-coupon" element={<RightBar />} />
          )}
          <Route path="/help" element={<Help />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <HowToPlay />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/help/terms"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Terms />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/help/responsible"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Responsible />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/help/promotion"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Promotions />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/help/privacy"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <PrivacyPolicy />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/help/rules"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <HowToPlay />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/help/age"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <ValidAge />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/help/faq"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <FAQ />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            <Route
              path="/help/apps"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Apps />
                  </ErrorBoundary>
                </Suspense>
              }
            />
          </Route>
        </Routes>

        {process.env.REACT_SHOW_MULA_FOOTER === 'true' && <MulaFooter />}
      </div>
    </ErrorBoundary>
  );
}
