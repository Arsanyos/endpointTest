import { Pagination, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useCoreData } from '../hooks/useCoreData';
import { useEvent } from '../hooks/useEvent';
import { updateEventPage } from '../store/eventSlice';
import TodayMatchCard from './TodayMatchCard';
import TodayMatchViewLoader from './TodayMatchViewLoader';

function TodayMatchView() {
  const [filterBy, setFilterBy] = useState('ALL');
  const [sortBy, setSortBy] = useState('LEAGUE');
  const [expand, setExpand] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [grouped_Data, setGroupedData] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);

  const coreData = useSelector((state) => state.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);

  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const config = useSelector((state) => state.configuration);

  const groupedData = useSelector((state) => state.Event.groupedData);
  const league_groups = useSelector((state) => state.coreData.league_groups);
  const selectedEventGames = useSelector(
    (state) => state.Event.selectedEventGames
  );
  const sportTypeEvents = useSelector(
    (state) => state.coreData.sportTypeEvents
  );
  const selectedGameMenu = useSelector(
    (state) => state.selectedMenu.selectedGameMenu
  );
  // const selectedPage = useSelector((state) => state.Event.selectedPage);
  const { getLogoBySportType } = useEvent();
  const { getData } = useCoreData();
  const navigate = useNavigate();
  let { id } = useParams();
  const dispatch = useDispatch();

  const todayMatchRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (todayMatchRef.current !== null) {
      todayMatchRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [todayMatchRef, todayMatchRef.current]);

  useEffect(() => {
    // console.log(selectedGameMenu);
    if (id && coreData.coreData !== undefined && coreData.coreData.leagues)
      getData(2, id);
    setSelectedPage(0);
  }, [id, coreData]);

  useEffect(() => {
    if (groupedData != undefined && groupedData?.length != 0) {
      // setGroupedData([...groupedData]);
      sortBy === 'LEAGUE'
        ? organiseByLeague(filterBy)
        : organiseByTime(filterBy);
    }
  }, [groupedData]);

  // TODO: sort and filter
  useEffect(() => {
    if (sortBy === 'LEAGUE') {
      // SORT BY LEAGUE
      organiseByLeague(filterBy);
    } else {
      // SORT BY TIME
      organiseByTime(filterBy);
    }
  }, [sortBy, filterBy]);

  const organiseByLeague = (filterBy) => {
    // console.log(league_events[id]);
    // console.log(groupedData);
    let new_grouped_data = groupedData
      ? groupedData
          .map((g) => {
            let todays_events = { ...g };
            let valid_events = g.events.filter((event) => {
              const gameTime = moment(event.schedule);
              const now = moment(); //FIXME:  it should use current time from user or server time should upate regularly
              if (filterBy === 'ALL')
                return (
                  gameTime.format('MM DD YYYY') == now.format('MM DD YYYY')
                );
              const diff = Math.abs(
                moment.duration(gameTime.diff(now)).asHours()
              );
              return diff <= filterBy;
            });
            if (valid_events.length == 0) return null;
            todays_events.events = valid_events;
            todays_events.text = leagues[g.id].name;
            return todays_events;
          })
          .filter((item) => item)
      : [];
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (a.events.length < 2) return 0;
      return a.order > b.order ? 1 : -1;
    });
    setGroupedData([...new_grouped_data]);
  };

  const organiseByTime = (filterBy) => {
    let new_grouped_data = sportTypeEvents[id]
      ?.map((event) => {
        const league_data = leagues[event.league];
        const groupData = { ...league_groups[league_data.league_group] };
        groupData.events = [{ ...event }];
        groupData.text = league_data.name;
        groupData.icon = groupData.logo;
        const gd = groupData;

        return gd;
      })
      .map((g) => {
        let todays_events = { ...g };
        let valid_events = g.events.filter((event) => {
          const gameTime = moment(event.schedule);
          const now = moment(); //FIXME:  it should use current time from user or server time should upate regularly
          if (filterBy === 'ALL')
            return gameTime.format('MM DD YYYY') == now.format('MM DD YYYY');
          const diff = Math.abs(moment.duration(gameTime.diff(now)).asHours());
          return (
            diff <= filterBy &&
            gameTime.format('MM DD YYYY') == now.format('MM DD YYYY')
          );
        });
        if (valid_events.length == 0) return null;
        todays_events.events = valid_events;
        return todays_events;
      })
      .filter((item) => item);

    // console.log(new_grouped_data);
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (a.events.length < 2) return 0;
      // if (moment(a.events[0].schedule) < moment(b.events[0].schedule)) {
      //   return -1;
      // }
      // if (moment(a.events[0].schedule) > moment(b.events[0].schedule)) {
      //   return 1;
      // }
      return (
        moment(a.events[0].schedule) - moment(b.events[0].schedule) ||
        a.order - b.order
      );
    });
    setGroupedData([...(new_grouped_data ? new_grouped_data : [])]);
  };

  const changePage = (page, pageSize) => {
    // dispatch(updateEventPage({ selectedPage: page - 1 }));
    setSelectedPage(page - 1);
  };
  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  const hours_filter_list = [
    {
      id: 'ALL',
      label: t('All'),
      hour: 'ALL',
    },
    {
      id: 12,
      label: ` 12 ${t('Hours')}`,
      hour: 12,
    },
    {
      id: 6,
      label: ` 6 ${t('Hours')}`,
      hour: 6,
    },
    {
      id: 3,
      label: ` 3 ${t('Hours')}`,
      hour: 3,
    },
    {
      id: 1,
      label: ` 1 ${t('Hours')}`,
      hour: 1,
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

  // console.log(selectedGameMenu);
  // console.log(groupedData);

  return (
    <>
      {groupedData && groupedData?.length > 0 && (
        <div className="flex h-full flex-col md:overflow-x-auto">
          <div
            ref={todayMatchRef}
            className="flex h-9  items-center bg-secondary-600 px-2"
            onClick={() => {
              console.log('change view to Type');
            }}
          >
            <img
              src={getLogoBySportType(groupedData[0]?.sport_type)}
              alt="Icon"
              className="flex w-5 items-center justify-start"
            />
            <div className="flex w-full items-center justify-center ">
              <span className="flex items-center text-lg uppercase text-font-light md:text-xl ">
                {t('TodaysGame')}
              </span>
            </div>
            {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
            <></>
          </div>
          <div className="flex  w-full flex-col  gap-y-1 ">
            <div className="flex flex-col gap-y-1">
              <div className="mt-1 flex w-full flex-col justify-between gap-x-4  bg-secondary-700 px-4  py-2 pt-4 text-font-light md:h-20 md:flex-row">
                <div className="p-x-2 flex h-full flex-col items-end justify-center gap-y-2 md:items-start">
                  <span className="flex justify-start text-xs md:justify-center md:text-base">
                    ORGANIZE GAMES BY
                  </span>
                  <div className="relative flex h-8 w-fit flex-row gap-x-2 rounded bg-secondary-900 p-1 text-font-light">
                    {/* <span
                      className={` ${
                        sortBy == 'LEAGUE' ? 'bg-secondary-200' : ''
                      } min-w-fit cursor-pointer rounded px-2 py-[2px] text-xs md:text-base`}
                      onClick={() => {
                        changePage(1, pageSize);
                        setSortBy('LEAGUE');
                      }}
                    >
                      Leagues
                    </span>
                    <span
                      className={` ${
                        sortBy == 'TIME' ? 'bg-secondary-200' : ''
                      } min-w-fit cursor-pointer rounded px-2 py-[2px] text-xs md:text-base`}
                      onClick={() => {
                        changePage(1, pageSize);
                        setSortBy('TIME');
                      }}
                    >
                      Start Time
                    </span> */}

                    {toggle.map((tab) => {
                      return (
                        <div
                          key={tab.id}
                          className={`relative cursor-pointer py-[2px]  px-2 text-xs text-font-light duration-300`}
                          onClick={() => {
                            changePage(1, pageSize);
                            setSortBy(tab.filter);
                          }}
                        >
                          {sortBy == tab.id && (
                            <motion.div
                              layoutId="today-toggle-pill "
                              className="absolute inset-0 rounded bg-secondary-200 "
                            />
                          )}
                          <span className="relative z-10 ">{tab.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-x-2 flex h-full w-full flex-col justify-center gap-y-2 md:w-fit">
                  <span className="flex justify-start text-xs md:text-base">
                    FILTER GAMES BY TIME
                  </span>
                  <div className="flex h-8 flex-row-reverse gap-x-2 rounded bg-secondary-900 p-1 text-font-light">
                    {hours_filter_list.map((tab) => {
                      return (
                        <div
                          key={tab.id}
                          className={`relative cursor-pointer py-[2px]  px-2 text-xs text-font-light duration-300`}
                          onClick={() => setFilterBy(tab.hour)}
                        >
                          {filterBy == tab.id && (
                            <motion.div
                              layoutId="active-today-pill "
                              className="absolute inset-0 rounded bg-secondary-200 "
                            />
                          )}
                          <span className="relative z-10 ">{tab.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* <div className="flex h-8 flex-row-reverse gap-x-2 rounded bg-secondary-900 p-1 text-font-light">
                    <span
                      className={` ${
                        filterBy == 'ALL' ? 'bg-secondary-200' : ''
                      } min-w-fit cursor-pointer rounded py-[2px]  px-4 text-xs duration-300 md:text-base`}
                      onClick={() => setFilterBy('ALL')}
                    >
                      All
                    </span>
                    <span
                      className={` ${
                        filterBy == 12 ? 'bg-secondary-200' : ''
                      } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                      onClick={() => setFilterBy(12)}
                    >
                      12 hours
                    </span>
                    <span
                      className={` ${
                        filterBy == 6 ? 'bg-secondary-200' : ''
                      } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                      onClick={() => setFilterBy(6)}
                    >
                      6 hours
                    </span>
                    <span
                      className={` ${
                        filterBy == 3 ? 'bg-secondary-200' : ''
                      } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                      onClick={() => setFilterBy(3)}
                    >
                      3 hours
                    </span>
                    <span
                      className={` ${
                        filterBy == 1 ? 'bg-secondary-200' : ''
                      } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                      onClick={() => setFilterBy(1)}
                    >
                      1 hour
                    </span>
                  </div> */}
                </div>
              </div>
              <div className="hidden h-9 w-full items-center bg-secondary-700 px-4 py-2 pt-4  md:flex">
                <div className=" flex w-16 items-center justify-center rounded-md px-2 lg:w-36 "></div>
                <div
                  className={`flex h-4 w-full flex-1 cursor-pointer items-center justify-center rounded-md  px-4 `}
                >
                  <span className="text-font-light "> HOME</span>
                </div>
                <div
                  className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md `}
                >
                  <span className=" text-font-light "> DRAW</span>
                </div>
                <div
                  className={`flex h-4 w-full flex-1 cursor-pointer items-center justify-center rounded-md px-4 `}
                >
                  <span className="text-font-light "> AWAY</span>
                </div>
                <div className="flex h-4 w-16 cursor-pointer items-center justify-center rounded-md ">
                  <span className=" text-font-light "> MORE</span>
                </div>
              </div>
            </div>
            {selectedGameMenu == 2 && grouped_Data
              ? grouped_Data
                  ?.map((gd, i) => {
                    // console.log(this.state.activeSportTypeID,gd,i)
                    // var iconType = expand && sportTypeId == st.id ? 'minus' : 'plus';
                    if (
                      gd &&
                      i >= selectedPage * pageSize &&
                      i <= selectedPage * pageSize + pageSize
                    ) {
                      return <TodayMatchCard i={i} gd={gd} />;
                    } else {
                      return null;
                    }
                  })
                  .filter((gd) => gd != null)
              : ''}
          </div>
          <div className="flex justify-center">
            {selectedGameMenu == 2 ? (
              grouped_Data?.length <= 20 ||
              selectedGameMenu == 7 ||
              selectedGameMenu == 6 ||
              selectedGameMenu == 'promotion' ? (
                ''
              ) : (
                <Row className="fullTable">
                  <center
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      marginTop: '15px',
                    }}
                  >
                    {' '}
                    <Pagination
                      current={selectedPage + 1}
                      total={grouped_Data.length}
                      pageSizeOptions={[5, 10, 20, 50, 100]}
                      pageSize={pageSize}
                      onShowSizeChange={changePageSize}
                      onChange={changePage}
                    />{' '}
                  </center>
                </Row>
              )
            ) : (
              ''
            )}
          </div>
        </div>
      )}
      {(grouped_Data == undefined || grouped_Data.length == 0) && (
        <div ref={todayMatchRef} className="flex flex-col gap-y-2">
          {[...Array(3).keys()].map((i, index) => {
            return <TodayMatchViewLoader key={index} index={index} />;
          })}
          <div className="flex h-9 items-center justify-center gap-x-2">
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <div className="flex items-center justify-center gap-x-1  text-font-light">
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
            </div>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
          </div>
        </div>
      )}
    </>
  );
}

export default TodayMatchView;
