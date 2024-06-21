import React from 'react';

export default function ArchiveDetailLoader() {
  return (
    <>
      <div className="flex h-9 items-center justify-between rounded-md bg-secondary-600/50 px-2">
        <div className="flex h-8 w-4 animate-pulse cursor-pointer items-center justify-center rounded-md bg-gray-700/50 hover:opacity-40 ">
          <span className="h-4 w-2 animate-pulse rounded-md bg-white/25 text-2xl font-semibold" />
        </div>
        <div className="flex w-full items-center justify-center gap-x-2 ">
          <span className="h-4 w-32 animate-pulse rounded bg-white/25 " />
        </div>
        <div className="flex h-8 w-8 animate-pulse cursor-pointer items-center justify-center rounded-md bg-gray-700/50 hover:opacity-40 ">
          <span className="h-6 w-6 animate-pulse rounded-md bg-white/25 text-2xl font-semibold" />
        </div>
      </div>

      <div className="flex h-24 w-full animate-pulse rounded-md bg-gray-300/40 md:h-40" />

      <div className="flex flex-col gap-y-1">
        <div className="flex rounded-md bg-secondary-700/50 px-4 ">
          <div className="flex w-full items-center justify-between py-2 ">
            <div className="flex h-8 w-10 animate-pulse cursor-pointer items-center justify-center rounded-md bg-secondary-800 ">
              <span className="h-4 w-2 animate-pulse rounded-md bg-white/25 " />
            </div>
            <div className="flex flex-col items-center gap-y-1 ">
              <span className="h-4 w-32 animate-pulse rounded-md bg-white/25" />
              <span className="h-3 w-28 animate-pulse rounded bg-white/25" />
            </div>
            <div className="flex h-8 w-10 animate-pulse cursor-pointer items-center justify-center rounded-md bg-secondary-800 ">
              <span className="h-4 w-2 animate-pulse rounded-md bg-white/25 " />
            </div>
          </div>
        </div>
        <div className=" flex h-12 w-full justify-between rounded-md bg-secondary-700/50 py-2 ">
          <div className="flex w-40 flex-col gap-y-1">
            <span className="ml-4 h-4 w-20 animate-pulse rounded-md bg-white/25 " />
            <span className="ml-4 h-4 w-32 animate-pulse rounded-md bg-white/25 " />
          </div>
          <span className="mr-4 h-4 w-32 animate-pulse rounded-md bg-primary-300/50 " />
        </div>
        <div className="my-0.5 flex w-full items-center gap-x-2 overflow-x-auto rounded-md bg-secondary-700/70 p-4">
          {[...Array(5).keys()].map((idx) => {
            return (
              <div
                key={idx}
                className={`flex w-full justify-center ${
                  idx !== 0 ? 'border-l-[2px] border-slate-500 ' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-y-1">
                  <span className="h-3 w-12 animate-pulse rounded bg-white/25 " />
                  <span className="h-3 w-20 animate-pulse rounded bg-white/25 " />
                  <span className="h-3 w-16 animate-pulse rounded bg-white/25 " />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" flex min-h-[70%] flex-col ">
        <div className=" mb-1 hidden w-full  items-center gap-2 rounded-md bg-secondary-700 px-4 py-2 md:flex">
          <div className=" flex h-4 w-12 items-center px-2 " />
          <div className=" flex h-4 w-28 items-center px-2 " />
          <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center ">
            <span className="h-4 w-20 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center ">
            <span className="h-4 w-24 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center ">
            <span className="h-4 w-20 animate-pulse rounded-md bg-white/25 " />
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-1 p-2 md:p-0">
          {[...Array(7).keys()].map((idx) => {
            return <JackpotCardLoader key={idx} />;
          })}
        </div>

        <div className="my-1 flex h-9 items-center justify-center rounded-md bg-secondary-600">
          <span className="h-4 w-36 animate-pulse rounded-md bg-white/25 " />
        </div>

        <div className="flex w-full flex-col gap-y-1 p-2 md:p-0">
          {[...Array(3).keys()].map((idx) => {
            return <JackpotCardLoader key={idx} />;
          })}
        </div>
      </div>
    </>
  );
}

function JackpotCardLoader() {
  return (
    <>
      <div className="hidden w-full flex-col rounded-md bg-secondary-700/50 md:flex">
        <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
          <div className="flex h-10 w-12 animate-pulse items-center justify-center rounded-md bg-secondary-900/50 ">
            <span className="h-6 w-4 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className=" flex h-10 w-28 animate-pulse flex-col items-center justify-center gap-y-1 rounded-md bg-secondary-900/50">
            <span className="h-3 w-12 animate-pulse rounded bg-white/25 " />
            <span className="h-3 w-16 animate-pulse rounded bg-white/25 " />
          </div>
          <div className="flex h-10 w-1/3 animate-pulse items-center justify-between rounded-md bg-secondary-900/50 pl-4">
            <span className="h-4 w-40 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className="flex h-10 w-1/3 animate-pulse items-center justify-between rounded-md bg-secondary-900/50 pl-4">
            <span className="h-4 w-40 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className="flex h-10 w-1/3 animate-pulse items-center justify-center rounded-md bg-secondary-900/50 px-4">
            <span className="h-4 w-16 animate-pulse rounded-md bg-white/25 " />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-md bg-secondary-900/50 md:hidden">
        <div className="flex w-full flex-col items-center px-4 py-2">
          <div className="flex w-full justify-between">
            <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-secondary-700/50">
              <span className="h-5 w-3 animate-pulse rounded-md bg-white/25 " />
            </div>
            <span className="h-4 w-32 animate-pulse rounded-md bg-white/25 " />
          </div>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-y-1 ">
            <div className="flex w-full items-center justify-center gap-x-4 ">
              <span className="h-4 w-24 animate-pulse rounded-md bg-white/50 " />
              <span className="h-4 w-4 animate-pulse rounded-md bg-white/25 " />
              <span className="h-4 w-24 animate-pulse rounded-md bg-white/50 " />
            </div>
            <div className="mx-2 mt-1 flex h-[1px] w-full animate-pulse rounded-md bg-secondary-700/50" />
            <div className="-ml-6 flex h-6 w-full items-center justify-center gap-x-2">
              <span className="h-4 w-24 animate-pulse rounded-md bg-white/25 " />
              <div className="h-1 w-1 animate-pulse rounded-full bg-primary-700/50" />
              <span className="h-4 w-12 animate-pulse rounded-md bg-white/25 " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
