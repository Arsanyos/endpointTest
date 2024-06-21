import React from 'react';
import { useTranslation } from 'react-i18next';

export default function JackpotCard({ num, schedule, home, away, result }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="hidden w-full flex-col bg-secondary-700 md:flex">
        <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
          <div className="flex h-10 w-12 items-center justify-center rounded-md bg-secondary-900 text-center align-middle text-xs text-white">
            {num}
          </div>
          <div className="flex h-10 w-28 items-center rounded-md bg-secondary-900 px-2 text-center text-xs text-white">
            {schedule}
          </div>
          <div className="flex h-10 w-1/3 items-center justify-between truncate rounded-md bg-secondary-900 px-4 text-white">
            {home}
          </div>
          <div className="flex h-10 w-1/3 items-center justify-between truncate rounded-md bg-secondary-900 px-4 text-white">
            {away}
          </div>
          <div className="flex h-10 w-1/3 items-center justify-center rounded-md bg-secondary-900 px-4 text-white">
            {result}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-md bg-secondary-900 md:hidden">
        <div className="flex w-full flex-col items-center px-4 py-2">
          <div className="flex w-full justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-700 p-1 text-center align-middle text-xs text-white">
              {num}
            </div>
            <div className=" flex items-center rounded-md  px-2 text-center text-xs text-secondary-100 ">
              {schedule}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-y-[2px] ">
            <div className="flex w-full gap-x-4 ">
              <h1 className="flex h-8 flex-1 items-center justify-end truncate rounded-md text-white">
                {home}
              </h1>
              <span className="flex items-center text-end font-thin text-white">
                VS
              </span>
              <h1 className="flex h-8 flex-1 items-center justify-start truncate rounded-md text-white">
                {away}
              </h1>
            </div>
            <div className="mx-2 flex h-[1px] w-full rounded  bg-secondary-700"></div>
            <div className="flex h-8 w-full items-center gap-x-4  text-white">
              <div className="flex flex-1 justify-end truncate text-white">
                {t('Match') + ' ' + t('Result')}
              </div>
              <div className="h-2 w-2 rounded-full bg-primary-700"></div>
              <span className="flex flex-1 justify-start text-white">
                {result}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
