import React from 'react';

export default function TrendingCard({
  market,
  pick,
  schedule,
  betgroup,
  betType,
  odd,
  sportTypeURL,
  countryURL,
}) {
  return (
    <>
      {/* Web View */}
      <div className=" hidden w-full  flex-col bg-table-body text-table-body-font md:flex">
        <div className="flex w-full flex-row items-center justify-between px-4 py-2">
          <div className="flex w-1/2 flex-row items-center gap-x-2">
            <div className=" p-x-2 flex h-10 w-20 items-center text-center text-xs  ">
              {schedule}
            </div>
            <div className="flex gap-2">
              <div
                className={`flex flex-col items-center justify-between gap-y-1 ${
                  (sportTypeURL || countryURL) && 'rounded p-1'
                }`}
              >
                {sportTypeURL && (
                  <img
                    src={sportTypeURL ?? ''}
                    className="flex h-3 justify-start"
                    alt="sport type"
                  />
                )}
                {countryURL && (
                  <img
                    src={countryURL}
                    alt="country"
                    className="flex h-3 justify-start"
                  />
                )}
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="min-w-3/4 truncate ">{market}</span>
                <span className="min-w-3/4 truncate ">{pick}</span>
              </div>
            </div>
          </div>
          <div className="flex w-1/2 flex-row items-center gap-x-2">
            <div
              className={` flex h-10 w-1/2 items-center justify-between rounded-md bg-primary-700 px-4 text-white `}
            >
              <div className=" w-full truncate ">{betgroup}</div>
            </div>
            <div
              className={` flex  h-10 w-1/4 items-center justify-between rounded-md bg-primary-700 px-4 text-white  `}
            >
              <div className="w-full truncate ">{betType}</div>
            </div>
            <div
              className={` flex  h-10 w-16 items-center justify-between rounded-md bg-primary-700 px-4 text-white `}
            >
              <div className="w-full truncate ">{odd}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex w-full flex-col bg-secondary-800 text-black  md:hidden">
        <div className="flex w-full flex-col items-center justify-between gap-y-1 px-4 py-2">
          <div className=" p-x-2 flex w-full items-start justify-between text-center text-xs text-mute ">
            <span>{schedule}</span>
            <div
              className={`flex items-center justify-center gap-1 ${
                (sportTypeURL || countryURL) && 'rounded bg-primary-700 p-1'
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
                  className="flex h-3 justify-start"
                />
              )}
            </div>
          </div>
          <div className="flex w-full items-start gap-x-2">
            <div className="flex gap-x-2">
              <span className="min-w-1/3 truncate ">{market}</span>{' '}
              <span className="font-bold ">-</span>
              <span className="min-w-1/3 truncate ">{pick}</span>
            </div>
          </div>
          <div className="flex h-8 w-full flex-row items-center gap-x-[1px]">
            <div
              className={`flex h-full w-1/3 items-center justify-between rounded-l-md bg-primary-700 px-4 text-white `}
            >
              <div className=" w-full truncate ">{betgroup}</div>
            </div>
            <div
              className={` flex h-full w-1/3 items-center justify-between bg-primary-700 px-4 text-white `}
            >
              <div className="w-full truncate ">{betType}</div>
            </div>
            <div
              className={` flex h-full  w-1/3 items-center justify-between rounded-r-md bg-primary-700 px-4 text-white `}
            >
              <div className="w-full truncate ">{odd}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
