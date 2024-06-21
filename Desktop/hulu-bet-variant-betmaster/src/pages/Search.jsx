import MatchViewLoader from '@components/LoaderPages/MatchViewLoader';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// import MatchSearchView from '@components/MatchSearchView';
import { useEvent } from '@hooks/useEvent';

import { updateEventPage } from '@ReduxStore/eventSlice';

import { Pagination } from 'antd';

import { useTranslation } from 'react-i18next';
import MatchView from '@components/MatchView';

export default function Search({ search_value, onClose }) {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [events, setEvents] = useState([]);

  const coreData = useSelector((state) => state.coreData.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);
  const allEvents = useSelector((state) => state.coreData.allEvents);
  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const selectedPage = useSelector((state) => state.Event.selectedPage);

  const selectedEventGames = useSelector(
    (state) => state.Event.selectedEventGames
  );
  const { search } = useLocation();
  const { searchEvent } = useEvent();

  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (searchRef.current !== null) {
      searchRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [searchRef.current]);

  useEffect(() => setEvents([...allEvents]), [allEvents]);

  useEffect(() => {
    // console.log(search);
    if (search) {
      query(search.substring(1).replace('%20', ' ')); // REMOVE "?" and replace'%20' with SPACE from query
    }
  }, [search]);
  useEffect(() => {
    if (search_value) query(search_value);
  }, [search_value]);

  const query = (search) => {
    const data = searchEvent(search);
    setEvents(data);
  };

  const renderEvents = () => {
    const hasSomeDoubleChance = events.some((g) => g.win_odds.length > 3);
    return events
      .map((g, i) => {
        if (i >= selectedPage * 20 && i <= selectedPage * 20 + 20) {
          return (
            <MatchView
              coreData={coreData}
              leagues={leagues}
              bet_types={bet_types}
              market_filters={market_filters}
              lang={i18n.resolvedLanguage}
              hasDoubleChance={hasSomeDoubleChance}
              index={i}
              key={i}
              g={g}
              close={() => {
                if (typeof onClose === 'function') onClose();
              }}
            />
          );
        } else {
          return null;
        }
      })
      .filter((g) => g != null);
  };

  const changePage = (page, pageSize) => {
    dispatch(updateEventPage({ selectedPage: page - 1 }));
  };

  return (
    <div>
      <div
        ref={searchRef}
        className="hidden h-9 items-center  bg-secondary-600 pr-2 md:flex"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-sm capitalize text-white md:text-lg ">
            {t('SearchGames')}
          </span>
        </div>
        {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
        <></>
      </div>
      <div className="hidden w-full flex-col bg-secondary-700   md:flex">
        <div className="flex flex-row items-center gap-2 px-4 py-2 pt-4">
          <div className=" p-x-2 flex w-20 items-center justify-center rounded-md "></div>
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
            <span className=" text-white "> {t('MORE')}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {selectedEventGames.length > 0 ? (
          <>
            {events.length > 0 && renderEvents()}
            {events.length == 0 &&
              [...Array(10).keys()].map((i, index) => {
                return <MatchViewLoader key={index} index={index} />;
              })}
          </>
        ) : (
          <center
            style={{ fontSize: '20px', marginTop: '100px', color: '#4cae4e' }}
          >
            {t('NoGameAvailableAtTheMoment')}
          </center>
        )}
      </div>
      {/* )} */}
      {events.length <= 20 ? (
        ''
      ) : (
        <div className="fullTable">
          <center
            style={{ color: 'white', fontSize: '20px', marginTop: '15px' }}
          >
            <Pagination
              current={selectedPage + 1}
              total={events.length}
              pageSize={20}
              onChange={changePage}
            />
          </center>
        </div>
      )}
    </div>
  );
}
