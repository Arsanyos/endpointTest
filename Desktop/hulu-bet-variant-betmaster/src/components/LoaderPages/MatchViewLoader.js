import React from 'react';

export default function MatchViewLoader({ index }) {
  return (
    <>
      <div
        key={'selectedGame' + index}
        className="flex w-full flex-col   bg-secondary-700"
      >
        <div className="hidden h-[28px] w-full animate-pulse items-center bg-secondary-800 text-sm text-white md:flex ">
          <div className="  flex h-full w-[60%] shrink-0   items-center gap-x-4 border-r-[1px] border-black pl-2.5 text-justify hover:bg-secondary-700 xl:w-[45%] ">
            <div className=" flex flex-col items-center gap-y-[1px] text-[10px] font-light text-gray-400 ">
              <span className=" h-2 w-4 rounded-full bg-secondary-600  ">
                {' '}
              </span>
            </div>
            <div role="title" className="flex w-full gap-x-1 truncate pr-2">
              <span className="h-2 w-1/6 rounded-lg bg-secondary-600  "> </span>
              <span className=" h-2 w-1/6 rounded-full bg-secondary-600  "></span>
            </div>
          </div>
          <div className="flex h-full w-full items-center hover:bg-secondary-700 ">
            <div className="flex h-full flex-1 items-center justify-evenly divide-x-[1px] divide-black border-r-[1px] border-black">
              <div
                role="button"
                className={` flex h-full w-full items-center justify-center   text-start text-white `}
              >
                <span className=" h-2 w-4 rounded-full bg-secondary-600  "></span>
              </div>
              <div
                role="button"
                className={` flex h-full w-full items-center justify-center   text-start `}
              >
                <span className=" h-2 w-1/6 rounded-full bg-secondary-600  "></span>
              </div>
              <div
                role="button"
                className={` flex h-full w-full items-center justify-center   text-start `}
              >
                <span className=" h-2 w-1/6 rounded-full bg-secondary-600  "></span>
              </div>
            </div>
            {/* (gameDrawHome || gameHomeAway || gameDrawAway) && */}
            {
              <div className="hidden h-full flex-1 items-center justify-evenly divide-x-[1px] divide-black border-r-[1px] border-black xl:flex">
                <div
                  role="button"
                  className={` roup flex h-full w-full items-center justify-center   text-start  `}
                >
                  <span className=" h-2 w-4 rounded-full bg-secondary-600  "></span>
                </div>

                <div
                  role="button"
                  className={`flex h-full w-full items-center justify-center   text-start text-white `}
                >
                  <span className=" h-2 w-4 rounded-full bg-secondary-600  "></span>
                </div>
                <div
                  role="button"
                  className={` flex h-full w-full items-center justify-center text-start  `}
                >
                  <span className=" h-2 w-4 rounded-full bg-secondary-600  "></span>
                </div>
              </div>
            }
            <div
              role="button"
              className={`flex h-full w-20 items-center justify-center  border-black text-center align-middle `}
            >
              <span className=" h-2 w-4 rounded-full bg-secondary-600  "></span>
            </div>
          </div>
        </div>
        {/* mobile view */}
        <div className="min-h-20 relative  flex w-full animate-pulse flex-col rounded bg-secondary-700  md:hidden">
          {/* Variant - 1 */}
          <div className="relative flex  w-full flex-col gap-y-1 px-2 py-2 ">
            <div className="relative flex items-center gap-x-2 text-white ">
              <div className="flex h-6 w-12 items-center border-r-2 border-secondary-700  ">
                <span className="h-2 w-2/3 rounded-lg bg-gray-500  "> </span>
              </div>
              <div className="flex w-full flex-col gap-y-1 truncate pr-9 text-xs">
                <span className="h-2 w-1/3 rounded-lg bg-gray-500  "> </span>
                <span className="h-2 w-1/3 rounded-lg bg-gray-500  "> </span>
              </div>

              <div
                className={`absolute top-0 right-0 flex h-5 w-10  items-center justify-end rounded px-1  py-0 align-middle text-xs `}
              >
                <span className=" h-1.5 w-4 rounded-full bg-secondary-600  "></span>
              </div>
            </div>

            <div className="flex w-full gap-x-2 text-xs font-semibold text-white">
              <div
                className={`flex h-9 w-full flex-1 shrink-0 flex-col  items-center  justify-center gap-y-1 rounded bg-black/50 py-0.5 `}
              >
                <span className=" h-1 w-3 rounded-full bg-secondary-600  "></span>
                <span className=" h-1 w-6 rounded-full bg-secondary-600  "></span>
              </div>
              <div
                className={`flex h-9 w-full flex-1 shrink-0 flex-col  items-center  justify-center gap-y-1 rounded bg-black/50 py-0.5 `}
              >
                <span className=" h-1 w-3 rounded-full bg-secondary-600  "></span>
                <span className=" h-1 w-6 rounded-full bg-secondary-600  "></span>
              </div>

              <div
                className={`flex h-9 w-full flex-1 shrink-0 flex-col  items-center justify-center gap-y-1 rounded bg-black/50 py-0.5 `}
              >
                <span className=" h-1 w-3 rounded-full bg-secondary-600  "></span>
                <span className=" h-1 w-6 rounded-full bg-secondary-600  "></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
