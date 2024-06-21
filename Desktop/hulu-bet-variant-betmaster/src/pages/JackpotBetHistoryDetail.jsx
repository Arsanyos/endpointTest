import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { HiOutlineEmojiSad } from 'react-icons/hi';

import Utils from '@services/utils';
import { useBet } from '@hooks/useBet';
import { useEvent } from '@hooks/useEvent';
import BetHistoryDetailCard from '@components/BetHistoryDetailCard';
import BetHistoryDetailLoader from '@components/LoaderPages/Jackpot/BetHistoryDetailLoader';

// ================================================== Jackpot Bet History Detail ===========================================
export default function JackpotBetHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [reservedMatches, setReservedMatches] = useState([]);
  const [similarSJBetsCount, setSimilarSJBetsCount] = useState(null);
  const [jackpotBetHistoryDetail, setJackpotBetHistoryDetail] = useState(null);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const { getLogoBySportType } = useEvent();
  const { getJackpotHistoryDetail, getSimilarJackpotBetsCount } = useBet();

  const jackpotBetDetailRef = useRef(null);

  useEffect(() => {
    if (jackpotBetDetailRef.current !== null) {
      jackpotBetDetailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [jackpotBetDetailRef.current]);

  useEffect(() => {
    setLoading(true);
    const fetchBetHistoryDetail = async () => {
      const { jackpotHistoryDetail } = await getJackpotHistoryDetail(id);

      const reservedMatches =
        jackpotHistoryDetail && jackpotHistoryDetail.picks?.length > 0
          ? jackpotHistoryDetail.picks?.filter(
              (choice) => choice.is_reserve == true
            )
          : [];
      setReservedMatches(reservedMatches);

      getSimilarJackpotBetsCount(jackpotHistoryDetail.ticket_hash)
        .then(({ count }) => {
          if (count) {
            setSimilarSJBetsCount(count);
          }
        })
        .catch(() => {});

      setJackpotBetHistoryDetail(jackpotHistoryDetail);
      setLoading(false);
    };

    fetchBetHistoryDetail();
  }, []);

  const Market = {
    1: t('HOMETEAM'),
    2: t('VISITINGTEAM'),
    3: t('DRAW'),
    6: t('Open'),
  };

  return (
    <>
      {!loading && jackpotBetHistoryDetail && (
        <div className="flex w-full flex-col overflow-auto pb-16 md:gap-y-1">
          <div
            ref={
              jackpotBetHistoryDetail?.picks?.length > 0
                ? null
                : jackpotBetDetailRef
            }
            className="flex h-9 items-center justify-between bg-secondary-600 px-2 text-lg uppercase text-white"
          >
            <div
              className=" cursor-pointer hover:opacity-40 "
              onClick={() => {
                navigate('/history/jackpot');
              }}
            >
              <span className="text-2xl font-semibold">‹</span>
            </div>
            <div>
              {t('JackpotDetail') + ' ' + t('Bet') + ' ' + t('History')}
            </div>
            <div></div>
          </div>
          <div
            ref={jackpotBetHistoryDetail?.stake ? jackpotBetDetailRef : null}
            className="p-2 md:p-0"
          >
            <div className="scrollbar-hide h-18 flex w-full overflow-x-auto rounded-lg border-[1px] border-secondary-700 bg-secondary-700 py-2 px-4 text-white md:rounded-none md:border-0 md:bg-secondary-700">
              <div className="flex w-1/2 flex-col items-center justify-between border-r-[1px] border-white px-3">
                <div className="flex items-end gap-x-2">
                  <span className="text-xs">{t(configurations?.currency)}</span>
                  <span className="text-xl font-semibold">
                    {Utils.newCurrencyFormat(jackpotBetHistoryDetail?.stake)}
                  </span>
                </div>
                <span>{t('Stake')}</span>
              </div>

              <div className="flex w-1/2 flex-col items-center justify-between border-r-[1px] border-white px-3">
                <span className="text-xl font-semibold">
                  {similarSJBetsCount == null ? ' -- ' : similarSJBetsCount}
                </span>
                <span className="whitespace-nowrap">
                  {t('SimilarBetsCount')}
                </span>
              </div>
              <div className="flex w-1/2 flex-col items-center justify-between border-r-[1px] border-white px-3 ">
                <div className="flex items-end gap-x-2">
                  <span className="text-xs">{t(configurations?.currency)}</span>
                  <span className="text-xl font-semibold">
                    {jackpotBetHistoryDetail?.won_amount == null
                      ? ' -- '
                      : Utils.newCurrencyFormat(
                          jackpotBetHistoryDetail?.won_amount
                        )}
                  </span>
                </div>
                <span className="whitespace-nowrap">{t('WonAmount')}</span>
              </div>
              <div className="flex w-1/2 flex-col items-center justify-between px-3">
                <span className="text-xl font-semibold">
                  {jackpotBetHistoryDetail?.lost_count == null
                    ? ' -- '
                    : jackpotBetHistoryDetail?.lost_count}
                </span>
                <span className="whitespace-nowrap">{t('MatchLost')}</span>
              </div>
            </div>
          </div>
          {/* Header */}
          <div className=" hidden w-full flex-col gap-y-[2px] md:flex ">
            <div className="flex h-12 w-full  flex-row items-center justify-between bg-secondary-700 px-3 text-white ">
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  text-white ">
                  {t('Date')}
                </div>
              </div>
              <div className="flex w-40 flex-row items-center gap-1 text-left text-white">
                <span className="text-center ">{t('Leagues')}</span>
              </div>
              <div className="flex w-40 flex-row items-center gap-1 text-left text-white">
                <span className="text-center ">{t('MATCHES')}</span>
              </div>
              <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
                <span className="text-left ">{t('YourPick')}</span>
              </div>
              <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
                <span className="text-left ">{t('Archive')}</span>
              </div>
              <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
                <span className="text-left ">{t('Status')}</span>
              </div>
            </div>
          </div>
          <div className=" slipCar flex w-full flex-col gap-y-[2px] p-2 md:p-0 ">
            {jackpotBetHistoryDetail.picks?.length > 0 ? (
              jackpotBetHistoryDetail.picks
                .filter((choice) => choice.is_reserve == false)
                .map((list) => {
                  const status =
                    list.status == '3'
                      ? 'win'
                      : list.status == '2'
                      ? 'loss'
                      : list.status == '1'
                      ? t('Open')
                      : t('Canceled');
                  const sportTypeURL = getLogoBySportType(
                    list.event?.event?.league?.league_group?.sport_type
                  );
                  return (
                    <BetHistoryDetailCard
                      key={list.id}
                      status={status}
                      pick={Market[list.pick]}
                      sportTypeURL={sportTypeURL}
                      isOpenTicket={list.status == '1'}
                      result={Market[list.event.result]}
                      home={list.event.event.local_team}
                      away={list.event.event.visitor_team}
                      createdAt={list.event.event.schedule}
                      countryURL={list.event?.event?.league?.league_group?.logo}
                      leagueName={list.event?.event?.league?.name}
                    />
                  );
                })
            ) : (
              <div className=" w-full" style={{ margin: 20 }}>
                <div className="flex w-full flex-col justify-center ">
                  <span className="text-center">No match in this Jackpot.</span>
                </div>
              </div>
            )}
          </div>

          {jackpotBetHistoryDetail.picks?.length > 0 && (
            <div className="my-1 flex h-9  items-center bg-secondary-700">
              <div className="flex w-full items-center justify-center gap-x-2 ">
                <span className="uppercase text-white ">
                  {t('ReservedGames')}
                </span>
              </div>
            </div>
          )}
          {/* Reserved Jackpot matches */}
          <div className=" flex w-full flex-col gap-y-[2px] p-2 md:p-0 ">
            {reservedMatches.length != 0 ? (
              reservedMatches.map((list) => {
                const status =
                  list.status == '3'
                    ? 'win'
                    : list.status == '2'
                    ? 'loss'
                    : list.status == '1'
                    ? 'open'
                    : t('Canceled');
                const sportTypeURL = getLogoBySportType(
                  list.event?.event?.league?.league_group?.sport_type
                );
                return (
                  <BetHistoryDetailCard
                    key={list.id}
                    status={status}
                    pick={Market[list.pick]}
                    sportTypeURL={sportTypeURL}
                    isOpenTicket={list.status == '1'}
                    result={Market[list.event.result]}
                    home={list.event.event.local_team}
                    away={list.event.event.visitor_team}
                    createdAt={list.event.event.schedule}
                    leagueName={list.event?.event?.league?.name}
                    countryURL={list.event?.event?.league?.league_group?.logo}
                  />
                );
              })
            ) : (
              <div className=" w-full" style={{ margin: 20 }}>
                <div className="flex w-full flex-col justify-center ">
                  <span className="text-center">
                    No reserved match in this Jackpot.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!loading && !jackpotBetHistoryDetail && (
        <div className="flex w-full flex-col justify-center gap-y-2 pt-12 ">
          <div className="flex w-full justify-center">
            <HiOutlineEmojiSad className="h-32 w-32 text-gray-400 " />
          </div>
          <div className="flex flex-col gap-y-2 text-gray-400 ">
            <span className="text-center text-4xl">
              Jackpot bet history detail is unavailable right now.
            </span>
            <span className="text-center text-2xl">
              Please try again later.
            </span>
          </div>
        </div>
      )}
      {loading && <BetHistoryDetailLoader />}
    </>
  );
}
