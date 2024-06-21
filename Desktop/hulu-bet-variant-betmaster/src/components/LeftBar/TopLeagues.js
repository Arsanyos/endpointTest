import { MinusOutlined, PlusOutlined, TrophyFilled } from '@ant-design/icons';
import API from '@services/API';
import Utils from '@services/utils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function TopLeagues({ open, onClose }) {
  const [expand, setExpand] = useState(true);
  const topBets = useSelector((state) => state.coreData.top_bets);
  const league_events = useSelector((state) => state.coreData.league_events);

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const populateTopLeagues = () => {
    return topBets.map((p, i) => {
      return league_events[p.id] && league_events[p.id].length != 0 ? (
        <div key={'gameList' + i}>
          <div
            className="relative flex h-8 w-full flex-1 shrink-0 cursor-pointer flex-row items-center justify-between overflow-hidden  pl-2 "
            onClick={(e) => {
              e.preventDefault();
              navigate(`/matchs/${p.id}`);
              if (onClose) onClose();
            }}
          >
            <div className="flex flex-row items-center gap-2 ">
              {p.icon ? (
                <img
                  src={new URL(p.icon, API.API_BASE_URL)}
                  className="h-4 w-4 rounded-full"
                />
              ) : null}
              <span className="w-full items-center truncate text-sm text-leftbar-group-items-font">
                {i18n.resolvedLanguage.toUpperCase() == 'AM' &&
                p.locales &&
                p.locales.length != 0
                  ? p.locales[0].translation
                  : p.name}
              </span>
            </div>
          </div>
        </div>
      ) : null;
    });
  };

  return (
    <div className="flex flex-col bg-leftbar-group-header">
      {open && (
        <div
          className="group flex h-9 shrink-0 cursor-pointer flex-row items-center justify-between pl-1 pt-4 pb-2  "
          onClick={() => {
            setExpand((prev) => !prev);
          }}
        >
          <div className=" flex  items-center gap-5  border-l-2 border-red-700 px-2  ">
            <div
              className={`flex w-full whitespace-pre text-leftbar-group-header-font duration-500 ${
                !open && 'translate-x-28 overflow-hidden opacity-0'
              }`}
            >
              {t('TOPBETS')}
            </div>
          </div>
          <div
            className={`${
              open && 'hidden'
            } absolute left-14 z-50 -mt-12 flex w-0 translate-y-1/2 flex-col gap-[1px] divide-y-[1px] divide-primary-600 overflow-hidden whitespace-pre rounded-md bg-leftbar-group-items  px-0 py-0 font-semibold drop-shadow-lg group-hover:left-14 group-hover:w-64 group-hover:duration-500  `}
          >
            {populateTopLeagues()}
          </div>
        </div>
      )}
      <div className="flex flex-col divide-y-[1px] divide-primary-600 bg-leftbar-group-items px-2">
        {expand && open && populateTopLeagues()}
      </div>
    </div>
  );
}
