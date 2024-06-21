import React from 'react';
// import MatchViewLoader from './LoaderPages/MatchViewLoader';

function TodayMatchViewLoader() {
  return (
    <div className="flex animate-pulse flex-col gap-y-[2px] bg-secondary-800 p-1.5">
      {/* <div className="flex h-9 animate-pulse items-center justify-between bg-secondary-600 p-2">
        <span className=" h-3 w-4 rounded-full bg-secondary-200 "></span>
        <div className="flex w-full items-center justify-center ">
          <span className="flex h-3 w-80 items-center rounded-lg bg-secondary-200 "></span>
        </div>
        <span className=" h-6 w-8 rounded-lg fill-gray-500 "></span>
      </div> */}
      <div className="flex flex-col gap-y-1">
        <div className=" space flex h-24 flex-col items-center justify-center gap-y-4 bg-secondary-700">
          <div className="flex w-full flex-row items-center justify-center gap-4 ">
            <span className="h-3 w-36  rounded-lg bg-secondary-600"> </span>
            <span className="h-2 w-2 rounded-full bg-secondary-600"></span>
            <span className="h-3 w-36  rounded-lg bg-secondary-600"> </span>
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-4 ">
            <span className="h-3 w-36  rounded-lg bg-secondary-600"> </span>
            <span className="h-3 w-4 rounded-full bg-secondary-600"></span>
            <span className="h-3 w-36  rounded-lg bg-secondary-600"> </span>
          </div>
        </div>
        <div className="flex h-8 flex-row gap-x-2 ">
          <div
            className={
              'mb-1 flex  w-24 items-center justify-center rounded-md bg-secondary-700'
            }
          >
            <span className="h-3 w-16 rounded bg-secondary-600 "> </span>
          </div>
          <div className={'flex w-24  items-center justify-center rounded-md '}>
            <span className="h-3 w-16 rounded bg-secondary-600 "> </span>
          </div>
          <div className={'flex w-24  items-center justify-center rounded-md '}>
            <span className="h-3 w-16 rounded bg-secondary-600 "> </span>
          </div>
          <div
            className={'flex  w-24  items-center justify-center rounded-md '}
          >
            <span className="h-3 w-16 rounded bg-secondary-600 "> </span>
          </div>
          <div
            className={'flex  w-24  items-center justify-center rounded-md '}
          >
            <span className="h-3 w-16 rounded bg-secondary-600 "> </span>
          </div>
          <div
            className={'flex  w-24  items-center justify-center rounded-md '}
          >
            <span className="h-3 w-16 rounded bg-gray-400 "> </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {[...Array(3).keys()].map((item, k) => {
          return (
            <div key={k}>
              <div className="flex h-8 flex-row items-center justify-between rounded-t bg-primary-700 px-2">
                <div className="flex w-full items-center justify-center ">
                  <span className="bg-grap-400 h-3 w-24" />
                </div>
                <div className="flex w-full items-center justify-center ">
                  <span className="w-15 h-3 bg-secondary-200" />
                </div>
              </div>
              <div
                className="flex flex-wrap gap-[2px] bg-secondary-800 "
                key={'market'}
              >
                {[...Array(9).keys()].map((item, k) => {
                  return (
                    <div
                      key={'pick3' + k}
                      className="flex h-9 w-[calc(100%/3-1.5px)] flex-row bg-secondary-700"
                    >
                      <div className="flex w-full flex-row items-center justify-between px-1.5 pt-1.5">
                        <div className="flex">
                          <span className="h-3 w-24 rounded bg-secondary-200 ">
                            {' '}
                          </span>
                        </div>
                        <div
                          // span={4}
                          className="flex "
                        >
                          <span className="h-3 w-4 rounded-full bg-secondary-200 ">
                            {' '}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodayMatchViewLoader;
