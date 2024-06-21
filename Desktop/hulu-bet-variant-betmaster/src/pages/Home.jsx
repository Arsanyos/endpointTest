import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  updateConfigurationsCountryType,
  updateConfigurationsFilterTime,
  updateConfigurationsLeagueId,
  updateConfigurationsSelectedMenu,
  updateConfigurationsSortBy,
  updateConfigurationsSportType,
  updateConfigurationsselectedEvent,
} from '@ReduxStore/configurationSlice';
import { updateEventPage } from '@ReduxStore/eventSlice';
import DateMatchCard from '@components/DateMatchCard';
import Drawer from '@components/Drawer';
import SportTypeOptions from '@components/SportTypeOptions';
import TodayMatchCard from '@components/TodayMatchCard';
import TodayMatchPaginationLoader from '@components/TodayMatchPaginationLoader';
import TodayMatchViewLoader from '@components/TodayMatchViewLoader';
import { useEvent } from '@hooks/useEvent';
import API from '@services/API';
import ClientSession from '@services/client-session';
import Utils from '@services/utils';
import { Pagination } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { AiOutlineTrophy } from 'react-icons/ai';
import { BiWorld } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import { MdAccessTime, MdSearch } from 'react-icons/md';

const INITIAL_SPORT_TYPE = 79; // soccer
export default function Home() {
  // const [countryType, setCountryType] = useState('All'); // Set Default to Soccer
  // const [leagueId, setLeagueId] = useState(null); // Set Default to Soccer
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(20);

  const [topOfferDate, setTopOfferDate] = useState(0);
  // const [sortBy, setSortBy] = useState('LEAGUE');
  const [openCountries, setOpenCountries] = useState(false);
  const [openOfferDate, setOpenOfferDate] = useState(false);
  const [openSportTypes, setOpenSportTypes] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [grouped_Data, setGroupedData] = useState([]);
  const [groupDataLoading, setGroupedDataLoading] = useState(true);
  const [selected_grouped_data, setSelectedGroupedData] = useState([]);
  const [grouped_Date_Data, setGroupedDateData] = useState({});
  // const [selectedEvent, setSelectedEvent] = useState({});
  // const [selectedPage, setSelectedPage] = useState(0);

  const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const countryType = useSelector((state) => state.configuration.countryType);
  const leagueId = useSelector((state) => state.configuration.leagueId);
  const groupedData = useSelector((state) => state.Event?.groupedData);
  const league_groups = useSelector((state) => state.coreData?.league_groups);
  const favGamesList = useSelector((state) => state.coreData.favGamesList);
  const topBets = useSelector((state) => state.coreData.top_bets);
  const selectedMenu = useSelector((state) => state.configuration.selectedMenu);
  const selectedEvent = useSelector(
    (state) => state.configuration.selectedEvent
  );

  const selectedPage = useSelector((state) => state.Event.selectedPage);
  // const [selectedMenu, setSelectedMenu] = useState(null);

  const timeFilter = useSelector((state) => state.configuration.timeFilter);
  const sortBy = useSelector((state) => state.configuration.sortBy);
  const sportTypeEvents = useSelector(
    (state) => state.coreData.sportTypeEvents
  );

  const coreData = useSelector((state) => state.coreData.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);
  const available_sport_types = useSelector(
    (state) => state.coreData.available_sport_types
  );

  const {
    getSportType,
    getLeagueEvent,
    organiseByLeague,
    organiseByTimeGroup,
    searchLeagueEvent,
    getFavLeagueEvents,
  } = useEvent();

  const eventDetailCatch = {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const highlightsRef = useRef(null);
  const isVisibleRef = React.useRef(null);
  const { t, i18n } = useTranslation();
  const { search } = useLocation();

  useEffect(() => {
    if (highlightsRef.current !== null) {
      highlightsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [highlightsRef.current]);

  useEffect(() => {
    setTimeout(() => {
      if (isVisibleRef.current != null) {
        isVisibleRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start',
        });
        ClientSession.removeLastSelectedEvent();
      }
      return clearTimeout();
    }, 300);
  }, [isVisibleRef.current]);

  useEffect(() => {
    if (selectedMenu == 'FAV') return getFavLeagues();
    if (selectedMenu == 'TOP_OFFER') return getTopOffers();
    setGroupedDataLoading(true);
    if (sortBy === 'LEAGUE') {
      // SORT BY LEAGUE
      sportTypeEvents[sportTypeId] && sortByLeague();
    } else {
      // SORT BY TIME
      sportTypeEvents[sportTypeId] && sortByTime();
    }
  }, [
    sortBy,
    selectedMenu,
    sportTypeId,
    // selectedDate,
    timeFilter,
    groupedData,
    sportTypeEvents[sportTypeId],
  ]);

  useEffect(() => {
    if (search) {
      querySearch(search.substring(1).replace('%20', ' ')); // REMOVE "?" and replace'%20' with SPACE from query
    } else if (search == '' && selected_grouped_data?.length > 0) {
      setGroupedData(selected_grouped_data);
    }
    // else getData(sportTypeId);
  }, [search]);

  useEffect(() => {
    if (['FAV', 'TOP_OFFER'].includes(selectedMenu)) return;
    if (selectedMenu != 'Search') {
      // setSelectedMenu(null);
      dispatch(updateConfigurationsSelectedMenu({ selectedMenu: null }));
    }
    // getData(sportTypeId);
    setSearchValue('');
    // setSelectedPage(0);
    // changePage(0);
  }, [sportTypeId, selectedMenu]);

  useEffect(() => {
    if (searchValue) {
      setGroupedDataLoading(true);
      const filtered_data = searchLeagueEvent(
        searchValue,
        selected_grouped_data
      );
      setGroupedData(filtered_data);
    }
  }, [searchValue, selected_grouped_data]);

  useEffect(() => {
    if (openCountries || openOfferDate) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [openCountries, openOfferDate]);

  useEffect(() => {
    if (leagueId) {
      const new_grouped_data = {
        ...league_groups[leagues[leagueId]?.league_group],
      };
      const league_event_list = getLeagueEvent(leagueId, 'All');
      new_grouped_data.events = [...league_event_list];
      new_grouped_data.icon = new_grouped_data.logo;
      new_grouped_data.text = leagues[leagueId].name;
      new_grouped_data.league_group_id = leagues[leagueId]?.league_group;
      new_grouped_data && setGroupedData([new_grouped_data]);
    } else {
      if (sortBy === 'LEAGUE') {
        // SORT BY LEAGUE
        sportTypeEvents[sportTypeId] && sortByLeague();
      } else {
        // SORT BY TIME
        sportTypeEvents[sportTypeId] && sortByTime();
      }
    }
  }, [leagueId]);

  useEffect(() => {
    // if (['FAV', 'TOP_OFFER'].includes(selectedMenu)) return;
    if (selectedMenu == 'FAV') return getFavLeagues();
    if (selectedMenu == 'TOP_OFFER') return getTopOffers();
    let new_grouped_data = organiseByLeague(
      sportTypeId,
      null,
      timeFilter ?? 'All',
      countryType ?? 'All'
    );
    new_grouped_data && setGroupedData([...new_grouped_data]);
    new_grouped_data && setSelectedGroupedData([...new_grouped_data]);
    // if (new_grouped_data) setGroupedDataLoading(false);
  }, [countryType]);

  let sport_type_grouped_data = useMemo(() => {
    if (sportTypeId) return organiseByLeague(sportTypeId, null, 'All', 'All');
  }, [sportTypeId, sportTypeEvents]);

  const sortByLeague = () => {
    let new_grouped_data = organiseByLeague(
      sportTypeId,
      null,
      timeFilter ?? 'All',
      countryType ?? 'All'
    );
    new_grouped_data && setGroupedData([...new_grouped_data]);
    new_grouped_data && setSelectedGroupedData([...new_grouped_data]);
    if (new_grouped_data) setGroupedDataLoading(false);
  };

  const sortByTime = () => {
    let new_grouped_data = organiseByTimeGroup(
      sportTypeId,
      null,
      timeFilter ?? 'All',
      countryType ?? 'All'
    );
    // new_grouped_data && setGroupedData(new_grouped_data);
    new_grouped_data && setGroupedDateData(new_grouped_data);
    if (new_grouped_data) setGroupedDataLoading(false);
  };

  const getFavLeagues = () => {
    const fav_league_event_list = getFavLeagueEvents(favGamesList);
    fav_league_event_list && setGroupedData([...fav_league_event_list]);
    fav_league_event_list && setSelectedGroupedData([...fav_league_event_list]);
    setGroupedDataLoading(false);
  };
  const getTopOffers = () => {
    const top_offer_event_list = getFavLeagueEvents(topBets);
    top_offer_event_list && setGroupedData([...top_offer_event_list]);
    top_offer_event_list && setSelectedGroupedData([...top_offer_event_list]);
    setGroupedDataLoading(false);
  };

  const changeTimeFilter = (time) => {
    setTopOfferDate(time);
    dispatch(updateConfigurationsFilterTime({ timeFilter: time }));
    // setSelectedDate(null);
  };

  const querySearch = (searchValue) => {
    const filtered_grouped_data = searchLeagueEvent(
      searchValue,
      sport_type_grouped_data //selected_grouped_data
    );
    filtered_grouped_data && setGroupedData([...filtered_grouped_data]);
    // const data = searchEvent(searchValue);
  };

  const query = (value) => {
    navigate({
      pathname: '/',
      search: value.toLowerCase(),
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      query(searchValue);
    } else if (e.key === 'Escape') {
      // setSelectedMenu(null);
      dispatch(updateConfigurationsSelectedMenu({ selectedMenu: null }));
    }
  };
  const handleSearchOnChange = (e) => {
    query(e.target.value);
  };

  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  const changePage = (page) => {
    dispatch(updateEventPage({ selectedPage: page }));
    // setSelectedPage(page - 1);
  };

  const week_Days = {
    Sunday: 'እሁድ',
    Monday: 'ሰኞ',
    Tuesday: 'ማክሰኞ',
    Wednesday: 'እሮብ',
    Thursday: 'ሃሙስ',
    Friday: 'አርብ',
    Saturday: 'ቅዳሜ',
  };

  const day_filter_list = [
    {
      id: 0,
      label: t('Today'),
      action: () => changeTimeFilter(0),
    },
    {
      id: 1,
      label: t('Tomorrow'),
      action: () => changeTimeFilter(1),
    },
    {
      id: 2,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(2, 'days').format('dddd')
          : week_Days[moment().add(2, 'days').format('dddd')],
      action: () => changeTimeFilter(2),
    },
    {
      id: 3,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(3, 'days').format('dddd')
          : week_Days[moment().add(3, 'days').format('dddd')],
      action: () => changeTimeFilter(3),
    },
    {
      id: 4,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(4, 'days').format('dddd')
          : week_Days[moment().add(4, 'days').format('dddd')],
      action: () => changeTimeFilter(4),
    },
    {
      id: 5,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(5, 'days').format('dddd')
          : week_Days[moment().add(5, 'days').format('dddd')],
      action: () => changeTimeFilter(5),
    },
    {
      id: 6,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(6, 'days').format('dddd')
          : week_Days[moment().add(6, 'days').format('dddd')],
      action: () => changeTimeFilter(6),
    },
  ];

  const toggle = [
    {
      id: 'LEAGUE',
      label: t('Leagues'),
      filter: 'LEAGUE',
    },
    {
      id: 'TIME',
      label: t('Time'),
      filter: 'TIME',
    },
  ];

  return (
    <div className="flex flex-col gap-y-1">
      <div
        ref={highlightsRef}
        className="hidden h-9 items-center justify-between bg-primary-700 md:flex "
      >
        <div className="relative flex h-full flex-row items-center gap-x-1 overflow-hidden  bg-header-nav ">
          {day_filter_list.map((tab) => {
            return (
              <DateFilterItems
                key={tab.id}
                id={tab.id}
                label={tab.label}
                isActive={timeFilter == tab.id}
                onClick={tab.action}
              />
            );
          })}
        </div>

        {/* Toggles */}
        <div className="relative flex h-full flex-row bg-primary-600">
          {toggle.map((tab) => {
            return (
              <div
                key={tab.id}
                className={`relative flex h-full cursor-pointer items-center justify-center py-[2px]  px-2 text-xs duration-300 ${
                  sortBy == tab.id ? 'text-active-font' : 'text-font-dark'
                } `}
                onClick={() => {
                  // setSortBy(tab.filter);
                  dispatch(updateConfigurationsSortBy({ sortBy: tab.filter }));
                }}
              >
                {sortBy == tab.id && (
                  <motion.div
                    layoutId="today-toggle-pill "
                    className="absolute inset-0 bg-active "
                  />
                )}
                {/* <span className="relative z-10 ">{tab.label}</span> */}
                {tab.id == 'LEAGUE' ? (
                  <AiOutlineTrophy className="relative z-10 text-lg " />
                ) : (
                  <MdAccessTime className="relative z-10 text-lg " />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP SPORT TYPES */}
      <div className="  flex gap-y-0.5 gap-x-2 overflow-x-auto scroll-smooth bg-sport-types-contianer py-2 pr-2 md:mt-0  ">
        {available_sport_types.length > 0 && (
          <div className="ml-2 md:hidden ">
            <button
              className={` ${
                selectedMenu == 'Search'
                  ? 'bg-active text-active-font'
                  : 'bg-secondary-button text-secondary-button-font'
              } flex h-8 w-16 items-center justify-center rounded-full md:hidden`}
              onClick={() => {
                if (selectedMenu != 'Search') {
                  // setSelectedMenu('Search');
                  dispatch(
                    updateConfigurationsSelectedMenu({ selectedMenu: 'Search' })
                  );
                } else {
                  //  setSelectedMenu(null);
                  dispatch(
                    updateConfigurationsSelectedMenu({ selectedMenu: null })
                  );
                }
              }}
            >
              <MdSearch className="text-xl " />
            </button>
          </div>
        )}
        {favGamesList.length != 0 && (
          // <Favorite open={true} onClose={onClose} />
          <div className="relative ml-2 md:hidden ">
            <button
              className={` ${
                selectedMenu == 'FAV'
                  ? 'bg-active text-active-font'
                  : 'bg-secondary-button text-secondary-button-font'
              } flex h-8 w-28 items-center justify-center rounded-full md:hidden`}
              onClick={() => {
                // setSelectedMenu('FAV');
                dispatch(
                  updateConfigurationsSelectedMenu({ selectedMenu: 'FAV' })
                );
                // setOpenFav(!openFav);
                getFavLeagues();
              }}
            >
              <span>{t('FAVOURITES')}</span>
            </button>
          </div>
        )}

        {topBets.length != 0 && (
          // <Favorite open={true} onClose={onClose} />
          <div className="relative ml-2 md:hidden ">
            <button
              className={` ${
                selectedMenu == 'TOP_OFFER'
                  ? 'bg-active text-active-font'
                  : 'bg-secondary-button text-secondary-button-font'
              } flex h-8 w-28 items-center justify-center rounded-full md:hidden`}
              onClick={() => {
                // setOpenOffer(!openOffer);
                // setSelectedMenu('TOP_OFFER');
                dispatch(
                  updateConfigurationsSelectedMenu({
                    selectedMenu: 'TOP_OFFER',
                  })
                );
                getTopOffers();
              }}
            >
              <span>{t('TOPBETS')}</span>
            </button>
          </div>
        )}

        {process.env.REACT_SWAP_SPORT_TYPE_DATE_FILTER != 'true' ? (
          <>
            {available_sport_types.map((item) => {
              return (
                <SportTypeButton
                  key={item.id}
                  isActive={sportTypeId == item.id && selectedMenu == null}
                  title={
                    i18n.resolvedLanguage == 'Am' && item.locales[0]
                      ? item.locales[0].translation
                      : item.name
                  }
                  avatar={
                    Utils.validURL(item.logo)
                      ? item.logo
                      : new URL(item.logo, API.API_BASE_URL)
                  }
                  onClick={() => {
                    // setCountryType('All');
                    // setLeagueId(null);
                    dispatch(
                      updateConfigurationsCountryType({ countryType: 'All' })
                    );
                    dispatch(updateConfigurationsLeagueId({ leagueId: null }));
                    // setSelectedMenu(null);
                    dispatch(
                      updateConfigurationsSelectedMenu({ selectedMenu: null })
                    );
                    dispatch(
                      updateConfigurationsSportType({ sportTypeId: item.id })
                    );
                  }}
                />
              );
            })}
          </>
        ) : (
          <>
            {day_filter_list.map((tab) => {
              return (
                <DateFilterButtons
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  isActive={timeFilter == tab.id && selectedMenu == null}
                  onClick={() => {
                    tab.action();
                    dispatch(
                      updateConfigurationsSelectedMenu({
                        selectedMenu: null,
                      })
                    );
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedMenu == 'Search' && (
          <MobileSearchBar
            onKeyDown={handleSearchKeyDown}
            onChange={handleSearchOnChange}
          />
        )}
      </AnimatePresence>

      {/* Mobile:  countries and leauges */}
      {available_sport_types.length > 0 && (
        <div className="scrollbar sticky top-0 left-0 right-0 z-[1] flex   w-full flex-col md:hidden ">
          <div className="flex w-full gap-x-[1px] bg-primary-500 ">
            {process.env.REACT_SWAP_SPORT_TYPE_DATE_FILTER != 'true' ? (
              <button
                onClick={() => {
                  setOpenOfferDate(!openOfferDate);
                  setOpenCountries(false);
                  setOpenSportTypes(false);
                }}
                className=" flex h-10 w-full flex-1 items-center justify-between  bg-secondary-button px-2 text-secondary-button-font "
              >
                {timeFilter !== null && timeFilter != 'All' ? (
                  <span>
                    {day_filter_list.find((tab) => timeFilter == tab.id)?.label}
                  </span>
                ) : (
                  <span>{t('TOPBETS')}</span>
                )}
                <FaChevronDown
                  className={` ${
                    openOfferDate && ' rotate-180 '
                  } text-slate-100 duration-300 `}
                />
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpenSportTypes(!openSportTypes);
                  setOpenOfferDate(false);
                  setOpenCountries(false);
                }}
                className=" flex h-10 w-full flex-1 items-center justify-between  bg-secondary-button px-2 text-secondary-button-font "
              >
                <span>{t('SportTypes')}</span>
                <FaChevronDown
                  className={` ${
                    openOfferDate && ' rotate-180 '
                  } text-slate-100 duration-300 `}
                />
              </button>
            )}
            <button
              onClick={() => {
                setOpenCountries(!openCountries);
                setOpenOfferDate(false);
                setOpenSportTypes(false);
              }}
              className=" flex h-10 w-full flex-1 items-center justify-between gap-x-2  bg-secondary-button px-2 text-secondary-button-font "
            >
              {selectedEvent.title ? (
                <div className="flex items-center gap-x-2">
                  <img
                    src={selectedEvent.logo}
                    alt=""
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                  />
                  <span className="truncate">{selectedEvent.title}</span>
                </div>
              ) : (
                <span>{t('Countries')}</span>
              )}
              <FaChevronDown
                className={` ${
                  openCountries && ' rotate-180 '
                } text-slate-100 duration-300 `}
              />
            </button>
          </div>
          {process.env.REACT_SWAP_SPORT_TYPE_DATE_FILTER != 'true' ? (
            <AnimatePresence initial={false}>
              {openOfferDate && (
                <Drawer
                  className=" top-28  "
                  open={openOfferDate}
                  onClose={() => setOpenOfferDate(!openOfferDate)}
                >
                  <motion.div
                    // layoutScroll
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    exit={{ height: 0 }}
                    className={` flex h-full w-full flex-1 flex-col gap-y-1 divide-y-[1px] divide-primary-600 overflow-y-scroll bg-leftbar-country px-2 py-2 `}
                  >
                    {day_filter_list.map((tab) => {
                      return (
                        <DateFilterItems
                          className="relative flex h-8 w-full  cursor-pointer items-center rounded   py-[2px] px-2  align-middle text-xs duration-300"
                          key={tab.id}
                          id={tab.id}
                          label={tab.label}
                          isActive={timeFilter == tab.id}
                          onClick={() => {
                            setOpenOfferDate(!openOfferDate);
                            tab.action();
                          }}
                        />
                      );
                    })}
                  </motion.div>
                </Drawer>
              )}
            </AnimatePresence>
          ) : (
            <AnimatePresence initial={false}>
              {openSportTypes && (
                <Drawer
                  className=" top-28  "
                  open={openSportTypes}
                  onClose={() => setOpenSportTypes(!openSportTypes)}
                >
                  <motion.div
                    // layoutScroll
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    exit={{ height: 0 }}
                    className={` flex h-full w-full flex-1 flex-col gap-y-1 divide-y-[1px] divide-primary-600 overflow-y-scroll bg-leftbar-country px-2 py-2 `}
                  >
                    {available_sport_types.map((tab) => {
                      return (
                        <SportTypeFilterItems
                          className="relative flex h-8 w-full  cursor-pointer items-center rounded   py-[2px] px-2  align-middle text-xs duration-300"
                          key={tab.id}
                          id={tab.id}
                          label={
                            i18n.resolvedLanguage == 'Am' && tab.locales[0]
                              ? tab.locales[0].translation
                              : tab.name
                          }
                          isActive={
                            sportTypeId == tab.id && selectedMenu == null
                          }
                          onClick={() => {
                            dispatch(
                              updateConfigurationsCountryType({
                                countryType: 'All',
                              })
                            );
                            dispatch(
                              updateConfigurationsLeagueId({ leagueId: null })
                            );
                            dispatch(
                              updateConfigurationsSelectedMenu({
                                selectedMenu: null,
                              })
                            );
                            dispatch(
                              updateConfigurationsSportType({
                                sportTypeId: tab.id,
                              })
                            );
                            setOpenSportTypes(!openSportTypes);
                          }}
                        />
                      );
                    })}
                  </motion.div>
                </Drawer>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {openCountries && (
              <Drawer
                className=" top-28  "
                open={openCountries}
                onClose={() => setOpenCountries(!openCountries)}
              >
                <motion.div
                  layoutScroll
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  exit={{ height: 0 }}
                  className={` relative flex h-full w-full overflow-y-auto bg-leftbar-country px-2 py-2 `}
                >
                  <div className="mx-3 flex h-full w-full flex-col divide-y-[1px] divide-primary-600 ">
                    <div
                      className="group flex h-8 cursor-pointer flex-row items-center justify-between "
                      onClick={(e) => {
                        e.preventDefault();
                        // setCountryType('All');
                        dispatch(
                          updateConfigurationsLeagueId({ leagueId: null })
                        );
                        dispatch(
                          updateConfigurationsCountryType({
                            countryType: 'All',
                          })
                        );

                        setOpenCountries(false);
                        // setSelectedEvent({});
                        dispatch(
                          updateConfigurationsselectedEvent({
                            selectedEvent: {},
                          })
                        );
                      }}
                    >
                      <div className="flex flex-row items-center gap-2 text-leftbar-country-font">
                        <div>
                          <BiWorld className="h-5 w-5 rounded-full text-lg " />
                        </div>
                        <div className="flex items-center justify-between truncate ">
                          {t('All')}
                        </div>
                      </div>
                    </div>
                    {openCountries && available_sport_types.length > 0 && (
                      <SportTypeOptions
                        st={available_sport_types?.find(
                          (st) => st?.id == sportTypeId
                        )}
                        onCountrySelect={(cid) => {
                          // setCountryType(cid);
                          dispatch(
                            updateConfigurationsCountryType({
                              countryType: cid,
                            })
                          );
                          // setTopOfferDate('All');
                          const logo = new URL(
                            league_groups[cid]?.logo,
                            API.API_BASE_URL
                          );
                          const title =
                            i18n.resolvedLanguage == 'En' ||
                            !league_groups[cid].locales[0]
                              ? league_groups[cid]?.name
                              : league_groups[cid].locales[0]?.translation;
                          const selected_event = { logo: logo, title: title };
                          // setSelectedEvent(selected_event);
                          dispatch(
                            updateConfigurationsselectedEvent({
                              selectedEvent: selected_event,
                            })
                          );
                          setOpenCountries(!openCountries);
                        }}
                        onLeagueSelect={(lid) => {
                          // setLeagueId(lids);
                          dispatch(
                            updateConfigurationsLeagueId({ leagueId: lid })
                          );
                          const logo = new URL(
                            league_groups[leagues[lid]?.league_group]?.logo,
                            API.API_BASE_URL
                          );
                          const title =
                            i18n.resolvedLanguage == 'En' ||
                            !league_groups[leagues[lid]?.league_group]
                              .locales[0]
                              ? league_groups[leagues[lid]?.league_group]?.name
                              : league_groups[leagues[lid]?.league_group]
                                  ?.locales[0]?.translation;
                          const selected_event = { logo: logo, title: title };
                          // setSelectedEvent(selected_event);
                          dispatch(
                            updateConfigurationsselectedEvent({
                              selectedEvent: selected_event,
                            })
                          );
                          setOpenCountries(!openCountries);
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              </Drawer>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex flex-col gap-1 bg-secondary-200">
        {grouped_Data?.length > 0 && (
          <ListHomeEvents
            sortBy={sortBy}
            ref={isVisibleRef}
            grouped_Data={grouped_Data}
            grouped_Date_Data={grouped_Date_Data}
          />
        )}
        {grouped_Data?.length == 0 && !groupDataLoading && (
          <span className="flex w-full items-center justify-center text-lg text-gray-200 ">
            {t('NoGameAvailableAtTheMoment')}
          </span>
        )}
      </div>
      {groupDataLoading && (
        <div className="flex w-full flex-col gap-y-2">
          {[...Array(3).keys()].map((i, index) => {
            return <TodayMatchViewLoader key={index} index={index} />;
          })}
          <TodayMatchPaginationLoader />
        </div>
      )}
    </div>
  );
}

// if REACT_SWAP_SPORT_TYPE_DATE_FILTER is false
function SportTypeButton({ className = '', title, isActive, ...props }) {
  return (
    <>
      <button
        className={classNames(
          ` min-w-28  m-0 flex h-8 shrink-0 items-center justify-center gap-x-2  truncate rounded-full px-4 py-0.5 text-sm md:h-7  md:rounded-none ${
            isActive
              ? ' bg-active text-active-font'
              : 'bg-secondary-button text-secondary-button-font'
          } `,
          className
        )}
        {...props}
      >
        <span>{title}</span>
      </button>
    </>
  );
}

function DateFilterItems({ isActive, label, onClick, className = '' }) {
  return (
    <div
      className={classNames(
        `relative flex h-full min-w-[56px] cursor-pointer items-center py-[2px] px-2  align-middle text-xs duration-300  ${
          isActive ? 'text-active-font' : 'text-header-nav-font'
        }`,
        className
      )}
      onClick={onClick}
    >
      {isActive && (
        <motion.div
          layoutId="active-upcoming-pill "
          className="absolute inset-0 bg-active "
        />
      )}
      <span className="relative z-10">{label}</span>
    </div>
  );
}

// if REACT_SWAP_SPORT_TYPE_DATE_FILTER is true
function DateFilterButtons({
  isActive,
  label,
  onClick,
  className = '',
  ...props
}) {
  return (
    <div
      className={classNames(
        ` min-w-28  m-0 flex h-8 shrink-0 items-center justify-center gap-x-2  truncate rounded-full px-4 py-0.5 text-sm md:h-7  md:rounded-none ${
          isActive
            ? ' bg-active text-active-font'
            : 'bg-secondary-button text-secondary-button-font'
        } `,
        className
      )}
      {...props}
      onClick={onClick}
    >
      <span>{label}</span>
    </div>
  );
}

function SportTypeFilterItems({ isActive, label, onClick, className = '' }) {
  return (
    <div
      className={classNames(
        `relative flex h-full min-w-[56px] cursor-pointer items-center py-[2px] px-2  align-middle text-xs duration-300  ${
          isActive ? 'text-active-font' : 'text-header-nav-font'
        }`,
        className
      )}
      onClick={onClick}
    >
      {isActive && (
        <motion.div
          layoutId="active-upcoming-pill "
          className="absolute inset-0 bg-active "
        />
      )}
      <span className="relative z-10">{label}</span>
    </div>
  );
}

function MobileSearchBar({ onKeyDown, onChange }) {
  return (
    <motion.div
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -15, opacity: 0 }}
      className="flex w-full"
    >
      <input
        className="placeholder-text-field-ph mx-1 flex h-8 w-full  rounded-full bg-primary-900 px-4 text-font-dark outline-none "
        type="search"
        name="search"
        placeholder="search game "
        id="searchField"
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </motion.div>
  );
}

const ListHomeEvents = forwardRef(function ListHomeEvents(
  { sortBy, grouped_Data, grouped_Date_Data },
  forwardRef
) {
  const [pageSize, setPageSize] = useState(20);

  const selectedPage = useSelector((state) => state.Event.selectedPage);
  const dispatch = useDispatch();

  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  const changePage = (page) => {
    dispatch(updateEventPage({ selectedPage: page - 1 }));
  };

  return (
    <div className="flex flex-col gap-1 bg-primary-400">
      <div className="flex flex-col gap-y-[1px]">
        {sortBy == 'LEAGUE' && grouped_Data
          ? grouped_Data
              ?.map((gd, i) => {
                // console.log(gd);
                if (sortBy != 'LEAGUE') return null;
                if (
                  i >= selectedPage * pageSize &&
                  i <= selectedPage * pageSize + pageSize
                ) {
                  return (
                    <TodayMatchCard ref={forwardRef} key={i} i={i} gd={gd} />
                  );
                } else return null;
              })
              .filter((gd) => gd != null)
          : ''}
        {sortBy == 'TIME' && grouped_Date_Data
          ? [...Object.keys(grouped_Date_Data)]
              ?.map((gd, i) => {
                if (
                  !grouped_Date_Data[gd] ||
                  grouped_Date_Data[gd].length == 0
                ) {
                  return null;
                }
                return (
                  <DateMatchCard
                    key={i}
                    i={gd.id}
                    ref={forwardRef}
                    gd={grouped_Date_Data[gd][0]}
                    events={grouped_Date_Data[gd]}
                    date={gd}
                  />
                );
              })
              .filter((gd) => gd != null)
          : ''}

        {grouped_Data?.length > pageSize && (
          <div className="my-5 flex w-full items-center justify-center text-font-light ">
            <Pagination
              current={selectedPage + 1}
              total={grouped_Data.length}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              pageSize={pageSize}
              onShowSizeChange={changePageSize}
              onChange={changePage}
            />
          </div>
        )}
      </div>
    </div>
  );
});
