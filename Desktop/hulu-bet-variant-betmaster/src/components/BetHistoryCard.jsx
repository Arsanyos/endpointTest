import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function BetHistoryCard({
  status,
  ticketID,
  matches,
  stake,
  win,
  hover,
  createdAt,
  onClick,
}) {
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  return (
    <>
      {/* Web View */}
      <div
        className={
          'hidden h-12 w-full cursor-pointer flex-row  items-center justify-between bg-table-body px-3 text-table-body-font shadow-lg   hover:bg-secondary-700/80 md:flex' +
          (!hover ? '' : ' jackpot-hove')
        }
        href="/multijackpot/archive/detail"
        onClick={onClick}
      >
        <div className="flex w-24 flex-col items-center gap-y-1">
          <div className="w-full text-center   ">{createdAt}</div>
        </div>
        <div className="flex w-24 flex-row items-center gap-1 text-left ">
          <span className="text-center text-xs">{ticketID}</span>
        </div>
        <div className=" justify-left flex w-16 items-center ">
          {status == 'win' ? (
            <span className="rounded bg-success px-2 uppercase text-white ">
              {t('Won')}
            </span>
          ) : status == 'loss' ? (
            <span className="rounded bg-danger px-2 uppercase text-white ">
              {t('Lost')}
            </span>
          ) : status == 'rfnd' ? (
            <span className="rounded bg-danger px-2 py-1 text-xs uppercase text-white ">
              {t('Refund')}
            </span>
          ) : (
            <span className="rounded bg-secondary-300 px-2  uppercase text-font-light ">
              {status}
            </span>
          )}
        </div>
        {matches && (
          <div className="flex w-24 flex-row items-center justify-center gap-1 ">
            <span className="text-center text-xs">{matches}</span>
          </div>
        )}
        <div className="flex w-20 flex-row items-center gap-1 text-left ">
          <span className="text-center text-xs">
            {t(configurations?.currency) + ' ' + stake}
          </span>
        </div>
        <div className="flex w-24  flex-row items-center gap-1 text-left ">
          <span className="text-center text-xs">
            {win ? t(configurations?.currency) + ' ' + win : '--'}
          </span>
        </div>

        <div className=" flex items-center gap-x-2">
          <span className="text-2xl font-bold">›</span>
        </div>
      </div>
      {/* Mobile View */}
      <div
        className={
          'flex w-full cursor-pointer flex-row items-center justify-between  rounded-md bg-mobile-table-body py-2 px-3 text-mobile-table-body-font shadow-lg   hover:bg-secondary-700/80 md:hidden' +
          (!hover ? '' : ' jackpot-hove')
        }
        href="/multijackpot/archive/detail"
        onClick={onClick}
      >
        <div className="flex flex-1 flex-col gap-y-1">
          <div className="flex  flex-row items-center gap-1 text-left ">
            <span className="w-full text-start text-xs font-bold">
              {t('TicketID') + ' : ' + ticketID}
            </span>
          </div>
          <div className="flex  flex-col items-center gap-y-1">
            <div className="w-full text-xs font-thin uppercase  ">
              {createdAt}
            </div>
          </div>
          <div className="flex w-full flex-row items-center gap-1 text-left ">
            <span className="max-w-fit text-center text-xs uppercase">
              {t('win') + ': '}
            </span>
            <span className="min-w-fit text-center text-xs uppercase ">
              {win ? win + ' ' + t(configurations?.currency) : '--'}
            </span>
          </div>
        </div>

        <div className="flex w-1/3 flex-col gap-y-1">
          <div className=" flex w-full items-start ">
            {status == 'win' ? (
              <span className="rounded bg-success px-2 py-1  text-xs uppercase text-white ">
                {t('Won')}
              </span>
            ) : status == 'loss' ? (
              <span className="rounded bg-danger px-2 py-1 text-xs uppercase text-white ">
                {t('Lost')}
              </span>
            ) : (
              <span className="rounded bg-secondary-300 px-2 py-1 text-xs  uppercase text-font-light ">
                {status}
              </span>
            )}
          </div>
          <div className="flex  w-full flex-row items-start gap-1 ">
            <span className="text-start text-xs uppercase ">
              {t('MatchLost') + ': '}
            </span>
            <span className="text-start text-xs uppercase ">{matches}</span>
          </div>
          <div className="flex w-full flex-row items-start gap-1 ">
            <span className="text-start text-xs uppercase ">
              {t('Stake') + ': '}
            </span>
            <span className="w-full text-start text-xs uppercase  ">
              {stake + ' ' + t(configurations?.currency)}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-x-2 md:flex">
          <span className="text-2xl font-bold">›</span>
        </div>
      </div>
    </>
  );
}
