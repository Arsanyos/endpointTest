import React from 'react';

function TodayMatchPaginationLoader() {
  return (
    <div className="flex h-9 items-center justify-center gap-x-2">
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <div className="flex items-center justify-center gap-x-1  text-white">
        <span className="h-1 w-1 rounded-full bg-white" />
        <span className="h-1 w-1 rounded-full bg-white" />
        <span className="h-1 w-1 rounded-full bg-white" />
      </div>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
      <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
    </div>
  );
}

export default TodayMatchPaginationLoader;
