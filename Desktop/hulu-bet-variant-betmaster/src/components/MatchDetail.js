import Icon from '@ant-design/icons/lib/components/Icon';
import { message, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useEvent } from '../hooks/useEvent';
import API from '../services/API';
import FormatEntity from '../services/format_entity';
import Utils from '../services/utils';
import { updateEventDetailCatch } from '../store/eventSlice';
import MatchDetailLoader from './MatchDetailLoader';
import MarketGroupViewer from './MarketGroupViewer';
import { updateMarketTypeFavs } from '@ReduxStore/coreDataSlice';
import ClientSession from '@services/client-session';
import { AiOutlineSearch } from 'react-icons/ai';

const antIcon = (
  <Icon type="loading" style={{ color: 'var(--primary)', fontSize: 34 }} spin />
);
export default function MatchDetail() {
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const [searchValue, setSearchValue] = useState('');

  const bet_groups = useSelector((state) => state.coreData.bet_groups);
  const leagues = useSelector((state) => state.coreData.leagues);
  const league_groups = useSelector((state) => state.coreData.league_groups);
  const market_filters = useSelector((state) => state.coreData.market_filters);
  const marketTypeFav = useSelector((state) => state.coreData.marketTypeFav);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [eventDetail, setEventDetail] = useState({});
  const [allMarketList, setAllMarketList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [filterMarketByType, setFilterMarketByType] = useState('All');

  const { isMarketTypeFav } = useEvent();

  const { id } = useParams();
  const navigate = useNavigate();
  const selectedRef = useRef(null);

  const { t, i18n } = useTranslation();
  const { searchMarket } = useEvent();

  const MAIN_MARKET = 1;
  const TOTAL = 2;
  const COMBINATIONS = 3;
  const HALF_TIME = 4;
  const HANDICAPS = 5;

  useEffect(() => {
    const marketTypeFavs = ClientSession.getMarketTypeFav();
    dispatch(updateMarketTypeFavs({ marketTypeFav: marketTypeFavs || [] }));
  }, []);
  useEffect(() => {
    if (id) getEventDetail(id);
  }, [id]);

  useEffect(() => {
    if (eventDetail?.items) {
      const filtered_market = searchMarket(searchValue, eventDetail?.items);
      setAllMarketList([...filtered_market]);
    }
  }, [searchValue, eventDetail?.items]);

  useEffect(() => {
    setTimeout(() => {
      if (selectedRef.current != null) {
        selectedRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start',
        });
      }
      return clearTimeout();
    }, 300);
  }, [selectedRef.current]);

  const processMarketData = () => {
    let market_types = {};
    allMarketList?.map((item) => {
      let i = { ...item };
      if (market_types[item.bet_group.id]) {
        let all_odds = [...market_types[item.bet_group.id].odds, ...i.odds];
        i.odds = [...all_odds];
      }
      market_types[item.bet_group.id] = i;
    });
    let markets = Object.values(market_types);
    markets = markets.sort((a, b) => {
      // INFO: uncomment to sort favs on top
      // if (isMarketTypeFav(a.bet_group.id)) {
      //   return -1;
      // }

      // if (isMarketTypeFav(b.bet_group.id)) {
      //   return 1;
      // }

      if (
        market_filters[MAIN_MARKET]?.includes(a.bet_group.id) &&
        market_filters[MAIN_MARKET]?.includes(b.bet_group.id)
      ) {
        if (a.bet_group.order < b.bet_group.order) {
          return -1;
        }
        if (a.bet_group.order > b.bet_group.order) {
          return 1;
        }
      }

      if (market_filters[MAIN_MARKET]?.includes(a.bet_group.id)) {
        return -1;
      }

      if (market_filters[MAIN_MARKET]?.includes(b.bet_group.id)) {
        return 1;
      }

      if (a.bet_group.order < b.bet_group.order) {
        return -1;
      }
      if (a.bet_group.order > b.bet_group.order) {
        return 1;
      }

      return 0;
    });
    // setAllMarketTypes(markets);
    return markets;
  };
  const allMarketTypes = useMemo(() => {
    return processMarketData();
  }, [allMarketList, marketTypeFav]);

  const getEventDetail = (id) => {
    // TODO: check catch time 2 mins
    if (
      eventDetailCatch != undefined &&
      eventDetailCatch[id] != null &&
      eventDetailCatch[id] != undefined
    ) {
      setLoading(false);
      setEventDetail(eventDetailCatch[id]);
      eventDetailCatch[id]?.items &&
        setAllMarketList(eventDetailCatch[id]?.items);
      setSelectedEvent(eventDetailCatch[id]);
      return eventDetailCatch[id];
    }
    setLoading(true);
    API.findWithNoToken(
      `sport-data/matches/${id}/?ln=${i18n.resolvedLanguage.toLowerCase()}`,
      null,
      null
    )
      .then((response) => {
        if (response.data) {
          let r = response.data;
          let i = r.items.sort((a, b) =>
            a.bet_group.order < b.bet_group.order ? -1 : 1
          );
          r.items = i;
          let edc = { ...eventDetailCatch };
          edc[id] = r;
          setLoading(false);
          dispatch(updateEventDetailCatch({ eventDetailCatch: edc }));
          setEventDetail(r);
          setAllMarketList(r?.items);
          setSelectedEvent(r);
        }
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response || !err.response.data) {
          return message.error('Error While Loading Data');
        }
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
        setLoading(false);
      });
  };
  const localizeBetGroups = (id, value) => {
    if (i18n.resolvedLanguage == 'Am') {
      if (
        bet_groups &&
        bet_groups[id] &&
        bet_groups[id]?.locales.filter((l) => l.locale == 1)[0]
      ) {
        return bet_groups[id].locales.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const search = (value) => {
    setSearchValue(value);
  };

  const MARKET_TYPE_LIST = [
    {
      id: 'fav',
      label: t('FAVOURITES'),
      filter: 'fav',
    },
    {
      id: 'All',
      label: t('All'),
      filter: 'All',
    },
    {
      id: 1,
      label: t('Main') + ' ' + t('Market'),
      filter: MAIN_MARKET,
    },
    {
      id: 2,
      label: t('Total'),
      filter: TOTAL,
    },
    {
      id: 3,
      label: t('Combinations'),
      filter: COMBINATIONS,
    },
    {
      id: 4,
      label: t('HalfTime'),
      filter: HALF_TIME,
    },

    {
      id: 5,
      label: t('Handicaps'),
      filter: HANDICAPS,
    },
  ];

  const renderSwitchs = () => {
    return (
      <div className="flex  w-full shrink-0 flex-row gap-x-2 overflow-x-auto px-1.5 pb-1  md:pb-0  ">
        {MARKET_TYPE_LIST.map((tab) => {
          if (tab.filter == 'fav' && marketTypeFav?.length == 0) return null;
          return (
            <div
              key={tab.id}
              className={` m-0  flex h-7 min-w-[98px] shrink-0 cursor-pointer items-center justify-center  gap-x-2 truncate rounded-full px-4 py-0.5 text-sm ${
                filterMarketByType == tab.filter
                  ? ' bg-active text-active-font'
                  : 'bg-secondary-button text-secondary-button-font '
              } `}
              onClick={() => {
                setFilterMarketByType(tab.filter);
              }}
            >
              <span className="relative z-10 rounded-full ">{tab.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // const sportIcon = getSportTypeLogo(eventDetail?.league?.id);

  return (
    <div
      ref={eventDetail.items ? null : selectedRef}
      className=" flex flex-col gap-y-1 overflow-y-auto bg-match-detail-contianer"
    >
      <div className=" flex h-9 w-full  items-center justify-between gap-x-2 bg-container-header text-white">
        <div className="flex h-5 flex-row items-center justify-center gap-x-2">
          <span
            className="flex h-full w-7 cursor-pointer items-center justify-center "
            onClick={() => {
              window.history.state.idx > 0
                ? navigate(-1)
                : navigate(`/matchs/${eventDetail?.league?.id}`);
            }}
          >
            {/* {'‹'} */}
            <MdOutlineArrowBackIosNew className="" />
          </span>
          {/* <img
                src={sportIcon ? sportIcon : ''}
                alt="Icon"
                className="flex w-5 items-center justify-center"
              /> */}
        </div>
        <div className="item-center flex h-full w-full flex-row justify-center 2xl:w-80 ">
          <input
            className="h-full w-full bg-primary-500 px-4 text-font-dark outline-none  "
            type="search"
            name="search"
            id="searchField"
            placeholder=" Search market... "
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search(searchValue);
              }
            }}
            onChange={(e) => {
              setSearchValue(e.target.value);
              search(e.target.value);
            }}
          />
          <button
            id="searchBtn1"
            name="searchBtn1"
            className="flex h-full items-center justify-end gap-1 bg-secondary-button px-2 text-secondary-button-font"
            onClick={() => {
              search(searchValue);
            }}
          >
            <AiOutlineSearch className="" />
            <span>{t(`search`)}</span>
          </button>
        </div>
        {/* <div className=" flex w-full items-center justify-center">
              <span className="capitalize  text-white">
                <span>
                  {i18n.resolvedLanguage == 'Am' &&
                  league_groups[eventDetail.league?.league_group]?.locales
                    .length > 0
                    ? league_groups[eventDetail.league?.league_group]
                        ?.locales[0].translation
                    : league_groups[eventDetail.league?.league_group]?.name}
                </span>
                {' - '}
                <spn>
                  {i18n.resolvedLanguage == 'Am' &&
                  leagues[eventDetail.league?.id]?.locales.length > 0
                    ? leagues[eventDetail.league?.id]?.locales[0].translation
                    : leagues[eventDetail.league?.id]?.name}
                </spn>
              </span>
            </div> */}
      </div>
      {eventDetail?.items ? (
        <>
          <div className="flex h-20 flex-col items-center justify-center gap-y-2 overflow-auto bg-match-detail-header text-match-detail-header-font">
            <div className="flex w-full items-center justify-center gap-2 ">
              <span className=" text-right">
                {Utils.displayDate(eventDetail.schedule, i18n.resolvedLanguage)}
              </span>
              {/* <span className="h-0.5 w-2 bg-white"></span> */}
              <span className=" text-left">
                {Utils.displayTimeOnly(
                  eventDetail.schedule,
                  i18n.resolvedLanguage
                )}
              </span>
              {/* <span className="h-0.5 w-2 bg-white"></span> */}
              <span>
                {i18n.resolvedLanguage == 'Am' &&
                league_groups[eventDetail.league?.league_group]?.locales
                  .length > 0
                  ? league_groups[eventDetail.league?.league_group]?.locales[0]
                      .translation
                  : league_groups[eventDetail.league?.league_group]?.name}
              </span>
              {' - '}
              <spn>
                {i18n.resolvedLanguage == 'Am' &&
                leagues[eventDetail.league?.id]?.locales.length > 0
                  ? leagues[eventDetail.league?.id]?.locales[0].translation
                  : leagues[eventDetail.league?.id]?.name}
              </spn>
            </div>
            <div className="flex w-full items-center justify-center gap-4 ">
              <strong>
                {i18n.resolvedLanguage == 'Am' && eventDetail.hometeam_locale
                  ? eventDetail.hometeam_locale
                  : eventDetail.hom}
              </strong>
              <span className="text-lg font-semibold  ">{t('VS')}</span>
              <strong>
                {i18n.resolvedLanguage == 'Am' && eventDetail.awayteam_locale
                  ? eventDetail.awayteam_locale
                  : eventDetail.awy}
              </strong>
            </div>
          </div>
          {/* Filters */}
          {renderSwitchs()}

          <div className="flex flex-col gap-y-1 bg-match-detail-events-container p-1.5 ">
            {!loading ? (
              allMarketTypes ? (
                allMarketTypes.map((item, k) => {
                  let i = { ...item };
                  i.league = eventDetail?.league?.id;
                  if (
                    filterMarketByType != 'All' &&
                    filterMarketByType != 'fav' &&
                    !market_filters[filterMarketByType]?.includes(
                      i.bet_group.id
                    )
                  ) {
                    return null;
                  }
                  if (
                    filterMarketByType == 'fav' &&
                    !isMarketTypeFav(i.bet_group.id)
                  ) {
                    return null;
                  }
                  const marketpick =
                    process.env.REACT_ABBREVIATE == 'true'
                      ? Utils.replaceMarketNameShort(
                          localizeBetGroups(i.bet_group.id, i.bet_group.name),
                          i.param,
                          selectedEvent.hom,
                          selectedEvent.awy,
                          selectedEvent.hometeam_locale,
                          selectedEvent.awayteam_locale,
                          i18n.resolvedLanguage
                        )
                      : Utils.replaceMarketName(
                          localizeBetGroups(i.bet_group.id, i.bet_group.name),
                          i.param,
                          selectedEvent.hom,
                          selectedEvent.awy,
                          selectedEvent.hometeam_locale,
                          selectedEvent.awayteam_locale,
                          i18n.resolvedLanguage
                        );
                  let marketType =
                    Object.values(i.specifier).length != 0
                      ? FormatEntity.formatMarketName(
                          marketpick,
                          null,
                          i.specifier
                        )
                      : FormatEntity.formatMarketName(
                          marketpick,
                          selectedEvent,
                          i.specifier
                        );
                  if (marketType.includes('Handicap')) {
                    marketType = marketType.slice(0, -3);
                  }
                  return (
                    <>
                      <MarketGroupViewer
                        key={k}
                        ref={selectedRef}
                        market_group={i}
                        filterMarketByType={filterMarketByType}
                        marketType={marketType}
                        selectedEvent={selectedEvent}
                        eventDetail={eventDetail}
                      />
                    </>
                  );
                })
              ) : (
                ''
              )
            ) : (
              <center>
                <Spin indicator={antIcon} size="large" />
              </center>
            )}
          </div>
        </>
      ) : (
        <MatchDetailLoader />
      )}
    </div>
  );
}
