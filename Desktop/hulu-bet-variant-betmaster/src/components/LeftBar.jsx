import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Favorite from './LeftBar/Favorite';
import TopLeagues from './LeftBar/TopLeagues';
import SportTypesLoader from './LoaderPages/SportTypesLoader';
import SportTypes from './SportTypes';
import { FaChevronDown, FaChevronLeft, FaChevronUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SportTypeOptions from './SportTypeOptions';
import { updateConfigurationsSportType } from '@ReduxStore/configurationSlice';
import { updateCountryCollapseKey } from '@ReduxStore/collapseSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import Utils from '@services/utils';
import API from '@services/API';
import { motion, AnimatePresence } from 'framer-motion';
import { MEDIA_SIZE_XL } from '@services/constants';
import SearchById from './SearchById';
import DownloadFixture from './DownloadFixture';

// const MEDIA_SIZE = 1264; //1264 1024
export default function LeftBar() {
  const [open, setOpen] = useState(true);
  const [openFloat, setOpenFloat] = useState(false);
  const [expand, setExpand] = useState(true);
  const [ticketNumber, setTicketNumber] = useState();

  const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const available_sport_types = useSelector(
    (state) => state.coreData.available_sport_types
  );

  const topBets = useSelector((state) => state.coreData.top_bets);
  const favGamesList = useSelector((state) => state.coreData.favGamesList);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < MEDIA_SIZE_XL) setOpen(false);
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < MEDIA_SIZE_XL) setOpen(false);
      // if (window.innerWidth > MEDIA_SIZE_XL && !open) setOpen(true);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  const changeColapseSportType = (st) => {
    if (sportTypeId == st.id && expand == true) {
      setExpand((expand) => !expand);
    } else if (sportTypeId == st.id && expand == false) {
      dispatch(updateConfigurationsSportType({ sportTypeId: st.id }));
      setExpand((expand) => !expand);
    } else if (sportTypeId != st.id && expand == false) {
      dispatch(updateConfigurationsSportType({ sportTypeId: st.id }));
      setExpand((expand) => !expand);
    } else {
      dispatch(updateConfigurationsSportType({ sportTypeId: st.id }));
    }
    dispatch(
      updateCountryCollapseKey({
        countryCollapseKey: st.id,
      })
    );
  };

  return (
    <div
      className={`${
        open && windowWidth > MEDIA_SIZE_XL ? 'w-[222px] ' : 'w-12 '
      } h-full gap-y-4 overflow-x-hidden bg-leftbar-container duration-500 hover:overflow-y-visible`}
    >
      <div className="z-10 mb-[1px] flex h-9 items-center justify-end bg-secondary-button ">
        {/* <h4 className="text-font-light">LeftBar </h4> */}
        <span
          className="flex  cursor-pointer pr-4 text-secondary-button-font"
          onClick={() => {
            if (window.innerWidth <= MEDIA_SIZE_XL) {
              setOpenFloat((prev) => !prev);
            } else setOpen((prev) => !prev);
          }}
        >
          <FaChevronLeft
            className={`${
              open && windowWidth > MEDIA_SIZE_XL
                ? ' '
                : 'rotate-180 duration-300 '
            }`}
          />
        </span>
      </div>
      {open && <SearchById />}
      {open && <DownloadFixture />}

      {open && favGamesList.length != 0 && (
        <Favorite open={open && windowWidth > MEDIA_SIZE_XL} />
      )}
      {open && topBets?.length > 0 && (
        <TopLeagues open={open && windowWidth > MEDIA_SIZE_XL} />
      )}

      {available_sport_types?.length > 0 ? (
        <SportTypes open={open} />
      ) : (
        <SportTypesLoader open={open && windowWidth > MEDIA_SIZE_XL} />
      )}
      <AnimatePresence>
        {window.innerWidth <= MEDIA_SIZE_XL && openFloat && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%', transition: { duration: 0.3 } }}
            transition={{ type: 'keyframes' }}
            className="absolute top-0 bottom-0 left-0 z-50 flex w-[222px] flex-col overflow-y-scroll bg-leftbar-container"
          >
            <div className="z-10 mb-[1px] flex h-9 shrink-0 items-center justify-end bg-container-header ">
              {/* <h4 className="text-font-light">LeftBar </h4> */}
              <span
                className="flex  cursor-pointer pr-4 text-secondary-button-font "
                onClick={() => setOpenFloat((prev) => !prev)}
              >
                <FaChevronLeft
                  className={`${openFloat ? ' ' : 'rotate-180 duration-300 '}`}
                />
              </span>
            </div>
            <SearchById />
            <DownloadFixture />
            {favGamesList.length != 0 && <Favorite open={openFloat} />}
            {topBets?.length > 0 && <TopLeagues open={openFloat} />}
            <div className=" flex h-9 shrink-0 items-center bg-leftbar-group-header pl-1 pt-4 pb-2 text-leftbar-group-header-font">
              <div className=" flex items-center gap-5 border-l-2  border-yellow-500  px-2">
                <div
                  className={`flex w-full whitespace-pre duration-500 ${
                    !openFloat && 'translate-x-28 overflow-hidden opacity-0'
                  }`}
                >
                  {t('Sports')}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[1px] bg-primary-700 ">
              {available_sport_types &&
                available_sport_types.map((st, key) => {
                  let label =
                    i18n.resolvedLanguage.toUpperCase() == 'AM' && st.locales[0]
                      ? st.locales[0].translation
                      : st.name;
                  let isActiveSport = sportTypeId == st.id;
                  let showCollapse = expand && sportTypeId == st.id;

                  return (
                    <div key={key} className="duration-500 ">
                      <div
                        className={` group flex h-8 cursor-pointer flex-row items-center justify-between px-3  ${
                          isActiveSport
                            ? 'bg-active text-active-font'
                            : 'bg-leftbar-group-sport text-leftbar-group-sport-font'
                        }`}
                        onClick={() => {
                          dispatch(
                            updateConfigurationsSportType({
                              sportTypeId: st.id,
                            })
                          );
                          navigate('/');
                        }}
                      >
                        <div className="flex flex-row items-center gap-1.5">
                          {st.logo ? (
                            <img
                              src={
                                Utils.validURL(st.logo)
                                  ? st.logo
                                  : new URL(st.logo, API.API_BASE_URL)
                              }
                              className={` group-hover:opacity-100 ${
                                openFloat ? 'h-4 w-4' : '  h-6 w-6'
                              } ${
                                isActiveSport ? ' opacity-100 ' : 'opacity-80'
                              }`}
                            />
                          ) : (
                            <div className=" h-4  w-4 rounded-full bg-gray-500" />
                          )}
                          <span
                            className={`whitespace-pre pl-2.5 duration-500 group-hover:opacity-100 ${
                              isActiveSport ? ' opacity-100 ' : 'opacity-80'
                            }  ${
                              !openFloat &&
                              'translate-x-28 overflow-hidden opacity-0'
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeColapseSportType(st);
                          }}
                          className={`whitespace-pre duration-500 ${
                            !openFloat &&
                            'translate-x-28 overflow-hidden opacity-0 '
                          }`}
                        >
                          {showCollapse ? (
                            <FaChevronUp className=" text-xs font-thin group-hover:block  " />
                          ) : (
                            <FaChevronDown className=" flex text-xs font-thin group-hover:flex md:hidden  " />
                          )}
                        </div>
                      </div>
                      {showCollapse && openFloat && (
                        <div className="bg-leftbar-country pl-4 pr-3 ">
                          <SportTypeOptions st={st} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
