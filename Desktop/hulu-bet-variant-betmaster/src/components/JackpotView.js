import React, { useState, useEffect } from 'react';

import Utils from '../services/utils';

// import { useStore } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useJackpot } from '../hooks/useJackpot';
import { useTranslation } from 'react-i18next';

function JackpotView(props) {
  const leagues = useSelector((state) => state.coreData.leagues);

  const navigate = useNavigate();
  const { isJackpotPick, addQuickpick, addJackpotToSlip } = useJackpot();
  const bet_types = useSelector((state) => state.coreData.bet_types);

  const { g, index } = props;
  const { t, i18n } = useTranslation();

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
    isJackpotPick(gameHome.id);
  const isDrawSelected = hasDraw && isJackpotPick(gameDraw.id);
  const isAwaySelected =
    g.win_odds.filter((o) => verifyOddType(o.bet_type, 'AWAY')).length != 0 &&
    isJackpotPick(gameAway.id);
  return (
    <>
      <div
        key={'selectedGame' + index}
        className="flex w-full flex-col   bg-secondary-700"
      >
        <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
          <div className=" p-x-2 flex h-10 w-20 items-center rounded-md bg-secondary-900 text-center text-xs text-white ">
            {Utils.displayTime(g.schedule, i18n.resolvedLanguage)}
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
              addQuickpick(
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
            } flex h-10 w-16 cursor-pointer items-center justify-center rounded-md bg-secondary-900 text-white ${
              hasDraw && ' hover:bg-primary-700 '
            }`}
            // id={this.state.scrollElementId}
            onClick={(e) => {
              // console.log("event Draw")
              e.preventDefault();
              hasDraw &&
                addQuickpick(
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
              addQuickpick(
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
            className={`flex h-10 w-16 cursor-pointer items-center justify-center rounded-md  ${
              isJackpotPick(g.id) &&
              !isAwaySelected &&
              !isHomeSelected &&
              !isDrawSelected
                ? ' bg-primary-700'
                : ' bg-gray-900'
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/match/detail/${g.id}`);
            }}
          >
            <span className="text-white ">{g.item_count} +</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default JackpotView;
