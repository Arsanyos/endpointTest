import React, { useState } from 'react';

import { Row, Col, Collapse } from 'antd';
// import { useDisplayLeagueMatches } from '../../hooks/useDisplayLeagueMatches';
import { useDispatch, useSelector } from 'react-redux';

export default function SportTypesLoader({ open }) {
  return (
    <>
      <div className="flex flex-col gap-[1px]">
        {[...Array(10).keys()].map((i, kk) => {
          return (
            <div key={kk}>
              <div className=" flex h-12 animate-pulse cursor-pointer flex-row items-center justify-between bg-secondary-800 ">
                <div className="flex flex-row items-center gap-2">
                  <div className="ml-4 h-6 w-6 rounded-full bg-secondary-600" />
                  <span
                    className={`h-3 w-32 whitespace-pre rounded-lg bg-secondary-600 pl-2.5 ${
                      !open && 'translate-x-28 overflow-hidden opacity-0'
                    }`}
                  ></span>
                </div>
                <div
                  className={`whitespace-pre pr-4 duration-500 ${
                    !open && 'translate-x-28 overflow-hidden opacity-0'
                  }`}
                >
                  <div className=" h-4 w-4 rounded-full bg-secondary-600  " />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
