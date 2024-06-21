import { DatePicker, Pagination } from 'antd';
import React, { Fragment, useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useBet } from '@hooks/useBet';
import Utils from '@services/utils';
import BetHistoryCard from '@components/BetHistoryCard';
import { BiCalendar, BiCalendarAlt } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import Empty from '@components/Empty';
import { Popover, Transition } from '@headlessui/react';
import HuluDatePicker from '@components/HuluDatePicker';

export default function BetHistory() {
  const [selectedPage, setSelectedPage] = useState(0);
  const [betHistory, setBetHistory] = useState([]);
  const [coreBetHistory, setCoreBetHistory] = useState([]);
  const [nextpageUrl, setNextpageUrl] = useState('');
  const [prevpageUrl, setPrevpageUrl] = useState('');
  const [apiDataLength, setApiDataLength] = useState(0);
  const [filterBy, setFilterBy] = useState('day');
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const navigate = useNavigate();
  const { getBetHistory } = useBet();
  const betRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (betRef.current !== null) {
      betRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [betRef.current]);
  // get bet history
  useEffect(() => {
    getData();
  }, [selectedPage]);

  useEffect(() => {
    // filter BY TIME
    if (filterBy != 'ALL') {
      // setLoading(true);
      let filtered_bet_history = coreBetHistory.filter((list) => {
        if (filterBy.toLocaleLowerCase() == 'other') {
          return moment(list.created_at).format('DD/MM/YYYY') == selectedDate;
        }
        let currentDate = moment();
        if (filterBy == 'day') {
          return moment(list.created_at).isSame(currentDate, filterBy);
        }
        if (filterBy == 'week') {
          let startDate = moment().subtract(7, 'days');
          return moment(list.created_at).isBetween(startDate, currentDate);
        }
        if (filterBy == 'month') {
          let startDate = moment().subtract(30, 'days');
          return moment(list.created_at).isBetween(startDate, currentDate);
        }
        if (filterBy == 'year') {
          let startDate = moment().subtract(365, 'days');
          return moment(list.created_at).isBetween(startDate, currentDate);
        }

        return moment(list.created_at).isSame(currentDate, filterBy); //filterBy: day, week, month and year
      });
      setBetHistory(filtered_bet_history);
      setLoading(false);
    } else {
      setBetHistory(coreBetHistory);
      setLoading(false);
    }
    // setLoading(false);
  }, [filterBy, coreBetHistory]);

  const getData = async () => {
    setLoading(true);
    const data = await getBetHistory(selectedPage);
    setBetHistory(data.betHistory);
    setCoreBetHistory(data.betHistory);
    setApiDataLength(data.apiDataLength);
    setNextpageUrl(data.nextpageUrl);
    setPrevpageUrl(data.prevpageUrl);
    setLoading(false);
  };

  const changePage = (page) => {
    setSelectedPage(page - 1);
  };

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > moment();
  };

  return (
    <div
      ref={betRef}
      className="h-full w-full overflow-auto bg-table-container pb-16"
    >
      <div className="flex h-9 items-center justify-between bg-container-header  px-2 text-lg uppercase text-white">
        <div
          className=" cursor-pointer hover:opacity-40 "
          onClick={() => {
            // navigate('/jackpots');
          }}
        >
          {/* <span className="text-2xl font-semibold">‹</span> */}
        </div>
        <div>{t('BetHistory')}</div>
        <div></div>
      </div>
      {coreBetHistory && coreBetHistory.length > 0 && (
        <div className="mt-1 flex w-full flex-col items-end justify-end gap-x-4  bg-table-body px-4  py-2 pt-4 text-table-body-font md:h-20 md:flex-row">
          <div className="p-x-2 flex h-full w-fit flex-col items-end justify-center gap-y-2 md:w-fit">
            <span className="flex justify-start text-xs md:text-base">
              FILTER BY TIME
            </span>
            <div className="flex h-8 flex-row items-center justify-end gap-x-2 rounded bg-header-nav p-1 text-white">
              <div
                role="button"
                className={` ${
                  filterBy == 'day' ? 'bg-active text-active-font ' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('day');
                  setExpand(false);
                }}
              >
                Day
              </div>
              <div
                role="button"
                className={` ${
                  filterBy == 'week' ? 'bg-active text-active-font ' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('week');
                  setExpand(false);
                }}
              >
                Week
              </div>
              <div
                role="button"
                className={` ${
                  filterBy == 'month' ? 'bg-active text-active-font ' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('month');
                  setExpand(false);
                }}
              >
                Month
              </div>
              <div
                role="button"
                className={` ${
                  filterBy == 'year' ? 'bg-active text-active-font ' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => setFilterBy('year')}
              >
                Year
              </div>
              <Popover className="relative flex items-center">
                {({ open, close }) => (
                  <>
                    <Popover.Button
                      className={`
                                ${open ? '' : 'text-opacity-90'}
                                group  relative inline-flex items-center justify-center rounded-md font-medium text-white ring-0 hover:text-opacity-100 focus:outline-none focus-visible:ring-0 `}
                    >
                      {open || selectedDate != '' || selectedDate === null ? (
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
                      {selectedDate && selectedDate != null && (
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
                          className=" w-64 rounded-md bg-white pt-8 text-black xs:w-80"
                          isFutureDisabled={true}
                          defaultDate={currentDate}
                          onChange={(date) => {
                            if (date == null) {
                              setExpand(false);
                              setSelectedDate(null);
                              setCurrentDate(null);
                              close();
                              return;
                            }

                            let selected = moment(date).format('DD/MM/YYYY');
                            setSelectedDate(selected);
                            setCurrentDate(date);
                            setFilterBy('Other');
                            close();
                          }}
                          defaultValue={
                            selectedDate ? moment(selectedDate) : ''
                          }
                        />
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {!loading && (
        <div className="mt-1 hidden w-full flex-col gap-y-[2px] md:flex ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header px-3 text-table-header-font">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center   ">{t('Date')}</div>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left ">
              <span className="text-center ">{t('TicketID')}</span>
            </div>
            <div className="flex w-16 flex-row items-center gap-1 text-left ">
              <span className="text-center ">{t('Status')}</span>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left ">
              <span className="text-left ">{t('MATCHES')}</span>
            </div>
            <div className="flex w-20 flex-row items-center gap-1 text-left ">
              <span className="text-left ">{t('Stake')}</span>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left ">
              <span className="text-left ">{t('PossibleWin')}</span>
            </div>
            <div className=" flex items-center gap-x-2">
              <span className="text-2xl font-bold"></span>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-1 overflow-auto">
        <div className="mt-1 flex w-full flex-col gap-y-[2px]  p-2 md:p-0  ">
          {!loading &&
            betHistory &&
            betHistory.length > 0 &&
            betHistory.map((list, i) => {
              return (
                <>
                  <BetHistoryCard
                    key={list.id}
                    hover={[1, 2, 3].includes(list.status)}
                    createdAt={Utils.displayTime(list.created_at, 'En')}
                    ticketID={list.ticketID}
                    status={list.status}
                    matches={list.matches}
                    stake={list.stake}
                    win={list.possible_win}
                    onClick={() => {
                      navigate(`/history/detail/${list.ticketID}`);
                    }}
                  />
                </>
              );
              // } else return null;
            })}
        </div>

        {loading && (
          <div className="mb-0.5 flex w-full animate-pulse flex-col gap-y-1 ">
            <div className="flex h-12 w-full  flex-row items-center justify-between bg-secondary-700 px-3 text-white ">
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="h-3  w-20 rounded-l-full rounded-r-full bg-slate-400 text-center"></div>
              </div>
              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
              {/* <div className="flex w-24 flex-row items-center gap-1 text-left ">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div> */}
              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
            </div>
          </div>
        )}
        {!loading && betHistory.length == 0 && (
          <Empty message={'No bet history for selected date.'} />
        )}
        {!loading && apiDataLength > 10 ? (
          <center>
            <Pagination
              current={selectedPage + 1}
              total={apiDataLength == 0 ? betHistory.length : apiDataLength}
              // total={betHistory.length}
              pageSize={10}
              onChange={changePage}
            />
          </center>
        ) : (
          ''
        )}
        {loading && (
          <div className="flex flex-col gap-y-[2px]">
            {[...Array(10).keys()].map((i, index) => {
              return (
                <div
                  key={index}
                  className={
                    'flex h-10 w-full animate-pulse flex-row items-center justify-between bg-secondary-700 px-3 text-white   shadow-lg '
                  }
                >
                  <div className="flex w-24 flex-col items-center gap-y-1">
                    <div className="h-2.5  w-20 rounded-r-full rounded-l-full bg-gray-400 text-center text-gray-400 "></div>
                  </div>

                  <div className="flex w-28 flex-row items-center gap-1 text-left text-gray-400">
                    <span className="h-2.5 w-24 rounded-l-full rounded-r-full bg-gray-400 text-left text-xs"></span>
                  </div>

                  <div className="justify-left flex w-24 flex-row items-center gap-1 ">
                    <span className="h-2.5 w-24 truncate rounded-l-full rounded-r-full bg-gray-400 text-left text-xs uppercase"></span>
                  </div>

                  {/* <div className="flex w-28 flex-row items-center gap-1 text-left ">
                    <span className="h-2.5 w-24 bg-gray-400 text-center text-xs rounded-l-full rounded-r-full"></span>
                  </div> */}
                  <div className="flex w-28 flex-row items-center gap-1 text-left ">
                    <span className="h-2.5 w-24 rounded-l-full rounded-r-full bg-gray-400 text-center text-xs"></span>
                  </div>
                </div>
              );
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
    </div>
  );
}
