import MatchViewListLoader from '@components/LoaderPages/MatchViewListLoader';
import TrendingCard from '@components/TrendingCard';
import { useEvent } from '@hooks/useEvent';
import { updateSlips } from '@ReduxStore/slipSlice';
import API from '@services/API';
import ClientSession from '@services/client-session';
import FormatEntity from '@services/format_entity';
import Utils from '@services/utils';
import '@styles/custom.css';
import { DatePicker, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiCalendar } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

export default function Accumulator() {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [loading, setLoading] = useState(false);
  const [accumulator, setAccumulator] = useState([]);
  const [accumilatorTotalOdd, setAccumilatorTotalOdd] = useState(0);
  const [betStake, setBetStake] = useState(null);
  const [possibleWin, setPossibleWin] = useState(null);
  const [numOfMatches, setNumOfMatches] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [scheduleEndDate, setScheduleEndDate] = useState(null);

  const slips = useSelector((state) => state.slip.slips);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const leagues = useSelector((state) => state.coreData.leagues);
  const config = useSelector((state) => state.configuration);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const league_groups = useSelector((state) => state.coreData.league_groups);

  const { getSportTypeLogo } = useEvent();

  const dispatch = useDispatch();

  const accumulatorRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (accumulatorRef.current !== null) {
      accumulatorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [accumulatorRef.current]);

  const getAccumulator = () => {
    setLoading(true);
    //TODO: Use Configuration stake
    const data = {
      numOfMatches: numOfMatches == '' ? null : numOfMatches,
      possibleWin: possibleWin,
      schedule: schedule == '' ? null : schedule,
      scheduleEndDate: scheduleEndDate == '' ? null : scheduleEndDate,
      stake: betStake,
    };
    API.createNoToken(`sport-data/accumilator/?ln="en"`, data, null)
      .then((response) => {
        if (response.data) {
          var todd = 1;
          response.data.forEach((accum) => {
            todd = todd * accum.odd.odd;
          });
          setAccumulator(response.data);
          setAccumilatorTotalOdd(todd);
        }
        setLoading((prev) => !prev);
      })
      .catch((err) => {
        if (!err.response || !err.response.data) {
          return message.error('Error While Loading Data', 5);
        }
        setLoading((prev) => !prev);
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
      });
  };

  const addTrendingToSlip = () => {
    let currentSlips = { ...slips };
    accumulator.forEach((accum) => {
      const betType = Utils.replaceName(
        localizeBetTypes(
          accum.odd.bet_type.id,
          accum.odd.bet_type ? accum.odd.bet_type.name : ''
        ),
        accum.odd.item ? accum.odd.item.param : '',
        accum.match.hom,
        accum.match.awy,
        accum.match.hometeam_locale,
        accum.match.awayteam_locale
      );
      const formatedBetType = FormatEntity.formatPickName(
        betType,
        null,
        accum.odd.item.specifier
      );
      const formatedGroupType = FormatEntity.formatMarketName(
        accum.odd.bet_group.name,
        Object.values(accum.odd.item.specifier).length > 0 ? accum : null,
        accum.odd.item.specifier
      );
      const betgroup = Utils.replaceName(
        formatedGroupType,
        accum.odd.item ? accum.odd.item.param : '',
        accum.match.hom,
        accum.match.awy
      );

      if (currentSlips[selectedSlip].length >= config.maxmatches) {
        return message.error(
          `${t('MaximumamountofMatchesis')} ${config.maxmatches}`,
          5
        );
      }
      let currentAccum = { ...accum };
      currentAccum.league = accum.match?.league;
      let newSlip = createSlip(
        currentSlips,
        currentAccum,
        currentAccum,
        (i18n.resolvedLanguage == 'Am' &&
        currentAccum.match.hometeam_locale != null
          ? currentAccum.match.hometeam_locale
          : currentAccum.match.hom) +
          ' ' +
          t('VS') +
          ' ' +
          (i18n.resolvedLanguage == 'Am' &&
          currentAccum.match.awayteam_locale != null
            ? currentAccum.match.awayteam_locale
            : currentAccum.match.awy),
        betgroup,
        formatedBetType,
        currentAccum.match.id,
        currentAccum.odd.id,
        currentAccum.odd.odd
      );
      currentSlips = { ...newSlip };
    });

    dispatch(updateSlips({ slips: currentSlips }));
    ClientSession.storeSlip(currentSlips, (err) => {});

    setAccumulator([]);
    setAccumilatorTotalOdd(0);
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
    <div className="flex  w-full flex-1 flex-col justify-start md:h-full md:min-h-full ">
      <div ref={accumulatorRef} className="flex w-full  flex-col gap-y-1  ">
        <div
          className="flex h-9 shrink-0  items-center bg-primary-700 px-2"
          onClick={() => {
            // console.log('change view to Type');
          }}
        >
          <div className="flex w-full items-center justify-center gap-x-2 ">
            <span className="uppercase text-white ">{t('Accumulator')}</span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-start bg-secondary-700 py-2">
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-4">
            <div style={{ marginTop: 3 }}>
              <input
                type="number"
                min={config.minStake > 5 ? 5 : config.minStake}
                max={config.maxStake}
                // value={stake[selectedSlip]}
                name="stake"
                id="stake"
                placeholder={t('StakeBirr') + '...'}
                className="h-9 w-full rounded bg-accumulator-input px-3 text-accumulator-input-font  outline-none"
                onChange={(e) => {
                  setBetStake(e.target.value);
                  // const newStake = { ...stake };
                  // newStake[selectedSlip] = e.target.value;
                  // dispatch(updateStake({ stake: newStake }));
                }}
              />
            </div>
            <div style={{ marginTop: 3 }}>
              <input
                type="number"
                // min={config.minStake > 5 ? 5 : config.minStake}
                max={config.maxStake}
                // value={stake[selectedSlip]}
                name="possibleWin"
                id="possibleWin"
                placeholder={'possible Win...'}
                className="h-9 w-full rounded bg-accumulator-input px-3 text-accumulator-input-font  outline-none"
                onChange={(e) => {
                  setPossibleWin(e.target.value);
                }}
              />
            </div>
            <div style={{ marginTop: 3 }}>
              <input
                type="number"
                name="numOfMatches"
                id="numOfMatches"
                placeholder="No of Matches"
                className="h-9 w-full rounded bg-accumulator-input px-3 text-accumulator-input-font  outline-none"
                onChange={(e) => {
                  setNumOfMatches(e.target.value);
                }}
              />
            </div>
            <div style={{ marginTop: 3 }}>
              <DatePicker
                name="schedule"
                onChange={(date, dateString) => setSchedule(dateString)}
                placeholder="Due Date"
                className="h-9 w-full rounded border-0 !bg-accumulator-input px-3  !text-accumulator-input-font outline-none"
                suffixIcon={<BiCalendar className="text-secondary-800" />}
                style={{
                  background: 'var(--light)',
                  color: 'var(--white)',
                  border: 'none',
                }}
              />
            </div>
            <div style={{ marginTop: 3 }}>
              <DatePicker
                name="scheduleEndDate"
                onChange={(date, dateString) => setScheduleEndDate(dateString)}
                placeholder="End Date"
                className="h-9 w-full rounded border-0 !bg-accumulator-input px-3 !text-accumulator-input-font outline-none"
                suffixIcon={<BiCalendar className="text-secondary-800" />}
                style={{
                  background: 'var(--light)',
                  // color: 'var(--white)',
                  border: 'none',
                }}
                dateRender={(current) => {
                  const style = {};
                  if (current.date() === 1) {
                    style.color = 'var(--white)';
                    // style.borderRadius = '50%';
                  }
                  return (
                    <div className="ant-picker-cell-inner" style={style}>
                      {current.date()}
                    </div>
                  );
                }}
              />
            </div>
            <div style={{ marginTop: 3 }}>
              <button
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-x-1 rounded bg-secondary-button p-2 font-semibold  uppercase text-secondary-button-font shadow-lg  hover:opacity-70"
                onClick={getAccumulator}
              >
                {loading && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 animate-spin fill-active text-secondary-button-font "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {t('Generate')}
              </button>
            </div>
          </div>
        </div>
        {!loading && (
          <div className="flex h-full flex-col gap-y-1">
            <div className=" flex h-full flex-col ">
              {accumulator.length != 0 && (
                <div className=" hidden w-full bg-table-header px-4 py-2  pt-4 text-table-header-font md:flex">
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
                      <span className="uppercase ">{t('Odd')}</span>
                    </div>
                  </div>
                </div>
              )}
              {accumulator.length != 0 && (
                <div className="flex w-full bg-table-header px-4 py-2  text-table-header-font md:hidden">
                  <div className="flex w-full flex-row items-center gap-x-2">
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4 `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('Market')}
                      </div>
                    </div>
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4 `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('PICK')}
                      </div>
                    </div>
                    <div
                      className={`flex h-full w-1/3 items-center justify-between px-4 `}
                    >
                      <div className=" h-4 w-full truncate text-center text-xs uppercase ">
                        {t('Odd')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && (
                <div className="mt-1 flex w-full flex-col gap-y-1">
                  {accumulator.length != 0 &&
                    accumulator.map((accum, i) => {
                      // console.log(leagues[accum.match?.league]);
                      const betType = Utils.replaceName(
                        localizeBetTypes(
                          accum.odd.bet_type.id,
                          accum.odd.bet_type ? accum.odd.bet_type.name : ''
                        ),
                        accum.odd.item ? accum.odd.item.param : '',
                        accum.match.hom,
                        accum.match.awy,
                        accum.match.hometeam_locale,
                        accum.match.awayteam_locale
                      );
                      const formatedBetType = FormatEntity.formatPickName(
                        betType,
                        null,
                        accum.odd.item.specifier
                      );
                      const formatedGroupType = FormatEntity.formatMarketName(
                        accum.odd.bet_group.name,
                        Object.values(accum.odd.item.specifier).length > 0
                          ? accum
                          : null,
                        accum.odd.item.specifier
                      );
                      const betgroup = Utils.replaceName(
                        formatedGroupType,
                        accum.odd.item ? accum.odd.item.param : '',
                        accum.match.hom,
                        accum.match.awy
                      );

                      const logo =
                        league_groups[
                          leagues[accum.match?.league]?.league_group
                        ]?.logo;
                      const countryURL = logo
                        ? new URL(logo, API.API_BASE_URL)
                        : '';
                      const sportTypeURL = getSportTypeLogo(
                        accum.match?.league
                      );
                      return (
                        <>
                          <TrendingCard
                            key={'selectedGame' + i}
                            market={
                              i18n.resolvedLanguage == 'Am' &&
                              accum.match.hometeam_locale != null
                                ? accum.match.hometeam_locale
                                : accum.match.hom
                            }
                            pick={
                              i18n.resolvedLanguage == 'Am' &&
                              accum.match.awayteam_locale != null
                                ? accum.match.awayteam_locale
                                : accum.match.awy
                            }
                            schedule={Utils.displayTime(accum.match.schedule)}
                            betgroup={accum.odd.bet_group ? betgroup : ''}
                            betType={accum.odd.bet_type ? formatedBetType : ''}
                            odd={accum.odd.odd}
                            sportTypeURL={sportTypeURL}
                            countryURL={countryURL}
                          />
                        </>
                      );
                    })}
                </div>
              )}

              <div className="mt-4 flex w-full flex-1 flex-col items-center justify-start gap-y-4">
                {accumulator.length != 0 && (
                  <div className="flex w-full flex-row md:w-1/2">
                    <div className="flex h-28 w-full flex-col items-center justify-center gap-x-2 rounded-md bg-secondary-700 px-4 py-2 md:flex-row">
                      <div className="flex w-full flex-col items-center justify-center py-2 md:w-1/2">
                        <div className="font-semibold text-white">
                          {accumilatorTotalOdd.toFixed(2)}
                        </div>
                        <div className="font-semibold text-white">
                          {t('TotalOdd')}
                        </div>
                      </div>
                      <div className="h-[2px] w-12 rounded bg-gray-800 md:h-full md:w-[2px]"></div>
                      <div className="flex w-full flex-col items-center justify-center py-2 md:w-1/2">
                        <div className="font-semibold text-white">
                          {(accumilatorTotalOdd.toFixed(2) * betStake).toFixed(
                            2
                          )}
                        </div>
                        <div className="font-semibold text-white">
                          {t('PossibleWin')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex w-full flex-row justify-center">
                  <div className=" mb-2 flex w-3/5 flex-row justify-center gap-x-8">
                    {accumulator.length != 0 && (
                      <button
                        className="h-12 w-full cursor-pointer rounded-md bg-secondary-button p-2 font-semibold  uppercase text-secondary-button-font shadow-lg  hover:opacity-70"
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
        )}
      </div>

      {loading && (
        <div className="mt-1 flex w-full animate-pulse flex-col gap-y-1">
          <div className="flex w-full gap-2 bg-secondary-700  px-4 py-2 pt-4">
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
