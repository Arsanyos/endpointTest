import React, { useState, useEffect } from 'react';
import { message } from 'antd';
// import LockIcon from '@material-ui/icons/Lock';

import Utils from '../services/utils';
import local from '../services/localization';
import ClientSession from '../services/client-session';
// import MoreView from './MoreView';
import moment from 'moment';

// import { useStore } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { updateSlips } from '../store/slipSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MatchSearchView(props) {
  // const { slips, setSlips } = useStore();
  // const { stake, setStake } = useStore();
  // const { selectedSlip, setSelectedSlip } = useStore();
  // const [lang, setLang] = useState(props.lang);
  const [visibleMore, setVisibleMore] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
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

      // console.log(g);
      // debugger;
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

      // useStore.getState().setSlips(newSlips);
      dispatch(updateSlips({ slips: newSlips }));

      ClientSession.storeSlip(newSlips, (err) => {});
      ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
    }
  };
  const removeSlip = (id) => {
    console.log('removedSlip');
    let s = slips[selectedSlip].filter((s) => s.id != id);
    let newSlips = { ...slips };
    newSlips[selectedSlip] = s;
    // useStore.getState().setSlips(newSlips);
    dispatch(updateSlips({ slips: newSlips }));
    ClientSession.storeSlip(newSlips, (err) => {});
    ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
  };
  const getBetTypeName = (btid) => {
    // console.log(bet_types[btid]);
    // var lg = props.coreData.bet_types.filter(bt => bt.id == btid)[0]
    if (!bet_types) return 'empty';
    var lg = bet_types[btid];
    return lg?.name;
  };

  const verifyOddType = (bet_type, type) => {
    var name = getBetTypeName(bet_type);

    if (type == 'HOME') {
      if (name == '{$competitor1}' || name == '1') {
        return true;
      } else {
        return false;
      }
    } else if (type == 'AWAY') {
      if (name == '{$competitor2}' || name == '2') {
        return true;
      } else {
        return false;
      }
    } else if (type == 'DRAW') {
      if (name?.toLowerCase() == 'draw') {
        return true;
      } else {
        return false;
      }
    }
  };

  const isAddedToSlip = (id) => {
    // return false
    if (slips[selectedSlip].filter((s) => s.id == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const isMatchAddedToSlip = (id) => {
    // return false
    if (slips[selectedSlip].filter((s) => s.matchId == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const { g, index, close } = props;

  // console.log( leagues);
  // console.log( bet_types);
  const gameHome = g.win_odds.filter((o) =>
    verifyOddType(o.bet_type, 'HOME')
  )[0];
  const gameDraw = g.win_odds.filter((o) =>
    verifyOddType(o.bet_type, 'DRAW')
  )[0];
  const gameAway = g.win_odds.filter((o) =>
    verifyOddType(o.bet_type, 'AWAY')
  )[0];

  // const eventHasDrawLocked = props.coreData && props.coreData.leagues.length > 0 && props.coreData.leagues.find(league => league.id == g.league)  && props.coreData.leagues.find(league => league.id == g.league).sport_type == "1";
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
  return (
    <>
      <div
        key={'selectedGame' + index}
        className="hidden w-full flex-col bg-secondary-700  md:flex"
      >
        <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
          <div className=" p-x-2 flex h-10 w-20 items-center rounded-md bg-secondary-900 text-center text-xs text-white ">
            {Utils.displayDate(g.schedule, i18n.resolvedLanguage) +
              ' ' +
              Utils.displayTimeOnly(g.schedule, i18n.resolvedLanguage)}
          </div>
          <div
            className={`${
              isHomeSelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
            }flex h-10 w-2/5 cursor-pointer items-center justify-between rounded-md  px-4 hover:bg-primary-700`}
            // id={this.state.scrollElementId}
            onClick={(e) => {
              // console.log("Match component ")
              // console.log(useStore.getState().slips)
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
                  (i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
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
            <div className="3/4 truncate text-white">
              {i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                ? g.hometeam_locale
                : g.hom}
            </div>
            {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME'))
              .length != 0 ? (
              <div className="text-white ">
                {
                  g.win_odds.filter((o) => verifyOddType(o.bet_type, 'HOME'))[0]
                    .odd
                }
              </div>
            ) : (
              <div className=" bg-secondary-900 ">
                {/* <LockIcon style={{ color: 'white', size: 12 }} /> */}
              </div>
            )}
          </div>
          {/* {hasDraw ? ( */}
          <div
            className={`${
              isDrawSelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
            } flex h-10 w-16 shrink-0 cursor-pointer items-center justify-center rounded-md bg-secondary-900 text-white ${
              hasDraw && ' hover:bg-primary-700 '
            }`}
            // id={this.state.scrollElementId}
            onClick={(e) => {
              // console.log("event Draw")
              e.preventDefault();
              hasDraw &&
                addToSlip(
                  g,
                  gameDraw,
                  (i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                    ? g.hometeam_locale
                    : g.hom) +
                    ' ' +
                    t('VS') +
                    ' ' +
                    (i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
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
              g?.win_odds?.filter((o) => verifyOddType(o.bet_type, 'DRAW'))[0]
                .odd}
          </div>
          {/* ) : eventHasDrawLocked ? (
            <div className="flex h-10 w-16 items-center justify-center rounded-md bg-secondary-900 text-white">
              //<LockIcon style={{ color: 'white', size: 12 }} />
            </div>
          ) : (
            <div></div>
          )} */}
          <div
            className={`${
              isAwaySelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
            } flex h-10 w-2/5 cursor-pointer items-center justify-between rounded-md bg-secondary-900 px-4 hover:bg-primary-700 `}
            // id={this.state.scrollElementId}
            onClick={(e) => {
              // console.log("event Away")
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
                  (i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
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
            <div className="w-3/4 truncate text-white">
              {i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                ? g.awayteam_locale
                : g.awy}
            </div>
            {g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY'))
              .length != 0 ? (
              <div className="text-white">
                {
                  g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY'))[0]
                    .odd
                }
              </div>
            ) : (
              <div className={'tableitemPrice'}>
                <span className={'tableitemPrice'}>
                  {/* <LockIcon style={{ color: 'white', size: 12 }} /> */}
                </span>
              </div>
            )}
          </div>
          <div
            className={`flex h-10 w-16 shrink-0 cursor-pointer items-center justify-center rounded-md  ${
              isMatchAddedToSlip(g.id) &&
              !isAwaySelected &&
              !isHomeSelected &&
              !isDrawSelected
                ? ' bg-primary-700'
                : ' bg-gray-900'
            }`}
            onClick={(e) => {
              e.preventDefault();
              // close();
              navigate(`/match/detail/${g.id}`);
            }}
          >
            <span className="text-white ">{g.item_count} +</span>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div
        key={'selectedGame_mobile' + index}
        className="flex h-20 w-full flex-col bg-secondary-700  md:hidden"
      >
        <div
          className="flex h-full w-full flex-row items-center gap-2 px-4 py-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            close();
            navigate(`/match/detail/${g.id}`);
          }}
        >
          <div className="flex h-full w-2/5 flex-col justify-between ">
            <div className="w-full">
              {/* <div className="items-starttext-start flex py-1 text-xs text-gray-400 ">
                {Utils.displayTime(g.schedule, i18n.resolvedLanguage)}
              </div> */}
              <div className="flex w-full items-center gap-1 truncate text-xs text-gray-400 ">
                <span>
                  {Utils.displayTimeOnly(g.schedule, i18n.resolvedLanguage)}
                </span>
                <div className=" items-center justify-center">
                  <div className="h-0.5 w-1 rounded-r-full rounded-l-full  bg-primary-700"></div>
                </div>
                <span>
                  {Utils.displayDate(g.schedule, i18n.resolvedLanguage)}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex w-full items-center gap-x-1">
                <div className="h-1 w-1 shrink-0 rounded-full bg-primary-700"></div>
                <div className="text-md truncate text-white">
                  {i18n.resolvedLanguage == 'Am' && g.hometeam_locale != null
                    ? g.hometeam_locale
                    : g.hom}
                </div>
              </div>
              <div className="flex w-full items-center gap-x-1">
                <div className="h-1 w-1 shrink-0 rounded-full bg-primary-700"></div>
                <div className="text-md truncate text-white">
                  {i18n.resolvedLanguage == 'Am' && g.awayteam_locale != null
                    ? g.awayteam_locale
                    : g.awy}
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-3/5 flex-col items-end justify-between gap-2">
            <div className="flex items-center gap-2 py-1  ">
              <ul className="m-0 flex items-center justify-center  gap-x-[1px] text-gray-400">
                <li className="flex w-10 shrink-0 justify-center text-center text-xs uppercase ">
                  {t('Home')}
                </li>
                <li className="flex w-10 shrink-0 justify-center text-center text-xs uppercase ">
                  {t('DRAW')}
                </li>
                <li className="flex w-10 shrink-0 justify-center text-center  text-xs uppercase ">
                  {t('AWAY')}
                </li>
              </ul>
              <div className="flex w-12 shrink-0 justify-center text-center text-xs uppercase  text-gray-400">
                {t('More')}
              </div>
            </div>
            <div className="flex flex-1 shrink-0 items-end justify-center gap-2">
              <ul className="m-0 flex h-8 border-collapse items-center justify-center gap-x-[1px] overflow-hidden rounded-md border-[1px] border-slate-500 text-white">
                <li
                  className={`${
                    isHomeSelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
                  } flex h-8 w-10 shrink-0 cursor-pointer items-center justify-center text-xs`}
                  onClick={(e) => {
                    // console.log("Match component ")
                    // console.log(useStore.getState().slips)
                    e.stopPropagation();
                    e.preventDefault();
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
                    <div className="text-white ">
                      {
                        g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'HOME')
                        )[0].odd
                      }
                    </div>
                  ) : null}
                </li>
                <li
                  className={`${
                    isDrawSelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
                  } flex h-8 w-10 shrink-0 cursor-pointer items-center justify-center text-xs`}
                  onClick={(e) => {
                    // console.log("event Draw")
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
                  {hasDraw &&
                    g?.win_odds?.filter((o) =>
                      verifyOddType(o.bet_type, 'DRAW')
                    )[0].odd}
                </li>
                <li
                  className={`${
                    isAwaySelected ? 'bg-primary-700 ' : 'bg-secondary-900 '
                  } flex h-8 w-10 shrink-0 cursor-pointer items-center justify-center text-xs`}
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
                    <div className="text-white">
                      {
                        g.win_odds.filter((o) =>
                          verifyOddType(o.bet_type, 'AWAY')
                        )[0].odd
                      }
                    </div>
                  ) : null}
                </li>
              </ul>
              <div
                className={`m-0 flex h-8 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border-[1px] border-slate-500  ${
                  isMatchAddedToSlip(g.id) &&
                  !isAwaySelected &&
                  !isHomeSelected &&
                  !isDrawSelected
                    ? ' bg-primary-700'
                    : ' bg-gray-900'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  close();
                  navigate(`/match/detail/${g.id}`);
                }}
              >
                <div className="text-xs text-white ">{g.item_count} +</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchSearchView;
