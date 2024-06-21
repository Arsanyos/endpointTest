import React from 'react';
import { BiCalendarAlt } from 'react-icons/bi';

export default function BetHistoryListLoader() {
  return (
    <>
      <div className="mb-0.5 flex w-full animate-pulse flex-col gap-y-1 ">
        <div className="mt-1 flex w-full items-center justify-end gap-x-4 bg-table-body px-4  py-2 pt-4 md:h-20">
          <div className="p-x-2 flex h-full w-fit flex-col items-end justify-center gap-y-2 md:w-fit">
            <span className="h-5 w-32 animate-pulse rounded bg-slate-400/40 " />
            <div className="flex h-8 flex-row items-center justify-end gap-x-2 rounded bg-header-nav p-1 ">
              <div className="flex h-6 w-10 items-center justify-center rounded-sm bg-secondary-200/50">
                <span className="h-4 w-8 animate-pulse rounded bg-gray-400/50" />
              </div>
              <div className="flex h-6 w-10 items-center justify-center rounded-sm bg-secondary-200/50">
                <span className="h-4 w-8 animate-pulse rounded bg-gray-400/50" />
              </div>
              <div className="flex h-6 w-10 items-center justify-center rounded-sm bg-secondary-200/50">
                <span className="h-4 w-8 animate-pulse rounded bg-gray-400/50" />
              </div>
              <div className="flex h-6 w-10 items-center justify-center rounded-sm bg-secondary-200/50">
                <span className="h-4 w-8 animate-pulse rounded bg-gray-400/50" />
              </div>
              <div className="flex h-6 w-8 animate-pulse items-center justify-center rounded-sm bg-secondary-200/50">
                <BiCalendarAlt className="text-2xl text-white/60" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden h-12 w-full items-center justify-between bg-secondary-800/80 px-3 md:flex">
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-20 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-24 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-20 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-28 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-24 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex w-32 items-center justify-center">
            <span className="h-4 w-28 animate-pulse rounded-md bg-slate-400/40 " />
          </div>
          <div className="flex h-8 w-4 items-center justify-center">
            <span className="h-4 w-2" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-0.5">
        {[...Array(10).keys()].map((i, index) => {
          return (
            <div key={index}>
              <div className="hidden h-10 w-full items-center justify-between bg-secondary-700 px-3 shadow-lg md:flex">
                <div className="flex w-32 items-center justify-center">
                  <span className="h-3 w-32 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex w-32 items-center justify-center">
                  <span className="h-3 w-12 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex w-32 items-center justify-center">
                  <div className="flex h-8 w-20 items-center justify-center rounded-sm bg-secondary-200/50">
                    <span className="h-4 w-16 animate-pulse rounded bg-gray-400/50" />
                  </div>
                </div>
                <div className="flex w-32 items-center justify-center">
                  <span className="h-3 w-12 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex w-32 items-center justify-center">
                  <span className="h-3 w-16 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex w-32 items-center justify-center">
                  <span className="h-3 w-32 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex h-8 w-4 items-center justify-center">
                  <span className="h-4 w-2 animate-pulse cursor-pointer rounded-md bg-white/25" />
                </div>
              </div>
              <div className="flex h-16 w-full items-center justify-between bg-secondary-700 px-3 shadow-lg md:hidden">
                <div className="flex w-full flex-col gap-y-1">
                  <span className="h-4 w-32 animate-pulse rounded bg-gray-400/50" />
                  <span className="h-3 w-32 animate-pulse rounded bg-gray-400/50" />
                  <span className="h-3 w-40 animate-pulse rounded bg-gray-400/50" />
                </div>
                <div className="flex w-full flex-col items-end gap-y-1">
                  <div className="flex h-6 w-20 items-center justify-center rounded-sm bg-secondary-200/50">
                    <span className="h-3 w-16 animate-pulse rounded bg-gray-400/50" />
                  </div>
                  <span className="h-3 w-32 animate-pulse rounded bg-gray-400/50" />
                  <span className="h-3 w-32 animate-pulse rounded bg-gray-400/50" />
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex h-9 items-center justify-center gap-x-2">
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
          <div className="flex items-center justify-center gap-x-1  text-white">
            <span className="h-1 w-1 animate-pulse rounded-full bg-white/70" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-white/70" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-white/70" />
          </div>
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
          <span className="h-6 w-6 animate-pulse rounded-md bg-secondary-400/75" />
        </div>
      </div>
    </>
  );
}
