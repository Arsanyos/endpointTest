import React from 'react';

export default function Dropdown({ children, icon, localtion = 'right' }) {
  return (
    <span className="group relative">
      <>{icon}</>
      <div
        className={`min-w-60 absolute  ${localtion.toLowerCase()}-0 top-0 z-50  h-0  overflow-hidden  whitespace-pre px-0 group-hover:top-4 group-hover:h-fit group-hover:py-0 group-hover:duration-500 `}
      >
        <div className="mt-2 py-1">
          <div
            className={`absolute ${localtion.toLowerCase()}-1  h-2 w-2 rotate-45 bg-secondary-900 `}
          ></div>
        </div>
        <div className=" w-full rounded-md bg-secondary-900 p-2 text-white drop-shadow-lg">
          {children}
        </div>
      </div>
    </span>
  );
}
