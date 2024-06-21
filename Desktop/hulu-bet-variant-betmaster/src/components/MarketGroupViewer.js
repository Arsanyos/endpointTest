import React, { forwardRef, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { BiMinus, BiPlus } from 'react-icons/bi';

import ToolTip from './ToolTip';
import { useEvent } from '@hooks/useEvent';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import Utils from '@services/utils';
import { useSlips } from '@hooks/useSlips';
import FormatEntity from '@services/format_entity';
import classNames from 'classnames';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import {
  HORIZONTAL,
  MATCHODD,
  THREEWAY,
  TWOWAY,
  TWOWAY_TEMPLATE,
} from '@services/constants';

const MarketGroupViewer = forwardRef(function MarketGroupViewer(
  props,
  forwardedRef
) {
  const {
    market_group,
    key,
    marketType,
    selectedEvent,
    eventDetail,
    filterMarketByType,
  } = props;

  const [expand, setExpand] = useState(true);

  const market_filters = useSelector((state) => state.coreData.market_filters);
  const marketTypeFav = useSelector((state) => state.coreData.marketTypeFav);

  const { addMarketTypeToFav, isMarketTypeFav, localizeBetTypes } = useEvent();
  const { isAddedToSlip, addToSlip } = useSlips();

  const hadSelectedOdd = () => {
    return [...market_group.odds].some((o) => {
      return isAddedToSlip(o.id);
    });
  };

  // TODO: refactor collapse handler
  const isOpen =
    (filterMarketByType != 'All' && filterMarketByType != 'fav' && expand) ||
    (filterMarketByType == 'fav' && expand) ||
    hadSelectedOdd() ||
    (filterMarketByType == 'All' &&
      market_filters[1]?.includes(market_group.bet_group.id) &&
      expand) ||
    (filterMarketByType == 'All' &&
      marketTypeFav?.includes(market_group.bet_group?.id) &&
      expand) ||
    (filterMarketByType == 'All' &&
      !market_filters[1]?.includes(market_group.bet_group.id) &&
      !marketTypeFav?.includes(market_group.bet_group.id) &&
      expand) ||
    (filterMarketByType == 'All' &&
      !market_filters[1]?.includes(market_group.bet_group.id) &&
      marketTypeFav?.includes(market_group.bet_group.id) &&
      expand);

  return (
    <div>
      <div
        key={'SGM' + key}
        className={`flex flex-col justify-between overflow-hidden border-[1px] border-primary-700/30 bg-event-title  ${
          isOpen ? 'rounded-t pt-2' : 'rounded'
        } `}
      >
        <div
          onClick={() => setExpand((prev) => !prev)}
          className="flex cursor-pointer flex-row items-center justify-between  px-2 text-event-title-font"
        >
          <div className="flex items-center gap-x-2 " span={12}>
            {isMarketTypeFav(market_group.bet_group?.id) ? (
              <AiFillHeart
                className="shrink-0 text-lg text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMarketTypeToFav(market_group.bet_group?.id);
                }}
              />
            ) : (
              <AiOutlineHeart
                className=" flex shrink-0 text-lg text-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMarketTypeToFav(market_group.bet_group?.id);
                }}
              />
            )}
            <span className="w-full font-semibold uppercase ">
              {marketType}
            </span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" flex w-4 shrink-0 cursor-pointer items-center gap-x-2"
          >
            {isOpen ? (
              <BiMinus
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpand((prev) => !prev);
                }}
                className="h-4 w-4 shrink-0 "
              />
            ) : (
              <BiPlus
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpand((prev) => !prev);
                }}
                className="h-4 w-4 shrink-0 "
              />
            )}
          </div>
          {/* </div> */}
        </div>
        {isOpen && (
          <>
            <Templates
              ref={forwardedRef}
              Odds={market_group.odds}
              eventDetail={eventDetail}
              selectedEvent={selectedEvent}
              market_group={market_group}
            />
          </>
        )}
      </div>
    </div>
  );
});
export default MarketGroupViewer;

const Templates = forwardRef(function Templates(
  { className = '', market_group, eventDetail, selectedEvent, ...props },
  forwardedRef
) {
  if (market_group.bet_group?.template == TWOWAY) {
    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2  ">
        <TwoWayTemp
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  } else if (market_group.bet_group?.template == TWOWAY_TEMPLATE) {
    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2   ">
        <TwoWayTemp
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  } else if (market_group.bet_group?.template == THREEWAY) {
    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2   ">
        <ThreeWay
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  } else if (market_group.bet_group?.template == HORIZONTAL) {
    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2  ">
        <HorizontalTemp
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  } else if (market_group.bet_group?.template == MATCHODD) {
    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2   ">
        <MatchOddTemp
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  } else {
    // console.log(market_group);
    // console.log(market_group.odds, eventDetail, selectedEvent);
    // return <></>;

    return (
      <div className="flex w-full flex-wrap gap-[2px] bg-match-detail-odds-container px-1 py-2   ">
        <ThreeCols
          ref={forwardedRef}
          Odds={market_group.odds}
          eventDetail={eventDetail}
          selectedEvent={selectedEvent}
          market_group={market_group}
        />
      </div>
    );
  }
});

const Column = forwardRef(function Column(
  { className = '', ...props },
  forwardedRef
) {
  const { odd, selectedEvent, market_group, eventDetail } = props;
  const { localizeBetTypes } = useEvent();
  const navigate = useNavigate();
  const { isAddedToSlip, addToSlip } = useSlips();
  const { t, i18n } = useTranslation();

  if (!odd?.bet_type?.name) {
    console.log(odd);
  }

  const betType = Utils.replaceName(
    localizeBetTypes(odd.bet_type.id, odd.bet_type.name),
    market_group.param,
    selectedEvent.hom,
    selectedEvent.awy,
    selectedEvent.hometeam_locale,
    selectedEvent.awayteam_locale
  );
  const formatedBetType = FormatEntity.formatPickName(
    betType,
    null,
    odd.item.specifier
  );
  const formatedGroupType = FormatEntity.formatMarketName(
    odd.bet_group.name,
    Object.values(odd.item.specifier).length > 0 ? selectedEvent : null,
    odd.item.specifier
  );
  const betgroup = Utils.replaceName(
    formatedGroupType,
    odd.item && odd.item.param ? odd.item.param : '',
    selectedEvent.hom,
    selectedEvent.awy
  );
  let title =
    (i18n.resolvedLanguage == 'Am' && selectedEvent.hometeam_locale != null
      ? selectedEvent.hometeam_locale
      : selectedEvent.hom) +
    ' ' +
    t('VS') +
    ' ' +
    (i18n.resolvedLanguage == 'Am' && selectedEvent.awayteam_locale
      ? selectedEvent.awayteam_locale
      : selectedEvent.awy);

  return (
    <div
      ref={isAddedToSlip(odd.id) ? forwardedRef : null}
      className={classNames(
        className,
        `${
          isAddedToSlip(odd.id)
            ? 'bg-active text-active-font '
            : 'bg-odd-item text-odd-item-font '
        }  flex w-full flex-1 cursor-pointer items-center hover:bg-active hover:text-active-font`
      )}
      onClick={() => {
        addToSlip(
          market_group,
          market_group,
          title,
          betgroup,
          formatedBetType,
          market_group.match,
          odd.id,
          odd.odd
        );
        if (
          process.env.REACT_MATCH_DETAIL_ADD_TO_SLIP_REDIRECT_TO_MATCH_LIST ===
          'true'
        ) {
          window.history.state.idx > 0
            ? navigate(-1)
            : navigate(`/matchs/${eventDetail?.league?.id}`);
        }
      }}
    >
      <div className=" flex w-full flex-row items-center justify-between px-1.5 py-1 ">
        <div className=" inline-block text-left ">
          {/* {Utils.capitalizePicks(formatedBetType)} */}
          {process.env.REACT_ABBREVIATE == 'true'
            ? Utils.capitalizePicksShort(formatedBetType)
            : Utils.capitalizePicks(formatedBetType)}
        </div>
        <div className={'tableitemPrice'}>
          <span className={'tableitemPrice font-semibold'}>{odd.odd}</span>
        </div>
      </div>
    </div>
  );
});

const TwoWayTemp = forwardRef(function TwoWayTemp(props, forwardedRef) {
  const { Odds, eventDetail, selectedEvent, market_group } = props;
  const { isAddedToSlip } = useSlips();

  const mapped = useMemo(() => {
    return Odds.reduce((r, a) => {
      r[a.bet_type.id] = [...(r[a.bet_type.id] || []), a];
      return r;
    }, {});
  }, [Odds]);

  const cols = Object.keys(mapped);

  // console.log('Two Way Temp', cols, mapped);

  return (
    <>
      {mapped &&
        cols?.length > 1 &&
        mapped[cols[0]]?.map((o, index) => {
          if (cols.length == 2) {
            return (
              <div
                key={'pick2x' + index}
                className=" flex w-full flex-wrap gap-[2px] "
              >
                {cols.map((col, idx) => {
                  return (
                    <div key={idx} className=" flex w-[calc(100%/2-1px)] ">
                      <Column
                        ref={
                          isAddedToSlip(mapped[col][index]?.id)
                            ? forwardedRef
                            : null
                        }
                        key={idx}
                        cols={cols}
                        selectedEvent={selectedEvent}
                        odd={mapped[col] && mapped[col][index]}
                        className={''}
                        market_group={market_group}
                        eventDetail={eventDetail}
                      />
                    </div>
                  );
                })}
              </div>
            );
          } else {
            return cols.map((col, idx) => {
              return (
                <div key={idx} className=" flex w-[calc(100%/2-1px)] ">
                  <Column
                    ref={
                      isAddedToSlip(mapped[col][index]?.id)
                        ? forwardedRef
                        : null
                    }
                    key={idx}
                    cols={cols}
                    selectedEvent={selectedEvent}
                    odd={mapped[col] && mapped[col][index]}
                    className={''}
                    market_group={market_group}
                    eventDetail={eventDetail}
                  />
                </div>
              );
            });
          }
        })}
    </>
  );
});

const MatchOddTemp = forwardRef(function MatchOddTemp(props, forwardedRef) {
  const { Odds, eventDetail, selectedEvent, market_group } = props;
  const { isAddedToSlip } = useSlips();
  const mapped = useMemo(() => {
    return Odds.reduce((r, a) => {
      r[a.bet_type.id] = [...(r[a.bet_type.id] || []), a];
      return r;
    }, {});
  }, [Odds]);
  const cols = Object.keys(mapped);

  // console.log('MatchOdd Temp', Odds);
  return (
    <>
      {mapped &&
        cols?.length > 1 &&
        mapped[cols[0]]?.map((o, index) => {
          return (
            <div key={'pick2x' + index} className=" flex w-full gap-[3px] ">
              {cols.map((col, idx) => {
                return (
                  <Column
                    ref={
                      isAddedToSlip(mapped[col][index].id) ? forwardedRef : null
                    }
                    key={idx}
                    cols={cols}
                    selectedEvent={selectedEvent}
                    odd={mapped[col] && mapped[col][index]}
                    className={''}
                    market_group={market_group}
                    eventDetail={eventDetail}
                  />
                );
              })}
            </div>
          );
        })}
    </>
  );
});

const HorizontalTemp = forwardRef(function HorizontalTemp(props, forwardedRef) {
  const { Odds, eventDetail, selectedEvent, market_group } = props;
  const { isAddedToSlip } = useSlips();
  const mapped = useMemo(() => {
    return Odds.reduce((r, a) => {
      r[a.bet_type.id] = [...(r[a.bet_type.id] || []), a];
      return r;
    }, {});
  }, [Odds]);

  const cols = Object.keys(mapped);

  // console.log('Horizontal ', Odds);

  return (
    <>
      {mapped &&
        cols?.length > 1 &&
        mapped[cols[0]]?.map((o, index) => {
          return (
            <div
              key={'pick2x' + index}
              className=" flex w-full flex-wrap gap-[3px] "
            >
              {cols.map((col, idx) => {
                return (
                  <Column
                    ref={
                      isAddedToSlip(mapped[col][index].id) ? forwardedRef : null
                    }
                    key={idx}
                    cols={cols}
                    selectedEvent={selectedEvent}
                    odd={mapped[col] && mapped[col][index]}
                    className={''}
                    market_group={market_group}
                    eventDetail={eventDetail}
                  />
                );
              })}
            </div>
          );
        })}
    </>
  );
});

const ThreeWay = forwardRef(function ThreeWay(props, forwardedRef) {
  const { Odds, eventDetail, selectedEvent, market_group } = props;
  const { isAddedToSlip } = useSlips();

  const mapped = useMemo(() => {
    return Odds.reduce((r, a) => {
      r[a.bet_type.id] = [...(r[a.bet_type.id] || []), a];
      return r;
    }, {});
  }, [Odds]);

  const cols = Object.keys(mapped);

  // console.log('ThreeWay Temp', ' cols: ', cols, ' map: ', mapped);

  return (
    <>
      {mapped &&
        cols?.length > 1 &&
        mapped[cols[0]]?.map((o, index) => {
          return cols.map((col, idx) => {
            if (!(mapped[col] && mapped[col][index])) {
              console.log(mapped, mapped[col], mapped[col][index]);
            }
            return (
              <div
                key={idx}
                className={classNames(
                  ' flex w-[calc(100%/3-2px)] ',
                  cols.length == 2 ? 'w-[calc(100%/2-1px)]' : ''
                )}
              >
                <Column
                  ref={
                    isAddedToSlip(mapped[col][index]?.id) ? forwardedRef : null
                  }
                  key={idx}
                  cols={cols}
                  selectedEvent={selectedEvent}
                  odd={mapped[col] && mapped[col][index]}
                  className={''}
                  market_group={market_group}
                  eventDetail={eventDetail}
                />
              </div>
            );
          });
        })}
    </>
  );
});

const ThreeCols = forwardRef(function ThreeWay(props, forwardedRef) {
  const { Odds, eventDetail, selectedEvent, market_group } = props;
  const { isAddedToSlip } = useSlips();

  // console.log('Three Cols Temp', Odds);

  return (
    <>
      {Odds.map((odd, idx) => {
        return (
          <div
            key={idx}
            className={classNames(
              ' flex  ',
              Odds.length == 2 ? 'w-[calc(100%/2-1px)]' : 'w-[calc(100%/3-2px)]'
            )}
          >
            <Column
              ref={isAddedToSlip(odd?.id) ? forwardedRef : null}
              key={idx}
              // cols={cols}
              selectedEvent={selectedEvent}
              odd={odd}
              className={''}
              market_group={market_group}
              eventDetail={eventDetail}
            />
          </div>
        );
        // });
      })}
    </>
  );
});
