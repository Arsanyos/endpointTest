import React from 'react';
import CountDown from '@components/CountDown';

export default function JackpotDetailLoader() {
  return (
    <div className="relative flex h-full flex-col gap-y-1">
      <div className="flex h-24 w-full animate-pulse bg-gray-300/40 md:h-40" />
      <div className="flex h-9 animate-pulse items-center justify-between bg-container-header/40 px-2">
        <div className="flex h-6 w-4 animate-pulse cursor-pointer items-center justify-center rounded-md bg-gray-300/40 hover:opacity-40">
          <span className="h-4 w-2 animate-pulse rounded-md bg-white/25" />
        </div>
        <span className="h-5 w-24 animate-pulse rounded-md bg-white/25" />
        <span className="h-6 w-6 animate-pulse rounded-md bg-white/25" />
      </div>

      <div className="flex h-full flex-col gap-y-1">
        <div className="flex bg-jackpot-detail-container ">
          <div className="flex w-full py-4 ">
            <div className="flex w-full flex-col gap-y-4 px-2 pb-2 md:px-8">
              <div className="flex justify-center gap-x-4 ">
                <div className="flex flex-col items-center gap-y-2 ">
                  <div className="flex items-end justify-center gap-x-1 ">
                    <span className="h-4 w-10 animate-pulse rounded bg-white/25" />
                    <span className="h-12 w-16 animate-pulse rounded-md bg-white/25" />
                  </div>
                  <span className="h-5 w-20 rounded-md bg-white/25" />
                </div>
                <div className="jackpot-price">
                  <span className="text-6xl font-extrabold text-jackpot-detail-timer-btn">
                    →
                  </span>
                </div>
                <div className="flex flex-col items-center gap-y-2 ">
                  <div className="flex items-end justify-center gap-x-1 ">
                    <span className="h-4 w-10 animate-pulse rounded bg-white/25" />
                    <span className="h-12 w-32 animate-pulse rounded-md bg-active/10 md:w-36" />
                  </div>
                  <span className="h-5 w-20 rounded-md bg-white/25" />
                </div>
              </div>

              <hr className="w-full rounded-md border-[1px] border-gray-400 " />

              <div className="flex items-end justify-center md:justify-between">
                <div className="hidden h-9 animate-pulse cursor-pointer items-center justify-center gap-x-2 rounded-md bg-jackpot-detail-btn/40 px-2 align-middle hover:opacity-70 md:flex">
                  <span className="h-6 w-6 animate-pulse rounded-md bg-white/25" />
                  <span className="h-6 w-24 animate-pulse rounded-md bg-white/25" />
                </div>
                <div className="flex w-72 animate-pulse flex-col items-center gap-y-4">
                  <CountDown />
                  <button className="h-4 w-44 animate-pulse rounded-md bg-active/20 px-4 hover:opacity-70" />
                </div>
                <div className="hidden h-9 animate-pulse cursor-pointer items-center justify-center gap-x-2 rounded-md bg-jackpot-detail-timer-btn/50 px-2 hover:bg-red-600/25 md:flex">
                  <span className="h-6 w-6 animate-pulse rounded-md bg-white/25" />
                  <span className="h-6 w-24 animate-pulse rounded-md bg-white/25" />
                </div>
              </div>

              <div className="flex items-center justify-between md:hidden">
                <div className=" flex h-9 cursor-pointer items-center justify-center gap-x-2 rounded-md bg-jackpot-detail-btn/40 px-2 align-middle hover:opacity-70">
                  <span className="h-6 w-6 animate-pulse rounded-md bg-white/25" />
                  <span className="h-6 w-24 animate-pulse rounded-md bg-white/25" />
                </div>

                <div className=" flex h-9 cursor-pointer items-center justify-center gap-x-2 rounded-md bg-jackpot-detail-timer-btn/50 px-2 hover:bg-red-600/25">
                  <span className="h-6 w-6 animate-pulse rounded-md bg-white/25" />
                  <span className="h-6 w-24 animate-pulse rounded-md bg-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex min-h-[70%] flex-col ">
          <div className="mb-0.5 flex animate-pulse items-center gap-2 bg-jackpot-detail-container px-4 py-2 pt-4">
            <div className="h-4 w-20 rounded-md" />
            <div className="flex h-4 w-2/5 cursor-pointer items-center justify-center px-4 pr-0 md:pr-4">
              <span className="h-5 w-24 animate-pulse rounded-md bg-white/30" />
            </div>
            <div className="flex h-4 w-16 cursor-pointer items-center justify-center ">
              <span className="h-5 w-16 animate-pulse rounded-md bg-white/30" />
            </div>
            <div className="flex h-4 w-2/5 cursor-pointer items-center justify-center px-2 md:px-4 ">
              <span className="h-5 w-24 animate-pulse rounded-md bg-white/30" />
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-1">
            {[...Array(7).keys()].map((j) => {
              return <EventOddsLoader key={j} />;
            })}
          </div>
          <div className="my-1 flex h-9 w-full items-center justify-center gap-x-2 bg-jackpot-detail-reserve-header/40 ">
            <span className="h-5 w-36 animate-pulse rounded-md bg-white/30" />
          </div>
          <div className="flex w-full flex-col gap-1">
            {[...Array(3).keys()].map((j) => {
              return <EventOddsLoader key={j} />;
            })}
          </div>
        </div>

        <div className="flex w-full flex-col justify-center">
          <div className="my-4 flex w-full justify-center">
            <div className="flex w-4/5 justify-center md:w-3/5">
              <div className="flex w-full flex-col justify-center gap-2 ">
                <div className="flex items-center gap-x-2">
                  <span className="h-4 w-4 animate-pulse rounded bg-white/25" />
                  <span className="h-3 w-72 animate-pulse rounded bg-white/25" />
                </div>
                <button className="h-12 w-full animate-pulse cursor-pointer rounded-md bg-jackpot-detail-place-bet-btn/30 p-2 shadow-lg hover:opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className=" mb-2 flex w-full flex-col-reverse items-center justify-center gap-y-2 md:w-3/5 md:md:gap-x-8">
              <button className="h-12 w-1/2 animate-pulse cursor-pointer rounded-md bg-jackpot-detail-btn/40 p-2 shadow-lg hover:opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EventOddsLoader = () => {
  return (
    <div className="flex w-full animate-pulse flex-col bg-jackpot-detail-container/50">
      <span className="mt-1 ml-2 h-4 w-72 animate-pulse rounded bg-white/25 md:hidden" />
      <div className="flex w-full flex-row items-center gap-2 rounded px-4 py-2">
        <div className=" flex h-10 w-20 animate-pulse flex-col items-center justify-center gap-y-1 rounded bg-jackpot-detail-event-odd-item ">
          <span className="h-3 w-12 animate-pulse rounded bg-white/25" />
          <span className="h-3 w-16 animate-pulse rounded bg-white/25" />
        </div>

        {[...Array(3).keys()].map((j) => {
          const isOdd = j === 0 || j == 2;
          return (
            <div
              key={j}
              className={`animate-pulse rounded bg-jackpot-detail-event-odd-item/60 ${
                isOdd
                  ? 'w-2/5 justify-center md:justify-between'
                  : 'w-16 justify-center'
              } flex h-10 cursor-pointer items-center rounded hover:bg-active/25 `}
            >
              {isOdd && (
                <span className="3/4 hidden h-5 w-72 animate-pulse rounded bg-white/25 md:block" />
              )}
              <span className="h-5 w-10 animate-pulse rounded bg-white/25" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
