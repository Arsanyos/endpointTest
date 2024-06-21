import React, { Fragment, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import moment from 'moment';

import { Pagination } from 'antd';
import { Popover, Transition } from '@headlessui/react';

import { BiCalendar, BiCalendarAlt } from 'react-icons/bi';

import { useBet } from '@hooks/useBet';

import Utils from '@services/utils';
import Empty from '@components/Empty';
import BetHistoryCard from '@components/BetHistoryCard';
import HuluDatePicker from '@components/HuluDatePicker';
import BetHistoryListLoader from '@components/LoaderPages/Jackpot/BetHistoryListLoader';

// ====================================================== Jackpot Bet History List ===============================================
export default function JackpotBetHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedPage, setSelectedPage] = useState(0);

  const [apiDataLength, setApiDataLength] = useState(0);
  const [jackpotBetHistory, setJackpotBetHistory] = useState([]);
  const [coreJackBetHistory, setCoreJackBetHistory] = useState([]);

  const [currentDate, setCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [filterBy, setFilterBy] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const jackpotBetRef = useRef(null);

  const { getJackpotHistory } = useBet();

  useEffect(() => {
    if (jackpotBetRef.current !== null) {
      jackpotBetRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [jackpotBetRef.current]);

  useEffect(() => {
    getJackBetHistory();
  }, [selectedPage]);

  useEffect(() => {
    if (coreJackBetHistory.length > 0) {
      if (filterBy != 'ALL') {
        const filteredBetHistory = coreJackBetHistory.filter((list) => {
          if (filterBy.toLocaleLowerCase() == 'other') {
            return moment(list.created_at).format('DD/MM/YYYY') == selectedDate;
          }
          let currentDate = moment();
          return moment(list.created_at).isSame(currentDate, filterBy); //filterBy: day, week, month and year
        });
        setJackpotBetHistory(filteredBetHistory);
        setLoading(false);
      } else {
        setJackpotBetHistory(coreJackBetHistory);
        setLoading(false);
      }
    }
  }, [filterBy, coreJackBetHistory]);

  const getJackBetHistory = async () => {
    setLoading(true);
    const data = await getJackpotHistory(selectedPage);
    
    setApiDataLength(data.jackpotHistoryData?.count);
    if (data.jackpotHistory?.length > 0) {
      setCoreJackBetHistory(data.jackpotHistory);
    } else {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    setSelectedPage(page - 1);
  };

  return (
    <div
      ref={jackpotBetRef}
      className="h-full w-full overflow-auto bg-table-container pb-16"
    >
      <div className="flex h-9 items-center justify-between bg-container-header px-2 text-lg uppercase text-white">
        <div>{t('Jackpot') + ' ' + t('Bet') + ' ' + t('History')}</div>
      </div>
      {/* FIlters */}
      {!loading && apiDataLength > 0 && (
        <div className="mt-1 flex w-full flex-col items-end justify-end gap-x-4  bg-table-body px-4  py-2 pt-4 text-table-body-font md:h-20 md:flex-row">
          <div className="p-x-2 flex h-full w-fit flex-col items-end justify-center gap-y-2 md:w-fit">
            <span className="flex justify-start text-xs md:text-base">
              FILTER BY TIME
            </span>
            <div className="flex h-8 flex-row items-center justify-end gap-x-2 rounded bg-header-nav p-1 text-white">
              <span
                className={` ${
                  filterBy == 'day' ? 'bg-active text-active-font' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('day');
                }}
              >
                Day
              </span>
              <span
                className={` ${
                  filterBy == 'week' ? 'bg-active text-active-font' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('week');
                }}
              >
                Week
              </span>
              <span
                className={` ${
                  filterBy == 'month' ? 'bg-active text-active-font' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('month');
                }}
              >
                Month
              </span>
              <span
                className={` ${
                  filterBy == 'year' ? 'bg-active text-active-font' : ''
                } min-w-fit  cursor-pointer rounded py-[2px] px-2 text-xs duration-300 md:text-base  `}
                onClick={() => {
                  setFilterBy('year');
                }}
              >
                Year
              </span>

              <Popover className="relative flex items-center">
                {({ open, close }) => (
                  <>
                    <Popover.Button
                      className={`
                                ${open ? '' : 'text-opacity-90'}
                                group  relative inline-flex items-center justify-center rounded-md font-medium text-white ring-0 hover:text-opacity-100 focus:outline-none focus-visible:ring-0 `}
                    >
                      {open || selectedDate != '' || selectedDate === null ? (
                        <BiCalendarAlt className="text-2xl text-white" />
                      ) : (
                        <BiCalendar className="text-2xl text-white" />
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
                          className="w-64 rounded-md bg-white pt-8 xs:w-80"
                          isFutureDisabled={true}
                          defaultDate={currentDate}
                          onChange={(date) => {
                            if (date == null) {
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
      {!loading && jackpotBetHistory?.length > 0 && (
        <>
          <div className="mt-1 hidden w-full flex-col gap-y-[2px] md:flex ">
            <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header-font ">
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">{t('Date')}</div>
              </div>
              <div className="flex w-24 flex-row items-center gap-1 text-left">
                <span className="text-center ">{t('TicketID')}</span>
              </div>
              <div className="flex w-16 flex-row items-center gap-1 text-left ">
                <span className="text-center ">{t('Status')}</span>
              </div>
              <div className="flex w-16 flex-row items-center gap-1 text-left ">
                <span className="whitespace-nowrap text-center">
                  {t('MatchLost')}
                </span>
              </div>
              <div className="flex w-20 flex-row items-center gap-1 text-left ">
                <span className="text-left ">{t('Stake')}</span>
              </div>
              <div className="flex w-24 flex-row items-center gap-1 text-left ">
                <span className="text-left ">{t('PossibleWin')}</span>
              </div>
              <div className=" flex items-center gap-x-2">
                <span className="text-2xl font-bold" />
              </div>
            </div>
          </div>

          <div className="mt-1 flex w-full flex-col gap-y-[2px]  p-2 md:p-0 ">
            {jackpotBetHistory.map((list, i) => {
              const status =
                list.status == 3
                  ? 'win'
                  : list.status == 2
                  ? 'loss'
                  : list.status == 1
                  ? t('Open')
                  : t('Canceled');
              return (
                <BetHistoryCard
                  key={list.id}
                  hover={[1, 2, 3].includes(list.status)}
                  createdAt={Utils.displayTime(list.created_at, 'En')}
                  ticketID={list.id}
                  status={status}
                  matches={list.lost_count}
                  stake={list.stake}
                  win={list.won_amount}
                  onClick={() => {
                    navigate(`/history/jackpotDetail/${list.id}`);
                  }}
                />
              );
            })}
          </div>

          <center className="mt-2">
            <Pagination
              current={selectedPage + 1}
              total={apiDataLength || jackpotBetHistory.length}
              pageSize={10}
              onChange={changePage}
            />
          </center>
        </>
      )}
      {!loading && jackpotBetHistory?.length === 0 && (
        <Empty message={'No jackpot history for selected date.'} />
      )}

      {loading && <BetHistoryListLoader />}
    </div>
  );
}
