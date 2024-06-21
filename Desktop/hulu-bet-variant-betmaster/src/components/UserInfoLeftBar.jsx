import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useUser } from '@hooks/useUser';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  FaUserAlt,
  FaHistory,
  FaWallet,
  FaExchangeAlt,
  FaChevronLeft,
} from 'react-icons/fa';
import { MdLogout, MdSportsSoccer } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillDollarCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { MEDIA_SIZE } from '@services/constants';
// const MEDIA_SIZE = 1264; //1264 1024
export default function UserInfoLeftBar(props) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { logOut } = useUser();
  const userDetail = useSelector((state) => state.user.userDetail);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  const [expand, setExpand] = useState(true);

  const changeColapseSportType = (item) => {
    if (selected == item.id && expand == true) {
      setExpand((expand) => !expand);
    } else if (selected == item.id && expand == false) {
      setSelected(item.id);
      setExpand((expand) => !expand);
    } else if (selected != item.id && expand == false) {
      setSelected(item.id);
      setExpand((expand) => !expand);
    } else {
      setSelected(item.id);
    }
  };

  const subMenuRender = (subMenu) => {
    return subMenu.map((p, i) => {
      if (userDetail?.member?.member_type != 2 && p.url == '/betforme') return;
      return (
        <div
          key={'gameList' + i}
          className=" bg-leftbar-group-items text-font-light "
        >
          <NavLink to={p.url}>
            <div className="flex h-10 shrink-0 cursor-pointer flex-row items-center justify-between px-4  ">
              <div className="flex flex-row items-center gap-2 text-leftbar-group-items-font">
                <div span={3}>{p.icon}</div>
                <div className="flex items-center justify-between">
                  {p.name}
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      );
    });
  };

  const Menu = [
    {
      name: t('MyProfile'),
      id: 1,
      icon: <FaUserAlt />,
      url: '/profile',
      subMenu: [
        {
          name: t('Profile'),
          icon: <FaUserAlt />,
          url: '/profile',
        },
        {
          name: t('ReferalInfo'),
          icon: <FaExchangeAlt />,
          url: '/refer',
        },
      ],
    },
    {
      name: t('Wallet'),
      id: 2,
      icon: <FaWallet />,
      subMenu: [
        {
          name: t('Balance'),
          icon: <FaWallet />,
          url: '/wallet',
        },
        {
          name: t('BetForMe'),
          icon: <FaWallet />,
          url: '/betforme',
        },
        {
          name: t('TransactionHistory'),
          icon: <FaExchangeAlt />,
          url: '/transaction',
        },
      ],
    },
    {
      name: t('History'),
      id: 3,
      icon: <FaHistory />,
      subMenu: [
        { name: t('Sports'), icon: <MdSportsSoccer />, url: '/history' },
        {
          name: t('Jackpot'),
          icon: <AiFillDollarCircle />,
          url: '/history/jackpot',
        },
      ],
    },
  ];

  const isOpen = open && windowWidth > MEDIA_SIZE;

  return (
    <div
      className={`${
        isOpen ? 'w-64 ' : 'w-12 '
      } relative gap-y-4 overflow-hidden duration-500 hover:overflow-visible`}
    >
      <div className="mb-[1px] flex h-9 items-center justify-end bg-secondary-button">
        <span
          className="flex  cursor-pointer pr-4 text-secondary-button-font"
          onClick={() => setOpen((prev) => !prev)}
        >
          {/* {isOpen ? '‹‹ Hide ' : '››'} */}
          <FaChevronLeft
            className={`${isOpen ? ' ' : 'rotate-180'}  duration-300`}
          />
        </span>
      </div>

      <div className="flex flex-col gap-[1px]">
        {Menu.map((item, kk) => {
          return (
            <div key={kk} className=" flex flex-col duration-500">
              <div
                className=" group flex h-9 cursor-pointer flex-row items-center justify-between bg-header-nav pl-4 "
                onClick={() => {
                  if (item.subMenu && item.subMenu.length != 0)
                    changeColapseSportType(item);
                  else navigate(item.url);
                }}
              >
                <div className="flex flex-row items-center gap-1 text-font-dark hover:opacity-50 group-hover:opacity-50">
                  {item.icon}
                  <strong
                    className={`whitespace-pre text-font-dark  duration-500 ${
                      !isOpen && 'translate-x-28 overflow-hidden opacity-0'
                    }`}
                    style={{ paddingLeft: '10px' }}
                  >
                    {item.name}
                  </strong>
                </div>

                {item.subMenu && item.subMenu.length != 0 && (
                  <div
                    className={`whitespace-pre duration-500 ${
                      !isOpen && 'translate-x-28 overflow-hidden opacity-0 '
                    }`}
                  >
                    {expand && selected === item.id ? (
                      <MinusOutlined
                        className="fill-white pr-4 text-font-dark hover:opacity-50 group-hover:opacity-50 "
                        style={{
                          color: 'white',
                        }}
                      />
                    ) : (
                      <PlusOutlined
                        style={{
                          color: 'white',
                        }}
                        className="fill-white pr-4 text-font-dark hover:opacity-50 group-hover:opacity-50 "
                      />
                    )}
                  </div>
                )}
                {item.subMenu && item.subMenu.length != 0 && (
                  <div
                    className={`${
                      isOpen && 'hidden'
                    } absolute left-14 z-50 w-0 overflow-hidden whitespace-pre rounded-md bg-secondary-800 px-0 py-0 font-semibold drop-shadow-lg group-hover:left-[50px] group-hover:w-64 group-hover:duration-500  `}
                  >
                    {subMenuRender(item.subMenu)}
                  </div>
                )}
              </div>
              {expand && selected == item.id && isOpen && (
                <div className="flex flex-col gap-[1px] bg-secondary-600">
                  {subMenuRender(item.subMenu)}
                </div>
              )}
            </div>
          );
        })}
        <div className=" duration-500">
          <div
            className=" group flex h-9 cursor-pointer flex-row items-center justify-between bg-secondary-button pl-4 "
            onClick={() => {
              // logout
            }}
          >
            <div
              className="flex flex-row items-center gap-1 text-secondary-button-font hover:opacity-50"
              onClick={() => logOut()}
            >
              <MdLogout className="text-l" />
              <strong
                className={`whitespace-pre  duration-500 ${
                  !isOpen && 'translate-x-28 overflow-hidden opacity-0'
                }`}
                style={{ paddingLeft: '10px' }}
              >
                {t('Logout')}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
