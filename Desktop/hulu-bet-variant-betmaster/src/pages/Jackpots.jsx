import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateJackpot } from '@ReduxStore/jackpotSlice';

import moment from 'moment';

import { message } from 'antd';
import { HiOutlineEmojiSad } from 'react-icons/hi';

import API from '@services/API';
import Utils from '@services/utils';

// ============================================ Jackpots List ============================================
export default function JackpotsList() {
  const [loading, setLoading] = useState(true);

  const [jackpotList, setJackpotList] = useState(null);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jackpotRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getJackpots();
  }, []);

  const getJackpots = () => {
    setLoading(true);
    API.findJackpotWithNoToken(`super-jackpot/active/`, null, null)
      .then((response) => {
        const resData = response.data.filter((sj) => {
          const hasEvent = sj.events.length > 0;
          if (!hasEvent) return false;

          const sortedJackpotList = sj.events
            .slice()
            .sort((a, b) =>
              moment.utc(a.event.schedule).diff(moment.utc(b.event.schedule))
            );

          const startTimeDiff = moment
            .duration(
              moment(sortedJackpotList[0].event.schedule).diff(
                moment(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
              )
            )
            .asMilliseconds();

          const hasGameStarted = 0 > startTimeDiff;

          return !hasGameStarted;
        });

        const SJList = resData.filter((jackpot) => {
          const isOnline =
            jackpot.supported_mode === 1 || jackpot.supported_mode === 3;
          const isRetail =
            jackpot.supported_mode === 2 || jackpot.supported_mode === 3;

          return isLoggedIn ? isOnline : isRetail;
        });

        setJackpotList(SJList);

        dispatch(updateJackpot({ jackpots: resData }));

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.code === 'ERR_NETWORK') {
          return message.error(err.message);
        }
        if (!err.response) {
          return message.error('Error While Loading Data');
        }
        return message.error(
          err.response.data[Object.keys(err.response.data)[0]][0]
        );
      });
  };

  const getMaxPrize = (jackpot) =>
    jackpot?.prizes?.length > 0
      ? Math.max(...jackpot?.prizes?.map((prize) => prize.amount))
      : 0;

  return (
    <div ref={jackpotRef} className="flex h-full flex-col gap-y-1">
      <div className="flex h-9 items-center justify-center bg-container-header px-2">
        <span className="text-white ">{t('Jackpots')}</span>
      </div>
      <div className="flex h-full flex-col gap-y-4">
        {!loading &&
          jackpotList.length > 0 &&
          jackpotList.map((jackpot) => (
            <div
              key={`${jackpot.id} - ${jackpot.jackpot_id} - ${jackpot.title}`}
              className="mx-4 flex flex-col items-center overflow-hidden rounded-lg bg-jackpot-container shadow-md"
            >
              <img
                src={jackpot.banner}
                className="h-24 w-full md:h-56"
                alt={`Jackpot banner ${jackpot.jackpot_id}`}
              />
              <div className="flex w-full flex-col gap-y-2 p-4 text-jackpot-container-font md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-y-1">
                  <span className="font-semibold md:text-lg md:font-bold">{`${jackpot.jackpot_id} - ${jackpot.title}`}</span>
                  <span className="text-xs font-semibold md:text-base">
                    {`Stake : ${Utils.newCurrencyFormat(jackpot.stake)} ${t(
                      configurations?.currency
                    )}`}
                  </span>
                </div>
                <span className="text-xl font-semibold md:text-3xl md:font-bold">
                  {`${Utils.newCurrencyFormat(getMaxPrize(jackpot))} ${t(
                    configurations?.currency
                  )}`}
                </span>
                <div className="flex flex-col gap-y-1 text-xs md:text-base">
                  <span>
                    {`${t('JackpotEnds')} : ${moment(jackpot.end_time).format(
                      'DD MMM, HH:mm'
                    )}`}
                  </span>
                  <span>{`${jackpot.events.length} ${t('MATCHES')}`}</span>
                </div>
              </div>
              <Link
                to={`/jackpot/${jackpot.jackpot_id}`}
                className="mb-3 w-full px-2 shadow-sm"
              >
                <button className="w-full rounded-lg border border-jackpot-container-font py-2 text-base font-semibold text-jackpot-container-font">
                  {t('SeeDetail')}
                </button>
              </Link>
            </div>
          ))}
        {!loading && jackpotList.length === 0 && (
          <div className=" flex w-full">
            <div className="flex w-full flex-col justify-center ">
              <div className="flex w-full justify-center">
                <HiOutlineEmojiSad className="h-40 w-40 text-gray-400 " />
              </div>
              <div className="flex flex-col text-4xl text-gray-400 ">
                <span className="text-center">No jackpot right now.</span>
                <span className="text-center">Please try again later.</span>
              </div>
            </div>
          </div>
        )}
        {loading && <JackpotsLoader />}
      </div>
    </div>
  );
}

const JackpotsLoader = () => {
  return [...Array(3)].map((_, i) => (
    <div
      key={i}
      className="mx-4 flex cursor-pointer flex-col items-center overflow-hidden rounded-lg bg-jackpot-container shadow-md"
    >
      <div className="h-24 w-full animate-pulse bg-gray-300/40 md:h-56" />

      <div className="flex w-full flex-col gap-y-2 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex animate-pulse flex-col gap-y-1">
          <span className="h-5 w-44 animate-pulse rounded-md bg-jackpot-container-font/30 md:h-6 md:w-64 " />
          <span className="h-4 w-28 animate-pulse rounded-md bg-jackpot-container-font/30 md:h-5 md:w-40" />
        </div>
        <span className="h-7 w-36 animate-pulse rounded-md bg-jackpot-container-font/30 md:h-10 md:w-56 " />
        <div className="flex animate-pulse flex-col gap-y-1">
          <span className="h-4 w-32 animate-pulse rounded-md bg-jackpot-container-font/30 md:w-28" />
          <span className="h-4 w-20 animate-pulse rounded-md bg-jackpot-container-font/30 md:w-20" />
        </div>
      </div>
      <div className="mb-2 w-full px-2 shadow-sm">
        <button className="flex h-10 w-full items-center justify-center rounded-lg border border-jackpot-container-font py-2">
          <span className="h-4 w-24 animate-pulse rounded-md bg-jackpot-container-font/30" />
        </button>
      </div>
    </div>
  ));
};
