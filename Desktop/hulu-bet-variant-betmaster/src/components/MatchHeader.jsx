import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

function MatchHeader({ date = null, className = '', hasDoubleChance = true }) {
  const isMatchHeaderAbbreviated =
    process.env.REACT_MATCH_HEADER_ABBREVIATE === 'true';
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        ' h-[22px] w-full items-center bg-event-match-header text-[12px] font-light text-event-match-header-font md:flex ',
        process.env.REACT_ODD_DIVIDER == 'true'
          ? 'divide-x-[1px] divide-odd-item-divider'
          : '',
        className
      )}
    >
      <div className="flex h-full w-[60%] shrink-0 items-center  pl-2.5  text-justify font-semibold xl:w-[45%] ">
        {/* Date */}
        {date && <span>{date}</span>}
      </div>
      <div
        className={classNames(
          ' hidden h-full w-full items-center md:flex ',
          process.env.REACT_ODD_DIVIDER == 'true'
            ? 'divide-x-[1px] divide-odd-item-divider'
            : ''
        )}
      >
        <div className="flex flex-1 items-center justify-evenly ">
          <span className="flex h-full w-full items-center justify-center  text-center">
            {!isMatchHeaderAbbreviated ? t('Home') : '1'}
          </span>
          <span className="flex h-full w-full items-center justify-center  text-center">
            {!isMatchHeaderAbbreviated ? t('DRAW') : 'X'}
          </span>
          <span className="flex h-full w-full items-center justify-center  text-center">
            {!isMatchHeaderAbbreviated ? t('AWAY') : '2'}
          </span>
        </div>
        {process.env.REACT_ENABLE_DOUBLE_CHANCE_DESKTOP == 'true' &&
        hasDoubleChance ? (
          <div className="hidden h-full flex-1 items-center justify-evenly border-r-[1px] border-secondary-950 xl:flex">
            <span className="flex h-full w-full items-center justify-center  text-center">
              {!isMatchHeaderAbbreviated ? `1 ${t('or')} X` : '1X'}
            </span>
            <span className="flex h-full w-full items-center justify-center   text-center">
              {!isMatchHeaderAbbreviated ? `2 ${t('or')} X` : 'X2'}
            </span>
            <span className="flex h-full w-full items-center justify-center  text-center">
              {!isMatchHeaderAbbreviated ? `1 ${t('or')} 2` : '12'}
            </span>
          </div>
        ) : null}
        {/* {process.env.REACT_ENABLE_DOUBLE_CHANCE_MOBILE == 'true' &&
        hasDoubleChance ? (
          <div className="hidden h-full flex-1 items-center justify-evenly border-r-[1px] border-secondary-950 xl:flex">
            <span className="flex h-full w-full items-center justify-center  text-center">
              {!isMatchHeaderAbbreviated ? `1 ${t('or')} X` : '1X'}
            </span>
            <span className="flex h-full w-full items-center justify-center   text-center">
              {!isMatchHeaderAbbreviated ? `2 ${t('or')} X` : 'X2'}
            </span>
            <span className="flex h-full w-full items-center justify-center  text-center">
              {!isMatchHeaderAbbreviated ? `1 ${t('or')} 2` : '12'}
            </span>
          </div>
        ) : null} */}
        <div className="h-full w-20  text-center"></div>
      </div>
    </div>
  );
}

export default MatchHeader;
