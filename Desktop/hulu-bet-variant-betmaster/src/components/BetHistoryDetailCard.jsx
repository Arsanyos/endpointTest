import React from 'react';
import Utils from '@services/utils';
import moment from 'moment';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { GiCash } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';

export default function BetHistoryDetailCard({
  status,
  home,
  odd,
  away,
  pick,
  market,
  result,
  createdAt,
  countryURL,
  leagueName,
  isOpenTicket,
  sportTypeURL,
}) {
  const { t } = useTranslation();
  return (
    <>
      {/* Web View */}
      <div
        className={
          'hidden h-12 w-full flex-row  items-center justify-between bg-table-body px-3 text-table-body-font  shadow-lg   md:flex '
        }
      >
        <div className="flex w-24 flex-col items-center gap-y-1">
          <div className="w-full text-center  ">
            {Utils.displayTime(createdAt, 'En')}
          </div>
        </div>
        <div
          className={`flex h-full w-40 items-center  gap-x-2 ${
            (sportTypeURL || countryURL) && 'rounded p-1.5'
          }`}
        >
          {sportTypeURL && (
            <img
              src={sportTypeURL}
              className="flex w-3 flex-shrink-0 justify-start"
              alt="sport type"
            />
          )}
          {countryURL && (
            <img
              src={countryURL}
              alt="country"
              className="flex w-3.5 flex-shrink-0 justify-end"
            />
          )}
          <span>{leagueName}</span>
        </div>
        <div className="flex w-40 flex-col">
          <span className=" truncate">{home}</span>
          <span className=" truncate">{away} </span>
        </div>
        {market && (
          <div className="flex w-24 flex-row items-center gap-1 text-left ">
            <span className="text-left text-xs">{market || t('PICK')}</span>
          </div>
        )}

        <div className="justify-left flex w-24 flex-row items-center gap-1 ">
          <span className="truncate text-left text-xs uppercase">{pick}</span>
        </div>
        {result && (
          <div className="justify-left flex w-24 flex-row items-center gap-1 ">
            <span className="truncate text-left text-xs uppercase">
              {isOpenTicket ? '--' : result}
            </span>
          </div>
        )}
        {odd && (
          <div className="flex w-20 flex-row items-center gap-1 text-left ">
            <span className="text-center text-xs">{odd}</span>
          </div>
        )}
        <div className=" justify-left flex w-24 items-center text-white">
          {status == 'win' ? (
            <span className="rounded bg-success px-2 uppercase ">
              {t('Won')}
            </span>
          ) : status == 'loss' ? (
            <span className="rounded bg-danger px-2 uppercase ">
              {t('Lost')}
            </span>
          ) : (
            <span className="rounded bg-secondary-300 px-2 uppercase  text-font-light ">
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="slipCard h-18 relative flex flex-col rounded bg-mobile-table-body  py-2 pl-1 pr-2 text-mobile-table-body-font md:hidden">
        <div className="flex h-full gap-x-[3px]">
          <div
            className={`flex h-full flex-col items-center justify-center gap-1 ${
              (sportTypeURL || countryURL) && ' p-1'
            }`}
          >
            {sportTypeURL && (
              <img
                src={sportTypeURL}
                className="flex h-3 justify-start"
                alt="sport type"
              />
            )}
            {countryURL && (
              <img
                src={countryURL}
                alt="country"
                className="flex w-4 justify-start"
              />
            )}
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-full items-center justify-between ">
              <div className="flex w-[60%] items-center gap-x-1">
                <span className="w-full truncate text-xs font-semibold ">
                  {home}
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex w-24 shrink-0 items-center justify-end gap-x-0.5 truncate text-xs  ">
                  <span>{moment(createdAt).format('DD/MM/YY, HH:mm')}</span>
                </div>
              </div>
            </div>
            <div className="flex h-full items-center justify-between border-gray-400 ">
              <div className="flex w-[60%] items-center gap-x-1">
                <span className="w-full truncate text-xs font-semibold ">
                  {away}
                </span>
              </div>
              <div className="flex w-24 shrink-0 items-center justify-end gap-x-1 ">
                <span className="text-right text-xs ">{odd}</span>
                <div className="h-0.5 w-2 rounded bg-primary-700"></div>
                <span className=" truncate text-right text-xs">
                  {status == 'win' ? (
                    <BsFillCheckCircleFill className="text-success" />
                  ) : status == 'loss' ? (
                    <AiFillCloseCircle className="text-danger" />
                  ) : status == 'open' ? (
                    <MdOutlineAccessTimeFilled className="" />
                  ) : (
                    <GiCash className="" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-x-1  ">
              <div className="flex w-[60%] items-center gap-x-1">
                <div className="h-1 w-1 rounded-full bg-primary-700"></div>
                <span className="w-full text-xs ">{leagueName}</span>
              </div>
              <span className=" text-xs">{pick}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
