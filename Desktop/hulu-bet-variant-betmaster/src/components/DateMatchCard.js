import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MatchView from './MatchView';
// import { useEvent } from '@hooks/useEvent';
import { useEvent } from '@hooks/useEvent';

import Utils from '@services/utils';
import { useTranslation } from 'react-i18next';
import MatchHeader from './MatchHeader';

// function DateMatchCard(props) {
const DateMatchCard = React.forwardRef(function DateMatchCard(
  props,
  forwardedRef
) {
  const { i, gd, date, events } = props;
  const [expand, setExpand] = useState(true);
  const coreData = useSelector((state) => state.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);

  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const config = useSelector((state) => state.configuration);

  const { getSportTypeLogo } = useEvent();

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  let temp_date = null;

  const renderDate = (schedule, hasDoubleChance) => {
    if (temp_date != Utils.displayDate(schedule, i18n.resolvedLanguage)) {
      temp_date = Utils.displayDate(schedule, i18n.resolvedLanguage);
      return <MatchHeader date={temp_date} hasDoubleChance={hasDoubleChance} />;
    } else return null;
  };

  const hasSomeDoubleChance = events.some(
    (g) => g?.event?.win_odds?.length > 3
  );
  return (
    <div>
      <div
        key={'SGM' + i}
        className="flex flex-col justify-between gap-y-[1px] bg-black "
      >
        {expand && (
          <>
            <div className="flex w-full flex-col gap-y-1 px-2 pb-2 md:gap-[1px] md:p-0">
              {events.map((g, i) => {
                return (
                  <>
                    {renderDate(g.event?.schedule, hasSomeDoubleChance)}
                    <MatchView
                      coreData={coreData}
                      leagues={leagues}
                      bet_types={bet_types}
                      getSportTypeLogo={getSportTypeLogo}
                      market_filters={market_filters}
                      eventDetailCatch={eventDetailCatch}
                      lang={i18n.resolvedLanguage}
                      index={i}
                      key={i}
                      ref={forwardedRef}
                      config={config}
                      hasDoubleChance={hasSomeDoubleChance}
                      g={g.event}
                      getEventDetail={(g) => {
                        navigate(`/match/detail/${g.event.id}`);
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
export default DateMatchCard;
