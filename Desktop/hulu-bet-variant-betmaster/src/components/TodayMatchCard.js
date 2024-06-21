import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MatchView from './MatchView';
// import { useEvent } from '@hooks/useEvent';
import { useEvent } from '@hooks/useEvent';
import Utils from '@services/utils';

import API from '@services/API';
import { useTranslation } from 'react-i18next';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiMinus, BiPlus } from 'react-icons/bi';
import MatchHeader from './MatchHeader';

const TodayMatchCard = React.forwardRef(function TodayMatchCard(
  props,
  forwardedRef
) {
  const { i, gd } = props;
  const [expand, setExpand] = useState(true);
  let temp_date = null;

  const coreData = useSelector((state) => state.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);

  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const config = useSelector((state) => state.configuration);
  const league_groups = useSelector((state) => state.coreData?.league_groups);

  const { getSportTypeLogo, addToFav, isfav } = useEvent();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const renderDate = (schedule, hasDoubleChance) => {
    if (temp_date != Utils.displayDate(schedule, i18n.resolvedLanguage)) {
      temp_date = Utils.displayDate(schedule, i18n.resolvedLanguage);
      return (
        <MatchHeader
          date={Utils.displayDate(schedule, i18n.resolvedLanguage)}
          hasDoubleChance={hasDoubleChance}
        />
      );
    } else return null;
  };
  const hasSomeDoubleChance = gd.events.some((g) => g.win_odds.length > 3);

  return (
    <div>
      <div
        key={'SGM' + i}
        className="flex flex-col justify-between gap-y-[1px] bg-event-group md:bg-primary-500  "
      >
        <div
          className="relative flex h-8 items-center justify-between gap-x-1 bg-event-title pl-2 pr-2 "
          onClick={() => setExpand((prev) => !prev)}
        >
          <div className="flex w-[45%] min-w-0 flex-row items-center gap-x-2 ">
            <img
              src={new URL(gd.icon, API.API_BASE_URL)}
              className="h-4 w-4 rounded-full"
            />
            <div className="  truncate  text-sm text-event-title-font">
              <div>
                {i18n.resolvedLanguage == 'Am' &&
                league_groups[gd.league_group_id].locales?.length > 0
                  ? league_groups[gd.league_group_id].locales[0].translation
                  : league_groups[gd.league_group_id]?.name + ` - `}
                {i18n.resolvedLanguage == 'Am' && gd.locales?.length > 0
                  ? gd.locales[0].translation
                  : gd?.text + ` [${gd?.events?.length}]`}
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-end">
            {process.env.REACT_MATCH_EVENT_TITLE_SHOW_WAY === 'true' && (
              <div className="hidden w-full flex-1 grid-cols-2 items-center justify-center text-event-title-font  xl:grid">
                <span className="w-full text-center">{t('ThreeWay')}</span>
                <span className="w-full text-center">{t('DoubleChance')}</span>
              </div>
            )}
            <div className=" flex w-20 shrink-0   cursor-pointer items-center justify-end gap-x-2">
              {isfav(gd?.id) ? (
                <AiFillHeart
                  className="flex shrink-0 text-lg text-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToFav(gd.id, gd.icon, gd.text);
                  }}
                />
              ) : (
                <AiOutlineHeart
                  className="flex shrink-0 text-lg text-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToFav(gd.id, gd.icon, gd.text);
                  }}
                />
              )}
              {expand ? (
                <BiMinus
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpand((prev) => !prev);
                  }}
                  className="h-4 w-4 shrink-0 text-event-title-font"
                />
              ) : (
                <BiPlus
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpand((prev) => !prev);
                  }}
                  className="h-4 w-4 shrink-0 text-event-title-font"
                />
              )}
            </div>
          </div>
        </div>
        {expand && (
          <>
            <div className="flex w-full flex-col gap-y-1 px-2 pb-2 md:gap-[1px] md:p-0">
              {gd.events.map((g, i) => {
                return (
                  <>
                    {renderDate(g.schedule, hasSomeDoubleChance)}
                    <MatchView
                      coreData={coreData}
                      leagues={leagues}
                      ref={forwardedRef}
                      bet_types={bet_types}
                      getSportTypeLogo={getSportTypeLogo}
                      market_filters={market_filters}
                      eventDetailCatch={eventDetailCatch}
                      lang={i18n.resolvedLanguage}
                      index={i}
                      key={i}
                      config={config}
                      hasDoubleChance={hasSomeDoubleChance}
                      g={g}
                      getEventDetail={(g) => {
                        navigate(`/match/detail/${g.id}`);
                      }}
                    />
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
});
export default TodayMatchCard;
