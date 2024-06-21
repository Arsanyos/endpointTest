import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { useCoreData } from '../hooks/useCoreData';
import { useEvent } from '../hooks/useEvent';

import { updateConfigurationsCountryFilterTime } from '@ReduxStore/configurationSlice';
import ClientSession from '@services/client-session';
import { AiOutlineSearch, AiOutlineTrophy } from 'react-icons/ai';
import { MdAccessTime } from 'react-icons/md';
import TodayMatchCard from './TodayMatchCard';
import TodayMatchPaginationLoader from './TodayMatchPaginationLoader';
import TodayMatchViewLoader from './TodayMatchViewLoader';

function MatchList() {
  const [upComingDate, setUpComingDate] = useState('All');
  const [sortBy, setSortBy] = useState('LEAGUE');
  const [grouped_Data, setGroupedData] = useState([]);
  const [selected_grouped_data, setSelectedGroupedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [searchValue, setSearchValue] = useState('');

  const coreData = useSelector((state) => state.coreData);

  const groupedData = useSelector((state) => state.Event?.groupedData);
  const sportTypeEvents = useSelector(
    (state) => state.coreData.sportTypeEvents
  );
  const countryTimeFilter = useSelector(
    (state) => state.configuration.countryTimeFilter
  );

  const { organiseByLeague, organiseByTime, searchLeagueEvent } = useEvent();

  const { getData } = useCoreData();
  let { sportId, countryId } = useParams();

  const matchListRef = useRef(null);
  const isVisibleRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (matchListRef.current !== null) {
      matchListRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [matchListRef.current]);

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
    if (sportId && coreData.coreData !== undefined && coreData.coreData.leagues)
      getData(0, sportId);
  }, [sportId, countryId, coreData.coreData]);

  useEffect(() => {
    const filtered_data = searchLeagueEvent(searchValue, selected_grouped_data);
    setGroupedData(filtered_data);
  }, [searchValue, selected_grouped_data]);

  // useEffect(() => {
  //   // if (groupedData != undefined && groupedData?.length != 0) {
  //   // console.log(sortBy);
  //   sortBy === 'LEAGUE' ? sortByLeague() : sortByTime();
  //   // }
  //   console.log(sportId, countryId, groupedData);
  // }, [groupedData]);

  useEffect(() => {
    if (sortBy === 'LEAGUE') {
      // SORT BY LEAGUE
      sortByLeague();
    } else {
      // SORT BY TIME
      sportTypeEvents[sportId] && sortByTime();
    }
  }, [
    sortBy,
    sportId,
    countryId,
    selectedDate,
    countryTimeFilter,
    groupedData,
    coreData.coreData,
  ]);

  useEffect(() => {
    if (search) {
      searchMatch(search.substring(1).replace('%20', ' ')); // REMOVE "?" and replace'%20' with SPACE from search
    }
  }, [search]);

  const sortByLeague = () => {
    let new_grouped_data = organiseByLeague(
      sportId,
      selectedDate,
      countryTimeFilter,
      countryId || 'All'
    );
    // console.log(new_grouped_data);
    new_grouped_data && setGroupedData([...new_grouped_data]);
    new_grouped_data && setSelectedGroupedData([...new_grouped_data]);
  };

  const sortByTime = () => {
    let new_grouped_data = organiseByTime(
      sportId,
      selectedDate,
      countryTimeFilter,
      countryId || 'All'
    );
    new_grouped_data && setGroupedData([...new_grouped_data]);
    new_grouped_data && setSelectedGroupedData([...new_grouped_data]);
  };

  const changeTimeFilter = (time) => {
    setUpComingDate(time);
    setSelectedDate(null);
    dispatch(
      updateConfigurationsCountryFilterTime({ countryTimeFilter: time })
    );
  };

  const searchMatch = (value) => {
    setSearchValue(value);
    // Navigate({
    //   pathname: 'search',
    //   search: value.toLowerCase(),
    // });
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
      id: 'All',
      label: t('All'),
      action: () => changeTimeFilter('All'),
    },
    {
      id: 0,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(0, 'days').format('ddd')
          : week_Days[moment().add(0, 'days').format('dddd')],
      action: () => changeTimeFilter(0),
    },
    {
      id: 1,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(1, 'days').format('ddd')
          : week_Days[moment().add(1, 'days').format('dddd')],
      action: () => changeTimeFilter(1),
    },
    {
      id: 2,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(2, 'days').format('ddd')
          : week_Days[moment().add(2, 'days').format('dddd')],
      action: () => changeTimeFilter(2),
    },
    {
      id: 3,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(3, 'days').format('ddd')
          : week_Days[moment().add(3, 'days').format('dddd')],
      action: () => changeTimeFilter(3),
    },
    {
      id: 4,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(4, 'days').format('ddd')
          : week_Days[moment().add(4, 'days').format('dddd')],
      action: () => changeTimeFilter(4),
    },
    {
      id: 5,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(5, 'days').format('ddd')
          : week_Days[moment().add(5, 'days').format('dddd')],
      action: () => changeTimeFilter(5),
    },
    {
      id: 6,
      label:
        i18n.resolvedLanguage == 'En'
          ? moment().add(6, 'days').format('ddd')
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
      {/* Title bar */}
      <div
        ref={matchListRef}
        className="flex h-9 items-center justify-start bg-primary-600 "
      >
        <div className="relative flex h-full flex-row items-center gap-x-1 overflow-hidden  bg-primary-700 ">
          {day_filter_list.map((tab) => {
            return (
              <div
                key={tab.id}
                className={`relative flex h-full w-14 cursor-pointer items-center py-[2px] px-2  align-middle text-xs duration-300 ${
                  countryTimeFilter == tab.id
                    ? 'text-active-font'
                    : 'text-font-dark'
                }`}
                onClick={tab.action}
              >
                {countryTimeFilter == tab.id && (
                  <motion.div
                    layoutId="active-match-list-pill "
                    className="absolute inset-0 bg-active "
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIlTERS */}
      <div className="flex flex-col gap-y-1">
        <div className="flex w-full items-center justify-between gap-1  gap-x-[1px] py-[1px] md:flex-row">
          <div className="relative flex h-8 flex-row bg-primary-700 ">
            {toggle.map((tab) => {
              return (
                <div
                  key={tab.id}
                  className={`relative flex cursor-pointer items-center justify-center py-[2px]  px-2 text-xs duration-300 ${
                    sortBy == tab.id ? 'text-active-font' : 'text-font-dark'
                  }`}
                  onClick={() => {
                    setSortBy(tab.filter);
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
          <div className="item-center flex w-full flex-row justify-center">
            <input
              className="h-8 w-full bg-primary-600 px-4 text-font-light outline-none "
              type="search"
              name="search"
              placeholder={t('SearchGames')}
              id="searchField"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchMatch(searchValue);
                  // setOpen((prev) => !prev);
                }
              }}
              onChange={(e) => {
                setSearchValue(e.target.value);
                searchMatch(e.target.value);
              }}
            />
            <button
              id="searchBtn1"
              name="searchBtn1"
              className="text-f flex h-8 items-center justify-end gap-1 bg-active px-2 text-active-font"
              onClick={() => {
                searchMatch(searchValue);
                // setOpen((prev) => !prev);
              }}
            >
              <AiOutlineSearch className="" />
              <span>{t(`search`)}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 bg-secondary-800">
        {grouped_Data && grouped_Data?.length > 0 && (
          <div className="flex flex-col gap-y-1 ">
            {grouped_Data
              ? grouped_Data
                  ?.map((gd, i) => {
                    return (
                      <TodayMatchCard
                        ref={isVisibleRef}
                        key={i}
                        i={i}
                        gd={gd}
                      />
                    );
                  })
                  .filter((gd) => gd != null)
              : ''}
          </div>
        )}
      </div>

      {(grouped_Data == undefined || grouped_Data.length == 0) && (
        <div ref={matchListRef} className="flex flex-col gap-y-2">
          {[...Array(3).keys()].map((i, index) => {
            return <TodayMatchViewLoader key={index} index={index} />;
          })}
          <TodayMatchPaginationLoader />
        </div>
      )}
    </div>
  );
}

export default MatchList;
