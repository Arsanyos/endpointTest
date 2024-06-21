import React from 'react';
import { useSelector } from 'react-redux';
import TopLeagues from '@components/LeftBar/TopLeagues';
import SportTypes from './SportTypes';
import Favorite from '@components/LeftBar/Favorite';
import SportTypesLoader from '@components/LoaderPages/SportTypesLoader';
import { MdOutlineArrowBackIosNew, MdOutlineClose } from 'react-icons/md';
import { useState, useEffect } from 'react';
// import logo from '@assets/logo.svg';
import logo from '@assets/logo.png';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import SearchById from './SearchById';
import DownloadFixture from './DownloadFixture';

export default function MobileMenu({ onClose }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const available_sport_types = useSelector(
    (state) => state.coreData.available_sport_types
  );

  useEffect(() => {
    setOpen(true);
  }, []);
  const favGamesList = useSelector((state) => state.coreData.favGamesList);
  const topBets = useSelector((state) => state.coreData.top_bets);
  return (
    <div
      className={`fixed inset-0 top-0 left-0 z-50 flex h-screen w-screen bg-primary-700  duration-500 ${
        !open ? '-left-[900px]' : 'left-0'
      }`}
    >
      <div className="relative flex  h-full w-full flex-col overflow-y-auto pb-1 ">
        <div className="h-16 w-full shrink-0 items-center bg-header  px-4">
          <div className="flex h-full w-full items-center justify-between ">
            <button
              className="flex items-center justify-center"
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            >
              <MdOutlineClose className="text-2xl text-mute" />
            </button>

            <div
              className=" cursor-pointer "
              onClick={() => {
                setOpen(false);
                navigate('/');
                setTimeout(onClose, 1000);
              }}
            >
              <img src={logo} className="h-8 cursor-pointer" />
            </div>
          </div>
        </div>
        {/* <div className="flex h-10 w-full shrink-0  items-center justify-between gap-1 bg-secondary-900 px-4 ">
          <span
            className="flex h-full cursor-pointer items-center justify-center gap-1 "
            onClick={() => {
              setOpen(false);
              setTimeout(onClose, 1000);
            }}
          >
            <MdOutlineArrowBackIosNew className="text-lg font-bold text-white" />
            {t('back')}
          </span>
          <div>
            <AiOutlineCloseCircle
              className=" cursor-pointer  text-xl text-red-500 duration-200 hover:text-red-700"
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            />
          </div>
        </div> */}
        <div className="flex w-full flex-col overflow-y-auto overflow-x-hidden ">
          <div className="flex w-full flex-col bg-leftbar-group-items">
            <SearchById
              onClose={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            />
            <DownloadFixture />
          </div>
          {favGamesList.length != 0 && (
            <Favorite open={true} onClose={onClose} />
          )}
          {topBets?.length > 0 && <TopLeagues open={true} onClose={onClose} />}
          {/* <SportTypes open={true} /> */}
          {available_sport_types?.length > 0 ? (
            <SportTypes open={true} onClose={onClose} />
          ) : (
            <SportTypesLoader open={true} />
          )}
        </div>
      </div>
    </div>
  );
}
