import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Icon from '@ant-design/icons/lib/components/Icon';
import { Dropdown, Menu } from 'antd';
import {
  AiFillDollarCircle,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineCloseCircle,
  AiOutlineStop,
} from 'react-icons/ai';
import {
  MdLocalPostOffice,
  MdLogout,
  MdNoteAlt,
  MdOutlineArrowBackIosNew,
  MdOutlineClose,
  MdPrivacyTip,
  MdSportsSoccer,
} from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';

import en_icon from '@assets/img/en_icon.png';
import et_icon from '@assets/img/et_icon.png';
import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import { useUser } from '@hooks/useUser';

import { useTranslation } from 'react-i18next';
import { BiSupport } from 'react-icons/bi';
import { BsFillPatchCheckFill, BsQuestionCircleFill } from 'react-icons/bs';
import {
  FaClipboardList,
  FaExchangeAlt,
  FaHandshake,
  FaSlideshare,
  FaUserAlt,
  FaWallet,
} from 'react-icons/fa';
import { GiWallet } from 'react-icons/gi';

export default function MoreMenu({ onClose }) {
  const [open, setOpen] = useState(false);
  // const [lang, setLang] = useState('Am');
  const [visible, setVisible] = useState(false);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userDetail = useSelector((state) => state.user.userDetail);
  const { login, logOut, getProfile, changeLoginStatus, isBalanceValid } =
    useUser();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const changeLang = (lg) => {
    i18n.changeLanguage(lg);
    // ClientSession.storeLang(lg, () => null);
  };

  const downArrow = () => (
    <svg
      className={` text-primary h-4 w-4 origin-center -rotate-90 transform font-semibold duration-500`}
      viewBox="0 0 16.858 9.639"
    >
      <path
        id="Icon_ionic-ios-arrow-forward"
        data-name="Icon ionic-ios-arrow-forward"
        d="M17.98,14.622,11.6,8.248a1.2,1.2,0,0,1,0-1.7,1.215,1.215,0,0,1,1.706,0l7.228,7.222a1.2,1.2,0,0,1,.035,1.661L13.312,22.7A1.2,1.2,0,0,1,11.605,21Z"
        transform="translate(23.054 -11.247) rotate(90)"
        fill="#4cae4e"
      />
    </svg>
  );

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          // setLang('Am');
          changeLang('Am');
        }}
      >
        <img src={et_icon} width="32px" height="32px" /> አማርኛ
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          // setLang('En');
          changeLang('En');
        }}
      >
        <img src={en_icon} width="32px" height="32px" /> English
      </Menu.Item>
    </Menu>
  );

  const MenuItems = [
    {
      items: [
        {
          title: t('MyProfile'),
          icon: <FaUserAlt className="text-primary" />,
          action: '/profile',
          isPrivate: true,
        },
      ],
    },
    {
      items: [
        {
          title: t('Wallet'),
          icon: <GiWallet className="text-primary" />,
          action: '/wallet',
          isPrivate: true,
        },
        {
          title: t('BetForMe'),
          icon: <FaWallet className="text-primary" />,
          action: '/betforme',
          isPrivate: true,
        },
        {
          title: t('ReferEarn'),
          icon: <FaSlideshare className="text-primary" />,
          action: '/refer',
          isPrivate: true,
        },
        {
          title: t('TransactionHistory'),
          icon: <FaExchangeAlt className="text-primary" />,
          action: '/transaction',
          isPrivate: true,
        },
        {
          title: t('Sports') + ' ' + t('History'),
          icon: <MdSportsSoccer className="text-primary" />,
          action: '/history',
          isPrivate: true,
        },
        {
          title: t('Jackpot') + ' ' + t('History'),
          icon: <AiFillDollarCircle className="text-primary" />,
          action: '/history/jackpot',
          isPrivate: true,
        },
      ],
    },
    {
      items: [
        {
          title: t('Promotions'),
          icon: <BsFillPatchCheckFill className="text-primary" />,
          action: '/promotion',
          isPrivate: false,
        },
        {
          title: t('Partners'),
          icon: <FaHandshake className="text-primary" />,
          action: '/partners',
          isPrivate: false,
        },
      ],
    },
    {
      items: [
        {
          title: t('PrivacyPolicy'),
          icon: <MdPrivacyTip className="text-primary" />,
          action: '/privacy',
          isPrivate: false,
        },
        {
          title: t('TermsandConditions'),
          icon: <FaClipboardList className="text-primary" />,
          action: '/terms',
          isPrivate: false,
        },
      ],
    },
  ];

  return (
    <div
      className={`fixed inset-0 top-0 left-0 flex h-screen w-screen bg-white pb-12  duration-500 ${
        !open ? '-left-[900px]' : 'left-0'
      }`}
    >
      <div className="relative flex  h-full w-full flex-col overflow-y-auto pb-1 ">
        <div className="sticky top-0 z-50 flex w-full shrink-0 flex-col items-center ">
          <div className="flex h-16 w-full items-center justify-between bg-primary-700 px-4">
            <div
              className=" cursor-pointer "
              onClick={() => {
                setOpen(false);
                navigate('/');
                setTimeout(onClose, 1000);
              }}
            >
              <img src={logo} className="h-10 cursor-pointer" />
            </div>
            <div className="flex items-center gap-x-1 overflow-hidden">
              {isLoggedIn && (
                <div className="text-primary flex h-7 w-40 items-center justify-between gap-x-2 rounded bg-white pr-2  text-xs">
                  <span className="ml-6 ">ETB</span>
                  {visible ? (
                    <span className="font-mono">
                      {isBalanceValid() ? (
                        <span className="text-2xl font-semibold ">
                          {userDetail.member?.wallet?.balance
                            ? userDetail.member.wallet.balance.toFixed(2)
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
                </div>
              )}
              <Dropdown
                placement="bottomRight"
                arrow
                overlay={menu}
                className="m-0 flex items-center"
              >
                <a
                  className="ant-dropdown-NavLink text-white"
                  onClick={(e) => e.preventDefault()}
                >
                  {/* {i18n.resolvedLanguage == 'Am' ? 'ኣማ' : 'En'} */}
                  <img
                    src={i18n.resolvedLanguage == 'Am' ? et_icon : en_icon}
                    className="h-9"
                  />
                  <Icon
                    className="headerRight"
                    type="down"
                    style={{ color: 'white' }}
                  />
                </a>
              </Dropdown>
            </div>
          </div>
          <div className="flex h-10 w-full shrink-0  items-center justify-between bg-secondary-900 px-2 ">
            <span
              className="flex h-full  cursor-pointer items-center justify-center text-white "
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            >
              <MdOutlineArrowBackIosNew className="flex text-lg font-bold text-white" />
              {t('back')}
            </span>
            {/* <span></span> */}
            <AiOutlineCloseCircle
              className=" cursor-pointer  text-xl text-red-500 duration-200 hover:text-red-700"
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          {isLoggedIn && (
            <div
              className="flex h-24  w-full items-center gap-y-1 gap-x-2 bg-white px-2 py-1 "
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            >
              <NavLink
                to="/profile"
                className={
                  'flex h-full w-full items-center justify-between gap-x-2 px-2 text-xl text-black hover:text-secondary-200'
                }
              >
                <div className="flex items-center  gap-x-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-700 uppercase ">
                    <span className="text-xl uppercase text-white ">
                      {(userDetail?.first_name
                        ? userDetail?.first_name[0]
                        : '') +
                        (userDetail?.last_name ? userDetail?.last_name[0] : '')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-0.5 text-sm">
                    <span className="w-full font-semibold capitalize">
                      {userDetail.first_name + ' ' + userDetail.last_name}
                    </span>
                    <span className="w-full">+{userDetail.username}</span>
                  </div>
                </div>
                <span className=" text-black">{downArrow()}</span>
              </NavLink>
            </div>
          )}
          {MenuItems.map((menu, i) => {
            return (
              <ul key={i} className="m-0 flex flex-col gap-y-[1px] bg-gray-400">
                {menu?.items?.map((item, index) => {
                  if (item.isPrivate && !isLoggedIn) return;
                  if (
                    userDetail?.member?.member_type != 2 &&
                    item.action == '/betforme'
                  ) {
                    return;
                  }
                  return (
                    <li
                      key={index}
                      className="flex h-16 w-full items-center gap-y-1 gap-x-2 bg-[#e4ebe4] px-2 py-1 "
                      onClick={() => {
                        setOpen(false);
                        setTimeout(onClose, 1000);
                      }}
                    >
                      <NavLink
                        to={item.action}
                        className={
                          'flex h-full w-full items-center justify-between gap-x-2 px-2 text-xl text-black'
                        }
                      >
                        <div className="flex items-center  gap-x-3">
                          {item.icon}
                          <span className="w-full">{item.title}</span>
                        </div>
                        <span className=" text-black">{downArrow()}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            );
          })}
          {isLoggedIn && (
            <div
              className="flex h-16 w-full items-center gap-y-1 gap-x-3 bg-[#e4ebe4] px-4 py-1 text-xl"
              onClick={() => {
                logOut();
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            >
              <MdLogout className="text-primary" />
              <span className="w-full  text-black">{t('Logout')} </span>
            </div>
          )}
        </div>

        <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden "></div>
      </div>
    </div>
  );
}
