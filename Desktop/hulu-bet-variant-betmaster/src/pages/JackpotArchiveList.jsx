import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import { Pagination } from 'antd';

import { useJackpot } from '../hooks/useJackpot';

// =========================================================== Jackpot Archive List ================================================
export default function JackpotArchiveList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const jackpotArchiveRef = useRef(null);

  const [selectedPage, setSelectedPage] = useState(0);

  const jackpotSelectedList = useSelector(
    (state) => state.Jackpot.jackpotSelectedList
  );

  const { jackpotList } = useJackpot();

  useEffect(() => {
    if (jackpotArchiveRef.current !== null) {
      jackpotArchiveRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [jackpotArchiveRef.current]);

  useEffect(() => {
    jackpotList();
  }, []);

  const changePage = (page) => {
    setSelectedPage(page - 1);
  };

  return (
    <div ref={jackpotArchiveRef} className=" min-h-screen md:min-h-full">
      <div className="flex h-9 items-center justify-between bg-secondary-600 px-2 text-lg uppercase text-white">
        <div
          className=" cursor-pointer hover:opacity-40 "
          onClick={() => {
            navigate('/jackpots');
          }}
        >
          <span className="text-2xl font-semibold">‹</span>
        </div>
        <div>{t('Jackpots')}</div>
        <div></div>
      </div>
      <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
        {jackpotSelectedList &&
          jackpotSelectedList.length > 0 &&
          jackpotSelectedList.map((list, i) => {
            if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
              const currMonth = new Date(list.finished).getMonth();
              const monthNum = moment(
                moment().month(list.selectedJackpotMonth)
              ).get('month');

              return (
                <div
                  key={list.id}
                  className={
                    'flex h-14 w-full cursor-pointer  flex-row items-center justify-between bg-secondary-700 px-3 text-white   shadow-lg hover:bg-secondary-600' +
                    (![1, 2, 3].includes(list.status) ? '' : ' jackpot-hove')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if ([1, 2, 3].includes(list.status)) {
                      navigate(`/archiveDetail/${list.id}`);
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-y-1">
                    <div className="w-full text-left text-white ">
                      {moment(list.end_time).format('DD/MM/YYYY')}
                    </div>
                    <div className="flex flex-row items-center gap-1 text-left text-gray-400">
                      <span className="text-left text-xs">
                        {t('Jackpot') + ' ' + t('ID') + ': ' + list.id}
                      </span>
                    </div>
                  </div>
                  <div className=" flex items-center">
                    <div className="text-white ">
                      {![1, 2, 3].includes(list.status) ? (
                        <span className="rounded bg-secondary-200 px-2 uppercase ">
                          Canceled
                        </span>
                      ) : (
                        <span className="text-2xl font-bold">›</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else return null;
          })}
        {jackpotSelectedList && jackpotSelectedList.length > 15 ? (
          <center>
            <Pagination
              current={selectedPage + 1}
              total={jackpotSelectedList.length}
              pageSize={15}
              onChange={changePage}
            />
          </center>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
