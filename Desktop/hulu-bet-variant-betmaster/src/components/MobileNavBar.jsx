import { useEvent } from '@hooks/useEvent';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsSearch } from 'react-icons/bs';
import { FaMobileAlt, FaTicketAlt } from 'react-icons/fa';
import { MdMoreHoriz } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import MobileSearch from './MobileSearch';
import MoreMenu from './MoreMenu';
const SportICon = () => (
  <svg
    version="1.1"
    className="h-7 w-7 text-xl text-white"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 700 700"
  >
    <g>
      <path
        fill="#FFFFFF"
        d="M445.4,176.6c0-14.4-7.7-27.7-20.1-34.9c-12.5-7.2-27.8-7.2-40.3,0c-12.5,7.2-20.1,20.5-20.1,34.9
    s7.7,27.7,20.1,34.9c12.5,7.2,27.8,7.2,40.3,0C437.7,204.3,445.4,191,445.4,176.6z"
      />
      <path
        fill="#FFFFFF"
        d="M444,260.4c25.8,14.5,44.7,38.8,52.4,67.5c7.7,28.6,3.5,59.1-11.7,84.6c-3.9,6.6-11,10.6-18.7,10.5
    c-7.6-0.1-14.7-4.3-18.4-10.9c-3.7-6.7-3.6-14.8,0.3-21.4c8.7-14.6,11.5-32.1,7.9-48.7c-3.6-16.6-13.5-31.3-27.5-41
    c-0.9-0.6-2-0.8-3-0.5s-1.9,1-2.4,1.9L269.9,602.7c-4,7.7-11.8,12.7-20.5,13.2c-8.7,0.4-16.9-3.8-21.7-11.1
    c-4.7-7.3-5.3-16.5-1.4-24.3L305,426.2v0c2.3-4.6,0.5-10.1-4-12.5c-4.6-2.3-10.1-0.5-12.5,4l-51.5,101c-4,7.7-11.8,12.7-20.5,13.2
    c-8.7,0.4-16.9-3.8-21.7-11.1c-4.8-7.3-5.3-16.5-1.4-24.3l112.9-221.5c0.6-1.2,0.5-2.5-0.2-3.6c-0.7-1.1-1.9-1.7-3.2-1.7l-81.6,2.6
    c-7.6,0.2-14.8-3.6-18.9-10.1c-4-6.5-4.3-14.6-0.7-21.4c3.6-6.7,10.5-11,18.2-11.3l143.2-4.5v0c11.1-0.4,22.1,2.3,31.9,7.8
    L444,260.4z"
      />
      <path
        fill="#FFFFFF"
        d="M195.1,607.5c0-15.1-8-29-21.1-36.5c-13.1-7.5-29.1-7.5-42.2,0c-13.1,7.5-21.1,21.5-21.1,36.5
    c0,15.1,8,29,21.1,36.5c13.1,7.5,29.1,7.5,42.2,0C187.1,636.5,195.1,622.6,195.1,607.5L195.1,607.5z"
      />
    </g>
  </svg>
);
export default function MobileNavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [openSlip, setOpenSlip] = useState(false);
  const { getSummary } = useEvent();

  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const [expand, setExpand] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [odd, setOdd] = useState('');
  const [payout, setPayout] = useState('');

  const stake = useSelector((state) => state.slip.stake);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const changeCollapseFAQ = (id) => {
    if (selectedItem == id && expand == true) {
      setExpand((expand) => !expand);
    } else if (selectedItem == id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else if (selectedItem != id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else {
      setSelectedItem(id);
    }
  };

  const menu = [
    {
      id: 1,
      title: 'Menu',
      icon: `icon`,
    },
    {
      id: 2,
      title: 'Result',
      icon: `icon`,
    },
    {
      id: 3,
      title: 'Slip',
      icon: `icon`,
    },
    {
      id: 4,
      title: 'More',
      icon: `icon`,
    },
  ];

  React.useEffect(() => {
    location.pathname == '/slips' ? setOpenSlip(true) : setOpenSlip(false);
  }, []);

  useEffect(() => {
    getSlipSummary(stake[selectedSlip], slips[selectedSlip]);
  }, [slips]);

  const getSlipSummary = async (stake, slipsData) => {
    const slip_summery = await getSummary(stake, slipsData);
    setPayout(slip_summery.netWin);
    let total_odd = getOdd();
    setOdd(total_odd);
    // setbonusMsg(slip_summery.bonusMsg);
    // setBonusPercent(slip_summery.percentage);
  };
  const getOdd = () => {
    var odd = slips[selectedSlip].length == 0 ? 0 : 1;
    slips[selectedSlip].forEach((s) => {
      odd = odd * s.odd;
    });

    return odd.toFixed(2);
  };

  return (
    <div className="fixed inset-x-0 left-0 -bottom-[2px] z-50 block w-screen items-center justify-center overflow-hidden border-t-[0.002em] border-primary/50 bg-secondary-900 text-white shadow-lg md:hidden ">
      {/* <nav> */}
      {slips[selectedSlip]?.length > 0 && location.pathname != '/slips' && (
        <div className="relative z-50 flex h-5 items-center justify-between bg-primary-700 py-1 px-2">
          <span className="text-sm uppercase text-white ">
            {t('Odd') + ': ' + odd}
          </span>
          {payout && (
            <span className="text-sm uppercase text-white ">
              {t('NetPay') + ': ' + payout + ' ' + t(configurations?.currency)}
            </span>
          )}
        </div>
      )}
      <ul className="relative z-50 m-0 flex h-[50px] items-center justify-center bg-secondary-900 ">
        <li
          className="flex h-full flex-1  items-center justify-center pt-1 pb-2 hover:cursor-pointer "
          onClick={() => {
            setOpenMenu(!openMenu);
            setOpenMore(false);
            setOpenSearch(false);
            setOpenSlip(false);
          }}
        >
          {/* <div className="flex  flex-col items-center justify-center font-thin "> */}
          {/* <MdSportsSoccer className="text-2xl" /> */}
          {/* {<SportICon />} */}
          {/* <span>{t('Sports')}</span> */}
          {/* </div> */}
          {/* INFO: legacy look */}
          <div className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-red-600 ">
            {<SportICon />}
          </div>
        </li>
        <li
          className="flex h-full flex-1  items-center justify-center pt-1 pb-2 hover:cursor-pointer hover:bg-green-600 "
          onClick={() => {
            setOpenSearch(!openSearch);
            setOpenMenu(false);
            setOpenMore(false);
            setOpenSlip(false);
          }}
        >
          <div className="flex  flex-col items-center justify-center font-thin ">
            <BsSearch className="text-xl" />
            <span>{t('search')}</span>
          </div>
        </li>

        <li
          className={`relative flex h-full flex-1 flex-col  items-center justify-center pt-1 pb-2 hover:cursor-pointer ${
            location.pathname == '/slips' &&
            !openSearch &&
            !openMenu &&
            !openMore
              ? 'bg-green-600'
              : ''
          } `}
          onClick={() => {
            location.pathname == '/slips' ? navigate(-1) : navigate(`/slips`);
            setOpenSlip(!openSlip);
            setOpenMenu(false);
            setOpenMore(false);
            setOpenSearch(false);
          }}
        >
          <div
            className={`flex h-full w-full flex-1 items-center justify-center gap-x-2 text-white`}
          >
            <div className="flex  flex-col items-center justify-center ">
              {(slips[selectedSlip]?.length > 0 ||
                slips[1]?.length > 0 ||
                slips[2]?.length > 0 ||
                slips[3]?.length > 0) && (
                <span className="absolute top-0 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white ">
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
              <FaTicketAlt className="text-xl" />
              <span className="font-thin">
                {t('Slip')}{' '}
                {slips[selectedSlip]?.length > 0
                  ? selectedSlip
                  : slips[1]?.length > 0
                  ? '1'
                  : slips[2]?.length > 0
                  ? '2'
                  : slips[3]?.length > 0
                  ? '3'
                  : ''}
              </span>
            </div>
          </div>
        </li>
        {(configurations.android_app_url || configurations.ios_app_url) && (
          <li
            className={`flex h-full flex-1  items-center justify-center pt-1 pb-2 hover:cursor-pointer ${
              location.pathname == '/apps' &&
              !openSearch &&
              !openMenu &&
              !openMore
                ? 'bg-green-600'
                : ''
            } `}
            onClick={() => {
              setOpenMenu(false);
              setOpenMore(false);
              setOpenSearch(false);
              setOpenSlip(false);
            }}
          >
            <NavLink
              to="/apps"
              className="flex h-full w-full flex-1 items-center justify-center gap-x-2 text-white hover:text-white"
            >
              <div className="flex  flex-col items-center justify-center font-thin ">
                <FaMobileAlt className="text-xl" />
                <span>{t('Apps')}</span>
              </div>
            </NavLink>
          </li>
        )}
        <li
          className={`flex h-full flex-1 items-center  justify-center pt-1 pb-2 hover:cursor-pointer ${
            openMore ? 'bg-green-600' : ''
          }`}
          onClick={() => {
            setOpenMore(!openMore);
            setOpenMenu(false);
            setOpenSearch(false);
            setOpenSlip(false);
          }}
        >
          <div className="flex flex-col items-center justify-center  font-thin ">
            <MdMoreHoriz className="text-xl" />
            <span>{t('More')}</span>
          </div>
        </li>
      </ul>
      {/* </nav> */}
      {openMenu && <MobileMenu onClose={() => setOpenMenu(false)} />}
      {openMore && <MoreMenu onClose={() => setOpenMore(false)} />}
      {openSearch && <MobileSearch onClose={() => setOpenSearch(false)} />}
    </div>
  );
}
