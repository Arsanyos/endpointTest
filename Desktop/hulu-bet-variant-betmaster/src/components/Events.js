import React, { useEffect, useRef } from 'react';

import slip_ball_icon from '@assets/img/slip_ball_icon.png';

import { useDisplayLeagueMatches } from '@hooks/useDisplayLeagueMatches';
import { useEvent } from '@hooks/useEvent';
import API from '@services/API';
import ClientSession from '@services/client-session';
import Utils from '@services/utils';
import { useTranslation } from 'react-i18next';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MatchViewLoader from './LoaderPages/MatchViewLoader';
import MatchHeader from './MatchHeader';
import MatchView from './MatchView';

function Events() {
  const coreData = useSelector((state) => state.coreData.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);
  const league_groups = useSelector((state) => state.coreData.league_groups);
  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  // const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const available_sport_types = useSelector(
    (state) => state.coreData.available_sport_types
  );
  // const selectedPage = useSelector((state) => state.Event.selectedPage);
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const selectedEventGames = useSelector(
    (state) => state.Event.selectedEventGames
  );
  const config = useSelector((state) => state.configuration);
  const selectedGameListId = useSelector(
    (state) => state.selectedMenu.selectedGameListId
  );
  const selectedGameListIcon = useSelector(
    (state) => state.selectedMenu.selectedGameListIcon
  );
  const selectedGameListName = useSelector(
    (state) => state.selectedMenu.selectedGameListName
  );

  const league_events = useSelector((state) => state.coreData.league_events);

  const displayLeagueMatches = useDisplayLeagueMatches();

  let { id } = useParams();
  const { addToFav, isfav } = useEvent();

  const eventRef = useRef(null);
  const isVisibleRef = useRef(null);

  const { t, i18n } = useTranslation();
  let temp_date = null;

  React.useEffect(() => {
    if (eventRef.current !== null) {
      eventRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }

    // return (eventRef.current = null);
  }, [eventRef.current, id]);

  useEffect(() => {
    setTimeout(() => {
      if (isVisibleRef.current != null) {
        isVisibleRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start',
        });
        ClientSession.removeLastSelectedEvent();
      }
      return clearTimeout();
    }, 300);
  }, [isVisibleRef.current]);

  useEffect(() => {
    if (leagues[id]?.sport_type) {
      const SID = leagues[id]?.sport_type;
      displayLeagueMatches(id, SID);
    }
  }, [id, leagues, league_events]);

  const sportTypeLogo = () => {
    const logo = available_sport_types?.find(
      (st) => leagues[id]?.sport_type === st.id
    )?.logo;
    return Utils.validURL(logo) ? logo : new URL(logo, API.API_BASE_URL);
  };

  const renderDate = (schedule, hasDoubleChance) => {
    if (temp_date != Utils.displayDate(schedule, i18n.resolvedLanguage)) {
      temp_date = Utils.displayDate(schedule, i18n.resolvedLanguage);
      return <MatchHeader hasDoubleChance={hasDoubleChance} date={temp_date} />;
    } else return null;
  };
  const hasSomeDoubleChance = selectedEventGames.some(
    (g) => g.win_odds.length > 3
  );

  return (
    <div className="flex w-full flex-col gap-y-[1px] overflow-x-auto  bg-event-group">
      <div
        ref={eventRef}
        className="flex h-9 items-center  justify-between bg-container-header px-2"
      >
        <div className="flex items-center justify-center gap-1">
          <img
            src={sportTypeLogo()}
            className="flex h-5 justify-start"
            alt="sport type"
          />
          <img
            src={
              new URL(
                selectedEventGames?.length > 0 &&
                  league_groups &&
                  league_groups[
                    leagues[selectedEventGames[0]?.league]?.league_group
                  ]?.logo,
                API.API_BASE_URL
              )
            }
            alt="country"
            className="flex h-5 w-5 justify-start rounded-full"
          />
        </div>
        {leagues && selectedEventGames?.length > 0 && (
          <div className="flex w-full items-center justify-center gap-x-2 pl-4 ">
            <span className="flex items-center truncate uppercase text-event-title-font md:text-xl ">
              {i18n.resolvedLanguage == 'Am' &&
              league_groups[
                leagues[selectedEventGames[0]?.league]?.league_group
              ].locales?.length > 0
                ? league_groups[
                    leagues[selectedEventGames[0]?.league]?.league_group
                  ].locales[0].translation
                : league_groups[
                    leagues[selectedEventGames[0]?.league]?.league_group
                  ]?.name + ` - `}
              {leagues &&
                selectedEventGames?.length > 0 &&
                (i18n.resolvedLanguage == 'En' ||
                !leagues[selectedEventGames[0]?.league].locales[0]
                  ? leagues[selectedEventGames[0]?.league]?.name
                  : leagues[selectedEventGames[0]?.league].locales[0]
                      ?.translation)}
            </span>
          </div>
        )}
        {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
        {/* <></> */}
        {isfav(selectedGameListId) ? (
          <AiFillHeart
            className="text-xl text-danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToFav(
                selectedGameListId,
                selectedGameListIcon,
                selectedGameListName
              );
            }}
          />
        ) : (
          <AiOutlineHeart
            className="text-xl text-danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToFav(
                selectedGameListId,
                selectedGameListIcon,
                selectedGameListName
              );
            }}
          />
        )}
      </div>
      {/* <div className="mt-1 hidden w-full flex-row items-center gap-2 bg-secondary-700 px-4 py-2 pt-4 md:flex">
        <div className=" p-x-2 flex h-4 w-16 items-center rounded-md lg:w-36 "></div>
        <div
          className={`flex h-4 flex-1 cursor-pointer items-center justify-center rounded-md  px-4 `}
        >
          <span className="text-center capitalize text-white ">
            {' '}
            {t('Home')}
          </span>
        </div>
        <div
          className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md `}
        >
          <span className=" text-center capitalize text-white ">
            {' '}
            {t('DRAW')}
          </span>
        </div>
        <div
          className={`flex h-4 flex-1 cursor-pointer items-center justify-center rounded-md px-4 `}
        >
          <span className="text-center capitalize text-white ">
            {' '}
            {t('AWAY')}
          </span>
        </div>
        <div className="flex h-4 w-16 cursor-pointer items-center justify-center rounded-md  ">
          <span className=" capitalize text-white "> {t('More')}</span>
        </div>
      </div> */}

      {/* <MatchHeader className="bg-gray-800" /> */}

      <div className=" flex w-full flex-col gap-y-1 px-2 pb-2 md:gap-[1px] md:p-0">
        {selectedEventGames.length > 0 &&
          selectedEventGames
            .map((g, i) => {
              return (
                <>
                  {renderDate(g.schedule, hasSomeDoubleChance)}
                  <MatchView
                    key={g.id}
                    coreData={coreData}
                    leagues={leagues}
                    bet_types={bet_types}
                    getSportTypeLogo={slip_ball_icon}
                    market_filters={market_filters}
                    eventDetailCatch={eventDetailCatch}
                    lang={i18n.resolvedLanguage}
                    index={i}
                    hasDoubleChance={hasSomeDoubleChance}
                    config={config}
                    g={g}
                  />
                </>
              );
            })
            .filter((g) => g != null)}
      </div>

      {selectedEventGames.length == 0 && (
        <div ref={eventRef} className="mt-1 flex w-full flex-col gap-1">
          {[...Array(10).keys()].map((i, index) => {
            return <MatchViewLoader key={index} index={index} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
