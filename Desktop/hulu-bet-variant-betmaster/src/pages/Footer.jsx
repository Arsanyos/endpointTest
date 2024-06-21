// import logo from '@assets/logo.png';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import underAge from '@assets/age21.png';

export default function Footer() {
  const footerRef = useRef(null);
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  // console.log(configurations);
  return (
    <div className="  mt-0.5 flex flex-col items-end justify-end">
      <div className="flex max-h-14 w-full flex-col bg-primary-900  text-font-dark">
        <div
          ref={footerRef}
          className="flex h-8 w-full items-center justify-between px-2"
        >
          <div
            role="button"
            className="flex h-6 w-14 cursor-pointer items-center gap-2 rounded bg-secondary-700 "
          >
            <NavLink
              to={'/help/rules'}
              className=" w-12 cursor-pointer px-1 text-center text-font-dark focus:text-font-dark active:text-font-dark  "
            >
              {t('Info')}
            </NavLink>
            {/* <div className="h-full w-[1px] bg-secondary-200" />
            <Link to="/help" className=" h-full w-12 px-1 text-center ">
              {t('About')}
            </Link> */}
          </div>

          <NavLink
            to="/help/age"
            className="flex items-center justify-center px-1 text-center  "
          >
            <img
              src={configurations.underage_img ?? underAge}
              title="21+ and above"
              className="h-7 w-7"
            />
          </NavLink>
          <div className="flex items-center gap-x-1 ">
            {/* <span>
              {t('Copyright').replace('####', new Date().getFullYear())}
            </span> */}
            <span>{configurations.name}</span>
            &copy;{new Date().getFullYear()}
            <span className="text-xs">V. {process.env.VERSION}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
