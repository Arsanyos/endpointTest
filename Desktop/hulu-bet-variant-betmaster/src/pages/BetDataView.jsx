import React, { useEffect, useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import Table from '@components/Table';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import ClientSession from '@services/client-session';
import { useTranslation } from 'react-i18next';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Utils from '@services/utils';

export default function BetDataView({ betData, done,jackpotTitle,  maxJackpotPrize, }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const bet_types = useSelector((state) => state.coreData.bet_types);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const getTicketStage = (stage) => {
    if (stage === 1) {
      return t('CouponGenerated');
    } else if (stage === 2) {
      return t('Confirmed');
    } else if (stage === 3) {
      return t('Printed');
    } else if (stage === 4) {
      return t('Paid');
    }
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-4 overflow-y-auto bg-font-dark p-4 text-font-light md:max-w-[400px] md:p-8 ">
      <div className="flex w-full items-center justify-center">
        <span className="appearance-none text-lg font-semibold md:text-2xl">
          Congrats! Your bet is booked.
        </span>
      </div>
      <div className="flex w-full flex-col-reverse justify-evenly gap-4  md:w-full ">
        {/* Mobile */}

        <div className="flex h-full w-full flex-col gap-y-1 rounded-lg border-[1px] border-secondary-400 bg-neutral-100	 p-2 text-black ">
          {jackpotTitle && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Jackpot')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">{jackpotTitle}</span>
              </div>
            </div>
          )}

          {betData?.stake && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Stake')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(betData?.stake)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
          {jackpotTitle && (maxJackpotPrize || maxJackpotPrize === 0) && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('MaxJackpotPrize')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(maxJackpotPrize)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
          {(betData?.lost_count || betData?.lost_count === 0) && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('MatchLost')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {betData?.lost_count}
                </span>
              </div>
            </div>
          )}
          {betData?.stage && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('TicketStage')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {getTicketStage(betData?.stage)}
                </span>
              </div>
            </div>
          )}
          {betData?.max_win && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('MaxWin')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(betData?.max_win)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
          {betData?.bonus_value > 0 && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Bonus')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(betData.bonus_value)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
          {betData?.total_odds && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('TotalOdd')}</span>
              <span className="text-sm font-semibold">
                {Utils.newCurrencyFormat(betData?.total_odds)}
              </span>
            </div>
          )}

          {(betData?.net_pay || betData?.won_amount) && (
            <div className="h-[1px] rounded bg-active" />
          )}
          {betData?.net_pay && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-lg">{t('NetPay')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-lg font-semibold">
                  {Utils.newCurrencyFormat(betData?.net_pay)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
          {betData?.won_amount && (
            <div className="flex w-full items-center justify-between ">
              <span className="text-lg">{t('WonAmount')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-lg font-semibold">
                  {Utils.newCurrencyFormat(betData?.won_amount)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          )}
        </div>

        {/* {!ClientSession.isAuth() && ( */}
        <div className="flex h-full w-full justify-start rounded-lg border-[1px] border-secondary-400 bg-white text-black md:justify-evenly ">
          <div className="flex w-full flex-col items-center justify-center gap-1 p-3">
            {!ClientSession.isAuth() && (
              <div className="flex items-center gap-2">
                <h1 className="m-0 text-2xl font-semibold">
                  {betData.couponID}
                </h1>
                <FaCopy
                  role="button"
                  className="cursor-pointer text-lg text-active"
                  onClick={() => {
                    navigator.clipboard.writeText(betData.couponID);
                    message.success('Copied!', 2);
                  }}
                />
              </div>
            )}

            {!ClientSession.isAuth() && (
              <span className="text-xs">
                Please find a nearby {configurations.name} shop and deposit
                using the above ticket number. Thank you.
              </span>
            )}
            <span className="text-center text-xs text-red-600">
              ***All bets after kickoff are INVALID.***
            </span>
            <span className="text-center text-xs text-danger">
              ***All Terms and Conditions fully apply.***
            </span>
          </div>
        </div>
        {/* )} */}
      </div>
      {betData?.game_picks?.length && (
        <Table
          data={betData?.game_picks}
          bet_types={bet_types}
          lang={i18n.resolvedLanguage}
        />
      )}
      {/* <span>{betData?.game_picks?.length}</span> */}
      {!ClientSession.isAuth() && (
        <>
          <div className="flex w-full items-center justify-center">
            <span className="appearance-none text-2xl font-semibold">
              BET ONLINE
            </span>
          </div>
          <div className="flex w-full items-center justify-center">
            <span className="appearance-none text-xs">
              Create an account at {configurations.name} to bet online and
              unlock more bonuses and cashbacks.
            </span>
          </div>
        </>
      )}
      {!ClientSession.isAuth() && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              done();
              navigate({
                pathname: `${location.pathname}`,
                search: 'login',
              });
            }}
            className="hover:opacity-85 h-10 w-24 rounded bg-active  py-2 text-center align-middle font-semibold uppercase text-active-font "
          >
            Login
          </button>
          <button
            onClick={() => {
              done();
              navigate({
                pathname: `${location.pathname}`,
                search: 'register',
              });
            }}
            className="hover:opacity-85 h-10 w-24 rounded bg-primary-700 py-2 text-center align-middle font-semibold uppercase text-white"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}
