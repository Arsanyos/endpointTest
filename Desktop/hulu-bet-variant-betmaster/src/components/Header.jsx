import { useUser } from '@hooks/useUser';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FaBaby,
  FaChevronUp,
  FaDice,
  FaExchangeAlt,
  FaInfoCircle,
  FaListAlt,
  FaShareAlt,
  FaSlideshare,
  FaUserAlt,
  FaWallet,
} from 'react-icons/fa';
import Clock from 'react-live-clock';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Dropdown, Input, Menu, message } from 'antd';
import {
  AiFillDollarCircle,
  AiFillEye,
  AiFillEyeInvisible,
  AiFillFire,
  AiFillMobile,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineStop,
} from 'react-icons/ai';
import {
  BsFillPatchCheckFill,
  BsQuestionCircleFill,
  BsStack,
} from 'react-icons/bs';
import {
  GiBoatPropeller,
  GiCardKingDiamonds,
  GiCash,
  GiHamburgerMenu,
  GiWallet,
} from 'react-icons/gi';
import {
  MdLogout,
  MdMore,
  MdNoteAlt,
  MdPrivacyTip,
  MdSportsSoccer,
} from 'react-icons/md';

import { FacebookIcon, TelegramIcon, TwitterIcon } from 'react-share';
import { SocialIcon } from 'react-social-icons';

import Icon from '@ant-design/icons/lib/components/Icon';
import et_icon from '@assets/img/et_icon.png';
import uk_icon from '@assets/img/uk_icon.png';
import logo from '@assets/logo.png';
// import logo from '@assets/logo.jpg';
// import logo from '@assets/logo.svg';
import { updateIsRightBarOpen } from '@ReduxStore/configurationSlice';
import Modal from '@components/Modal';
import { useEvent } from '@hooks/useEvent';
import ForgotPassword from '@pages/ForgotPassword';
import NewPassword from '@pages/NewPassword';
import OTP from '@pages/OTP';
import Register from '@pages/Register';
import API from '@services/API';
import ClientSession from '@services/client-session';
import {
  MAX_PHONE_LENGTH,
  MEDIA_SIZE_LG,
  MIN_PHONE_LENGTH,
} from '@services/constants';
import classNames from 'classnames';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { RiFileListFill } from 'react-icons/ri';
import BottomSheet from './BottomSheet';
import Drawer from './Drawer';
import MobileDeposit from './MobileDeposit';
import MobileMenu from './MobileMenu';
import RightBar from './RightBar';

export default function Header({ loginVisible, setLoginVisible }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSlips, setOpenSlips] = useState(false);
  const [visible, setVisible] = useState(false);

  const [loginLoader, setLoginLoader] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [visibleRegisterOTP, setVisibleRegisterOTP] = useState(false);
  const [UnverifiedregisteredUser, setUnverifiedRegisteredUser] =
    useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  // const [loginVisible, setLoginVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [registerOTPVisible, setRegisterOTPVisible] = useState(false);
  const [otp, setOtp] = useState(null);
  const [payout, setPayout] = useState('');

  const [searchValue, setSearchValue] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = React.useState('');

  const userDetail = useSelector((state) => state.user.userDetail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isRightBarOpen = useSelector(
    (state) => state.configuration.isRightBarOpen
  );
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  // console.log('configurations: ', configurations);
  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const stake = useSelector((state) => state.slip.stake);

  const {
    login,
    logOut,
    getProfile,
    changeLoginStatus,
    verifyOTP,
    verifyRegisterOTP,
    isBalanceValid,
  } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { getSummary } = useEvent();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const MEDIA_SIZE_MD = 912;
  // const MEDIA_SIZE_LG = 1024;
  const TEMPLATE = 'NONE';
  const KIRON_LITTE_LEAGUE_URL = '/kironlite';

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  useEffect(() => {
    let params = new URLSearchParams(document.location.search);
    let refererCode = params.get('referal');
    let login = params.get('login');
    let register = params.get('register');
    if (
      (!ClientSession.isAuth() && refererCode) ||
      (!ClientSession.isAuth() && register == '')
    ) {
      setRegisterVisible(true);
    }
    if (!ClientSession.isAuth() && login == '') {
      setLoginVisible(true);
    }
  }, [document.location.search]);

  const handleKeyPress = useCallback((event) => {
    if (
      (event.metaKey === true || event.ctrlKey === true) &&
      event.key === 'k'
    ) {
      setOpen((prev) => !prev);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    ClientSession.getAccessToken(function (isLoggedIn, authData) {
      if (isLoggedIn) {
        getProfile();
        changeLoginStatus();
      } else if (window.location.search) {
        let referalCode = window.location.search.split('=');
        if (referalCode.length != 0 && referalCode[0] == '?referal') {
          setRegisterVisible(true);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (isLoggedIn) setLoginVisible(false);
  }, [isLoggedIn]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (open) {
      document.getElementById('searchField').focus();
    }
  }, [open]);

  useEffect(() => {
    getSlipSummary(stake[selectedSlip], slips[selectedSlip]);
  }, [slips]);
  const getSlipSummary = async (stake, slipsData) => {
    const slip_summery = await getSummary(stake, slipsData);
    setPayout(slip_summery.netWin);
  };

  const getOdd = () => {
    var odd = slips[selectedSlip].length == 0 ? 0 : 1;
    slips[selectedSlip].forEach((s) => {
      odd = odd * s.odd;
    });

    return odd.toFixed(2);
  };

  const search = (value) => {
    navigate({
      pathname: `${location.pathname}`,
      search: value.toLowerCase(),
    });
    // navigate({
    //   pathname: 'search',
    //   search: value.toLowerCase(),
    // });
  };

  const changeLang = (lg) => {
    i18n.changeLanguage(lg);
  };

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          changeLang('Am');
        }}
      >
        <img src={et_icon} width="32px" height="32px" /> አማርኛ
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          changeLang('En');
        }}
      >
        <img src={uk_icon} width="32px" height="32px" /> English
      </Menu.Item>
    </Menu>
  );

  const HOME_URL = API.HOME_URL;
  const ICON_DEFAULTS = {
    round: true,
    size: 30,
  };

  return (
    <>
      <div
        className={classNames(
          ' flex w-full flex-col justify-between bg-header-container md:relative md:top-auto ',
          process.env.REACT_STICKY_HEADER == 'true' && 'sticky top-0 z-40'
        )}
      >
        <div className="flex h-[var(--mobile-height)] w-full  items-center justify-between bg-header p-4 md:h-24">
          <div className="flex items-center gap-x-2">
            {window.innerWidth < MEDIA_SIZE_LG && (
              <button
                className="flex items-center justify-center"
                onClick={() => {
                  setOpenSlips(false);
                  setOpenMenu(!openMenu);
                }}
              >
                <GiHamburgerMenu className=" text-xl text-font-dark" />
              </button>
            )}
            <NavLink to="/" onClick={() => setOpenSlips(false)}>
              <img
                src={logo}
                className={`h-9 cursor-pointer md:h-${
                  process.env.REACT_APP_LOGO_SIZE ?? 14
                }`}
              />
            </NavLink>
          </div>

          <div className="flex gap-x-2 md:flex-col">
            <div className="flex justify-end gap-x-3 md:hidden">
              {/* {window.innerWidth < MEDIA_SIZE_LG && ( */}
              {process.env.REACT_ENABLE_SLIP_NAV == 'true' && (
                <button
                  className=" relative flex h-8 items-center gap-x-1  px-2 py-1 text-center font-semibold text-font-light "
                  onClick={() => {
                    setOpenSlips(!openSlips);
                    // dispatch(
                    //   updateIsRightBarOpen({
                    //     isRightBarOpen: !isRightBarOpen,
                    //   })
                    // )
                  }}
                  title="slips"
                >
                  <RiFileListFill className="text-2xl text-active" />
                  {/* {slips[selectedSlip].length} */}
                  {(slips[selectedSlip]?.length > 0 ||
                    slips[1]?.length > 0 ||
                    slips[2]?.length > 0 ||
                    slips[3]?.length > 0) && (
                    <span className="absolute top-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-100 p-1 text-[10px] text-active-font ">
                      {slips[selectedSlip]?.length > 0
                        ? slips[selectedSlip]?.length
                        : slips[1]?.length > 0
                        ? slips['1']?.length
                        : slips[2]?.length > 0
                        ? slips['2']?.length
                        : slips[3]?.length > 0
                        ? slips['3']?.length
                        : ''}
                    </span>
                  )}
                  {/* )} */}
                </button>
              )}

              {/* Bottom Slip Drawer */}
              {process.env.REACT_ENABLE_SLIP_NAV == 'true' &&
                (slips[selectedSlip]?.length > 0 ||
                  slips[1]?.length > 0 ||
                  slips[2]?.length > 0 ||
                  slips[3]?.length > 0) && (
                  <button
                    className=" fixed bottom-0 right-0 left-0 z-10 flex h-8 items-center justify-between gap-x-3 bg-active  px-4 py-1 text-center font-semibold text-active-font "
                    onClick={() => {
                      setOpenSlips(!openSlips);
                    }}
                    title="slips"
                  >
                    <div className="flex gap-x-8">
                      <span className="text-sm uppercase  ">
                        {t('Odd') + ':  ' + getOdd()}
                      </span>
                      <span className="text-sm uppercase  ">
                        {t('NetPay') + ':  ' + payout}
                      </span>
                    </div>
                    <FaChevronUp
                      className={` ${
                        openSlips && ' rotate-180 '
                      }  duration-300 `}
                    />
                  </button>
                )}
            </div>

            {!isLoggedIn && (
              <button
                className="flex items-center justify-end gap-x-2 text-sm uppercase text-active md:hidden"
                onClick={() => setRegisterVisible(true)}
              >
                {/* <BsFillPersonPlusFill /> */}
                <span>{t(`Register`)}</span>
              </button>
            )}
            {!isLoggedIn && (
              <button
                className="flex items-center justify-end gap-x-2 text-sm uppercase text-secondary-font md:hidden"
                onClick={() => setLoginVisible(true)}
              >
                {/* <BsFillPersonPlusFill /> */}
                <span>{t(`Login`)}</span>
              </button>
            )}

            <div className="flex flex-col gap-y-1">
              <div
                className={`gap-2 text-center ${
                  windowWidth > MEDIA_SIZE_MD ? ' ' : 'hidden '
                }  flex w-full justify-start text-lg text-secondary-font`}
              >
                {i18n.resolvedLanguage == 'Am'
                  ? moment(new Date()).format('DD MM YY') //TODO: change to Geaz calender
                  : moment().format('DD/MM/YY')}
                :
                <Clock
                  format={'HH:mm:ss'}
                  ticking={true}
                  // timezone={'Africa/Addis_Ababa'}
                />
              </div>
              {!isLoggedIn && (
                <div className="flex items-center gap-2 ">
                  <div className=" hidden flex-col justify-end gap-y-2 md:flex">
                    <div className="hidden gap-x-2 md:flex">
                      {window.innerWidth < MEDIA_SIZE_LG && (
                        <button
                          className="hidden h-8 items-center gap-x-1 rounded bg-slip-icon px-4 py-1 text-center font-semibold text-slip-icon-font md:flex "
                          onClick={() =>
                            dispatch(
                              updateIsRightBarOpen({
                                isRightBarOpen: !isRightBarOpen,
                              })
                            )
                          }
                        >
                          {`${t('Slips')} (${slips[selectedSlip].length})`}
                        </button>
                      )}
                      <button
                        className="flex h-8 items-center gap-x-1 rounded bg-active px-4 py-1 text-center font-semibold text-active-font"
                        onClick={() => setRegisterVisible(true)}
                      >
                        {t(`Register`)}
                      </button>
                      <button
                        className="flex h-8 items-center gap-x-1 rounded bg-secondary-font px-4 py-1 text-center font-semibold text-secondary-button"
                        onClick={async () => setLoginVisible(true)}
                      >
                        {t(`Login`)}
                      </button>
                    </div>
                  </div>
                  {configurations.is_language_supported && (
                    <Dropdown
                      // placement="bottomRight"
                      arrow
                      overlay={menu}
                      className="m-0 flex h-fit shrink-0 items-center "
                    >
                      <a
                        className="ant-dropdown-NavLink flex gap-[1px]"
                        onClick={(e) => e.preventDefault()}
                      >
                        {i18n.resolvedLanguage == 'Am' ? (
                          <img
                            src={et_icon}
                            className=" h-7 w-8	 shrink-0 object-contain md:h-10 md:w-12"
                          />
                        ) : (
                          <img
                            src={uk_icon}
                            className=" h-7 w-8	 shrink-0 object-contain md:h-10 md:w-12"
                          />
                        )}{' '}
                        <Icon
                          className="headerRight"
                          type="down"
                          style={{ color: 'white' }}
                        />
                      </a>
                    </Dropdown>
                  )}
                </div>
              )}
            </div>

            {isLoggedIn && userDetail && (
              <div className="hidden flex-col md:flex">
                <div className="flex flex-col justify-end gap-y-2">
                  <div className="flex items-center gap-x-6">
                    {window.innerWidth < MEDIA_SIZE_LG && (
                      <button
                        className="hidden h-8 items-center gap-x-1 rounded bg-slip-icon px-4 py-1 text-center font-semibold text-slip-icon-font md:flex "
                        onClick={() => {
                          dispatch(
                            updateIsRightBarOpen({
                              isRightBarOpen: !isRightBarOpen,
                            })
                          );
                        }}
                      >
                        {`${t('Slips')} (${slips[selectedSlip].length})`}
                      </button>
                    )}
                    <div className="flex h-9 items-center gap-x-2 rounded bg-header-nav px-1.5 py-1 text-header-nav-font">
                      <button
                        onClick={() => setDepositVisible(true)}
                        className="m-0 flex h-7 w-fit cursor-pointer items-center justify-center gap-x-2 rounded bg-active px-2 text-xs leading-tight  text-active-font shadow-lg"
                      >
                        <span className="font-mono">{t(`Deposite`)}</span>
                      </button>
                      <div className="relative flex items-center">
                        <div className="flex  h-8 items-center justify-between gap-x-2">
                          <span>{t(configurations?.currency)}</span>
                          {visible ? (
                            <span className="font-mono">
                              {isBalanceValid() ? (
                                <span className="text-sm font-semibold ">
                                  {userDetail.member?.wallet?.balance
                                    ? userDetail.member.wallet.balance.toFixed(
                                        2
                                      )
                                    : '0.00'}
                                </span>
                              ) : (
                                <AiOutlineStop className="mb-1 " />
                              )}
                            </span>
                          ) : (
                            <span className="font-mono">******</span>
                          )}
                          <div
                            className="cursor-pointer"
                            onClick={() => setVisible(!visible)}
                          >
                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                          </div>
                          <div className="group flex">
                            <button
                              className="flex h-7  w-full cursor-pointer items-center justify-center rounded-full bg-active px-2 text-active-font"
                              // onClick={() => navigate('/profile')}
                            >
                              <FaUserAlt className="text-active-font" />
                            </button>

                            <ProfileMenu />
                          </div>
                        </div>
                      </div>
                    </div>
                    {configurations.is_language_supported && (
                      <Dropdown
                        placement="bottomRight"
                        arrow
                        overlay={menu}
                        className="m-0 flex h-fit shrink-0 items-center md:-ml-2"
                      >
                        <a
                          className="ant-dropdown-NavLink flex gap-[1px]"
                          onClick={(e) => e.preventDefault()}
                        >
                          {i18n.resolvedLanguage == 'Am' ? (
                            <img
                              src={et_icon}
                              className=" h-7 w-8	 shrink-0 object-contain md:h-10 md:w-12"
                            />
                          ) : (
                            <img
                              src={uk_icon}
                              className=" h-7 w-8	 shrink-0 object-contain md:h-10 md:w-12"
                            />
                          )}{' '}
                          <Icon
                            className="headerRight"
                            type="down"
                            style={{ color: 'white' }}
                          />
                        </a>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isLoggedIn && userDetail && (
              <div className="flex items-center gap-x-2 md:hidden">
                {window.innerWidth < MEDIA_SIZE_LG && (
                  <button
                    className="hidden h-8 items-center gap-x-1 rounded bg-slip-icon px-4 py-1 text-center font-semibold text-slip-icon-font md:flex "
                    onClick={() => {
                      dispatch(
                        updateIsRightBarOpen({
                          isRightBarOpen: !isRightBarOpen,
                        })
                      );
                    }}
                  >
                    {`${t('Slips')} (${slips[selectedSlip].length})`}
                  </button>
                )}

                <BottomSheet />

                <div className="group flex h-8 items-center justify-between gap-x-2  ">
                  <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-active text-2xl text-active-font shadow-lg">
                    <FaUserAlt className="text-sm" />
                  </div>

                  <ProfileMenu className="top-4 right-2 group-hover:top-8" />
                </div>
                {configurations.is_language_supported && (
                  <Dropdown
                    placement="bottomRight"
                    arrow
                    overlay={menu}
                    className="m-0 flex h-fit shrink-0 items-center md:mt-2"
                  >
                    <a
                      className="ant-dropdown-NavLink flex gap-[1px]"
                      onClick={(e) => e.preventDefault()}
                    >
                      {i18n.resolvedLanguage == 'Am' ? (
                        <img
                          src={et_icon}
                          className=" h-8 w-9	 shrink-0 object-contain md:h-10 md:w-12"
                        />
                      ) : (
                        <img
                          src={uk_icon}
                          className=" h-8 w-9	 shrink-0 object-contain md:h-10 md:w-12"
                        />
                      )}{' '}
                      <Icon
                        className="headerRight"
                        type="down"
                        style={{ color: 'white' }}
                      />
                    </a>
                  </Dropdown>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="scrollbar-hide hidden h-10 items-center justify-between overflow-x-auto bg-header-nav px-8 md:flex">
          <nav className="h-full text-header-nav-font">
            <ul className="item-center mb-0 flex h-full gap-x-6 text-header-nav-font">
              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to="/"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active "
                >
                  {({ isActive }) => (
                    <>
                      <MdSportsSoccer className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Sports`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to="/Virtual"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <FaDice className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex  min-w-fit shrink-0 items-center `
                        }
                      >
                        <span className="min-w-fit shrink-0">
                          {t(`VirtualGames`)}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>

              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to="/games-virtual/games/SPB-aviator/detail/"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiBoatPropeller className="shrink-0  text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Aviator`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to={KIRON_LITTE_LEAGUE_URL}
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiBoatPropeller className="shrink-0 text-header-nav-icon " />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit shrink-0 items-center`
                        }
                      >
                        <span className="min-w-fit shrink-0">
                          {`${configurations?.name ?? 'Fetan'} ${t(`League`)}`}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to="/games"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiCardKingDiamonds className="shrink-0 text-header-nav-icon " />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Games`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>

              <li className="flex h-full min-w-fit items-center">
                <NavLink
                  to="/jackpots"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiCash className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Jackpots`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li
                className={`${
                  windowWidth > MEDIA_SIZE_MD ? 'flex ' : 'hidden '
                } h-full min-w-fit items-center`}
              >
                <NavLink
                  to="/accumulator"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <BsStack className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Accumulator`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li
                className={`${
                  windowWidth > MEDIA_SIZE_MD ? 'flex ' : 'hidden '
                } h-full min-w-fit items-center`}
              >
                <NavLink
                  to="/trending"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <AiFillFire className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className="flex min-w-fit  shrink-0 capitalize">
                          {/* {t(configurations?.hot_now_label)} */}
                          {configurations?.hot_now_label ?? t('HotNow')}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>

              {(configurations.android_app_url ||
                configurations.ios_app_url) && (
                <li
                  className={`${
                    windowWidth > MEDIA_SIZE_MD ? 'flex ' : 'hidden '
                  } h-full min-w-fit items-center`}
                >
                  <NavLink
                    to="/apps"
                    className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                  >
                    {({ isActive }) => (
                      <>
                        <AiFillMobile className="shrink-0 text-header-nav-icon" />
                        <div
                          className={
                            (isActive ? 'border-b-2 border-nav-border' : '') +
                            ` flex min-w-fit items-center `
                          }
                        >
                          <span className="flex min-w-fit  shrink-0">
                            {t('Apps')}
                          </span>
                        </div>
                      </>
                    )}
                  </NavLink>
                </li>
              )}

              {/* TODO: enable with configuration */}
              {/* <li
                className={`${
                  windowWidth > MEDIA_SIZE_MD ? 'flex ' : 'hidden '
                } h-full items-center text-primary-200 `}
              >
                <NavLink
                  to="/apps"
                  className="flex h-full items-center gap-x-2 text-primary-200 focus:text-primary-200 active:text-primary-200"
                >
                  {({ isActive }) => (
                    <>
                      <FaMobileAlt className=" text-header-nav-icon"/>
                      <div
                        className={
                          (isActive
                            ? 'border-b-2 border-nav-border'
                            : '' )+ `flex h-full items-center `
                        }
                      >
                        <span>{t(`Apps`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li> */}
              <li
                className={`${
                  windowWidth > MEDIA_SIZE_MD ? 'flex ' : 'hidden '
                } h-full min-w-fit items-center `}
              >
                <NavLink
                  to="/promotion"
                  className="flex h-full min-w-fit items-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <BsFillPatchCheckFill className=" text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Promotions`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="group flex h-full items-center ">
                <div className="flex h-full cursor-pointer items-center gap-x-2 text-header-nav-font hover:text-active">
                  <MdMore className=" text-header-nav-icon" />
                  <div className="flex h-full items-center">
                    <span>{t(`More`)}</span>
                  </div>
                </div>
                <div
                  className={`group-hover:border-primary absolute top-28  z-50 h-0 w-56 overflow-hidden whitespace-pre rounded-b-md bg-drop-down-menu px-0 drop-shadow-lg group-hover:top-[136px] group-hover:h-fit group-hover:border-[1px] group-hover:py-2 group-hover:duration-500  `}
                >
                  <ul className="flex flex-col ">
                    {/* for small devices */}
                    <li
                      className={`w-full items-center gap-y-1 gap-x-2 px-2 py-1 ${
                        windowWidth > MEDIA_SIZE_MD ? 'hidden ' : 'flex '
                      } `}
                    >
                      <NavLink
                        to="/accumulator"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <BsStack />
                        <span className="w-full border-b-[1px] border-gray-600">
                          {t(`Accumulator`)}
                        </span>
                      </NavLink>{' '}
                    </li>
                    <li
                      className={`w-full items-center gap-y-1 gap-x-2 px-2 py-1 ${
                        windowWidth > MEDIA_SIZE_MD ? 'hidden ' : 'flex '
                      } `}
                    >
                      <NavLink
                        to="/trending"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <AiFillFire />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {configurations?.hot_now_label ?? t(`HotNow`)}
                        </span>
                      </NavLink>{' '}
                    </li>
                    {/* TODO: enable with configuration */}
                    {/* <li
                      className={`w-full items-center gap-y-1 gap-x-2 px-2 py-1 ${
                        windowWidth > MEDIA_SIZE_MD ? 'hidden ' : 'flex '
                      } `}
                    >
                      <NavLink
                        to="/apps"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <FaMobileAlt />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`Apps`)}
                        </span>
                      </NavLink>{' '}
                    </li> */}
                    <li
                      className={`flex w-full items-center gap-y-1 gap-x-2 px-2 py-1  ${
                        windowWidth > MEDIA_SIZE_MD ? 'hidden ' : 'flex '
                      }`}
                    >
                      <NavLink
                        to="/promotion"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <BsFillPatchCheckFill />
                        <span className="w-full truncate border-b-[1px] border-gray-600 ">
                          {t(`Promotions`)}
                        </span>
                      </NavLink>{' '}
                    </li>
                    {/* common */}
                    {/* <li className="flex w-full items-center gap-y-1  gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/chat"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-font-light'
                        }
                      >
                        <BiSupport />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`LiveChat`)}
                        </span>
                      </NavLink>{' '}
                    </li> */}
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/faq"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <BsQuestionCircleFill />
                        <span className="w-full truncate border-b-[1px] border-gray-600 ">
                          {t(`FAQ`)}
                        </span>
                      </NavLink>{' '}
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/rules"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <FaListAlt />
                        <span className="w-full truncate border-b-[1px] border-gray-600 ">
                          {t(`Howtoplay`)}
                        </span>
                      </NavLink>
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/privacy"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <MdPrivacyTip />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`PrivacyPolicy`)}
                        </span>
                      </NavLink>{' '}
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/terms"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <MdNoteAlt />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`Termsandconditions`)}
                        </span>
                      </NavLink>
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/responsible"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <MdNoteAlt />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`ResponsibleGaming`)}
                        </span>
                      </NavLink>
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/age"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <FaBaby />
                        <span className="w-full truncate border-b-[1px] border-gray-600">
                          {t(`underAgeRule`)}
                        </span>
                      </NavLink>
                    </li>
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 text-font-light ">
                      <NavLink
                        to="/about"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <FaInfoCircle />
                        <span className="w-full truncate border-b-[1px] border-gray-600 ">
                          {t(`About`)}
                        </span>
                      </NavLink>
                    </li>
                    {/* <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 ">
                      <NavLink
                        to="/contact"
                        className={
                          ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                        }
                      >
                        <MdLocalPostOffice />
                        <span className="w-full truncate border-b-[1px] border-gray-600 ">
                          {t(`ContactUs`)}
                        </span>
                      </NavLink>
                    </li> */}
                    <li className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 text-drop-down-menu-font">
                      {/* <NavLink
                        to="/"
                        className="flex h-full items-center gap-x-2 text-font-light"
                      > */}
                      <FaShareAlt />
                      <span className="w-full ">{t(`ContactUs`)} </span>
                      {/* </NavLink> */}
                    </li>
                    <li className="flex items-center gap-y-1 gap-x-2 px-2 py-1">
                      <span />
                      <div className="flex w-full justify-around gap-4 ">
                        {configurations.facebook && (
                          <a
                            href={configurations.facebook ?? ''}
                            target={'_blank'}
                            rel="noreferrer noopener"
                          >
                            <FacebookIcon
                              {...{
                                round: true,
                                size: 30,
                              }}
                            />
                          </a>
                        )}

                        {configurations.instagram && (
                          <a
                            href={configurations.instagram}
                            target={'_blank'}
                            className="flex  items-center"
                            rel="noreferrer noopener"
                          >
                            <SocialIcon
                              network="instagram"
                              url={configurations.instagram}
                              style={{ height: 29, width: 29 }}
                            />
                          </a>
                        )}
                        {configurations.twitter && (
                          <a
                            href={configurations.twitter}
                            target={'_blank'}
                            rel="noreferrer noopener"
                          >
                            <TwitterIcon
                              {...{
                                round: true,
                                size: 30,
                              }}
                            />
                          </a>
                        )}
                        {configurations.telegram && (
                          <a
                            href={configurations.telegram}
                            target={'_blank'}
                            rel="noreferrer noopener"
                          >
                            <TelegramIcon
                              {...{
                                round: true,
                                size: 30,
                              }}
                            />
                          </a>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
          <div className="group flex items-center gap-x-4">
            <button
              id="searchBtn"
              name="searchBtn"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
              className="group flex items-center  gap-1 text-font-dark hover:opacity-40"
            >
              {/* <span className="flex items-center text-xs text-gray-400">
                <BiCommand />K
              </span> */}
              <AiOutlineSearch />
              <span>{t(`search`)}</span>
            </button>
          </div>
          <div
            className={`${
              !open && ' w-0 duration-500'
            } absolute left-0 z-20 flex h-10 items-center bg-header-nav px-0 py-0 font-semibold drop-shadow-lg  group-hover:w-full group-hover:duration-500  ${
              open && 'w-full duration-500'
            } `}
          >
            {open && (
              <>
                <div className="item-center flex w-full flex-row justify-center">
                  <input
                    className="h-8 w-96 rounded-l-md bg-nav-search-input px-4 text-nav-search-input-font outline-none "
                    type="search"
                    name="search"
                    placeholder={t('SearchGames')}
                    id="searchField"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        search(searchValue);
                        setOpen((prev) => !prev);
                      }
                    }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      search(e.target.value);
                    }}
                  />
                  <button
                    id="searchBtn1"
                    name="searchBtn1"
                    className="flex h-8 items-center justify-end gap-1 rounded-r bg-nav-search-button px-2 text-nav-search-button-font hover:opacity-40"
                    onClick={() => {
                      search(searchValue);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <AiOutlineSearch className="" />
                    <span>{t(`search`)}</span>
                  </button>
                </div>
                <div
                  className="mr-6 flex cursor-pointer items-center justify-end gap-1 text-header-nav-font hover:opacity-40"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <AiOutlineClose />
                  <span className="text-semibold">{t(`Close`)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        {TEMPLATE == 'HULUSPORT' && (
          <hr className="h-[0.5px] border-none bg-green-200 md:hidden " />
        )}
        <div className="flex h-12 items-center justify-between overflow-x-auto overflow-y-hidden scroll-smooth bg-header-nav px-4 md:hidden">
          <nav className="h-full ">
            <ul className="item-center mb-0 flex h-full gap-x-6 pr-4 ">
              <li className="flex h-full min-w-fit items-center justify-center">
                <NavLink
                  to="/"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <MdSportsSoccer className=" shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className="">{t(`Sports`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center justify-center ">
                <NavLink
                  to="/Virtual"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <FaDice className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className="min-w-fit shrink-0">
                          {t(`VirtualGames`)}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>

              <li className="flex h-full min-w-fit items-center justify-center  ">
                <NavLink
                  to="/games-virtual/games/SPB-aviator/detail/"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiBoatPropeller className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Aviator`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              {/* <li className="flex h-full min-w-fit items-center ">
                <NavLink
                  to={KIRON_LITTE_LEAGUE_URL}
                  className="flex h-full min-w-fit flex-col items-center justify-center  gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiBoatPropeller className="shrink-0 text-header-nav-icon " />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>
                          {`${configurations?.name ?? 'Fetan'} ${t(`League`)}`}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li> */}

              <li className="flex h-full w-full min-w-fit items-center justify-center px-2 ">
                <NavLink
                  to="/games"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiCardKingDiamonds className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span>{t(`Games`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>

              <li className="flex h-full w-full min-w-fit items-center justify-center ">
                <NavLink
                  to="/jackpots"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <GiCash className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className=" ">{t(`Jackpots`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center  justify-center ">
                <NavLink
                  to="/accumulator"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <BsStack className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className=" ">{t(`Accumulator`)}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              <li className="flex h-full min-w-fit items-center justify-center  ">
                <NavLink
                  to="/trending"
                  className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                >
                  {({ isActive }) => (
                    <>
                      <AiFillFire className="shrink-0 text-header-nav-icon" />
                      <div
                        className={
                          (isActive ? 'border-b-2 border-nav-border' : '') +
                          ` flex min-w-fit items-center `
                        }
                      >
                        <span className="flex  min-w-fit shrink-0 truncate capitalize">
                          {configurations?.hot_now_label ?? t(`HotNow`)}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
              {(configurations.android_app_url ||
                configurations.ios_app_url) && (
                <li className="flex h-full min-w-fit items-center justify-center  ">
                  <NavLink
                    to="/apps"
                    className="flex h-full min-w-fit flex-col items-center justify-center gap-x-2 text-header-nav-font hover:text-active"
                  >
                    {({ isActive }) => (
                      <>
                        <AiFillMobile className="shrink-0 text-header-nav-icon" />
                        <div
                          className={
                            (isActive ? 'border-b-2 border-nav-border' : '') +
                            ` flex min-w-fit items-center `
                          }
                        >
                          <span className="flex  min-w-fit shrink-0 truncate">
                            {t('Apps')}
                          </span>
                        </div>
                      </>
                    )}
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
      {openMenu && <MobileMenu onClose={() => setOpenMenu(false)} />}
      {window.innerWidth < MEDIA_SIZE_LG && (
        <Drawer open={openSlips} onClose={() => setOpenSlips(!openSlips)}>
          <RightBar onClose={() => setOpenSlips(!openSlips)} />
        </Drawer>
      )}

      <Modal
        visible={depositVisible}
        onCancel={() => setDepositVisible(false)}
        onOk={() => setDepositVisible(false)}
      >
        <MobileDeposit />
      </Modal>

      <Modal
        visible={registerVisible}
        onCancel={() => setRegisterVisible(false)}
        onOk={() => setRegisterVisible(false)}
      >
        <Register
          login={() => {
            setRegisterVisible(false);
            setLoginVisible(true);
          }}
          openOTP={(phone, id) => {
            setRegisterVisible(false);
            setPhone(phone);
            if (configurations.registeration_conf_required) {
              setVisibleRegisterOTP(true);
              setUnverifiedRegisteredUser(id);
            } else {
              setLoginVisible(true);
            }
          }}
        />
      </Modal>

      <Modal
        visible={loginVisible}
        onCancel={() => setLoginVisible(false)}
        onOk={() => setLoginVisible(false)}
      >
        <div className="flex w-full flex-col md:w-80 md:max-w-lg">
          <div className="flex h-24 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-full flex-col items-start justify-center px-4">
            <h2 className="pt-2 text-lg font-semibold uppercase">
              {t('Login')}
            </h2>
          </div>
          <form>
            <div className="flex w-full flex-col flex-wrap justify-center gap-y-2 p-4">
              <div className="flex h-8 w-full text-xs">
                <div className="flex w-1/3 items-center  justify-between rounded-l bg-secondary-button px-1 text-center text-secondary-button-font">
                  <span>{configurations?.country}</span>
                  <span>+{configurations?.country_code}</span>
                </div>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="spin-button-none w-full rounded-r border-none bg-gray-200 px-2 py-1 pl-2 outline-none"
                  placeholder="Phone..."
                />
              </div>
              <div className="flex w-full flex-wrap justify-evenly gap-2">
                <Input.Password
                  placeholder="password..."
                  style={{ borderRadius: 5, outlineStyle: 'none' }}
                  onChange={(e) => setPassword(e.target.value)}
                  iconRender={(visible) =>
                    visible ? <AiFillEye /> : <AiFillEyeInvisible />
                  }
                />
              </div>
              <div className="flex w-full justify-end">
                <div className="cursor-pointer text-xs ">
                  <span
                    className=""
                    onClick={() => {
                      setLoginVisible(false);
                      setForgotPasswordVisible(true);
                    }}
                  >
                    {t(`forgotpassword`)}
                  </span>
                </div>
              </div>
              <div className=" flex flex-col items-center justify-center gap-y-2 gap-x-4">
                <button
                  className="flex h-9 w-full items-center justify-center gap-x-1 rounded bg-secondary-button py-2 px-4 text-center text-sm font-semibold uppercase text-secondary-button-font"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (phone == '')
                      return message.error(t('PhoneCannotBeEmpty'));
                    if (password == '')
                      return message.error(t('PasswordCannotBeEmpty'));
                    setLoginLoader(true);
                    if (
                      phone?.length < MIN_PHONE_LENGTH ||
                      phone?.length > MAX_PHONE_LENGTH
                    )
                      return message.error(t('phoneformatnotcorrect'));
                    const login_result = await login(phone, password);
                    if (typeof login_result == 'string') {
                      setUnverifiedRegisteredUser(login_result);
                      setVisibleRegisterOTP(true);
                    }
                    setLoginLoader(false);
                  }}
                >
                  {loginLoader && (
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
                  <span>{t(`Login`)}</span>
                </button>
                <button
                  className="flex h-9 w-full items-center justify-center gap-x-1 rounded bg-active py-2 px-4 text-center text-sm font-semibold uppercase text-active-font"
                  onClick={() => {
                    setLoginVisible(false);
                    setRegisterVisible(true);
                  }}
                >
                  {t(`Create`)}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        visible={newPasswordVisible}
        onCancel={() => setNewPasswordVisible(false)}
        onOk={() => setNewPasswordVisible(false)}
      >
        <NewPassword
          otp={otp}
          phone={phone}
          done={() => setNewPasswordVisible(false)}
        />
      </Modal>

      <Modal
        visible={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
        onOk={() => setForgotPasswordVisible(false)}
      >
        <ForgotPassword
          done={(phone) => {
            setForgotPasswordVisible(false);
            setOtpVisible(true);
            setPhone(phone);
          }}
        />
      </Modal>

      <Modal
        visible={otpVisible}
        onCancel={() => setOtpVisible(false)}
        onOk={() => setOtpVisible(false)}
      >
        <OTP
          phoneNumber={phone}
          done={(otp) => {
            if (otp) setNewPasswordVisible(true);
            setOtpVisible(false);
            setOtp(otp);
            otp && message.success(t('OTPValid'));
          }}
        />
      </Modal>

      <Modal
        visible={visibleRegisterOTP}
        onCancel={() => setVisibleRegisterOTP(false)}
        onOk={() => setVisibleRegisterOTP(false)}
      >
        <OTP
          phoneNumber={phone}
          done={(otp) => {
            setOtp(otp);
            setVisibleRegisterOTP(false);
            otp && message.success(t('OTPValid'));
          }}
          verifyRegisteredUser={UnverifiedregisteredUser}
        />
      </Modal>
    </>
  );
}

function ProfileMenu({ className = '' }) {
  const userDetail = useSelector((state) => state.user.userDetail);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const { logOut } = useUser();
  const { t } = useTranslation();

  const items = [
    {
      title: t('MyProfile'),
      icon: <FaUserAlt className="" />,
      action: '/profile',
      isPrivate: true,
    },
    {
      title: t('Wallet'),
      icon: <GiWallet className="" />,
      action: '/wallet',
      isPrivate: true,
    },
    {
      title: t('BetForMe'),
      icon: <FaWallet className="" />,
      action: '/betforme',
      isPrivate: true,
    },
    {
      title: t('ReferEarn'),
      icon: <FaSlideshare className="" />,
      action: '/refer',
      isPrivate: true,
    },
    {
      title: t('TransactionHistory'),
      icon: <FaExchangeAlt className="" />,
      action: '/transaction',
      isPrivate: true,
    },
    {
      title: t('Sports') + ' ' + t('History'),
      icon: <MdSportsSoccer className="" />,
      action: '/history',
      isPrivate: true,
    },
    {
      title: t('Jackpot') + ' ' + t('History'),
      icon: <AiFillDollarCircle className="" />,
      action: '/history/jackpot',
      isPrivate: true,
    },
  ];

  return (
    <div
      className={classNames(
        `absolute  right-1.5  top-0 z-50 h-0  w-40  overflow-hidden  whitespace-pre px-0 group-hover:top-4 group-hover:h-fit group-hover:py-2 group-hover:duration-500 `,
        className
      )}
    >
      <div className="py-3 ">
        <div className="absolute right-12 mt-2 h-3 w-3 rotate-45 bg-secondary-800 md:right-2 "></div>
      </div>
      <div className=" rounded-b-md  bg-drop-down-menu drop-shadow-lg">
        <ul className="m-0 flex flex-col">
          {items.map((item, key) => {
            if (item.isPrivate && !isLoggedIn) return;
            if (
              userDetail?.member?.member_type != 2 &&
              item.action == '/betforme'
            ) {
              return;
            }
            return (
              <li
                key={key}
                className="flex w-full items-center gap-y-1 gap-x-2 px-2 py-1 "
              >
                <NavLink
                  to={item.action}
                  className={
                    ' flex h-full w-full items-center gap-x-2 text-drop-down-menu-font'
                  }
                >
                  {item.icon}
                  <span className="w-full border-b-[1px] border-secondary-600">
                    {item.title}
                  </span>
                </NavLink>
              </li>
            );
          })}
          <li
            className="flex w-full cursor-pointer items-center gap-y-1 gap-x-2 px-2 py-1 text-drop-down-menu-font hover:text-sky-400/100"
            onClick={() => logOut()}
          >
            <MdLogout className="" />
            <span className="w-full ">{t(`Logout`)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
