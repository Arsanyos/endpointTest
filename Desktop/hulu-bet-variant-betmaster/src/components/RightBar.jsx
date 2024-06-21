import React, { Fragment, useRef, useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { BsInboxFill, BsTrashFill } from 'react-icons/bs';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Checkbox, message } from 'antd';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { useEvent } from '../hooks/useEvent';
import API from '../services/API';
import ClientSession from '../services/client-session';
import FormatEntity from '../services/format_entity';
import Utils from '../services/utils';
import {
  updateSelectedSlip,
  updateSlips,
  updateStake,
  updatePhone,
} from '../store/slipSlice';

import BetDataView from '@pages/BetDataView';
import { useTranslation } from 'react-i18next';
import {
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
} from 'react-icons/fa';
import BetCard from './BetCard';
import Modal from './Modal';
import * as Switch from '@radix-ui/react-switch';

import { MdOutlineArrowBackIosNew, MdOutlineClose } from 'react-icons/md';
import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import classNames from 'classnames';

export default function RightBar({ onClose = null }) {
  const [expand, setExpand] = useState(true);
  const [clearSlip, setClearSlip] = useState(
    ClientSession.getClearPlace() ?? true
  );

  const [loadingPlaceBet, setLoadingPlaceBet] = useState(false);
  const [cid, setCid] = useState('');
  const [checkCouponId, setcheckCouponId] = useState('');
  const [acceptChange, setAcceptChange] = useState(true);
  const [betDataVisible, setBetDataVisible] = useState(false);
  const [isCheckCouponVisible, setIsCheckCouponVisible] = useState(false);
  const [isBetForMeVisible, setIsBetForMeVisible] = useState(false);
  const [couponData, setCheckCouponData] = useState({});
  const [betData, setBetData] = useState({});

  const [betForMeData, setBetForMeData] = useState({});
  const [betForMeSlips, setBetForMeSlips] = useState({});
  const [couponLoader, setCouponLoader] = useState(false);
  const [retrieveLoader, setRetrieveLoader] = useState(false);
  const [bonusPercent, setBonusPercent] = useState(null);
  const [bonusMsg, setbonusMsg] = useState(null);

  const PROMOTION_BANNER = 2;

  const [summery, setSummery] = useState({
    stakeNet: 0,
    vat: 0,
    win: 0,
    tax: 0,
    netWin: 0,
    bonus: 0,
  });
  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const league_groups = useSelector((state) => state.coreData?.league_groups);
  const leagues = useSelector((state) => state.coreData.leagues);

  const stake = useSelector((state) => state.slip.stake);
  const phone = useSelector((state) => state.slip.phone);
  const config = useSelector((state) => state.slip);
  const userDetail = useSelector((state) => state.user.userDetail);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const telegramData = useSelector((state) => state.user.telegramData);

  const ON_LINE_MIN = configurations?.online_minimum_stake;
  const MIN = configurations?.offline_minimum_stake;
  const MAX = configurations?.maximum_stake;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    getSportTypeLogo,
    getLogoBySportType,
    getSlips,
    getSummary,
    prepareSlip,
  } = useEvent();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const [animationParent] = useAutoAnimate(); /* optional config */
  const slipsRef = useRef(null);

  const { t, i18n } = useTranslation();

  const MediaSize = 768;
  let { slipID } = useParams();

  useEffect(() => {
    ClientSession.storeClearPlace(clearSlip);
  }, [clearSlip]);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  useEffect(() => {
    try {
      ClientSession.getSlips(function (err, data) {
        ClientSession.getSlipsLastUpdate((err, lastUpdate) => {
          let minutes = moment(new Date()).diff(lastUpdate, 'minutes');
          if (data == null || minutes > 10) return;
          // setSlips(data);
          dispatch(updateSlips({ slips: data }));
        });
      });
    } catch (err) {
      // console.log(err);
    }
  }, []);

  useEffect(() => {
    if (slipID) {
      getSlipData();
    } else setIsBetForMeVisible(false);
  }, [location.pathname]);

  const getSlipData = async () => {
    setIsBetForMeVisible(true);
    setIsCheckCouponVisible(false);
    await getSlips(slipID)
      .then((response) => {
        if (response.stake) {
          setBetForMeData(response);
          const newSlips = prepareSlip(response);
          setBetForMeSlips(newSlips);
          if (response.stake && response.game_picks) {
            getSlipSummary(response.stake, response.game_picks);
          }
        } else if (response.detail) {
          message.warning(response.detail);
        } else if (typeof response == 'string') {
          message.warning(response);
        }
      })
      .catch((err) => {
        if (typeof err == 'string') message.warning(err);
        // console.log(err);
      });
  };

  useEffect(() => {
    if (stake[selectedSlip] > 0 && slips[selectedSlip].length > 0) {
      getSlipSummary(stake[selectedSlip], slips[selectedSlip]);
    }
  }, [stake, slips, selectedSlip]);

  const removeSlip = async (id) => {
    // let s = slips[selectedSlip].filter((s) => s.id != id);
    let newSlip = [...slips[selectedSlip]];
    newSlip.splice(
      newSlip.findIndex((slip) => slip.id === id),
      1
    );
    let newSlips = { ...slips };
    newSlips[selectedSlip] = newSlip;
    dispatch(updateSlips({ slips: newSlips }));
    ClientSession.storeSlip(newSlips, (err) => {});
  };

  const removeAllSlips = async () => {
    let newSlips = { ...slips };
    newSlips[selectedSlip] = [];
    dispatch(updateSlips({ slips: newSlips }));
    ClientSession.storeSlip(newSlips, (err) => {});
  };
  const getSlipSummary = async (stake, slipsData) => {
    const slip_summery = await getSummary(stake, slipsData);

    setbonusMsg(slip_summery.bonusMsg);
    setBonusPercent(slip_summery.percentage);

    let summeryData = {
      stakeNet: slip_summery.stakeNet,
      vat: slip_summery.vat,
      win: slip_summery.win,
      tax: slip_summery.tax,
      netWin: slip_summery.netWin,
      bonus: slip_summery.bonus,
      vat_label: slip_summery.vat_label,
      tax_label: slip_summery.tax_label,
    };
    setSummery({ ...summeryData });
  };

  const onTabChange = (key) => {
    // setSelectedSlip(key);
    dispatch(updateSelectedSlip({ selectedSlip: key }));
  };

  const localizeBetTypes = (id, value) => {
    if (i18n.resolvedLanguage == 'Am') {
      if (bet_types[id].locales.filter((l) => l.locale == 1)[0]) {
        return bet_types[id].locales.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const checkCoupon = () => {
    setCouponLoader(true);
    API.findWithNoToken(`coupon-get/${checkCouponId}/`, null, null)
      .then((response) => {
        if (response.data) {
          setCouponLoader(false);
          setIsCheckCouponVisible(true);
          setCheckCouponData(response.data);
        }
      })
      .catch((err) => {
        setCouponLoader(false);
        if (!err.response && !err.response.data) {
          return message.error('Error While Loading Data', 5);
        }
        message.error(err.response.data[Object.keys(err.response.data)[0]], 5);
      });
  };

  const retriveCoupon = () => {
    setRetrieveLoader(true);
    API.findWithNoToken(`coupon-retrieve/${cid}/`, null, null)
      .then((response) => {
        if (response.data) {
          // INFO: confirm if prepareSlip works?
          const newSlips = prepareSlip(response.data);
          dispatch(updateSlips({ slips: newSlips }));
          setRetrieveLoader(false);
        }
      })
      .catch((err) => {
        setRetrieveLoader(false);
        if (!err.response.data) {
          return message.error('Error While Loading Data', 5);
        }
        message.error(err.response.data[Object.keys(err.response.data)[0]], 5);
      });
  };
  const changecid = (e) => {
    setCid(e.target.value.trim());
  };
  const changecheckCouponId = (e) => {
    setcheckCouponId(e.target.value.trim());
  };

  const getOdd = () => {
    var odd = slips[selectedSlip].length == 0 ? 0 : 1;
    slips[selectedSlip].forEach((s) => {
      odd = odd * s.odd;
    });

    return odd.toFixed(2);
  };

  const placeBet = () => {
    if (!acceptChange) return message.info(t('Acceptallchanges'), 5);
    const online_min =
      parseInt(configurations?.online_minimum_stake) ?? parseInt(ON_LINE_MIN);
    const offline_min =
      parseInt(configurations?.offline_minimum_stake) ?? parseInt(MIN);

    if (
      stake[selectedSlip] == '' ||
      (ClientSession.isAuth()
        ? parseInt(stake[selectedSlip]) < parseInt(online_min)
        : parseInt(stake[selectedSlip]) < parseInt(offline_min))
    ) {
      return message.error(
        `${t('StakeshouldbeMinimum')} ${
          ClientSession.isAuth() ? online_min : offline_min
        } `,
        5
      );
    }

    // if (summery.netWin > config.maxWin) {
    //   return message.error(`${t('MaximumWinis')} ${config.maxWin}`, 5);
    // }

    let selected_odds = slips[selectedSlip].map((s) => {
      return { gamepick: s.id, odd_value: s.odd };
    });

    let data = { selected_odds: selected_odds, stake: stake[selectedSlip] };
    if (ClientSession.isAuth()) {
      setLoadingPlaceBet(true);
      let url = `sport-data/bet.place/`;
      if (ClientSession.isAuth() && userDetail?.member?.member_type != 1) {
        url = `online-agent/bet-place/`;
        data.useridentifier = phone[selectedSlip];
      }
      API.create(url, data, null)
        .then((response) => {
          if (response.data) {
            message.success(t('BetPlacedSuccessfully'));
            setBetDataVisible(true);
            setBetData(response.data);
            setLoadingPlaceBet(false);
            if (telegramData.cid) {
              API.createBot('/bet', {
                chat_id: Number(telegramData.cid),
                message_id: Number(telegramData.mid),
                is_logged_in: true,
                ...response.data,
                // token: ClientSession.getToken(),
              });
            }
            if (!clearSlip) {
              removeAllSlips();
            }
          }
        })
        .catch((err) => {
          setLoadingPlaceBet(false);
          message.error(
            err.response.data[Object.keys(err.response.data)[0]][0],
            5
          );
        });
    } else {
      setLoadingPlaceBet(true);
      API.createNoToken(`sport-data/bet.place/`, data, null)
        .then((response) => {
          if (response.data) {
            // TODO: SLIP DATA NOT BEING RECIEVED
            message.success(t('BetPlacedSuccessfully'));
            setBetDataVisible(true);
            setBetData(response.data);
            setLoadingPlaceBet(false);
            if (telegramData.cid) {
              API.createBot('/bet', {
                chat_id: Number(telegramData.cid),
                message_id: Number(telegramData.mid),
                is_logged_in: false,
                ...response.data,
                // token: ClientSession.getToken(),
              });
            }
            if (!clearSlip) {
              removeAllSlips();
            }
          }
        })
        .catch((err) => {
          setLoadingPlaceBet(false);
          message.error(
            err.response.data[Object.keys(err.response.data)[0]][0],
            5
          );
        });
    }
  };

  const renderSlips = () => {
    return (
      <>
        <ul
          // ref={animationParent}
          className={classNames(
            ' relative m-0 flex flex-col gap-y-[2px] bg-rightbar-container   text-font-dark',
            process.env.REACT_TICKET_SCROLL == 'true'
              ? 'max-h-[400px] flex-col overflow-y-auto scroll-smooth'
              : '',
            process.env.REACT_TICKET_ROUNDED == 'true' ? 'p-1' : 'p-0'
          )}
        >
          <AnimatePresence initial={false}>
            {slips[selectedSlip].map((s) => {
              let gameType = s.gameType;
              const sportIcon = getSportTypeLogo(s?.gleague);
              if (gameType.includes('Handicap')) {
                gameType = gameType.slice(0, -3);
              }

              const league_title = league_groups[
                leagues[s?.gleague]?.league_group
              ]?.name
                ? `${
                    (i18n.resolvedLanguage == 'Am' &&
                    league_groups[leagues[s?.gleague]?.league_group]?.locales
                      ?.length > 0
                      ? league_groups[leagues[s?.gleague]?.league_group]
                          ?.locales[0].translation
                      : league_groups[leagues[s?.gleague]?.league_group]
                          ?.name) +
                    ' - ' +
                    (i18n.resolvedLanguage == 'Am' &&
                    leagues[s?.gleague]?.locales?.length > 0
                      ? leagues[s?.gleague]?.locales[0].translation
                      : leagues[s?.gleague]?.name)
                  } `
                : null;

              return (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 50, scale: 0.73 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    x: 50,
                    transition: { duration: 0.2 },
                  }}
                  className={classNames(
                    'relative flex flex-col bg-rightbar-picked-odd-item text-rightbar-picked-odd-item-font',
                    process.env.REACT_TICKET_ROUNDED == 'true'
                      ? 'rounded-md'
                      : ''
                  )}
                >
                  <div className=" absolute top-0 right-0  ">
                    <RiCloseCircleLine
                      className="m-1 h-5 w-5 cursor-pointer fill-gray-500 hover:opacity-70"
                      onClick={() => {
                        removeSlip(s.id);
                      }}
                    />
                  </div>
                  <div
                    className="m-2 flex cursor-pointer flex-col gap-y-1.5"
                    onClick={() => {
                      if (typeof onClose == 'function') onClose();
                      navigate(`/match/detail/${s.matchId}`);
                    }}
                  >
                    <div
                      className="gap-b-4 gap-r-4 hover:text-primary flex cursor-pointer flex-row items-center gap-x-2 "
                      onClick={() => {
                        if (typeof onClose == 'function') onClose();
                        navigate(`/match/detail/${s.matchId}`);
                      }}
                    >
                      <img
                        src={sportIcon ? sportIcon : ''}
                        alt="Icon"
                        className="flex h-4 w-4 items-center justify-center"
                      />
                      <span className="text-md w-4/5 truncate font-semibold ">
                        {s.title}
                      </span>
                    </div>

                    <div className="ml-2 flex flex-col gap-y-0.5">
                      {league_title ? (
                        <div
                          className={classNames(
                            '  flex w-full justify-start rounded  px-1 py-0.5 text-xs  ',
                            process.env.REACT_TICKET_HIGHLIGHTED == 'true'
                              ? 'bg-rightbar-picked-odd-highligher'
                              : ''
                          )}
                        >
                          <span>{league_title}</span>
                        </div>
                      ) : null}
                      <div className="flex flex-row items-center gap-x-3 px-1 ">
                        <strong className=" truncate text-xs ">
                          {gameType}
                        </strong>
                      </div>
                      <div className="flex  flex-row items-center gap-x-3 ">
                        <div
                          className={classNames(
                            'flex w-full justify-between space-x-2 rounded  px-1 py-1  ',
                            process.env.REACT_TICKET_HIGHLIGHTED == 'true'
                              ? 'bg-rightbar-picked-odd-highligher'
                              : ''
                          )}
                        >
                          <strong className="w-[140px] truncate text-xs">
                            {s.pick}
                          </strong>
                          <strong className=" text-right text-xs ">
                            {s.odd}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </>
    );
  };

  const renderBetForMeSlips = () => {
    return (
      <>
        <div className="flex h-9 items-center justify-between bg-header-container px-4">
          <span className="uppercase text-font-light">
            {t('MATCHES')} {'[' + betForMeData?.number_matches + ']'}
          </span>
          <div></div>
        </div>
        <ul
          ref={animationParent}
          className="scrollbar relative flex max-h-[400px] flex-col gap-y-[2px] overflow-y-scroll scroll-smooth bg-container  p-2 text-font-dark"
        >
          {betForMeSlips[selectedSlip].map((s, index) => {
            let gameType = s.gameType;
            const sportIcon = getSportTypeLogo(s?.gleague);
            if (gameType.includes('Handicap')) {
              gameType = gameType.slice(0, -3);
            }
            return (
              <li
                key={index}
                className="slipCard relative flex flex-col bg-secondary-200"
              >
                <div
                  className="m-2 flex cursor-pointer flex-col gap-y-2"
                  onClick={() => {
                    // navigate(`/match/detail/${s.matchId}`);
                  }}
                >
                  <div
                    className="gap-b-4 gap-r-4 hover:text-primary flex cursor-pointer flex-row items-center gap-x-2 text-font-dark"
                    onClick={() => {
                      // navigate(`/match/detail/${s.matchId}`);
                    }}
                  >
                    <img
                      src={sportIcon ? sportIcon : ''}
                      alt="Icon"
                      className="flex h-5 w-5 items-center justify-center"
                    />
                    <span className="text-md w-4/5 truncate font-semibold ">
                      {s.title}
                    </span>
                  </div>
                  <div className="ml-2 flex flex-col gap-y-0.5">
                    <div className="flex flex-row items-center gap-x-3 ">
                      <span className="w-[74px] shrink-0 truncate text-sm">
                        {t('GameType')}
                      </span>
                      <div className=" items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-primary-700"></div>
                      </div>
                      <strong className=" truncate text-xs">{gameType}</strong>
                    </div>
                    <div className="flex  flex-row items-center gap-x-3 ">
                      <div className="flex items-center ">
                        <span className="w-[74px] shrink-0 truncate text-sm">
                          {t('YourPick')}
                        </span>
                      </div>
                      <div className=" items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-primary-700"></div>
                      </div>
                      <div className="flex w-full justify-between space-x-2">
                        <strong className="w-[140px] truncate text-xs">
                          {s.pick}
                        </strong>
                        <strong className=" text-right text-xs ">
                          {s.odd}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  };
  const renderRetrieveCoupon = () => {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 px-2 pb-6">
        {/* <img src={slip_icon} className="mt-8 h-10 w-32 text-font-light" alt="" /> */}
        <div className="flex h-48 w-full flex-col items-center justify-center ">
          <span className="text-center font-semibold text-font-light">
            {t('Youhavenotselectedanybet')}
          </span>
          <span className="text-center text-font-light">
            {t('Makeyourfirstpicktostartplaying')}
          </span>
        </div>
        <hr className="w-full rounded border-[1px] border-gray-500" />
        <div className="flex w-full flex-col justify-start ">
          <span className="text-start text-font-light">
            {t('Load') + ' ' + t('Coupon')}:
          </span>
          <div className="flex w-full flex-col gap-y-1 ">
            <input
              type="text"
              // value={stake[selectedSlip]}
              name="retrieve_number"
              id="retrieve_number"
              placeholder={`${t('Coupon')} ${t(
                'Number'
              ).toLocaleLowerCase()} ...`}
              className="h-9 w-full rounded bg-ticket-input px-3 text-ticket-input-font  outline-none"
              onChange={changecid}
            />
            <button
              className=" flex h-9 w-full cursor-pointer items-center justify-center gap-x-1 rounded bg-secondary-button uppercase text-secondary-button-font"
              onClick={retriveCoupon}
              disabled={retrieveLoader}
            >
              {retrieveLoader && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-4 w-4 animate-spin fill-active text-secondary-button-font "
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
              {t('Load')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBetForMeSlipEmpty = () => {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 px-6 pb-6">
        <BsInboxFill className="h-28 w-1/4 text-font-light" />
        <div className="flex flex-col items-center justify-center ">
          <span className="text-center font-semibold text-font-light">
            {t('Youhavenotselectedanybet')}
          </span>
          <span className="text-center text-font-light">
            {t('Makeyourfirstpicktostartplaying')}
          </span>
        </div>
        <hr className="w-full rounded border-[1px] border-gray-500" />
        <div className="flex flex-col justify-start ">
          <span className="text-start text-font-light">
            {/* {t('RetrieveYourBetCoupon')}: */}
            Please check your Coupon ID and try again
          </span>
        </div>
      </div>
    );
  };

  const renderSummery = () => {
    return (
      <>
        {configurations.show_staketax_information && (
          <div className="flex justify-between">
            <span className=" font-semibold uppercase ">
              {/* {t('VAT')} */}
              {summery.vat_label ?? 'VAT'}
            </span>
            <span className=" font-semibold ">
              {Utils.currencyCommaFormat(summery.vat)}
            </span>
          </div>
        )}
        {configurations.show_staketax_information && (
          <div className="flex justify-between">
            <span className=" font-semibold uppercase ">
              {/* {t('VAT')} */}
              {summery.net_stake_label ?? 'Net Stake'}
            </span>
            <span className=" font-semibold ">
              {Utils.currencyCommaFormat(summery.stakeNet)}
            </span>
          </div>
        )}
        {configurations.show_wintax_information && (
          <div className="flex justify-between">
            <span className=" font-semibold uppercase ">
              {/* {t('TAX')} */}
              {summery.tax_label}
            </span>
            <span className=" font-semibold ">
              {Utils.currencyCommaFormat(summery.tax)}
            </span>
          </div>
        )}
        {summery.bonus ? (
          <div className="flex justify-between">
            <span className=" font-semibold uppercase ">{t('Bonus')}</span>
            <span className=" font-semibold ">
              {Utils.currencyCommaFormat(summery.bonus)}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className=" text-xl font-semibold uppercase ">
            {t('PossibleWin')}
          </span>
          <span className=" text-xl font-semibold">
            {Utils.currencyCommaFormat(summery.netWin)}
          </span>
        </div>
      </>
    );
  };

  const renderBetForMeSummery = () => {
    return (
      <div className="flex w-full flex-col overflow-hidden rounded-md border-[1px] border-secondary-200 text-font-light">
        <div className="flex border-b-[1px] border-secondary-200 ">
          <span className="flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left">
            {t('Stake')}
          </span>
          <span className="flex flex-1 items-center pl-2 text-left">
            {Utils.currencyCommaFormat(betForMeData?.stake)}
          </span>
        </div>
        <div className="flex border-b-[1px] border-secondary-200 ">
          <span className="flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left">
            {t('VAT')}
          </span>
          <span className="flex flex-1 items-center pl-2 text-left">
            {Utils.currencyCommaFormat(summery.vat)}
          </span>
        </div>
        <div className="flex border-b-[1px] border-secondary-200 ">
          <span className="flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left">
            {t('Bonus')}
          </span>
          <span className="flex flex-1 items-center pl-2 text-left">
            {Utils.currencyCommaFormat(summery.bonus)}
          </span>
        </div>
        <div className="flex border-b-[1px] border-secondary-200 ">
          <span className="flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left">
            {t('MaxWin')}
          </span>
          <span className="flex flex-1 items-center pl-2 text-left">
            {Utils.currencyCommaFormat(betForMeData?.possible_win || 0)}
          </span>
        </div>
        <div className="flex border-b-[1px] border-secondary-200 ">
          <span className="flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left">
            {t('TAX')}
          </span>
          <span className="flex flex-1 items-center pl-2 text-left">
            {Utils.currencyCommaFormat(summery.tax)}
          </span>
        </div>
        <div className="flex ">
          <span className="text-md flex flex-1 items-center border-r-[1px] border-secondary-200 pl-2 text-left font-semibold text-font-light ">
            {t('NetPay')}
          </span>
          <span className=" text-md flex flex-1 items-center pl-2 text-left font-semibold text-font-light ">
            {Utils.currencyCommaFormat(summery.netWin)}
          </span>
        </div>

        <div className="flex border-t-[1px] border-secondary-200">
          <span className="text-md flex w-full flex-1 items-center border-r-[1px] border-secondary-200 px-2 text-left text-font-light ">
            {t('CouponID')}
          </span>
          <div className="flex w-full flex-1 items-center justify-between px-2">
            <span className=" text-md flex items-center truncate text-left text-font-light ">
              {betForMeData?.ticketID}
            </span>
            <FaCopy
              role="button"
              className="text-md text-primary cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(betForMeData?.ticketID);
                message.success('Copied!', 2);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderBetSlips = () => {
    const tabs = [
      { id: 1, label: t('Slip') },
      { id: 2, label: t('Slip') },
      { id: 3, label: t('Slip') },
    ];
    return (
      <div className="relative flex w-full flex-col bg-slip-container pb-2  lg:w-80">
        <div
          onClick={() => typeof onClose == 'function' && onClose()}
          className="mb-1 flex h-9 items-center justify-between border-l-8  border-secondary-500 bg-container-header pl-4 pr-4 text-center font-medium capitalize text-secondary-button-font  "
        >
          <span>
            {t('Bet').toLocaleUpperCase() + t('Slip').toLocaleUpperCase()}
          </span>
          {typeof onClose == 'function' ? (
            <button onClick={() => onClose()} className=" block  md:hidden">
              <FaChevronDown className={` duration-300 `} />
            </button>
          ) : slips[selectedSlip]?.length != 0 ? (
            <button
              title={t('CLEAR')}
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded  bg-container-header  "
              onClick={removeAllSlips}
            >
              <BsTrashFill className="text-xl text-primary-200 group-hover:text-primary-50  " />
            </button>
          ) : (
            <></>
          )}
        </div>
        <motion.ul className="mb-1 flex h-9 w-full flex-wrap divide-x-[1px] divide-gray-600 bg-slip-tab-container text-center text-sm font-medium text-header-nav-font ">
          {tabs.map((tab) => {
            return (
              <li
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={` relative flex h-full w-full flex-1 cursor-pointer items-center justify-center text-center `}
              >
                {selectedSlip == tab.id && (
                  <motion.div
                    // transition={{ duration: 0.3 }}
                    layoutId="active-slip-tab"
                    className="absolute inset-0 top-auto h-1 bg-active "
                  />
                )}

                {slips[tab.id].length > 0 && (
                  <span
                    className={`absolute top-1 right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full ${
                      selectedSlip != tab.id
                        ? 'bg-slip-badge-active text-slip-badge-active-font'
                        : 'bg-slip-badge text-slip-badge-font'
                    } text-center text-[8px] `}
                  >
                    {slips[tab.id].length}
                  </span>
                )}
                <span className="relative z-10">
                  {tab.label + ' ' + tab.id}
                </span>
              </li>
            );
          })}
        </motion.ul>
        {slips[selectedSlip]?.length != 0 && renderSlips()}
        {slips[selectedSlip]?.length == 0 && renderRetrieveCoupon()}
        {slips[selectedSlip]?.length != 0 ? (
          <div className="bg-bet-summery pb-2 text-bet-summery-font">
            <div className="mt-2 flex w-full flex-col gap-y-2 px-4 ">
              {bonusMsg && (
                <span className="text-xs text-active">{bonusMsg}</span>
              )}
            </div>
            <div className="flex w-full flex-col gap-y-2 px-4">
              <div className="flex justify-between">
                <span className=" capitalize ">{t('TotalOdd')}</span>
                <span className=" ">{getOdd()}</span>
              </div>
              {/* <hr className="border-gray-400" /> */}
              {ClientSession.isAuth() && userDetail?.member?.member_type != 1 && (
                <input
                  value={phone[selectedSlip] || ''}
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder={t('PhoneNumber') + '...'}
                  className="h-9 w-full rounded bg-ticket-input text-ticket-input-font  outline-none"
                  onChange={(e) => {
                    const newPhone = { ...phone };
                    newPhone[selectedSlip] = e.target.value;
                    dispatch(updatePhone({ phone: newPhone }));
                  }}
                />
              )}
              <div className="flex h-8 items-center overflow-hidden rounded ">
                <span className="flex h-full w-full items-center bg-bet-stake px-4 text-bet-stake-font">
                  {t('Stake')}
                </span>
                <input
                  type="number"
                  min={
                    ClientSession.isAuth()
                      ? configurations?.online_minimum_stake
                      : configurations?.offline_minimum_stake
                  }
                  max={configurations?.maximum_stake}
                  value={stake[selectedSlip] ?? ''}
                  name="stake"
                  id="stake"
                  placeholder={t('Stake') + '...'}
                  className="h-full w-full bg-ticket-input px-3 text-ticket-input-font  outline-none"
                  onChange={(e) => {
                    const newStake = { ...stake };
                    newStake[selectedSlip] = (() => {
                      if (e.target.value > configurations?.maximum_stake) {
                        message.warning(
                          `${
                            i18n.resolvedLanguage == 'Am'
                              ? `ለመመደብ ከፍተኛው የገንዘብ መጠን ${configurations.maximum_stake} የኢትዮጵያ ብር ነው።`
                              : `Maximum stake amount is ${configurations.maximum_stake} ETB`
                          } `,
                          2
                        );
                        return configurations?.maximum_stake;
                      }
                      return e.target.value;
                    })();
                    dispatch(updateStake({ stake: newStake }));
                  }}
                />
              </div>
              {renderSummery()}
            </div>

            <div className="mt-4 flex w-full flex-col gap-y-2 px-4 ">
              <div className="flex items-center">
                <label
                  className="pr-[15px] text-[15px] leading-none "
                  htmlFor="clear-slip"
                >
                  Copy Ticket
                </label>
                <Switch.Root
                  defaultChecked={clearSlip}
                  onCheckedChange={(value) => setClearSlip(value)}
                  className={classNames(
                    'relative h-[25px] w-[42px] rounded-full outline-none  ',
                    clearSlip ? 'bg-active' : 'bg-primary-700'
                  )}
                  id="clear-slip"
                  style={{
                    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
                  }}
                >
                  <Switch.Thumb
                    className={classNames(
                      '  block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-active shadow-[0_2px_2px] transition-transform duration-100 will-change-transform',
                      clearSlip ? 'translate-x-[19px] bg-white' : ''
                    )}
                  />
                </Switch.Root>
              </div>
              <div className="flex flex-row gap-x-2">
                <Checkbox
                  checked={acceptChange}
                  onChange={(e) => setAcceptChange(e.target.checked)}
                />
                <span className="text-xs ">{t('Acceptallchanges')}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-x-2">
                <button
                  title={t('CLEAR')}
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded  bg-secondary-button  hover:bg-primary-600 "
                  onClick={removeAllSlips}
                >
                  <BsTrashFill className="text-xl text-secondary-button-font group-hover:opacity-70  " />
                </button>
                <button
                  className=" flex h-9 w-full items-center justify-center gap-x-1 rounded-md bg-active uppercase text-active-font"
                  disabled={loadingPlaceBet}
                  onClick={placeBet}
                >
                  {loadingPlaceBet && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 animate-spin fill-active text-font-light "
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
                  {t('PLACEBET')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  const renderCheckCoupon = () => {
    const status = couponData?.ticket?.status;
    return (
      <div className=" flex w-full flex-col gap-4 bg-header-nav pb-2 lg:w-80">
        <div className="mb-1 flex h-9 items-center gap-2 bg-header-container px-2  text-center text-sm font-medium text-header-nav-font ">
          <span
            className="flex cursor-pointer  items-center justify-center text-2xl font-bold "
            onClick={() => setIsCheckCouponVisible(false)}
          >
            ‹
          </span>
          <span className="text-lg">|</span>
          <span className="font-semibold">Ticket ID:</span>
          <span className=" font-semibold">{couponData.couponID}</span>
        </div>

        <div className="px-2">
          <div className="flex h-full w-full shrink-0 snap-center flex-col gap-y-1 rounded-lg border-[1px] border-secondary-700 bg-secondary-800 p-2 text-font-light ">
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Status')}</span>
              <div className="flex items-center gap-x-1">
                {status == 'win' ? (
                  <span className="rounded bg-success px-2 uppercase ">
                    {t('Won')}
                  </span>
                ) : status == 'loss' ? (
                  <span className="rounded bg-danger px-2 uppercase ">
                    {t('Lost')}
                  </span>
                ) : (
                  <span className="rounded bg-secondary-200  px-2 uppercase ">
                    {status}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('Stake')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {couponData?.stake?.toFixed(2)}
                </span>
                <span>{t('ETB')}</span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('MaxWin')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-sm font-semibold">
                  {couponData?.max_win?.toFixed(2)}
                </span>
                <span>{t('ETB')}</span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between ">
              <span className="text-sm">{t('TotalOdd')}</span>
              <span className="text-sm font-semibold">
                {couponData?.total_odds?.toFixed(2)}
              </span>
            </div>
            <div className="h-[1px] rounded bg-gray-700" />
            <div className="flex w-full items-center justify-between ">
              <span className="text-lg">{t('NetPay')}</span>
              <div className="flex items-center gap-x-1">
                <span className="text-lg font-semibold">
                  {couponData?.net_pay?.toFixed(2)}
                </span>
                <span>{t('ETB')}</span>
              </div>
            </div>
          </div>
        </div>
        {couponData?.game_picks?.length > 0 && renderCouponSlip()}
        {/* {renderRetrieveCoupon()} */}
      </div>
    );
  };

  const renderCouponSlip = () => {
    return (
      <>
        <div className="scrollbar relative flex h-fit flex-col gap-y-[2px] bg-header-container  p-2 text-header-container-font">
          {couponData?.game_picks?.map((s, index) => {
            const betType = Utils.replaceName(
              localizeBetTypes(
                s.bet_type.id,
                s.bet_type ? s.bet_type.name : ''
              ),
              s.item ? s.item.param : '',
              s.match.hom,
              s.match.awy,
              s.match.hometeam_locale,
              s.match.awayteam_locale,
              i18n.resolvedLanguage
            );
            const formatedBetType = FormatEntity.formatPickName(
              betType,
              null,
              s.item.specifier
            );
            const formatedGroupType = FormatEntity.formatMarketName(
              s.bet_group.name,
              Object.values(s.item.specifier).length > 0 ? s.match : null,
              s.item.specifier
            );
            const betgroup = Utils.replaceName(
              formatedGroupType,
              s.item.param,
              s.match.hom,
              s.match.awy,
              s.match.hometeam_locale,
              s.match.awayteam_locale,
              i18n.resolvedLanguage
            );

            const sportIcon = getLogoBySportType(
              s?.match?.league?.sport_type?.id
            );
            return (
              <div
                key={index}
                className="slipCard relative flex shrink-0 flex-col bg-header-nav"
              >
                <BetCard
                  market={betgroup}
                  home={
                    i18n.resolvedLanguage == 'Am' &&
                    s.match.hometeam_locale != null
                      ? s.match.hometeam_locale
                      : s.match.hom
                  }
                  away={
                    i18n.resolvedLanguage == 'Am' &&
                    s.match.awayteam_locale != null
                      ? s.match.awayteam_locale
                      : s.match.awy
                  }
                  pick={formatedBetType}
                  schedule={s.match.schedule}
                  sportIcon={
                    sportIcon ? sportIcon : s?.match?.league?.sport_type?.logo
                  }
                  odd={s.odd}
                  status={s.status}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderBetForMe = () => {
    return (
      <div className=" flex w-full flex-col bg-container pb-2 lg:w-80">
        <div className="mb-1 flex h-9 items-center gap-2 bg-header-container px-2  text-center text-sm font-medium text-gray-200 ">
          <span
            className="flex cursor-pointer  items-center justify-center text-2xl font-bold "
            onClick={() => setIsBetForMeVisible(false)}
          >
            ‹
          </span>
          <span className="text-lg">|</span>
          <span className="font-semibold">CouponID:</span>
          <span className=" font-semibold">{betForMeData.ticketID}</span>
        </div>
        {betForMeSlips[selectedSlip]?.length > 0
          ? renderBetForMeSlips()
          : renderBetForMeSlipEmpty()}

        {betForMeSlips[selectedSlip]?.length > 0 && (
          <div className="flex flex-col gap-4 bg-gray-700 p-2">
            <div className="flex flex-col gap-1">
              <span className="text-md font-mono text-font-light">
                Bet Placed
              </span>
              <hr className=" bg-slate-400" />
            </div>

            {renderBetForMeSummery()}
          </div>
        )}
      </div>
    );
  };

  const moveToView = () => {
    if (slipsRef.current !== null) {
      setTimeout(
        () =>
          slipsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
          }),
        500
      );
    }
  };

  const isSlipPage =
    location.pathname == '/slips' || location.pathname.startsWith('/slips/');

  return (
    <div className="mt-1 mb-10 flex h-full w-full flex-col gap-y-1 md:mb-0 md:mt-0 md:w-80">
      {isSlipPage &&
        windowWidth <= MediaSize &&
        !isBetForMeVisible &&
        !isCheckCouponVisible && (
          <div className="h-16 w-full shrink-0 items-center bg-primary-700 px-4">
            <div className="flex h-full w-full items-center justify-between bg-primary-700">
              <div
                className=" cursor-pointer "
                onClick={() => {
                  navigate('/');
                }}
              >
                <img src={logo} className="h-10 cursor-pointer" />
              </div>
              <div></div>
            </div>
          </div>
        )}
      {isSlipPage &&
        windowWidth <= MediaSize &&
        !isBetForMeVisible &&
        !isCheckCouponVisible && (
          <div className="sticky top-0 z-50 flex h-9 w-full  items-center justify-between bg-primary-900 px-4 md:hidden">
            <div
              onClick={() => navigate(-1)}
              className="flex  items-center gap-x-1 text-font-light "
            >
              <MdOutlineArrowBackIosNew className="flex cursor-pointer text-lg font-bold text-font-light" />
              {t('back')}
            </div>
            {/* <img src={icon} className="h-5 w-5" alt="" /> */}
            <AiOutlineCloseCircle
              className=" cursor-pointer  text-xl text-danger duration-200 hover:text-danger/60"
              onClick={() => navigate(-1)}
            />
          </div>
        )}
      <div
        ref={slipsRef}
        className={`flex flex-col gap-y-2 overflow-y-scroll ${
          isSlipPage ? 'pb-14' : ''
        }`}
      >
        {isSlipPage && windowWidth <= MediaSize && (
          <>
            {!isBetForMeVisible && !isCheckCouponVisible && renderBetSlips()}
            {isCheckCouponVisible && renderCheckCoupon()}
            {isBetForMeVisible && renderBetForMe()}
            <div
              className={`${
                expand ? ' h-fit' : ' h-10 '
              } flex flex-col gap-y-2 bg-primary-600  p-2 duration-300`}
            >
              <div className="flex h-10 items-center justify-between text-font-light">
                <div className="flex flex-row items-center justify-between gap-x-2">
                  <span className="">{t('Load') + ' ' + t('Coupon')}</span>
                </div>
                <div
                  className="cursor-pointer "
                  onClick={() => setExpand((prev) => !prev)}
                >
                  {expand ? (
                    <BiMinus className="h-4 w-4 " />
                  ) : (
                    <BiPlus className="h-4 w-4 " />
                  )}
                </div>
              </div>
              {expand && (
                <div className="flex w-full flex-col gap-y-1  ">
                  <input
                    type="text"
                    // value={stake[selectedSlip]}
                    placeholder={`${t('Coupon')} ${t(
                      'Number'
                    ).toLocaleLowerCase()} ...`}
                    id="Coupon_number"
                    name={'Coupon_number'}
                    className="h-9 w-full rounded bg-ticket-input  px-3 text-ticket-input-font  outline-none"
                    onChange={changecheckCouponId}
                  />
                  <button
                    className=" flex h-9 w-full cursor-pointer items-center justify-center gap-x-1 rounded bg-secondary-button px-1 uppercase text-secondary-button-font"
                    onClick={checkCoupon}
                  >
                    {couponLoader && (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-4 w-4 animate-spin fill-active text-secondary-button-font"
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
                    {t('Load')}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {(isSlipPage ||
          (windowWidth > MediaSize && location.pathname != '/apps')) &&
          configurations?.front_page_images?.length > 0 &&
          configurations?.front_page_images
            ?.filter((banner) => {
              return (
                banner.image_location == PROMOTION_BANNER &&
                (i18n.resolvedLanguage.toUpperCase() ===
                  banner.locale?.shortcode?.toUpperCase() ||
                  banner.locale == null)
              );
            }) // 2 = promotion banners
            .map((banner, index) => {
              return (
                <div
                  key={index}
                  className="w-full bg-secondary-200 "
                  // onClick={() => navigate(banner.image_link)}
                >
                  {banner.image_link != '' && (
                    <>
                      {Utils.validURL(banner.image_link) ? (
                        <a
                          href={`${banner.image_link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={banner.photo}
                            alt="virtual"
                            className=" h-full w-full"
                          />
                        </a>
                      ) : (
                        <Link to={`${banner.image_link}`}>
                          <img
                            src={banner.photo}
                            alt="virtual"
                            className=" h-full w-full"
                          />
                        </Link>
                      )}
                    </>
                  )}
                  {banner.image_link == '' && (
                    <img
                      src={banner.photo}
                      alt="virtual"
                      className=" h-full w-full"
                    />
                  )}
                </div>
              );
            })}
      </div>

      {!isSlipPage && (
        <>
          {!isBetForMeVisible && !isCheckCouponVisible && renderBetSlips()}
          {isCheckCouponVisible && renderCheckCoupon()}
          {!isCheckCouponVisible && isBetForMeVisible && renderBetForMe()}
          <div
            className={`${
              expand ? ' h-fit ' : ' h-10 '
            } flex flex-col gap-y-2 bg-secondary-800  p-2 duration-300`}
          >
            <div className="flex h-10 items-center justify-between text-font-light ">
              <div className="flex flex-row items-center justify-between gap-x-2">
                <span>{t('Check') + ' ' + t('Coupon')}</span>
              </div>
              <div
                className="cursor-pointer "
                onClick={() => setExpand((prev) => !prev)}
              >
                {expand ? (
                  <BiMinus className="h-4 w-4" />
                ) : (
                  <BiPlus className="h-4 w-4" />
                )}
              </div>
            </div>
            {expand && (
              <div className="flex w-full flex-col gap-y-1 ">
                <input
                  type="text"
                  // value={stake[selectedSlip]}
                  name="ticket_number"
                  id="ticket_number"
                  placeholder={`${t('Coupon')} ${t(
                    'Number'
                  ).toLocaleLowerCase()} ...`}
                  className="h-9 w-full rounded bg-ticket-input px-3 text-ticket-input-font  outline-none"
                  onChange={changecheckCouponId}
                />
                <button
                  className=" flex h-9 w-full cursor-pointer items-center justify-center gap-x-1 rounded bg-secondary-button px-1 text-xs uppercase text-secondary-button-font"
                  onClick={checkCoupon}
                >
                  {couponLoader && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 animate-spin fill-active text-secondary-button-font "
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
                  {t('Check')}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        visible={betDataVisible}
        onCancel={() => setBetDataVisible(false)}
        onOk={() => setBetDataVisible(false)}
      >
        <BetDataView betData={betData} done={() => setBetDataVisible(false)} />
      </Modal>
    </div>
  );
}
