import React, { useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';

export default function Accordion({ title, children }) {
  const downArrow = () => (
    <svg
      className={`h-4 w-4 font-semibold text-white ${
        expand && ' origin-center rotate-180 transform duration-500 '
      } transform duration-500`}
      viewBox="0 0 16.858 9.639"
    >
      <path
        id="Icon_ionic-ios-arrow-forward"
        data-name="Icon ionic-ios-arrow-forward"
        d="M17.98,14.622,11.6,8.248a1.2,1.2,0,0,1,0-1.7,1.215,1.215,0,0,1,1.706,0l7.228,7.222a1.2,1.2,0,0,1,.035,1.661L13.312,22.7A1.2,1.2,0,0,1,11.605,21Z"
        transform="translate(23.054 -11.247) rotate(90)"
        fill="#FFFFFF"
      />
    </svg>
  );
  const [expand, setExpand] = useState(false);

  return (
    <div className="flex h-full w-full items-center gap-y-1 gap-x-2 overflow-hidden bg-gray-300 px-2 py-1">
      <div
        className={`flex h-16 w-full items-center gap-y-1 gap-x-2 bg-gray-300 px-2 py-1 ${
          expand && ' border-b-[1px] border-gray-400'
        }`}
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center gap-6">
          <h1 className="text-white">{title}</h1>
        </div>
        <div>{expand ? downArrow() : downArrow()}</div>
      </div>
      {
        <div
          className={` ${expand && ' h-60 duration-500'} ${
            !expand && ' h-0 duration-500'
          } overflow-x-auto `}
        >
          {children}
        </div>
      }
    </div>
  );
}
