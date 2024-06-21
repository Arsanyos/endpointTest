import { message } from 'antd';
import React from 'react';

import ClientSession from '@services/client-session';
import Utils from '@services/utils';

import moment from 'moment';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateSlips } from '../store/slipSlice';

const HOME = '{$competitor1}';
const PLAYER1 = '1';
const PLAYER2 = '2';
const AWAY = '{$competitor2}';
const DRAW = 'draw';

const NO_DRAW = 'no draw';

const HOME_OR_AWAY = '{$competitor1} or {$competitor2}';
const DRAW_OR_HOME = '{$competitor1} or draw';
const DRAW_OR_AWAY = 'draw or {$competitor2}';

const LARGE_WINDOW = 1280;
const SMALL_WINDOW = 720;
// const MatchView = forwardRef(function MatchView(
//   props,
//   forwardedRef
// ) {
const MatchView = React.forwardRef(function MatchView(
  { hasDoubleChance = false, ...props },
  forwardedRef
) {
  const isMatchHeaderAbbreviated =
    process.env.REACT_MATCH_HEADER_ABBREVIATE === 'true';

  const maxmatches = useSelector((state) => state.slip.maxmatches);
  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const leagues = useSelector((state) => state.coreData.leagues);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const addToSlip = async (
    full,
    g,
    title,
    gameType,
    pick,
    matchId,
    oddId,
    odd
  ) => {
    if (isAddedToSlip(oddId)) {
      removeSlip(oddId);
    } else {
      const s = slips[selectedSlip].filter((s) => s.matchId != matchId);

      if (s.length >= maxmatches) {
        return message.error(
          `${t('MaximumamountofMatchesis')} ${maxmatches}`,
          5
        );
      }

      const game = { ...g };
      game.matchId = matchId;
      game.gleague = full.league;
      game.title = title;
      game.gameType = gameType;
      game.pick = pick;
      game.id = oddId;
      game.odd = odd;
      s.unshift(game);
      let newSlips = { ...slips };
      newSlips[selectedSlip] = s;

      dispatch(updateSlips({ slips: newSlips }));

      ClientSession.storeSlip(newSlips, (err) => {});
      ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
    }
  };
  const removeSlip = (id) => {
    let s = slips[selectedSlip].filter((s) => s.id != id);
    let newSlips = { ...slips };
    newSlips[selectedSlip] = s;
    dispatch(updateSlips({ slips: newSlips }));
    ClientSession.storeSlip(newSlips, (err) => {});
    ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
  };
  const getBetTypeName = (btid) => {
    if (!bet_types) return 'empty';
    var lg = bet_types[btid];
    return lg?.name;
  };

  const verifyOddType = (bet_type, type) => {
    let name = getBetTypeName(bet_type);
    if (type == 'HOME') {
      return name == HOME || name == PLAYER1;
    } else if (type == 'AWAY') {
      return name == AWAY || name == PLAYER2;
    } else if (type == 'DRAW') {
      return name?.toLowerCase() == DRAW;
    } else if (type == 'HOME_OR_AWAY')
      return name?.toLowerCase() == HOME_OR_AWAY;
    else if (type == 'DRAW_OR_AWAY') return name?.toLowerCase() == DRAW_OR_AWAY;
    else if (type == 'DRAW_OR_HOME') return name?.toLowerCase() == DRAW_OR_HOME;
  };

  const isAddedToSlip = (id) => {
    if (slips[selectedSlip].filter((s) => s.id == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const isMatchAddedToSlip = (id) => {
    if (slips[selectedSlip].filter((s) => s.matchId == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const { g, index, close } = props;

  const gameHome = g.win_odds.find((o) => verifyOddType(o.bet_type, 'HOME'));
  const gameDraw = g.win_odds.find((o) => verifyOddType(o.bet_type, 'DRAW'));
  const gameAway = g.win_odds.find((o) => verifyOddType(o.bet_type, 'AWAY'));
  const gameHomeAway = g.win_odds.find((o) =>
    verifyOddType(o.bet_type, 'HOME_OR_AWAY')
  );
  const gameDrawHome = g.win_odds.find((o) =>
    verifyOddType(o.bet_type, 'DRAW_OR_HOME')
  );
  const gameDrawAway = g.win_odds.find((o) =>
    verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
  );

  const eventHasDrawLocked =
    leagues && leagues[g.league] && leagues[g.league].sport_type == '1';

  const hasDraw =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'DRAW')).length != 0;

  const isHomeSelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME')).length != 0 &&
    isAddedToSlip(gameHome.id);
  const isDrawSelected = hasDraw && isAddedToSlip(gameDraw.id);

  const isAwaySelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY')).length != 0 &&
    isAddedToSlip(gameAway.id);

  const isHomeDrawSelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'DRAW_OR_HOME'))
      .length != 0 && isAddedToSlip(gameDrawHome.id);

  const isAwayDrawSelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'DRAW_OR_AWAY'))
      .length != 0 && isAddedToSlip(gameDrawAway.id);

  const isHomeAwaySelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME_OR_AWAY'))
      .length != 0 && isAddedToSlip(gameHomeAway.id);

  const lastSelectedEvent = ClientSession.getLastSelectedEvent();
  return (
    <>
      {window.innerWidth > SMALL_WINDOW ? (
        <div
          key={'game_web' + index}
          ref={lastSelectedEvent == g.id ? forwardedRef : null}
          className={`hidden w-full items-center bg-event-item text-sm text-event-item-font md:flex ${
            process.env.REACT_MATCHNAME_ONELINE == 'true' ? 'h-7' : 'h-9'
          } ${
            process.env.REACT_ODD_DIVIDER == 'true'
              ? 'divide-x-[1px] divide-odd-item-divider'
              : ''
          }`}
        >
          <div
            className="  flex h-full w-[60%] shrink-0 cursor-pointer  items-center gap-x-4  pl-2.5 text-justify hover:bg-secondary-300 xl:w-[45%] "
            onClick={(e) => {
              e.preventDefault();
              ClientSession.storeLastSelectedEvent(g.id);
              navigate(`/match/detail/${g.id}`);
              typeof close === 'function' && close();
            }}
          >
            {process.env.REACT_SHOW_GAME_ID == 'true' && (
              <div
                className={classNames(
                  ' flex min-w-fit items-start text-xs font-semibold text-match-event-time-font hover:bg-secondary-300/80 hover:text-white  ',
                  process.env.REACT_MATCHNAME_ONELINE == 'true'
                    ? ' flex-row gap-x-1'
                    : 'flex-col'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(g.id);
                  message.success('ID Copied!');
                }}
              >
                <span className="text m-0 ">{t('GAMEID')}</span>
                <span className="m-0 ">{g.id}</span>
              </div>
            )}
            <div className=" flex min-w-fit flex-col items-center gap-y-[1px] text-[12px] font-semibold text-match-event-time-font  ">
              <span className="m-0 ">
                {Utils.displayTimeOnly(g.schedule, i18n.resolvedLanguage)}
              </span>
            </div>
            {process.env.REACT_MATCHNAME_ONELINE == 'true' ? (
              <div
                role="title"
                className="w-full truncate pr-2 font-medium capitalize"
              >
                {i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                  ? g.hometeam_locale
                  : g.hom}
                {'  -  '}
                {i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                  ? g.awayteam_locale
                  : g.awy}
              </div>
            ) : (
              <div className="flex w-full flex-col truncate pr-9 text-xs font-medium capitalize ">
                <span>
                  {i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                    ? g.hometeam_locale
                    : g.hom}
                </span>
                <span>
                  {i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                    ? g.awayteam_locale
                    : g.awy}
                </span>
              </div>
            )}
          </div>
          <div
            className={classNames(
              'group flex h-full w-full items-center hover:bg-secondary-300 ',
              process.env.REACT_ODD_DIVIDER == 'true'
                ? 'divide-x-[1px] divide-odd-item-divider'
                : ''
            )}
          >
            <div
              className={classNames(
                'flex h-full w-full items-center ',
                process.env.REACT_ODD_DIVIDER == 'true'
                  ? 'divide-x-[1px] divide-odd-item-divider'
                  : ''
              )}
            >
              <div
                className={classNames(
                  'flex h-full flex-1 items-center justify-evenly ',
                  process.env.REACT_ODD_DIVIDER == 'true'
                    ? 'divide-x-[1px] divide-odd-item-divider'
                    : ''
                )}
              >
                <div
                  role="button"
                  className={` ${
                    isHomeSelected
                      ? 'bg-active text-active-font '
                      : 'bg-odd-item text-odd-item-font group-hover:bg-secondary-300 '
                  } hover-active:text-dark flex h-full w-full items-center   justify-center text-start group-hover:hover:bg-active group-hover:hover:text-active-font`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToSlip(
                      g,
                      gameHome,
                      (i18n.resolvedLanguage == 'Am' &&
                      g.hometeam_locale != null
                        ? g.hometeam_locale
                        : g.hom) +
                        ' ' +
                        t('VS') +
                        ' ' +
                        (i18n.resolvedLanguage == 'Am' &&
                        g.awayteam_locale != null
                          ? g.awayteam_locale
                          : g.awy),
                      i18n.resolvedLanguage == 'Am'
                        ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                        : i18n.resolvedLanguage == 'Am'
                        ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                        : '3 Way 90 Min',
                      i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                        ? g.hometeam_locale
                        : g.hom,
                      g.id,
                      gameHome.id,
                      gameHome.odd
                    );
                  }}
                >
                  {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME'))
                    .length != 0 ? (
                    <div className={`  w-6 text-right `}>
                      {
                        g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'HOME')
                        )[0].odd
                      }
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div
                  role="button"
                  className={` ${
                    isDrawSelected
                      ? 'bg-active text-active-font '
                      : ' bg-odd-item text-odd-item-font group-hover:bg-secondary-300'
                  } hover-active:text-dark flex h-full w-full items-center  justify-center text-start group-hover:hover:bg-active group-hover:hover:text-active-font`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    hasDraw &&
                      addToSlip(
                        g,
                        gameDraw,
                        (i18n.resolvedLanguage == 'Am' &&
                        g.hometeam_locale != null
                          ? g.hometeam_locale
                          : g.hom) +
                          ' ' +
                          t('VS') +
                          ' ' +
                          (i18n.resolvedLanguage == 'Am' &&
                          g.awayteam_locale != null
                            ? g.awayteam_locale
                            : g.awy),
                        i18n.resolvedLanguage == 'Am'
                          ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                          : '3 Way 90 Min',
                        i18n.resolvedLanguage == 'Am' ? 'አቻ' : 'DRAW',
                        g.id,
                        gameDraw.id,
                        gameDraw.odd
                      );
                  }}
                >
                  {hasDraw &&
                    g?.win_odds?.filter((o) =>
                      verifyOddType(o.bet_type, 'DRAW')
                    )[0].odd}
                </div>
                <div
                  role="button"
                  className={` ${
                    isAwaySelected
                      ? 'bg-active text-active-font '
                      : 'bg-odd-item text-odd-item-font group-hover:bg-secondary-300 '
                  } hover-active:text-dark flex h-full w-full items-center   justify-center text-start group-hover:hover:bg-active group-hover:hover:text-active-font`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToSlip(
                      g,
                      gameAway,
                      (i18n.resolvedLanguage == 'Am' &&
                      g.hometeam_locale != null
                        ? g.hometeam_locale
                        : g.hom) +
                        ' ' +
                        t('VS') +
                        ' ' +
                        (i18n.resolvedLanguage == 'Am' &&
                        g.awayteam_locale != null
                          ? g.awayteam_locale
                          : g.awy),
                      i18n.resolvedLanguage == 'Am'
                        ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                        : '3 Way 90 Min',
                      i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                        ? g.awayteam_locale
                        : g.awy,
                      g.id,
                      gameAway.id,
                      gameAway.odd
                    );
                  }}
                >
                  {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY'))
                    .length != 0 ? (
                    <div className={` w-6 text-right `}>
                      {
                        g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'AWAY')
                        )[0].odd
                      }
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {process.env.REACT_ENABLE_DOUBLE_CHANCE_DESKTOP == 'true' &&
                hasDoubleChance && (
                  <div
                    className={classNames(
                      'hidden h-full flex-1 items-center justify-evenly  xl:flex',
                      process.env.REACT_ODD_DIVIDER == 'true'
                        ? 'divide-x-[1px] divide-odd-item-divider'
                        : ''
                    )}
                  >
                    {gameDrawHome && (
                      <div
                        role="button"
                        className={` ${
                          isHomeDrawSelected
                            ? 'bg-active text-active-font '
                            : ' bg-odd-item text-odd-item-font group-hover:bg-secondary-300'
                        } hover-active:text-dark group flex h-full w-full items-center   justify-center  text-start group-hover:hover:bg-active group-hover:hover:text-active-font`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToSlip(
                            g,
                            gameDrawHome,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am' &&
                              g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom,
                            g.id,
                            gameDrawHome.id,
                            gameDrawHome.odd
                          );
                        }}
                      >
                        {g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                        ).length != 0 ? (
                          <div className={`  w-6 text-right`}>
                            {
                              g.win_odds.filter((o) =>
                                verifyOddType(o.bet_type, 'DRAW_OR_HOME')
                              )[0].odd
                            }
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {gameDrawAway && (
                      <div
                        role="button"
                        className={` ${
                          isAwayDrawSelected
                            ? 'bg-active text-active-font '
                            : 'bg-odd-item text-odd-item-font group-hover:bg-secondary-300'
                        } hover-active:text-dark flex h-full w-full items-center justify-center  text-start group-hover:hover:bg-active group-hover:hover:text-active-font`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToSlip(
                            g,
                            gameDrawAway,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                              ? g.awayteam_locale
                              : g.awy,
                            g.id,
                            gameDrawAway.id,
                            gameDrawAway.odd
                          );
                        }}
                      >
                        {g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                        ).length != 0 ? (
                          <div className={` w-6 text-right  `}>
                            {
                              g.win_odds.filter((o) =>
                                verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                              )[0].odd
                            }
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {gameHomeAway && (
                      <div
                        role="button"
                        className={` ${
                          isHomeAwaySelected
                            ? 'bg-active text-active-font '
                            : ' bg-odd-item text-odd-item-font group-hover:bg-secondary-300'
                        } hover-active:text-dark flex h-full w-full items-center   justify-center text-start  group-hover:hover:bg-active group-hover:hover:text-active-font`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // hasDraw &&
                          addToSlip(
                            g,
                            gameHomeAway,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am'
                              ? 'አቻ'
                              : 'HOME_OR_AWAY',
                            g.id,
                            gameHomeAway.id,
                            gameHomeAway.odd
                          );
                        }}
                      >
                        {hasDraw &&
                          g?.win_odds?.filter((o) =>
                            verifyOddType(o.bet_type, 'HOME_OR_AWAY')
                          )[0]?.odd}
                      </div>
                    )}
                  </div>
                )}
            </div>
            <div
              role="button"
              className={`flex h-full w-20 shrink-0 items-center justify-center  border-black text-center align-middle ${
                isMatchAddedToSlip(g.id) &&
                !isAwaySelected &&
                !isHomeSelected &&
                !isDrawSelected &&
                ((!isAwayDrawSelected &&
                  !isHomeDrawSelected &&
                  !isHomeAwaySelected) ||
                  window.innerWidth < LARGE_WINDOW)
                  ? ' border-primary bg-active text-active-font'
                  : 'bg-more-odds-btn text-more-odds-btn-font'
              }`}
              onClick={(e) => {
                e.preventDefault();
                ClientSession.storeLastSelectedEvent(g.id);
                navigate(`/match/detail/${g.id}`);
                typeof close === 'function' && close();
              }}
            >
              +{g.item_count}
            </div>
          </div>
        </div>
      ) : (
        <div
          key={'game_mobile' + index}
          ref={lastSelectedEvent == g.id ? forwardedRef : null}
          role={'link'}
          className="min-h-20 relative flex w-full flex-col rounded bg-mobile-event-item text-mobile-event-item-font  md:hidden"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            ClientSession.storeLastSelectedEvent(g.id);
            navigate(`/match/detail/${g.id}`);
            typeof close === 'function' && close();
          }}
        >
          {/* Variant - 1 */}
          <div className="relative flex  w-full flex-col gap-y-1 px-2 py-2 ">
            <div className="relative flex items-center gap-x-2 text-event-item-font ">
              {process.env.REACT_SHOW_GAME_ID == 'true' && (
                <div
                  className=" flex min-w-fit flex-col items-start text-[10px] font-semibold text-mute  hover:text-white  "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(g.id);
                    message.success('ID Copied!');
                  }}
                >
                  <span className=" m-0 ">{t('GAMEID')}</span>
                  <span className="m-0 ">{g.id}</span>
                </div>
              )}
              <div className="flex h-6 w-14 items-center border-r-2 border-secondary-700 pr-1 text-mute  ">
                <span className="flex flex-col text-left text-[10px]    ">
                  {/* <span className="text-sm font-light  ">
                  {Utils.displayDate(
                    g.schedule,
                    i18n.resolvedLanguage,
                    'DD.MM'
                  )}
                </span> */}

                  <span className="text-[12px] font-bold   ">
                    {Utils.displayTimeOnly(g.schedule, i18n.resolvedLanguage)}
                  </span>
                </span>
              </div>
              <div className="flex w-full flex-col truncate pr-9 text-xs font-semibold uppercase text-white">
                <span>
                  {i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                    ? g.hometeam_locale
                    : g.hom}
                </span>
                <span>
                  {i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                    ? g.awayteam_locale
                    : g.awy}
                </span>
              </div>

              <div
                className={`absolute top-0 right-0 flex h-5 w-10 cursor-pointer items-center justify-end rounded px-1  py-0 align-middle text-xs   ${
                  isMatchAddedToSlip(g.id) &&
                  !isAwaySelected &&
                  !isHomeSelected &&
                  !isDrawSelected &&
                  ((!isAwayDrawSelected &&
                    !isHomeDrawSelected &&
                    !isHomeAwaySelected) ||
                    process.env.REACT_ENABLE_DOUBLE_CHANCE_MOBILE !== 'true')
                    ? ' bg-active text-active-font '
                    : 'bg-mobile-more-odds-btn text-mobile-more-odds-btn-font'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  ClientSession.storeLastSelectedEvent(g.id);
                  navigate(`/match/detail/${g.id}`);
                  typeof close === 'function' && close();
                }}
              >
                <span>+{g.item_count}</span>
              </div>
            </div>

            <div className="flex w-full gap-x-2 text-xs font-semibold text-font-dark">
              <div
                className={`${
                  isHomeSelected
                    ? 'bg-active text-active-font  '
                    : 'bg-mobile-odd-item text-mobile-odd-item-font shadow '
                } flex h-9 w-full flex-1 shrink-0 cursor-pointer  flex-col items-center justify-center rounded py-0.5 `}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addToSlip(
                    g,
                    gameHome,
                    (i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                      ? g.hometeam_locale
                      : g.hom) +
                      ' ' +
                      t('VS') +
                      ' ' +
                      (i18n.resolvedLanguage == 'Am' &&
                      g.awayteam_locale != null
                        ? g.awayteam_locale
                        : g.awy),
                    i18n.resolvedLanguage == 'Am'
                      ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                      : i18n.resolvedLanguage == 'Am'
                      ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                      : '3 Way 90 Min',
                    i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                      ? g.hometeam_locale
                      : g.hom,
                    g.id,
                    gameHome.id,
                    gameHome.odd
                  );
                }}
              >
                <span className="text-[10px] text-inherit">
                  {isMatchHeaderAbbreviated ? 1 : t('Home')}
                </span>
                {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME'))
                  .length != 0 ? (
                  <span>
                    {
                      g.win_odds.filter((o) =>
                        verifyOddType(o.bet_type, 'HOME')
                      )[0].odd
                    }
                  </span>
                ) : null}
              </div>
              <div
                className={`${
                  isDrawSelected
                    ? 'bg-active text-active-font '
                    : 'bg-mobile-odd-item text-mobile-odd-item-font  shadow '
                } flex h-9 w-full flex-1 shrink-0 cursor-pointer  flex-col items-center justify-center rounded py-0.5 `}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  hasDraw &&
                    addToSlip(
                      g,
                      gameDraw,
                      (i18n.resolvedLanguage == 'Am' &&
                      g.hometeam_locale != null
                        ? g.hometeam_locale
                        : g.hom) +
                        ' ' +
                        t('VS') +
                        ' ' +
                        (i18n.resolvedLanguage == 'Am' &&
                        g.awayteam_locale != null
                          ? g.awayteam_locale
                          : g.awy),
                      i18n.resolvedLanguage == 'Am'
                        ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                        : '3 Way 90 Min',
                      i18n.resolvedLanguage == 'Am' ? 'አቻ' : 'DRAW',
                      g.id,
                      gameDraw.id,
                      gameDraw.odd
                    );
                }}
              >
                <span className="text-[10px] text-inherit">
                  {isMatchHeaderAbbreviated ? 'X' : t('DRAW')}
                </span>
                <span>
                  {hasDraw &&
                    g?.win_odds?.filter((o) =>
                      verifyOddType(o.bet_type, 'DRAW')
                    )[0].odd}
                </span>
              </div>

              <div
                className={`${
                  isAwaySelected
                    ? 'bg-active text-active-font  '
                    : 'bg-mobile-odd-item text-mobile-odd-item-font shadow  '
                } flex h-9 w-full flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded py-0.5 `}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addToSlip(
                    g,
                    gameAway,
                    (i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                      ? g.hometeam_locale
                      : g.hom) +
                      ' ' +
                      t('VS') +
                      ' ' +
                      (i18n.resolvedLanguage == 'Am' &&
                      g.awayteam_locale != null
                        ? g.awayteam_locale
                        : g.awy),
                    i18n.resolvedLanguage == 'Am'
                      ? 'የሙሉ ሰአት ውጤት 90 ደቂቃ'
                      : '3 Way 90 Min',
                    i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                      ? g.awayteam_locale
                      : g.awy,
                    g.id,
                    gameAway.id,
                    gameAway.odd
                  );
                }}
              >
                <span className="text-[10px] text-inherit">
                  {isMatchHeaderAbbreviated ? 2 : t('AWAY')}
                </span>
                {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY'))
                  .length != 0 ? (
                  <span>
                    {
                      g.win_odds.filter((o) =>
                        verifyOddType(o.bet_type, 'AWAY')
                      )[0].odd
                    }
                  </span>
                ) : null}
              </div>

              {/* (gameDrawHome || gameHomeAway || gameDrawAway) && */}

              {process.env.REACT_ENABLE_DOUBLE_CHANCE_MOBILE == 'true' &&
                hasDoubleChance && (
                  <>
                    {gameDrawHome && (
                      <div
                        role="button"
                        className={` ${
                          isHomeDrawSelected
                            ? 'bg-active text-active-font  '
                            : 'bg-mobile-odd-item text-mobile-odd-item-font  shadow '
                        } group flex h-9 w-full flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded py-0.5 `}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToSlip(
                            g,
                            gameDrawHome,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am' &&
                              g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom,
                            g.id,
                            gameDrawHome.id,
                            gameDrawHome.odd
                          );
                        }}
                      >
                        <span className="text-[10px] text-inherit">1X</span>
                        {g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                        ).length != 0 ? (
                          <div className={`  w-6 text-right`}>
                            {
                              g.win_odds.filter((o) =>
                                verifyOddType(o.bet_type, 'DRAW_OR_HOME')
                              )[0].odd
                            }
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {gameDrawAway && (
                      <div
                        role="button"
                        className={` ${
                          isAwayDrawSelected
                            ? 'bg-active text-active-font  '
                            : 'bg-mobile-odd-item text-mobile-odd-item-font shadow '
                        } flex h-9 w-full flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded py-0.5 `}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToSlip(
                            g,
                            gameDrawAway,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                              ? g.awayteam_locale
                              : g.awy,
                            g.id,
                            gameDrawAway.id,
                            gameDrawAway.odd
                          );
                        }}
                      >
                        <span className="text-[10px] text-inherit">2X</span>
                        {g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                        ).length != 0 ? (
                          <div className={` w-6 text-right  `}>
                            {
                              g.win_odds.filter((o) =>
                                verifyOddType(o.bet_type, 'DRAW_OR_AWAY')
                              )[0].odd
                            }
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {gameHomeAway && (
                      <div
                        role="button"
                        className={` ${
                          isHomeAwaySelected
                            ? 'bg-active text-active-font  '
                            : 'bg-mobile-odd-item text-mobile-odd-item-font shadow '
                        } flex h-9 w-full flex-1 shrink-0 cursor-pointer flex-col items-center justify-center rounded py-0.5 `}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // hasDraw &&
                          addToSlip(
                            g,
                            gameHomeAway,
                            (i18n.resolvedLanguage == 'Am' &&
                            g.hometeam_locale != null
                              ? g.hometeam_locale
                              : g.hom) +
                              ' ' +
                              t('VS') +
                              ' ' +
                              (i18n.resolvedLanguage == 'Am' &&
                              g.awayteam_locale != null
                                ? g.awayteam_locale
                                : g.awy),
                            i18n.resolvedLanguage == 'Am'
                              ? 'እጥፍ ዕድል'
                              : 'Double Chance',
                            i18n.resolvedLanguage == 'Am'
                              ? 'አቻ'
                              : 'HOME_OR_AWAY',
                            g.id,
                            gameHomeAway.id,
                            gameHomeAway.odd
                          );
                        }}
                      >
                        <span className="text-[10px] text-inherit">12</span>
                        <span>
                          {hasDraw &&
                            g?.win_odds?.filter((o) =>
                              verifyOddType(o.bet_type, 'HOME_OR_AWAY')
                            )[0]?.odd}
                        </span>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MatchView;
