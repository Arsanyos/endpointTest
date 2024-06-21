import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedPicks } from '@ReduxStore/jackpotSlice';

import moment from 'moment';
import ReactHtmlParser from 'html-react-parser';

import { Checkbox, message, Modal as AntdModal } from 'antd';

import { FaArchive } from 'react-icons/fa';
import { GiThorHammer } from 'react-icons/gi';
import { AiOutlineDelete } from 'react-icons/ai';
import { HiOutlineEmojiSad } from 'react-icons/hi';

import Modal from '@components/Modal';
import BetDataView from '@pages/BetDataView';
import CountDown from '@components/CountDown';
import MobileDeposit from '@components/MobileDeposit';
import JackpotDetailLoader from '@components/LoaderPages/Jackpot/JackpotDetailLoader';

import API from '@services/API';
import Utils from '@services/utils';

import logo from '@assets/logo.png';

// ============================================== Jackpot Detail ==============================================
export default function JackpotDetail() {
  const jackpotRef = useRef(null);

  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [agreeToJackpoyTerms, setAgreeToJackpoyTerms] = useState(true);

  const [schedule, setSchedule] = useState(null);
  const [showDesc, setShowDesc] = useState(false);

  const [SJDetail, setSJDetail] = useState(null);
  const [mainEvents, setMainEvents] = useState([]);
  const [reserveEvents, setReserveEvents] = useState([]);

  const [betData, setBetData] = useState({});
  const [betDataVisible, setBetDataVisible] = useState(false);

  const [isSubmmiting, setIsSubmmiting] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  const [openOnlinePlaceBet, setOpenOnlinePlaceBet] = useState(false);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const jackpots = useSelector((state) => state.Jackpot.jackpots);
  const selectedPicks = useSelector((state) => state.Jackpot.selectedPicks);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const noJackpotDetailFound = () => {
    setSJDetail(null);
    setLoading(false);
  };

  useEffect(() => {
    if (jackpotRef.current !== null) {
      jackpotRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [jackpotRef.current]);

  useEffect(() => {
    setLoading(true);
    if (params.jackpot_id && jackpots.length > 0) {
      const newSJDetail = jackpots.find(
        (jackpot) => jackpot.jackpot_id == params?.jackpot_id
      );
      findJackpotDetail(newSJDetail);
    } else if (params.jackpot_id && jackpots.length === 0) {
      fetchJackpotDetail(params.jackpot_id);
    } else {
      noJackpotDetailFound();
    }
  }, []);

  const fetchJackpotDetail = (jackpotID) => {
    API.findWithNoToken(`super-jackpot/active/${jackpotID}/`, null, null)
      .then((response) => {
        if (response.data) {
          findJackpotDetail(response.data);
        } else {
          noJackpotDetailFound();
        }
      })
      .catch((err) => {
        noJackpotDetailFound();
        if (!err.response) {
          return message.error('Error While Loading Data');
        }
        return message.error(
          err.response.data[Object.keys(err.response.data)[0]][0]
        );
      });
  };

  const findJackpotDetail = (newSJDetail) => {
    const sortedJackpotList = newSJDetail.events
      .slice()
      .sort((a, b) =>
        moment.utc(a.event.schedule).diff(moment.utc(b.event.schedule))
      );

    const endTimeDiff = moment
      .utc(sortedJackpotList[0].event.schedule)
      .diff(moment.utc(newSJDetail.end_time));

    setSchedule(
      endTimeDiff > 0
        ? newSJDetail.end_time
        : sortedJackpotList[0].event.schedule
    );

    const startTimeDiff = moment
      .duration(
        moment(sortedJackpotList[0].event.schedule).diff(
          moment(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
        )
      )
      .asMilliseconds();

    const hasGameStarted = 0 > startTimeDiff;
    if (hasGameStarted) {
      noJackpotDetailFound();
    } else {
      if (newSJDetail.events.length > 0) {
        const mainEvList = newSJDetail.events.filter(
          (event) => event.is_reserve == false
        );
        const reserveEvList = newSJDetail.events.filter(
          (event) => event.is_reserve == true
        );

        setMainEvents(mainEvList);
        setReserveEvents(reserveEvList);
      }
      setSJDetail(newSJDetail);
      setLoading(false);
    }
  };

  const addQuickpick = () => {
    let picks = [];
    let list = [1, 2, 3];
    SJDetail?.events.forEach((j) => {
      if (j.is_reserve == false) {
        let pickIndex = list[Math.floor(Math.random() * list.length)];
        picks.push({
          event_id: j.id,
          pick: pickIndex.toString(),
        });
      }
    });
    SJDetail?.events.forEach((j) => {
      if (j.is_reserve == true) {
        let pickIndex = list[Math.floor(Math.random() * list.length)];
        picks.push({
          event_id: j.id,
          pick: pickIndex.toString(),
        });
      }
    });
    dispatch(updateSelectedPicks({ selectedPicks: picks }));
  };

  const placeOnlineJackpotBet = () => {
    setIsSubmmiting(true);

    API.create(
      `super-jackpot/place-bet/`,
      {
        selected_picks: selectedPicks,
        jackpot_id: SJDetail?.id,
      },
      null
    )
      .then((response) => {
        if (response.data) {
          setIsSubmmiting(false);
          setBetDataVisible(true);
          setBetData(response.data);
          setOpenOnlinePlaceBet(false);
          dispatch(updateSelectedPicks({ selectedPicks: [] }));
        }
        return message.success(t('Jackpot') + ' ' + t('BetPlacedSuccessfully'));
      })
      .catch((err) => {
        setIsSubmmiting(false);
        setOpenOnlinePlaceBet(false);

        const isInsufficientBalance =
          err.response.data['non_field_errors'].length > 0
            ? err.response.data['non_field_errors'].includes(
                'Insufficient Balance'
              )
            : false;

        if (!err.response) {
          return message.error('Error While Loading Data');
        }
        if (isInsufficientBalance) {
          setDepositVisible(true);
        } else {
          return message.error(
            err.response.data[Object.keys(err.response.data)[0]][0]
          );
        }
      });
  };

  const placeRetailJackpotBet = () => {
    setIsSubmmiting(true);
    if (
      selectedPicks.length == 0 ||
      selectedPicks.length != SJDetail?.events.length
    ) {
      setIsSubmmiting(false);
      message.warning('Please Select All first');
    } else {
      API.createNoToken(
        `super-jackpot/place-bet/`,
        {
          selected_picks: selectedPicks,
          jackpot_id: SJDetail?.id,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            const resBetData = {
              ...response.data,
              couponID: response.data.coupon_id,
            };
            setIsSubmmiting(false);
            setBetData(resBetData);
            setBetDataVisible(true);
            dispatch(updateSelectedPicks({ selectedPicks: [] }));
          }
          return message.success(
            t('Jackpot') + ' ' + t('BetPlacedSuccessfully')
          );
        })
        .catch((err) => {
          setIsSubmmiting(false);
          if (!err.response) {
            return message.error('Error While Loading Data');
          }
          return message.error(
            err.response.data[Object.keys(err.response.data)[0]][0]
          );
        });
    }
  };

  const handleSubmit = () => {
    if (isLoggedIn) {
      if (
        selectedPicks.length == 0 ||
        selectedPicks.length != SJDetail?.events.length
      ) {
        message.warning('Please Select All first');
      } else {
        setOpenOnlinePlaceBet(true);
      }
    } else {
      placeRetailJackpotBet();
    }
  };

  const maxPrize =
    SJDetail?.prizes?.length > 0
      ? Math.max(...SJDetail?.prizes.map((item) => item.amount))
      : 0;

  return (
    <div className="relative flex h-full flex-col gap-y-1 text-jackpot-detail-font ">
      {!loading && SJDetail?.banner && (
        <div className="my-1 flex w-full items-center">
          <img
            src={SJDetail?.banner}
            className="h-24 w-full md:h-40"
            alt="Banner"
          />
        </div>
      )}
      {!loading && SJDetail && (
        <div
          ref={jackpotRef}
          className="flex h-9 items-center justify-between bg-container-header px-2"
        >
          <div
            className="-mt-4 flex cursor-pointer items-center hover:opacity-40"
            onClick={() => {
              navigate('/jackpots');
            }}
          >
            <span className="text-4xl font-semibold">‹</span>
          </div>
          <span className="uppercase">{t('Jackpot')}</span>
          <FaArchive
            className=" h-5 w-5 cursor-pointer justify-end fill-jackpot-detail-font hover:fill-jackpot-detail-font"
            onClick={() => navigate('/jackpot/archives')}
          />
        </div>
      )}
      {!loading && SJDetail && (
        <div className="flex h-full flex-col gap-y-1">
          <div className="flex bg-jackpot-detail-container ">
            <div className="flex w-full py-4 ">
              <div className="flex w-full flex-col gap-y-4 px-2 pb-2 md:px-8">
                <div className="flex justify-center gap-x-4 ">
                  <div className="flex flex-col items-center gap-y-2 ">
                    <div className="flex flex-row items-end justify-center gap-x-1 ">
                      <span style={{ fontSize: 12, marginRight: 2 }}>
                        {t(configurations?.currency)}
                      </span>
                      <span className="text-4xl font-semibold">
                        {SJDetail?.stake}
                      </span>
                    </div>
                    <span className="jackpot-font">{t('Stake')}</span>
                  </div>
                  <div className="jackpot-price">
                    <span className="text-6xl font-extrabold text-jackpot-detail-timer-btn">
                      →
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-y-2 ">
                    <div className="flex flex-row items-end justify-center gap-x-1 text-active ">
                      <span
                        style={{
                          fontSize: 12,
                          color: 'white',
                          marginRight: 2,
                        }}
                      >
                        {t(configurations?.currency)}
                      </span>
                      <span className="text-4xl font-semibold">
                        {maxPrize > 0
                          ? maxPrize
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : 0}
                      </span>
                    </div>
                    <span className="">{t('MaxWin')}</span>
                  </div>
                </div>

                <hr className="w-full rounded border-[1px]  border-gray-400 " />

                <div className="flex items-end justify-center md:justify-between">
                  <div
                    className="hidden h-9 cursor-pointer flex-row items-center justify-center gap-x-2 rounded bg-jackpot-detail-btn px-2 align-middle hover:opacity-70 md:flex"
                    onClick={() => addQuickpick()}
                  >
                    <GiThorHammer className="gap-x-2 text-2xl " />
                    <span className="font-semibold uppercase ">
                      {t('QUICKPICK')}
                    </span>
                  </div>
                  <div className="flex w-72 flex-col items-center gap-y-4">
                    <CountDown schedule={schedule} />
                    <button
                      onClick={() => {
                        setShowDesc((prev) => !prev);
                      }}
                      className="max-w-fit rounded-md bg-active px-4 text-active-font hover:opacity-70"
                    >
                      {showDesc ? t('CloseDescription') : t('ShowDescription')}
                    </button>
                  </div>
                  <div
                    className="hidden h-9 cursor-pointer flex-row items-center justify-center gap-x-2 rounded bg-jackpot-detail-timer-btn px-2 hover:bg-red-600 md:flex"
                    onClick={() =>
                      dispatch(updateSelectedPicks({ selectedPicks: [] }))
                    }
                  >
                    <AiOutlineDelete className="gap-x-2 text-2xl " />
                    <span className="font-semibold uppercase ">
                      {t('CLEAR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:hidden">
                  <div
                    className=" flex h-9 cursor-pointer flex-row items-center justify-center gap-x-2 rounded bg-jackpot-detail-btn px-2 align-middle hover:opacity-70"
                    onClick={() => addQuickpick()}
                  >
                    <GiThorHammer className="gap-x-2 text-2xl " />
                    <span className="font-semibold uppercase ">
                      {t('QUICKPICK')}
                    </span>
                  </div>

                  <div
                    className=" flex h-9 cursor-pointer flex-row items-center justify-center gap-x-2 rounded bg-jackpot-detail-timer-btn px-2 hover:bg-red-600"
                    onClick={() =>
                      dispatch(updateSelectedPicks({ selectedPicks: [] }))
                    }
                  >
                    <AiOutlineDelete className="gap-x-2 text-2xl " />
                    <span className="font-semibold uppercase ">
                      {t('CLEAR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex min-h-[70%] flex-col ">
            <div className="mb-0.5 flex flex-row items-center gap-2 bg-jackpot-detail-container px-4 py-2 pt-4">
              <div className="h-4 w-20 rounded-md" />
              <div
                className={`flex h-4 w-2/5 cursor-pointer items-center justify-center rounded-md px-4 pr-0 md:pr-4`}
              >
                <span className="whitespace-nowrap"> {t('HOMETEAM')}</span>
              </div>
              <div
                className={`flex h-4 w-16 cursor-pointer items-center justify-center rounded-md`}
              >
                <span className="whitespace-nowrap"> {t('DRAW')}</span>
              </div>
              <div
                className={`flex h-4 w-2/5 cursor-pointer items-center justify-center rounded-md px-2 md:px-4 `}
              >
                <span className="whitespace-nowrap"> {t('VISITINGTEAM')}</span>
              </div>
            </div>
            <div className="flex h-full w-full flex-col gap-1">
              {mainEvents?.length > 0 ? (
                mainEvents.map((j, i) => {
                  return (
                    <EventOdds
                      sj_id={j.id}
                      event={j.event}
                      key={j.event?.id || i}
                      sj_evs_length={SJDetail?.events?.length || 0}
                    />
                  );
                })
              ) : (
                <div className="flex w-full flex-col  justify-center py-12 ">
                  <div className="flex w-full justify-center">
                    <HiOutlineEmojiSad className="h-20 w-20 text-gray-400 " />
                  </div>
                  <div className="flex flex-col text-gray-400">
                    <span className="text-center text-2xl">
                      No match in this Jackpot.
                    </span>
                    <span className="text-center text-2xl">
                      Please try another.
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="my-1 flex h-9 w-full items-center justify-center gap-x-2 bg-jackpot-detail-reserve-header ">
              <span className="uppercase ">{t('ReservedGames')}</span>
            </div>
            <div className="flex w-full flex-col gap-1">
              {reserveEvents.length > 0 ? (
                reserveEvents.map((j, i) => {
                  return (
                    <EventOdds
                      sj_id={j.id}
                      event={j.event}
                      key={j.event?.id || i}
                      sj_evs_length={SJDetail?.events?.length || 0}
                    />
                  );
                })
              ) : (
                <div className="flex h-20 w-full flex-col items-center justify-center ">
                  <span className="text-center">No reserved match.</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col justify-center">
            {SJDetail?.events?.length > 0 && (
              <div className="my-4 flex w-full flex-row justify-center">
                <div className="flex w-4/5 flex-row justify-center md:w-3/5">
                  <div className="flex w-full flex-col justify-center gap-2 ">
                    <Checkbox
                      checked={agreeToJackpoyTerms}
                      className="flex justify-start"
                      onChange={() => setAgreeToJackpoyTerms((prev) => !prev)}
                    >
                      <span style={{ color: 'white' }}>
                        By placing a bet you have agreed to our terms and
                        conditions
                      </span>
                    </Checkbox>
                    <button
                      className=" flex h-12 w-full cursor-pointer items-center justify-center gap-x-2  rounded-md bg-jackpot-detail-place-bet-btn p-2 font-semibold uppercase text-jackpot-detail-place-bet-btn-font  shadow-lg  hover:opacity-70"
                      disabled={!agreeToJackpoyTerms || isSubmmiting}
                      onClick={handleSubmit}
                    >
                      {isSubmmiting && !isLoggedIn && (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="mr-2 h-4 w-4 animate-spin fill-active "
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
                      <span>
                        {t('PLACEBET') +
                          ' ' +
                          SJDetail?.stake +
                          ' ' +
                          t(configurations?.currency)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex w-full flex-row justify-center">
              <div className=" mb-2 flex w-full flex-col-reverse items-center justify-center gap-y-2 md:w-3/5 md:flex-row md:gap-x-8">
                <button
                  className="h-12 w-1/2 cursor-pointer rounded-md bg-jackpot-detail-btn p-2 font-semibold  uppercase shadow-lg  hover:opacity-70"
                  onClick={() => navigate('/jackpot/archives')}
                >
                  {t('Jackpot')} {t('Archives')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && !SJDetail && (
        <div className="flex w-full flex-col justify-center gap-y-2 pt-12 ">
          <div className="flex w-full justify-center">
            <HiOutlineEmojiSad className="h-32 w-32 text-gray-400 " />
          </div>
          <div className="flex flex-col gap-y-2 text-gray-400 ">
            <span className="text-center text-4xl">
              Jackpot detail is unavailable right now.
            </span>
            <span className="text-center text-2xl">
              Please try again later.
            </span>
          </div>
        </div>
      )}
      {loading && <JackpotDetailLoader />}

      {/* <AntdModal
        okText={t('Accept')}
        cancelText={t('Decline')}
        visible={openOnlinePlaceBet}
        onOk={placeOnlineJackpotBet}
        confirmLoading={isSubmmiting}
        onCancel={() => {
          setOpenOnlinePlaceBet(false);
        }}
        // title={`${t('ConfirmPlaceBet')}?`}
        title={<button className="bg-black">abc</button>}
      >
        <div className="flex flex-col gap-y-2">
          <span>{t('PaymentWillMade')}</span>
          <span className="text-base font-semibold">
            {`${t('Stake')} : ${SJDetail?.stake} ${t(
              configurations?.currency
            )}`}
          </span>
        </div>
      </AntdModal> */}

      <Modal
        visible={openOnlinePlaceBet}
        onCancel={() => setOpenOnlinePlaceBet(false)}
      >
        <ConfirmPlaceBet
          stake={SJDetail?.stake || 0}
          onSubmit={placeOnlineJackpotBet}
          isSubmmiting={isSubmmiting}
          onCancel={() => {
            setOpenOnlinePlaceBet(false);
          }}
        />
      </Modal>

      <Modal
        center={true}
        visible={showDesc}
        onCancel={() => setShowDesc(false)}
        onOk={() => setShowDesc(false)}
      >
        <JackpotDescription
          SJDesc={SJDetail?.description || <p></p>}
          SJPrizes={SJDetail?.prizes || []}
        />
      </Modal>
      <Modal
        visible={betDataVisible}
        onCancel={() => setBetDataVisible(false)}
        onOk={() => setBetDataVisible(false)}
      >
        <BetDataView
          betData={betData}
          done={() => setBetDataVisible(false)}
          jackpotTitle={SJDetail?.title || ''}
          maxJackpotPrize={maxPrize}
        />
      </Modal>
      <Modal
        center={true}
        visible={depositVisible}
        onCancel={() => setDepositVisible(false)}
        onOk={() => setDepositVisible(false)}
        myClass="text-dark group-hover:text-dark"
      >
        <div className="flex h-full w-full items-center bg-warning p-2 pt-6 md:max-w-[385px]">
          <span className="text-base font-semibold text-dark">
            {t('InsufficientBalance2Bet')}
          </span>
        </div>

        <MobileDeposit />
      </Modal>
    </div>
  );
}

const ConfirmPlaceBet = ({ stake, isSubmmiting, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  return (
    <div className="flex flex-col gap-y-2 text-font-dark md:max-w-[400px] ">
      <div className="flex h-20 w-full items-center justify-center bg-header-container px-4">
        <img src={logo} className="h-12" />
      </div>
      <div className=" relative flex w-full flex-col items-center justify-center px-4 md:px-8">
        <div className="flex w-full flex-col items-center justify-center gap-2 py-2">
          <h2 className="m-0 p-0 text-xl font-semibold capitalize text-primary">
            {`${t('ConfirmPlaceBet')}?`}
          </h2>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-y-2 px-4 md:px-8">
        <span>{t('PaymentWillMade')}</span>
        <span className="text-base font-semibold">
          {`${t('Stake')} : ${stake} ${t(configurations?.currency)}`}
        </span>
      </div>
      <hr />
      <div className="flex items-center justify-end gap-x-2 px-4 pb-4 md:px-8">
        <button
          onClick={onCancel}
          className="rounded-md bg-font-light px-4 py-1 text-sm text-font-dark"
        >
          {t('Decline')}
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center justify-center gap-x-2 rounded-md bg-active px-4 py-1 text-sm text-active-font"
        >
          {isSubmmiting && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-4 w-4 animate-spin fill-active "
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
          <span>{t('Accept')}</span>
        </button>
      </div>
    </div>
  );
};

const EventOdds = ({ sj_evs_length, sj_id, event }) => {
  return (
    <div className="flex w-full flex-col bg-jackpot-detail-container">
      <span className="whitespace-nowrap px-4 py-2 font-semibold md:hidden">{`${event?.local_team} Vs ${event?.visitor_team}`}</span>
      <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
        <div className=" flex h-10 w-20 items-center rounded-md bg-jackpot-detail-event-odd-item px-2 text-center text-xs  ">
          {Utils.displayTime(event?.schedule)}
        </div>
        <EventOddItem
          sj_id={sj_id}
          odd_type={'1'}
          teamName={event?.local_team}
          odd={event?.win_odds[2]?.odd}
          sj_evs_length={sj_evs_length}
        />
        <EventOddItem
          sj_id={sj_id}
          odd_type={'2'}
          odd={event?.win_odds[1]?.odd}
          sj_evs_length={sj_evs_length}
        />
        <EventOddItem
          sj_id={sj_id}
          odd_type={'3'}
          teamName={event?.visitor_team}
          odd={event?.win_odds[0]?.odd}
          sj_evs_length={sj_evs_length}
        />
      </div>
    </div>
  );
};

const EventOddItem = ({ sj_evs_length, sj_id, odd_type, teamName, odd }) => {
  const dispatch = useDispatch();
  const selectedPicks = useSelector((state) => state.Jackpot.selectedPicks);

  const addJackpotToSlip = (pickId, pick) => {
    let picks = [...selectedPicks];

    let changedPicked = picks.map((j) => {
      const current = { ...j };
      if (j.event_id == pickId) {
        current.pick = pick;
        return current;
      }
      return current;
    });

    if (selectedPicks.length == 0 || selectedPicks.length < sj_evs_length) {
      const exists = selectedPicks.filter((item) => item.event_id == pickId);
      if (exists.length == 0) {
        picks.push({
          event_id: pickId,
          pick: pick,
        });
        changedPicked = picks;
      }
    }
    dispatch(updateSelectedPicks({ selectedPicks: changedPicked }));
  };

  const isJackpotPick = (id, pick) => {
    return (
      selectedPicks &&
      selectedPicks.filter((f) => f.event_id == id && f.pick === pick).length !=
        0
    );
  };

  return (
    <div
      className={`${
        isJackpotPick(sj_id, odd_type)
          ? 'bg-active text-active-font'
          : 'bg-jackpot-detail-event-odd-item'
      } ${
        teamName
          ? 'w-2/5 justify-center px-4 md:justify-between'
          : 'w-16 justify-center'
      } flex h-10 cursor-pointer items-center rounded-md hover:bg-active hover:text-active-font`}
      onClick={() => addJackpotToSlip(sj_id, odd_type)}
    >
      {teamName && (
        <span className="3/4 hidden truncate md:block">{teamName}</span>
      )}
      <span>{odd ? odd : ''}</span>
    </div>
  );
};

const JackpotDescription = ({ SJDesc, SJPrizes }) => {
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  return (
    <div className="flex w-full flex-col gap-y-2 bg-jackpot-detail-container md:w-[700px] lg:w-[850px] ">
      <div className="scrollbar-hide max-h-[600px] overflow-auto py-4 px-2 md:px-4">
        <div className="flex  w-full flex-col gap-y-2 ">
          <span className="text-base font-semibold">
            {t('JackpotDescription')}
          </span>
          <span>{ReactHtmlParser(SJDesc)}</span>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <span className="text-base font-semibold">{t('JackpotPrizes')}</span>
          {SJPrizes?.length > 0 ? (
            <div className="mx-auto flex flex-col gap-y-2 ">
              <div className="flex w-full items-center justify-evenly gap-x-4">
                <div className="flex w-full justify-start">
                  <span className="font-semibold">{t('RuleTitle')}</span>
                </div>
                <div className="flex w-full justify-end">
                  <span className="font-semibold">{t('NoMatchLost')}</span>
                </div>
                <div className="flex w-full justify-end">
                  <span>
                    {`${t('Prize')} (${t(configurations?.currency)})`}
                  </span>
                </div>
              </div>
              {SJPrizes.map((prize, i) => {
                return (
                  <div
                    key={i}
                    className="flex w-full items-center justify-evenly gap-x-4"
                  >
                    <div className="flex w-full justify-start whitespace-nowrap">
                      <span>{prize.title}</span>
                    </div>
                    <div className="flex w-full justify-end pr-6 md:pr-2">
                      <span>{prize.rule}</span>
                    </div>
                    <div className="flex w-full justify-end">
                      <span className="whitespace-nowrap">
                        {Utils.newCurrencyFormat(prize.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full flex-row items-center gap-x-2">
              <span className="font-semibold">{t('NoPrizes')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
