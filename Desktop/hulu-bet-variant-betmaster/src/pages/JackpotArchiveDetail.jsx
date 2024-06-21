import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import { message } from 'antd';
import { FaArchive } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';

import API from '@services/API';
import Utils from '@services/utils';

import JackpotCard from '@components/JackpotCard';
import ArchiveDetailLoader from '@components/LoaderPages/Jackpot/ArchiveDetailLoader';

// ========================================================== Jackpot Archive Detail ==========================================
export default function JackpotArchiveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const jackpotArchiveDetailRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [jackpotArchive, setJackpotArchive] = useState(null);
  const [reservedMatches, setReservedMatches] = useState([]);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  useEffect(() => {
    if (jackpotArchiveDetailRef.current !== null) {
      jackpotArchiveDetailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [jackpotArchiveDetailRef.current]);

  useEffect(() => {
    getJackbotDetail(id);
  }, []);

  const getJackbotDetail = (id) => {
    setLoading(true);

    API.findJackpotWithNoToken(`super-jackpot/archived/${id}/`, null, null)
      .then((response) => {
        if (response.data) {
          setJackpotArchive(response.data);
          const reservedMatches =
            response.data?.events.length > 0
              ? response.data?.events?.filter(
                  (choice) => choice.is_reserve == true
                )
              : [];
          setReservedMatches(reservedMatches);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (
          !err.response ||
          (err.response && typeof err.response.data == 'string')
        ) {
          return message.error('Error While Loading Data');
        }
        setLoading(false);
        message.error(err.response.data[Object.keys(err.response.data)[0]][0]);
      });
  };

  return (
    <div className=" h-full">
      <div
        ref={jackpotArchiveDetailRef}
        className="flex h-full flex-col gap-y-1 "
      >
        {!loading && jackpotArchive && (
          <>
            <div className="flex h-9 items-center justify-between bg-secondary-600 px-2">
              <div
                className=" cursor-pointer hover:opacity-40 "
                onClick={() => {
                  navigate('/jackpot/archives');
                }}
              >
                <span className="text-2xl font-semibold text-white">‹</span>
              </div>
              <div className="flex w-full items-center justify-center gap-x-2 ">
                <span className="uppercase text-white ">
                  {jackpotArchive?.title}
                </span>
              </div>
              <FaArchive
                className=" h-5 w-5 cursor-pointer justify-end fill-gray-200 hover:fill-white"
                onClick={() => navigate('/jackpot/archives')}
              />
            </div>

            {jackpotArchive?.banner && (
              <div className="my-1 flex w-full items-center">
                <img
                  src={jackpotArchive?.banner}
                  className="h-24 w-full md:h-40"
                  alt="Banner"
                />
              </div>
            )}

            <div className="flex flex-col gap-y-1">
              <div className="flex bg-secondary-700 px-4 ">
                <div className="flex w-full items-center justify-between py-2 ">
                  <div
                    className={`flex h-8 w-10  items-center justify-center rounded-md  text-center text-lg ${
                      jackpotArchive?.prev_jackpot
                        ? 'cursor-pointer bg-secondary-900 text-white hover:opacity-90'
                        : ' cursor-not-allowed bg-secondary-800 text-gray-400'
                    }`}
                    onClick={() =>
                      jackpotArchive?.prev_jackpot &&
                      getJackbotDetail(jackpotArchive.prev_jackpot)
                    }
                  >
                    ‹
                  </div>
                  <div className="flex flex-col gap-1 text-white ">
                    <span>
                      {moment(jackpotArchive.end_time).format('DD/MM/YYYY')}
                    </span>
                    <span>
                      {t('Jackpot') + ' ' + t('ID') + ': ' + jackpotArchive.id}
                    </span>
                  </div>
                  <div
                    className={`flex h-8 w-10 items-center justify-center rounded-md text-center text-lg ${
                      jackpotArchive?.next_jackpot
                        ? 'cursor-pointer bg-secondary-900 text-white hover:opacity-90'
                        : ' cursor-not-allowed bg-secondary-800 text-gray-400'
                    }`}
                    onClick={() =>
                      jackpotArchive?.next_jackpot &&
                      getJackbotDetail(jackpotArchive.next_jackpot)
                    }
                  >
                    ›
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className=" flex h-16 w-full justify-between bg-secondary-700 py-2 px-4 text-white">
                  <div className="items-first flex w-40 flex-col justify-between">
                    <span className="text-lg font-semibold">Jackpot</span>
                    <div className="flex gap-x-2">
                      <span className="text-sm">
                        {t(configurations?.currency)}
                      </span>
                      <span className="text-sm font-semibold">
                        {jackpotArchive?.prizes?.length > 0
                          ? Math.max(
                              ...jackpotArchive.prizes.map((item) =>
                                parseFloat(item.amount)
                              )
                            )
                          : '- -'}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-40 flex-col items-center justify-between ">
                    <div>
                      <span className="text-sm font-semibold text-primary-300">
                        {(jackpotArchive?.prizes &&
                        jackpotArchive?.prizes?.length != 0 &&
                        jackpotArchive?.prizes[0]?.winner_count != null
                          ? jackpotArchive?.prizes[0]?.winner_count
                          : 0) +
                          ' ' +
                          t('Total') +
                          ' ' +
                          t('Winners')}
                      </span>
                    </div>
                  </div>
                </div>
                {jackpotArchive && jackpotArchive.prizes && (
                  <div className="my-0.5 flex w-full items-center gap-x-2 overflow-x-auto bg-secondary-700 p-4">
                    {jackpotArchive.prizes
                      .sort((a, b) => a.amount < b.amount)
                      .map((price, idx) => {
                        return (
                          <div
                            key={'prices' + idx}
                            className={`flex w-full justify-center text-white ${
                              idx != 0 && ' border-l-[2px] border-slate-500 '
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center px-2">
                              <span className="whitespace-nowrap">
                                {jackpotArchive.events.length
                                  ? jackpotArchive.events.length -
                                    price.rule +
                                    '/' +
                                    jackpotArchive.events.length
                                  : '- -'}
                              </span>
                              <span className="whitespace-nowrap">
                                {(price.winner_count
                                  ? price.winner_count
                                  : '0') +
                                  ' ' +
                                  t('Winners')}
                              </span>
                              <span className="whitespace-nowrap">
                                {price.amount}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className=" flex min-h-[70%] flex-col ">
                {jackpotArchive.events?.length != 0 && (
                  <div className=" hidden w-full flex-row items-center gap-2 bg-secondary-700 px-4 py-2 pt-4 md:flex">
                    <div className=" flex h-4 w-12 items-center rounded-md px-2 " />
                    <div className=" flex h-4 w-28 items-center rounded-md px-2 " />
                    <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center rounded-md  px-4 ">
                      <span className="text-white "> {t('HOMETEAM')}</span>
                    </div>
                    <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center rounded-md">
                      <span className=" text-white "> {t('VISITINGTEAM')}</span>
                    </div>
                    <div className="flex h-4 w-1/3 cursor-pointer items-center justify-center rounded-md px-4">
                      <span className="text-white "> {t('Result')}</span>
                    </div>
                  </div>
                )}
                <div className="flex h-full w-full flex-col gap-1 py-2 px-2 md:py-0 md:px-0">
                  {jackpotArchive?.events?.length != 0 ? (
                    jackpotArchive?.events
                      ?.filter((choice) => choice.is_reserve == false)
                      .map((j, i) => {
                        return (
                          <JackpotCard
                            num={i + 1}
                            schedule={Utils.displayTime(j.event.schedule)}
                            home={
                              i18n.resolvedLanguage == 'Am' &&
                              j.event.hometeam_locale
                                ? j.event.hometeam_locale
                                : j.event.local_team
                            }
                            away={
                              i18n.resolvedLanguage == 'Am' &&
                              j.event.awayteam_locale
                                ? j.event.awayteam_locale
                                : j.event.visitor_team
                            }
                            result={
                              j.result == 1
                                ? 'Home'
                                : j.result == 2
                                ? 'Away'
                                : j.result == 3
                                ? 'Draw'
                                : 'Canceled'
                            }
                          />
                        );
                      })
                  ) : (
                   <div className="w-full py-4">
                      <div className="flex w-full flex-col justify-center ">
                        <span className="text-center">
                          No match in this Jackpot.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {jackpotArchive.events?.length != 0 && (
                  <div
                    className="my-1 flex h-9  items-center bg-secondary-600"
                    onClick={() => {}}
                  >
                    <div className="flex w-full items-center justify-center gap-x-2 ">
                      <span className="uppercase text-white ">
                        {t('ReservedGames')}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex w-full flex-col gap-1 p-2 md:p-0">
                  {reservedMatches.length != 0 ? (
                    reservedMatches.map((j, i) => {
                      return (
                        <JackpotCard
                          num={i + 1}
                          schedule={Utils.displayTime(j.event.schedule)}
                          home={
                            i18n.resolvedLanguage == 'Am' &&
                            j.event.hometeam_locale
                              ? j.event.hometeam_locale
                              : j.event.local_team
                          }
                          away={
                            i18n.resolvedLanguage == 'Am' &&
                            j.event.awayteam_locale
                              ? j.event.awayteam_locale
                              : j.event.visitor_team
                          }
                          result={
                            j.result == 1
                              ? 'Home'
                              : j.result == 2
                              ? 'Away'
                              : j.result == 3
                              ? 'Draw'
                              : 'Canceled'
                          }
                        />
                      );
                    })
                  ) : (
                   <div className="w-full py-4">
                      {jackpotArchive.events?.length != 0 && (
                        <div className="flex w-full flex-col justify-center ">
                          <span className="text-center">
                            No reserved match in this Jackpot.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && !jackpotArchive && (
          <div className="flex w-full flex-col justify-center gap-y-2 pt-12 ">
            <div className="flex w-full justify-center">
              <HiOutlineEmojiSad className="h-32 w-32 text-gray-400 " />
            </div>
            <div className="flex flex-col gap-y-2 text-gray-400 ">
              <span className="text-center text-4xl">
                Jackpot archive detail is unavailable right now.
              </span>
              <span className="text-center text-2xl">
                Please try again later.
              </span>
            </div>
          </div>
        )}
        {loading && <ArchiveDetailLoader />}
      </div>
    </div>
  );
}
