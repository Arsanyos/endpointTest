import moment from 'moment';
import React from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import {
  LikeFilled,
  DislikeFilled,
  MinusCircleFilled,
} from '@ant-design/icons';

export default function BetCard({
  home,
  away,
  market,
  pick,
  sportIcon,
  odd,
  status,
  schedule,
}) {
  return (
    <>
      <div className="slipCard relative flex w-full flex-col bg-header-nav py-2 pl-1 pr-2 text-header-nav-font">
        <div className="flex gap-x-[3px]">
          <div className="flex w-3 shrink-0">
            <img
              src={sportIcon}
              alt="Icon"
              className="mt-0.5 flex h-3 w-3 items-center justify-center"
            />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-full items-center justify-between ">
              <span className="w-full truncate text-xs font-semibold ">
                {home}
              </span>
              <div className="flex gap-1">
                <div className="flex w-24 shrink-0 items-center justify-end gap-x-0.5 truncate text-xs ">
                  <span>{moment(schedule).format('DD/MM/YY')}</span>
                  <div className="h-1 w-1 rounded-full bg-primary-700"></div>
                  <span className="w-[34px]">
                    {moment(schedule).format('hh:mm')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex h-full items-center justify-between border-gray-400  ">
              <span className="w-full truncate text-xs font-semibold ">
                {away}
              </span>
              <div className="flex w-24 shrink-0 items-center justify-end gap-x-1 ">
                <span className="text-right text-xs ">{odd}</span>
                <div className="h-0.5 w-2 rounded bg-active"></div>
                <span className=" truncate text-right text-xs">
                  {status == 'win' ? (
                    <LikeFilled
                      twoToneColor="text-success"
                      style={{ color: '#64A944' }}
                    />
                  ) : status == 'loss' ? (
                    <DislikeFilled
                      twoToneColor="text-danger"
                      style={{ color: '#f44336' }}
                    />
                  ) : (
                    <MinusCircleFilled
                      twoToneColor="text-warning"
                      style={{ color: 'yellow' }}
                    />
                  )}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center justify-evenly gap-x-1 ">
              <span className="w-full text-left text-xs">{market}</span>
              <span className="w-full text-right text-xs">{pick}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
