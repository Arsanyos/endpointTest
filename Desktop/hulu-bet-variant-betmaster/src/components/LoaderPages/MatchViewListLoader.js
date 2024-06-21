import React from 'react';

export default function MatchViewListLoader({ index }) {
  return (
    <>
      <div
        key={'selectedGame' + index}
        className="flex w-full flex-col   bg-secondary-700"
      >
        <div className="flex animate-pulse flex-row items-center gap-2 px-4 py-2">
          <div className=" p-x-2 flex h-10 w-20 items-center justify-center rounded-md ">
            <span className="h-3 w-1/2 rounded-lg bg-gray-500  "> </span>
          </div>
          <div
            className={`flex h-10 w-2/5 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md  px-4 `}
          >
            <span className="h-3 w-1/2 rounded-lg bg-gray-500  "> </span>
            <span className=" h-3 w-1/2 rounded-lg bg-gray-500  "> </span>
          </div>
          <div
            className={`flex h-10 w-1/4 cursor-pointer items-center justify-center rounded-md bg-primary-900 px-4 `}
          >
            <span className="h-3 w-full rounded-lg bg-gray-500  "> </span>
          </div>
          <div className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md bg-gray-900">
            <span className=" h-3 w-8 rounded-lg bg-gray-500  "> </span>
          </div>
          <div className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md bg-gray-900">
            <span className=" h-3 w-8 rounded-lg bg-gray-500  "> </span>
          </div>
        </div>
      </div>
    </>
  );
}
