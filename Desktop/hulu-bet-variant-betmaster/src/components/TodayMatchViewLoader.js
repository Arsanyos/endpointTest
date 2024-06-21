import React from 'react';
import { BsGrid3X2GapFill } from 'react-icons/bs';
import MatchViewLoader from './LoaderPages/MatchViewLoader';

function TodayMatchViewLoader() {
  return (
    <div className="flex flex-col">
      <div className="flex h-9 animate-pulse items-center justify-between bg-event-title p-2">
        <div className="flex w-full items-center justify-start gap-x-4 ">
          <span className=" h-4 w-4 rounded-full bg-secondary-200 "></span>
          <span className="flex h-3 w-80 items-center rounded-lg bg-secondary-200 "></span>
        </div>
        <span className=" h-6 w-8 rounded-lg fill-gray-500 "></span>
      </div>
      <div className="flex w-full flex-col  gap-y-1 ">
        {[...Array(4).keys()].map((item, i) => {
          return <MatchViewLoader key={i} index={i} />;
        })}
      </div>
    </div>
  );
}

export default TodayMatchViewLoader;
