import { Pagination, Row } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { BiCalendar, BiCalendarAlt, BiChevronDown } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useCoreData } from '../hooks/useCoreData';
import { useEvent } from '../hooks/useEvent';
// import { updateEventPage } from '../store/eventSlice';
import TodayMatchCard from './TodayMatchCard';
import TodayMatchViewLoader from './TodayMatchViewLoader';
import HuluDatePicker from '@components/HuluDatePicker';
import { Popover, Transition } from '@headlessui/react';

function UpComing() {
  const [upComingDate, setUpComingDate] = useState(0);
  const [sortBy, setSortBy] = useState('LEAGUE');
  const [expand, setExpand] = useState(false);
  const [openDate, setOpenDate] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [grouped_Data, setGroupedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);

  const coreData = useSelector((state) => state.coreData);
  const leagues = useSelector((state) => state.coreData?.leagues);

  const groupedData = useSelector((state) => state.Event?.groupedData);
  const sportTypeEvents = useSelector(
    (state) => state.coreData.sportTypeEvents
  );
  const league_groups = useSelector((state) => state.coreData?.league_groups);

  // const selectedPage = useSelector((state) => state.Event.selectedPage);
  const { getLogoBySportType } = useEvent();
  const { getData } = useCoreData();
  let { id } = useParams();
  const dispatch = useDispatch();

  const upcomingMatchRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (upcomingMatchRef.current !== null) {
      upcomingMatchRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [upcomingMatchRef.current]);

  useEffect(() => {
    if (id && coreData.coreData !== undefined && coreData.coreData.leagues)
      getData(2, id);
    setSelectedPage(0);
  }, [id, coreData]);

  useEffect(() => {
    if (groupedData != undefined && groupedData?.length != 0) {
      sortBy === 'LEAGUE' ? organiseByLeague() : organiseByTime();
    }
  }, [groupedData]);

  useEffect(() => {
    if (sortBy === 'LEAGUE') {
      // SORT BY LEAGUE
      organiseByLeague();
    } else {
      // SORT BY TIME
      sportTypeEvents[id] && organiseByTime();
    }
  }, [sortBy, selectedDate, upComingDate]);

  const organiseByLeague = () => {
    let new_grouped_data = groupedData
      ? groupedData?.map((g) => {
          let currentDate = selectedDate;
          if (selectedDate == null && upComingDate != 'other') {
            currentDate = moment()
              .add(upComingDate, 'days')
              .format('DD/MM/YYYY'); // Current Date
          }
          let hasEvent = g.events.some(
            (event) =>
              moment(event.schedule).format('DD/MM/YYYY') == currentDate
          );
          if (hasEvent) {
            let upcoming_data = { ...g };
            let valid_events = g.events.filter(
              (event) =>
                moment(event.schedule).format('DD/MM/YYYY') == currentDate
            );
            upcoming_data.events = valid_events;
            upcoming_data.text = leagues[g.id].name;
            upcoming_data.locales = leagues[g.id].locales;
            return upcoming_data;
          }
        })
      : [];
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (a.events.length < 2) return 0;
      return a.order > b.order ? 1 : -1;
    });
    new_grouped_data && setGroupedData([...new_grouped_data]);
  };

  const organiseByTime = () => {
    let new_grouped_data = sportTypeEvents[id]
      ?.map((event) => {
        const league_data = leagues[event.league];
        const groupData = { ...league_groups[league_data.league_group] };
        groupData.events = [{ ...event }];
        groupData.text = league_data.name;
        groupData.locales = league_data.locales;
        groupData.icon = groupData.logo;
        const gd = groupData;

        return gd;
      })
      .filter((g) => {
        let currentDate = selectedDate;
        if (selectedDate == null && upComingDate != 'other') {
          currentDate = moment().add(upComingDate, 'days').format('DD/MM/YYYY'); // Current Date
        }
        return g.events.some(
          (event) => moment(event.schedule).format('DD/MM/YYYY') == currentDate
        );
      });
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (a.events.length < 2) return 0;
      return (
        moment(a.events[0].schedule) - moment(b.events[0].schedule) ||
        a.order - b.order
      );
    });
    setGroupedData([...new_grouped_data]);
  };

  const changePage = (page, pageSize) => {
    // dispatch(updateEventPage({ selectedPage: page - 1 }));
    setSelectedPage(page - 1);
  };
  const changePageSize = (current, size) => {
    setPageSize(size);
  };
  const changeTimeFilter = (time) => {
    setUpComingDate(time);
    setSelectedDate(null);
    setCurrentDate(null);
    setExpand(false);
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
        ref={upcomingMatchRef}
        className="flex h-9  items-center bg-secondary-600 px-2"
        onClick={() => {
          // console.log('change view to Type');
        }}
      >
        <img
          src={getLogoBySportType(id)}
          alt="Icon"
          className="flex w-5 items-center justify-start"
        />
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-lg uppercase text-white md:text-xl ">
            {t('upcoming')}
          </span>
        </div>
        {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
        <></>
      </div>
      {grouped_Data && grouped_Data?.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-col justify-between gap-x-4 gap-y-2  bg-secondary-700 px-4  py-2 pt-4 text-white md:h-20 md:flex-row">
            <div className="p-x-2 flex h-full flex-col items-end justify-center gap-y-2 md:items-start">
              <span className="hidden justify-start text-xs md:flex md:justify-center md:text-base">
                {t('OrganizeGamesBy')}
              </span>
              <div className="relative flex h-7 flex-row gap-x-2 rounded bg-secondary-900 p-1 text-white">
                {toggle.map((tab) => {
                  return (
                    <div
                      key={tab.id}
                      className={`relative cursor-pointer py-[2px]  px-2 text-xs text-white duration-300`}
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
            <div className="p-x-2 flex flex-col items-end justify-center gap-y-2">
              <span className="hidden justify-start text-xs md:flex md:text-base">
                {t('FilterGamesByTime')}
              </span>
              <div className="relative flex h-7 w-fit flex-row justify-end gap-x-1 rounded bg-secondary-900 p-1 text-white">
                <div className="flex h-full overflow-auto">
                  {day_filter_list.map((tab) => {
                    return (
                      <div
                        key={tab.id}
                        className={`relative cursor-pointer py-[2px]  px-2 text-xs text-white duration-300`}
                        onClick={tab.action}
                      >
                        {upComingDate == tab.id && (
                          <motion.div
                            layoutId="active-upcoming-pill "
                            className="absolute inset-0 rounded bg-secondary-200 "
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </div>
                    );
                  })}
                </div>
                {/* <div className="flex h-full w-full overflow-auto">
                  <span
                    className={` ${
                      upComingDate == 0 ? 'bg-secondary-200' : ''
                    } cursor-pointer rounded py-[2px] px-2 text-xs duration-300`}
                    onClick={() => changeTimeFilter(0)}
                  >
                    {t('Today')}
                  </span>
                  <span
                    className={` ${
                      upComingDate == 1 ? 'bg-secondary-200' : ''
                    } cursor-pointer rounded py-[2px] px-2 text-xs duration-300`}
                    onClick={() => changeTimeFilter(1)}
                  >
                    {t('Tomorrow')}
                  </span>
                  <span
                    className={` ${
                      upComingDate == 2 ? 'bg-secondary-200' : ''
                    } cursor-pointer rounded py-[2px] px-2 text-xs duration-300  `}
                    onClick={() => changeTimeFilter(2)}
                  >
                    {i18n.resolvedLanguage == 'En'
                      ? moment().add(2, 'days').format('dddd')
                      : week_Days[moment().add(2, 'days').format('dddd')]}
                  </span>
                  <span
                    className={` ${
                      upComingDate == 3 ? 'bg-secondary-200' : ''
                    } cursor-pointer rounded py-[2px] px-2 text-xs duration-300  `}
                    onClick={() => changeTimeFilter(3)}
                  >
                    {i18n.resolvedLanguage == 'En'
                      ? moment().add(3, 'days').format('dddd')
                      : week_Days[moment().add(3, 'days').format('dddd')]}
                  </span>
                  <span
                    className={` ${
                      upComingDate == 4 ? 'bg-secondary-200' : ''
                    } cursor-pointer rounded py-[2px] px-2 text-xs duration-300  `}
                    onClick={() => changeTimeFilter(4)}
                  >
                    {i18n.resolvedLanguage == 'En'
                      ? moment().add(4, 'days').format('dddd')
                      : week_Days[moment().add(4, 'days').format('dddd')]}
                  </span>
                </div> */}
                <Popover className="relative flex items-center">
                  {({ open, close }) => (
                    <>
                      <Popover.Button
                        className={`
                                ${open ? '' : 'text-opacity-90'}
                                group relative inline-flex items-center justify-center rounded-md font-medium text-white ring-0 hover:text-opacity-100 focus:outline-none focus-visible:ring-0 `}
                      >
                        {open || selectedDate != '' ? (
                          <BiCalendarAlt
                            className="text-2xl text-white"
                            onClick={() => setExpand(true)}
                          />
                        ) : (
                          <BiCalendar
                            className="text-2xl text-white"
                            onClick={() => setExpand(true)}
                          />
                        )}
                        {selectedDate && (
                          <span className="absolute mt-[3px] text-[10px] text-white ">
                            {moment(selectedDate, 'DD/MM/YYYY').date()}
                          </span>
                        )}
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 top-6 z-10 mt-3">
                          <HuluDatePicker
                            className="w-64 rounded-md bg-white pt-8 xs:w-80"
                            disabledDate={true}
                            defaultDate={currentDate}
                            onChange={(date) => {
                              if (date == null) {
                                setExpand(false);
                                setSelectedDate(null);
                                setCurrentDate(null);
                                close();
                                return;
                              }
                              setOpenDate(false);
                              let selected = moment(date).format('DD/MM/YYYY');
                              setSelectedDate(selected);
                              setCurrentDate(date);
                              setUpComingDate('Other');
                              close();
                            }}
                          />
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Headers */}
      <div className="hidden h-9 w-full items-center bg-secondary-700 px-4 py-2 pt-4  md:flex">
        <div className=" flex w-16 items-center justify-center rounded-md px-2 lg:w-36 "></div>
        <div
          className={`flex h-4 w-2/5 cursor-pointer items-center justify-center rounded-md  px-4 `}
        >
          <span className="text-white "> {t('HOMETEAM')}</span>
        </div>
        <div
          className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md `}
        >
          <span className=" text-white "> {t('DRAW')}</span>
        </div>
        <div
          className={`flex h-4 w-2/5 cursor-pointer items-center justify-center rounded-md px-4 `}
        >
          <span className="text-white "> {t('VISITINGTEAM')}</span>
        </div>
        <div className="flex h-4 w-16 cursor-pointer items-center justify-center rounded-md ">
          <span className=" text-white "> {t('More')}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 bg-secondary-800">
        {grouped_Data && grouped_Data?.length > 0 && (
          <div className="flex flex-col gap-y-1 ">
            {grouped_Data
              ? grouped_Data
                  ?.map((gd, i) => {
                    if (
                      gd &&
                      i >= selectedPage * pageSize &&
                      i <= selectedPage * pageSize + pageSize
                    ) {
                      return <TodayMatchCard key={i} i={i} gd={gd} />;
                    } else {
                      return null;
                    }
                  })
                  .filter((gd) => gd != null)
              : ''}
          </div>
        )}
        {/* Pagination */}
        {grouped_Data && grouped_Data?.length > 0 && (
          <div className="flex justify-center">
            {grouped_Data?.length > 20 && (
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
            )}
            {sportTypeEvents[id]?.length > 20 && sortBy !== 'LEAGUE' && false && (
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
                    total={sportTypeEvents[id].length}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    pageSize={pageSize}
                    onShowSizeChange={changePageSize}
                    onChange={changePage}
                  />{' '}
                </center>
              </Row>
            )}
          </div>
        )}
      </div>

      {(grouped_Data == undefined || grouped_Data.length == 0) && (
        <div ref={upcomingMatchRef} className="flex flex-col gap-y-2">
          {[...Array(3).keys()].map((i, index) => {
            return <TodayMatchViewLoader key={index} index={index} />;
          })}
          <div className="flex h-9 items-center justify-center gap-x-2">
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            <div className="flex items-center justify-center gap-x-1  text-white">
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
    </div>
  );
}

export default UpComing;
