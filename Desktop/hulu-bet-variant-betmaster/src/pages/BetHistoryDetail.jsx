import { Pagination } from 'antd';
import React, { useRef } from 'react';
import local from '../services/localization';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useBet } from '@hooks/useBet';
import Utils from '@services/utils';
import FormatEntity from '@services/format_entity';
import BetHistoryDetailCard from '@components/BetHistoryDetailCard';
import { useTranslation } from 'react-i18next';
import { BsPatchCheckFill } from 'react-icons/bs';
import { FaCoins } from 'react-icons/fa';

import { useEvent } from '@hooks/useEvent';

export default function BetHistoryDetail() {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const coreData = useSelector((state) => state.coreData);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [betHistoryDetail, setBetHistoryDetail] = useState({});
  const [nextpageUrl, setNextpageUrl] = useState('');
  const [prevpageUrl, setPrevpageUrl] = useState('');
  const [apiDataLength, setApiDataLength] = useState(0);
  const bet_groups = useSelector((state) => state.coreData.bet_groups);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const [betSummery, setBetSummery] = useState({
    stakeNet: 0,
    vat: null,
    win: 0,
    tax: null,
    netWin: 0,
    bonus: 0,
    vat_label: null,
    tax_label: null,
  });

  const navigate = useNavigate();
  const { getBetHistoryDetail, getChashout } = useBet();
  const { id } = useParams();
  const betRef = useRef(null);
  const { t, i18n } = useTranslation();

  const { getSummaryFlatOddUtils } = useEvent();

  useEffect(() => {
    if (betRef.current !== null) {
      betRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [betRef.current]);
  useEffect(() => {
    // get bet history
    getHistoryDetails();
  }, []);

  const getHistoryDetails = async () => {
    const data = await getBetHistoryDetail(id);
    setBetHistoryDetail(data.betHistoryDetail);
    getSlipSummary(
      data.betHistoryDetail?.stake,
      data.betHistoryDetail?.game_picks,
      data.betHistoryDetail?.slip_computer_class
    );
  };

  const getSlipSummary = async (stake, slipsData, slip_computer_class) => {
    const slip_summery = await getSummaryFlatOddUtils(
      stake,
      slipsData,
      slip_computer_class
    );

    let summeryData = {
      stakeNet: Number(slip_summery.stakeNet),
      vat: Number(slip_summery.vat),
      win: Number(slip_summery?.win),
      tax: Number(slip_summery.tax),
      netWin: Number(slip_summery.netWin),
      bonus: Number(slip_summery.bonus),
      vat_label: slip_summery.vat_label,
      tax_label: slip_summery.tax_label,
    };
    setBetSummery({ ...summeryData });
  };

  const localizeBetTypes = (id, value, bet_type) => {
    if (i18n.resolvedLanguage == 'Am') {
      if (bet_type?.locales?.filter((l) => l.locale == 1)[0]) {
        return bet_type?.locales?.filter((l) => l.locale == 1)[0].translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const changePage = (page) => {
    setSelectedPage(page - 1);
  };

  const renderCashout = () => {
    return (
      <div className=" flex w-full flex-col  gap-y-2 rounded-md bg-active px-4 py-2 md:rounded-none  ">
        <h1 className="m-0 flex w-fit items-center gap-x-1 uppercase text-white ">
          <BsPatchCheckFill className="text-white" />
          <span>Eligible for chashout</span>
        </h1>
        <button
          className="flex w-80 items-center gap-x-1 rounded bg-success px-2 py-1 text-white "
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await getChashout(id);
              setLoading(false);
            } catch (err) {
              setLoading(false);
            }
          }}
        >
          {loading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="fill-primary mr-2 h-4 w-4 animate-spin text-gray-200 "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <FaCoins className="text-white" />
          <span>
            Confirm cashout for {betHistoryDetail?.cashout_info?.cashout_amount}{' '}
            {configurations.currency}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-y-1 overflow-auto pb-16">
      <div
        ref={betRef}
        className="flex h-9 items-center justify-between bg-container-header px-2 text-lg uppercase text-white"
      >
        <div
          className=" cursor-pointer hover:opacity-40 "
          onClick={() => {
            navigate('/history');
          }}
        >
          <span className="text-2xl font-semibold">‹</span>
        </div>
        <div className="text-center">
          {t('TicketID') +
            ': ' +
            (betHistoryDetail?.ticketID ? betHistoryDetail?.ticketID : '')}
        </div>
        <div></div>
      </div>
      <div className="hidden h-24 w-full bg-table-header p-4 text-table-header-font md:flex">
        <div className="flex flex-1 flex-col items-center justify-between border-r-[1px] border-white">
          <div>
            <span className="mr-2 text-lg">{t(configurations?.currency)}</span>
            <span className="text-xl font-semibold">
              {Utils.newCurrencyFormat(betHistoryDetail?.stake)}
              {/* {betHistoryDetail?.stake?.toFixed(2)} */}
            </span>
          </div>
          <span>Stake</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between border-r-[1px] border-white">
          <div>
            <span className="mr-2 text-lg">{t(configurations?.currency)}</span>
            <span className="text-xl font-semibold">
              {Utils.newCurrencyFormat(betSummery?.win)}
            </span>
          </div>
          <span>Max Win</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between border-r-[1px] border-white">
          <div>
            {/* <span className='mr-2 text-lg'>{t(configurations?.currency)}</span> */}
            <span className="text-xl font-semibold">
              {Utils.newCurrencyFormat(betHistoryDetail?.total_odds)}
            </span>
          </div>
          <span>Total Odds</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between ">
          <div>
            <span className="mr-2 text-lg">{t(configurations?.currency)}</span>
            <span className=" text-xl font-semibold">
              {Utils.newCurrencyFormat(betSummery.netWin)}
            </span>
          </div>
          <span>Net Pay</span>
        </div>
      </div>

      {betHistoryDetail?.cashout_info?.is_cashout_available && (
        <div className="px-2 md:block md:px-0">{renderCashout()} </div>
      )}

      {betHistoryDetail && betHistoryDetail.game_picks?.length > 0 && (
        <div className="px-2 pt-2 md:hidden">
          <div className="flex h-full w-full shrink-0 snap-center flex-col gap-y-1 rounded-lg border-[1px] border-secondary-700 bg-secondary-700 p-2 text-white  md:hidden">
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Stake')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(betHistoryDetail?.stake)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('MaxWin')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {Utils.newCurrencyFormat(betSummery.win)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('TotalOdd')}</span>
              <span className="text-sm font-semibold">
                {Utils.newCurrencyFormat(betHistoryDetail?.total_odds)}
              </span>
            </div>
            <div className="h-[1px] rounded bg-secondary-300" />
            <div className="flex w-full items-center justify-between ">
              <span className="text-lg">{t('NetPay')}</span>
              <div className="flex items-center gap-x-1">
                <span className=" text-lg font-semibold">
                  {Utils.newCurrencyFormat(betSummery.netWin)}
                </span>
                <span>{t(configurations?.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="hidden w-full flex-col gap-y-[2px] md:flex ">
        <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header px-3 text-table-header-font ">
          <div className="flex w-24 flex-col items-center gap-y-1">
            <div className="w-full text-center   ">{t('Date')}</div>
          </div>
          <div className="flex w-40 flex-row items-center gap-1 text-left ">
            <span className="text-center ">{t('MATCHES')}</span>
          </div>
          <div className="flex w-24 flex-row items-center gap-1 text-left ">
            <span className="text-left ">{t('Market')}</span>
          </div>
          <div className="flex w-24 flex-row items-center gap-1 text-left ">
            <span className="text-left ">{t('YourPick')}</span>
          </div>
          <div className="flex w-20 flex-row items-center gap-1 text-left ">
            <span className="text-left ">{t('Odd')}</span>
          </div>
          <div className="flex w-24 flex-row items-center gap-1 text-left ">
            <span className="text-left ">{t('Status')}</span>
          </div>
          {/* <div className=" flex items-center gap-x-2">
            <span className="text-2xl font-bold"></span>
          </div> */}
        </div>
      </div>
      <div className=" flex w-full flex-col gap-y-[2px] bg-table-container p-2 md:p-0">
        {betHistoryDetail &&
          betHistoryDetail.game_picks?.length > 0 &&
          betHistoryDetail.game_picks.map((list, i) => {
            const betType = Utils.replaceName(
              localizeBetTypes(
                list.bet_type.id,
                list.bet_type ? list.bet_type.name : '',
                list.bet_type
              ),
              list.item ? list.item.param : '',
              list.match.hom,
              list.match.awy,
              list.match.hometeam_locale,
              list.match.awayteam_locale
            );
            const formatedBetType = FormatEntity.formatPickName(
              betType,
              null,
              list.item.specifier
            );
            const formatedGroupType = FormatEntity.formatMarketName(
              list.bet_group.name,
              Object.values(list.item?.specifier).length > 0
                ? list.match
                : null,
              list.item.specifier
            );
            const betgroup = Utils.replaceName(
              formatedGroupType,
              list.item ? list.item?.param : '',
              list.match.hom,
              list.match.awy
            );
            // const countryURL = league_groups[leagues[t.match?.league]?.league_group]?.logo;

            return (
              <>
                <BetHistoryDetailCard
                  key={list.id}
                  home={list.match.hom}
                  away={list.match.awy}
                  status={list.status}
                  market={betgroup}
                  pick={formatedBetType}
                  odd={list.odd}
                  sportTypeURL={list.match.league.sport_type.logo}
                  countryURL={list.match.league.league_group.logo}
                  win={list.possible_win}
                  createdAt={list.match.schedule}
                />
              </>
            );
          })}
      </div>
    </div>
  );
}
