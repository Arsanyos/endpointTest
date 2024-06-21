import React from 'react';

export default function BetHistoryDetailLoader() {
  return (
    <div className="flex w-full flex-col overflow-auto pb-16 md:gap-y-1">
      <div className="flex h-9 w-full items-center justify-between bg-secondary-600 p-2">
        <div className="flex h-6 w-4 animate-pulse cursor-pointer items-center justify-center rounded-md bg-gray-300/40 hover:opacity-40">
          <span className="h-3 w-2 animate-pulse rounded-md bg-white/25" />
        </div>
        <span className="h-5 w-64 animate-pulse rounded-md bg-white/25" />
        <span />
      </div>
      <div className="p-2 md:p-0">
        <div className="scrollbar-hide h-18 flex w-full overflow-x-auto rounded-lg border-[1px] border-secondary-700 bg-secondary-700 py-2 px-4 md:rounded-none md:border-0">
          <div className="flex flex-col items-center justify-between gap-y-1 border-r-[1px] border-white px-3 md:w-1/2">
            <div className="flex items-end gap-x-2">
              <span className="h-6 w-12 animate-pulse rounded-md bg-white/25" />
              <span className="h-8 w-20 animate-pulse rounded-md bg-white/50" />
            </div>
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/25" />
          </div>

          <div className="flex flex-col items-center justify-between gap-y-1 border-r-[1px] border-white px-3 md:w-1/2">
            <span className="h-8 w-10 animate-pulse rounded-md bg-white/50" />
            <span className="h-5 w-32 animate-pulse rounded-md bg-white/25" />
          </div>
          <div className="flex flex-col items-center justify-between gap-y-1 border-r-[1px] border-white px-3 md:w-1/2">
            <div className="flex items-end gap-x-2">
              <span className="h-6 w-12 animate-pulse rounded-md bg-white/25" />
              <span className="h-8 w-40 animate-pulse rounded-md bg-white/50" />
            </div>
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/25" />
          </div>

          <div className="flex flex-col items-center justify-between gap-y-1 px-3 md:w-1/2">
            <span className="h-8 w-10 animate-pulse rounded-md bg-white/50" />
            <span className="h-5 w-32 animate-pulse rounded-md bg-white/25" />
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="hidden w-full flex-col gap-y-[2px] md:flex">
        <div className="flex h-10 w-full items-center justify-between bg-secondary-700 px-3">
          <div className="flex w-24 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
          <div className="flex w-48 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
          <div className="flex w-40 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
          <div className="flex w-24 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
          <div className="flex w-24 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
          <div className="flex w-24 items-center">
            <span className="h-5 w-24 animate-pulse rounded-md bg-white/50" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-[2px] p-2 md:p-0">
        {[...Array(7).keys()].map((idx) => {
          return <BetHistoryCardLoader key={idx} />;
        })}
      </div>

      <div className="my-1 flex h-9 items-center bg-secondary-700">
        <div className="flex w-full items-center justify-center py-1">
          <span className="h-5 w-32 animate-pulse rounded-md bg-white/50" />
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-[2px] p-2 md:p-0">
        {[...Array(3).keys()].map((idx) => {
          return <BetHistoryCardLoader key={idx} />;
        })}
      </div>
    </div>
  );
}

function BetHistoryCardLoader() {
  return (
    <>
      {/* Web View */}
      <div className="hidden h-12 w-full items-center justify-between bg-table-body px-3 shadow-lg md:flex">
        <div className="flex w-24 flex-col items-center">
          <span className="h-4 w-24 animate-pulse rounded bg-white/25" />
        </div>
        <div className="flex h-10 w-48 items-center gap-x-2">
          <span className="h-5 w-4 animate-pulse rounded-md bg-white/25" />
          <span className="h-5 w-4 animate-pulse rounded-md bg-white/25" />
          <span className="h-5 w-40 animate-pulse rounded-md bg-white/25" />
        </div>
        <div className="flex w-40 flex-col gap-y-1">
          <span className="h-4 w-36 animate-pulse rounded-md bg-white/25" />
          <span className="h-4 w-32 animate-pulse rounded-md bg-white/25" />
        </div>
        <div className="flex w-24 items-center justify-center">
          <span className="h-5 w-20 animate-pulse rounded-md bg-white/25" />
        </div>

        <div className="flex w-24 items-center justify-center">
          <span className="h-5 w-20 animate-pulse rounded-md bg-white/25" />
        </div>
        <div className="flex w-24 items-center justify-center">
          <div className="flex h-6 w-20 items-center justify-center rounded bg-secondary-300 ">
            <span className="h-4 w-16 animate-pulse rounded bg-white/25" />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="slipCard h-18 relative flex flex-col rounded bg-mobile-table-body py-2 pl-1 pr-2 md:hidden">
        <div className="flex h-full gap-x-[3px]">
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="h-5 w-5 animate-pulse rounded-md bg-white/25" />
            <span className="h-5 w-5 animate-pulse rounded-md bg-white/25" />
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <div className="flex h-full items-center justify-between">
              <div className="flex w-[60%] items-center gap-x-1">
                <span className="h-4 w-36 animate-pulse rounded-md bg-white/25" />
              </div>
              <div className="flex gap-1">
                <div className="flex w-24 shrink-0 items-center justify-end gap-x-0.5">
                  <span className="h-4 w-36 animate-pulse rounded-md bg-white/25" />
                </div>
              </div>
            </div>
            <div className="flex h-full items-center justify-between border-gray-400">
              <div className="flex w-[60%] items-center gap-x-1">
                <span className="h-4 w-32 animate-pulse rounded-md bg-white/25" />
              </div>
              <div className="flex w-24 shrink-0 items-center justify-end gap-x-1">
                <div className="h-0.5 w-2 rounded bg-primary-700" />
                <span className="h-4 w-4 animate-pulse rounded bg-white/25" />
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-x-1">
              <div className="flex w-[60%] items-center gap-x-1">
                <div className="h-1 w-1 rounded-full bg-primary-700" />
                <span className="h-4 w-32 animate-pulse rounded-md bg-white/25" />
              </div>
              <span className="h-4 w-20 animate-pulse rounded-md bg-white/25" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
