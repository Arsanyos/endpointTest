import MatchViewListLoader from '@components/LoaderPages/MatchViewListLoader';
import TrendingCard from '@components/TrendingCard';
import { useEvent } from '@hooks/useEvent';
import { updateSlips } from '@ReduxStore/slipSlice';
import API from '@services/API';
import ClientSession from '@services/client-session';
import FormatEntity from '@services/format_entity';
import Utils from '@services/utils';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

export default function Trending() {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [trendingTotalOdd, setTrendingTotalOdd] = useState(0);

  const slips = useSelector((state) => state.slip.slips);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const config = useSelector((state) => state.configuration);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const league_groups = useSelector((state) => state.coreData.league_groups);
  const leagues = useSelector((state) => state.coreData.leagues);

  const { getSportTypeLogo } = useEvent();

  const dispatch = useDispatch();

  const trendingRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (trendingRef.current !== null) {
      trendingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [trendingRef.current]);

  useEffect(() => {
    getTrending();
  }, []);

  const getTrending = () => {
    setLoading(true);
    //TODO: Use Configuration stake
    // console.log(config);
    var data = {
      stake: 20,
    };
    API.createNoToken(
      `sport-data/accumilator/?ln=${i18n.resolvedLanguage}`,
      data,
      null
    )
      .then((response) => {
        if (response.data) {
          var todd = 1;
          response.data.forEach((trend) => {
            todd = todd * trend.odd.odd;
          });
          setTrending(response.data);
          setTrendingTotalOdd(todd);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!err.response || !err.response.data) {
          return message.error('Error While Loading Data', 5);
        }
        setLoading(false);
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
      });
  };

  const addTrendingToSlip = () => {
    let currentSlips = { ...slips };
    trending.forEach((trend) => {
      const betType = Utils.replaceName(
        localizeBetTypes(
          trend.odd.bet_type.id,
          trend.odd.bet_type ? trend.odd.bet_type.name : ''
        ),
        trend.odd.item ? trend.odd.item.param : '',
        trend.match.hom,
        trend.match.awy,
        trend.match.hometeam_locale,
        trend.match.awayteam_locale
      );
      const formatedBetType = FormatEntity.formatPickName(
        betType,
        null,
        trend.odd.item.specifier
      );
      const formatedGroupType = FormatEntity.formatMarketName(
        trend.odd.bet_group.name,
        Object.values(trend.odd.item.specifier).length > 0 ? trend : null,
        trend.odd.item.specifier
      );
      const betgroup = Utils.replaceName(
        formatedGroupType,
        trend.odd.item ? trend.odd.item.param : '',
        trend.match.hom,
        trend.match.awy
      );

      if (currentSlips[selectedSlip].length >= config.maxmatches) {
        return message.error(
          `${t('MaximumamountofMatchesis')} ${config.maxmatches}`,
          5
        );
      }
      let currentTrend = { ...trend };
      currentTrend.league = currentTrend.match?.league;
      let newSlip = createSlip(
        currentSlips,
        currentTrend,
        currentTrend,
        (i18n.resolvedLanguage == 'Am' &&
        currentTrend.match.hometeam_locale != null
          ? currentTrend.match.hometeam_locale
          : currentTrend.match.hom) +
          ' ' +
          t('VS') +
          ' ' +
          (i18n.resolvedLanguage == 'Am' &&
          currentTrend.match.awayteam_locale != null
            ? currentTrend.match.awayteam_locale
            : currentTrend.match.awy),
        betgroup,
        formatedBetType,
        currentTrend.match.id,
        currentTrend.odd.id,
        currentTrend.odd.odd
      );
      currentSlips = { ...newSlip };
    });

    dispatch(updateSlips({ slips: currentSlips }));
    ClientSession.storeSlip(currentSlips, (err) => {});

    setTrending([]);
    setTrendingTotalOdd(0);
  };

  const createSlip = (
    currentSlips,
    full,
    g,
    title,
    gameType,
    pick,
    matchId,
    oddId,
    odd
  ) => {
    const slipData = currentSlips[selectedSlip].filter(
      (s) => s.matchId != matchId
    );

    if (slipData.length >= config.maxmatches) {
      return message.error(
        `${t('MaximumamountofMatchesis')} ${config.maxmatches}`,
        5
      );
    }

    const game = g;
    game.matchId = matchId;
    game.gleague = full.league;
    game.title = title;
    game.gameType = gameType;
    game.pick = pick;
    game.id = oddId;
    game.odd = odd;

    slipData.push(game);

    const newslips = { ...currentSlips };
    newslips[selectedSlip] = slipData;

    return newslips;
  };

  const localizeBetTypes = (id, value) => {
    if (i18n.resolvedLanguage == 'Am') {
      if (bet_types[id]?.locales?.filter((l) => l.locale == 1)[0]) {
        return bet_types[id]?.locales?.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  return (
    <div ref={trendingRef}>
      {!loading && (
        <div className="flex h-full flex-col gap-y-1 ">
          <div
            className="flex h-9  items-center bg-header px-2"
            onClick={() => {
              // console.log('change view to Type');
            }}
          >
            <div className="flex w-full items-center justify-center gap-x-2 ">
              <span className="uppercase text-white ">{t('TRENDINGNOW')}</span>
            </div>
            {/* <FaArchive
            className=" h-5 w-5 cursor-pointer justify-end fill-gray-200 hover:fill-white"
            onClick={() => navigate('/jackpot/archives')}
          /> */}
          </div>
          <div className="flex h-full flex-col gap-y-1">
            <div className=" flex min-h-[70%] flex-col ">
              {trending.length != 0 && (
                <div className="hidden w-full bg-table-header px-4 py-2  pt-4 text-table-header-font md:flex">
                  <div className="w-1/2"></div>
                  <div className="flex w-1/2 flex-row items-center gap-x-2">
                    {/* <div className=" p-x-2 flex h-4 w-20 items-center rounded-md "></div> */}
                    <div
                      className={`flex h-4 w-1/2 cursor-pointer items-center justify-center rounded-md  px-4 `}
                    >
                      <span className="uppercase ">{t('Market')}</span>
                    </div>
                    <div
                      className={`flex h-4 w-1/4 cursor-pointer items-center justify-center rounded-md `}
                    >
                      <span className=" uppercase ">{t('PICK')}</span>
                    </div>
                    <div
                      className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md px-4 `}
                    >
                      <span className="uppercase "> {t('Odd')}</span>
                    </div>
                  </div>
                </div>
              )}
              {trending.length != 0 && (
                <div className="flex w-full bg-table-header px-4 py-2  text-table-header-font md:hidden">
                  <div className="flex w-full flex-row items-center gap-x-2">
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4  `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('Market')}
                      </div>
                    </div>
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4  `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('PICK')}
                      </div>
                    </div>
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4  `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('Odd')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && (
                <div className="mt-1 flex h-full w-full flex-col gap-y-1">
                  {trending.length != 0 ? (
                    trending.map((trend, i) => {
                      const betType = Utils.replaceName(
                        localizeBetTypes(
                          trend.odd.bet_type.id,
                          trend.odd.bet_type ? trend.odd.bet_type.name : ''
                        ),
                        trend.odd.item ? trend.odd.item.param : '',
                        trend.match.hom,
                        trend.match.awy,
                        trend.match.hometeam_locale,
                        trend.match.awayteam_locale
                      );
                      const formatedBetType = FormatEntity.formatPickName(
                        betType,
                        null,
                        trend.odd.item.specifier
                      );
                      const formatedGroupType = FormatEntity.formatMarketName(
                        trend.odd.bet_group.name,
                        Object.values(trend.odd.item.specifier).length > 0
                          ? trend
                          : null,
                        trend.odd.item.specifier
                      );
                      const betgroup = Utils.replaceName(
                        formatedGroupType,
                        trend.odd.item ? trend.odd.item.param : '',
                        trend.match.hom,
                        trend.match.awy
                      );
                      const logo =
                        league_groups[
                          leagues[trend.match?.league]?.league_group
                        ]?.logo;

                      const countryURL = logo
                        ? new URL(logo, API.API_BASE_URL)
                        : '';

                      const sportTypeURL = getSportTypeLogo(
                        trend.match?.league
                      );
                      return (
                        <>
                          <TrendingCard
                            key={'selectedGame' + i}
                            market={
                              i18n.resolvedLanguage == 'Am' &&
                              trend.match?.hometeam_locale != null
                                ? trend.match?.hometeam_locale
                                : trend.match?.hom
                            }
                            pick={
                              i18n.resolvedLanguage == 'Am' &&
                              trend.match?.awayteam_locale != null
                                ? trend?.match?.awayteam_locale
                                : trend.match?.awy
                            }
                            // schedule={Utils.displayTime(trend.match?.schedule) }
                            schedule={
                              Utils.displayDate(
                                trend.match?.schedule,
                                i18n.resolvedLanguage
                              ) +
                              ' ' +
                              Utils.displayTimeOnly(
                                trend.match?.schedule,
                                i18n.resolvedLanguage
                              )
                            }
                            betgroup={trend.odd?.bet_group ? betgroup : ''}
                            betType={trend.odd?.bet_type ? formatedBetType : ''}
                            odd={trend.odd?.odd}
                            sportTypeURL={sportTypeURL}
                            countryURL={countryURL}
                          />
                        </>
                      );
                    })
                  ) : (
                    <div className=" w-full">
                      <div className="flex w-full flex-col justify-center ">
                        <div className="flex w-full justify-center">
                          <HiOutlineEmojiSad className="h-40 w-40 text-gray-400 " />
                        </div>
                        <div className="flex flex-col text-4xl text-gray-400 ">
                          <span className="text-center">
                            {' '}
                            No Trendings right now.
                          </span>{' '}
                          <span className="text-center">Please try later.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex w-full flex-col items-center justify-center gap-y-4 px-2">
                {trending.length != 0 && (
                  <div className="flex h-20 w-full flex-col items-center justify-center rounded-md bg-secondary-700 md:mx-0 md:h-28 md:w-1/4">
                    <span className="font-semibold text-white">
                      {trendingTotalOdd.toFixed(2)}
                    </span>
                    <span className="font-semibold text-white">
                      {t('TotalOdd')}
                    </span>
                  </div>
                )}
                <div className="flex w-full flex-row justify-center">
                  <div className=" mb-2 flex w-full flex-col items-center justify-center gap-2 gap-x-8 md:w-3/5 md:flex-row">
                    <button
                      className="h-12 w-full cursor-pointer rounded-md bg-secondary-button p-2 font-semibold uppercase text-secondary-button-font shadow-lg hover:opacity-70  md:w-1/2"
                      onClick={() => getTrending()}
                    >
                      {t('GenerateNew')}
                    </button>
                    {trending.length != 0 && (
                      <button
                        className="h-12 w-full cursor-pointer rounded-md bg-secondary-button p-2 font-semibold uppercase  text-secondary-button-font shadow-lg hover:opacity-70  md:w-1/2"
                        onClick={() => addTrendingToSlip()}
                      >
                        {t('AddToSlip')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex animate-pulse flex-col gap-y-1">
          <div className="flex h-9  items-center bg-header px-2">
            <div className="flex w-full items-center justify-center gap-x-2 ">
              <span className="h-4 w-20 rounded-lg bg-gray-300"></span>
            </div>
          </div>
          <div className="flex w-full gap-2 bg-secondary-700  px-4 py-2 pt-4">
            {/* <div className="w-1/2"></div> */}
            <div className=" p-x-2 flex h-10 w-20 items-center justify-center rounded-md "></div>
            <div
              className={`flex h-10 w-2/5 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md  px-4 `}
            ></div>
            <div
              className={`flex h-4 w-1/4 items-center justify-center rounded-md  px-4 `}
            >
              <span className="h-3 w-10 rounded-lg bg-gray-500  "> </span>
            </div>
            <div
              className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md `}
            >
              <span className="h-3 w-10 rounded-lg bg-gray-500  "> </span>
            </div>
            <div
              className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md px-4 `}
            >
              <span className="h-3 w-10 rounded-lg bg-gray-500  "> </span>
            </div>
          </div>
          {[...Array(10).keys()].map((i, index) => {
            return <MatchViewListLoader key={index} />;
          })}
        </div>
      )}
    </div>
  );
}
