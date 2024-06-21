import React, { useState } from 'react';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import API from '../services/API';
import Utils from '../services/utils';
import { updateConfigurationsSportType } from '../store/configurationSlice';
import SportTypeOptions from './SportTypeOptions';
import { updateCountryCollapseKey } from '@ReduxStore/collapseSlice';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  MEDIA_SIZE_XL,
  MEDIA_SIZE_SM,
  MEDIA_SIZE_MD,
  MEDIA_SIZE_LG,
} from '@services/constants';
// const MEDIA_SIZE = 1264; //1264 1024
// const SMALL_MEDIA_SIZE = 768; //1264 1024
export default function SportTypes({ open, onClose }) {
  const [expand, setExpand] = useState(true);

  const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const available_sport_types = useSelector(
    (state) => state.coreData.available_sport_types
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

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
    <>
      {open && (
        <div className=" flex h-9 shrink-0 items-center bg-leftbar-group-header pl-1 pt-4 pb-2 text-leftbar-group-header-font">
          <div className=" flex items-center gap-5 border-l-2  border-yellow-500  px-2">
            <div
              className={`flex w-full whitespace-pre duration-500 ${
                !open && 'translate-x-28 overflow-hidden opacity-0'
              }`}
            >
              {t('Sports')}
            </div>
          </div>
        </div>
      )}
      {(window.innerWidth > MEDIA_SIZE_XL ||
        (open && window.innerWidth <= MEDIA_SIZE_LG)) && (
        <div className="flex flex-col gap-[1px] divide-y-[1px] bg-primary-700 ">
          {available_sport_types &&
            available_sport_types.map((st, key) => {
              // console.log(st);
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
                      if (onClose) onClose();
                      // changeColapseSportType(st);
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
                            open ? 'h-4 w-4' : '  h-6 w-6'
                          } ${isActiveSport ? ' opacity-100 ' : 'opacity-80'}`}
                        />
                      ) : (
                        <div className=" h-4  w-4 rounded-full bg-gray-500" />
                      )}
                      <span
                        className={`whitespace-pre pl-2.5 duration-500 group-hover:opacity-100 ${
                          isActiveSport ? ' opacity-100 ' : 'opacity-80'
                        }  ${
                          !open && 'translate-x-28 overflow-hidden opacity-0'
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
                        !open && 'translate-x-28 overflow-hidden opacity-0 '
                      }`}
                    >
                      {showCollapse ? (
                        <FaChevronUp className=" text-xs font-thin group-hover:block  " />
                      ) : (
                        <FaChevronDown className=" flex text-xs font-thin group-hover:flex md:hidden  " />
                      )}
                    </div>
                    {/* INFO: hover modal or option viewer */}
                    {/* <div
                    className={`${
                      open && 'hidden'
                    } absolute left-12 z-50 ml-1 -mt-12 w-0 translate-y-1/2 overflow-hidden whitespace-pre rounded-md bg-secondary-800 px-0 py-0 font-semibold drop-shadow-lg group-hover:left-12 group-hover:ml-1 group-hover:w-64 group-hover:duration-500  `}
                  >
                    <SportTypeOptions st={st} onClose={onClose} />
                  </div> */}
                  </div>
                  {showCollapse && open && (
                    <div className="bg-leftbar-country pl-6 pr-3">
                      <SportTypeOptions st={st} onClose={onClose} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
      {/* SPORT TYPES ONLY */}
      {window.innerWidth <= MEDIA_SIZE_XL && !open && (
        <div className="flex flex-col gap-[1px] bg-primary-700 ">
          {available_sport_types &&
            available_sport_types.map((st, key) => {
              // console.log(st);
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
                      if (onClose) onClose();
                      // changeColapseSportType(st);
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
                            open ? 'h-4 w-4' : '  h-6 w-6'
                          } ${isActiveSport ? ' opacity-100 ' : 'opacity-80'}`}
                        />
                      ) : (
                        <div className=" h-4  w-4 rounded-full bg-gray-500" />
                      )}
                    </div>
                  </div>
                  {showCollapse && open && (
                    <div className="bg-leftbar-country">
                      <SportTypeOptions st={st} onClose={onClose} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
