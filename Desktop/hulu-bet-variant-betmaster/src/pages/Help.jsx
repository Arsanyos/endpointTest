import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { FaBaby, FaClipboardList, FaHandshake } from 'react-icons/fa';
import { MdPrivacyTip } from 'react-icons/md';
import { Link, NavLink, Outlet } from 'react-router-dom';

export default function Help() {
  const ruleRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (ruleRef.current !== null) {
      ruleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [ruleRef.current]);

  const items = [
    {
      title: t('Howtoplay'),
      icon: (isActive) => (
        <FaClipboardList
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/rules',
      isPrivate: false,
    },
    {
      title: t('underAgeRule'),
      icon: (isActive) => (
        <FaBaby className={`${isActive ? 'text-font-dark' : 'text-primary'}`} />
      ),
      action: '/help/age',
      isPrivate: false,
    },
    {
      title: t('Promotions'),
      icon: (isActive) => (
        <BsFillPatchCheckFill
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/promotion',
      isPrivate: false,
    },

    {
      title: t('PrivacyPolicy'),
      icon: (isActive) => (
        <MdPrivacyTip
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/privacy',
      isPrivate: false,
    },
    {
      title: t('TermsandConditions'),
      icon: (isActive) => (
        <FaClipboardList
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/terms',
      isPrivate: false,
    },
    {
      title: t('ResponsibleGaming'),
      icon: (isActive) => (
        <FaClipboardList
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/responsible',
      isPrivate: false,
    },
    {
      title: t('FAQ'),
      icon: (isActive) => (
        <FaClipboardList
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/faq',
      isPrivate: false,
    },
    // {
    //   title: t('Apps'),
    //   icon: (isActive) => (
    //     <FaClipboardList
    //       className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
    //     />
    //   ),
    //   action: '/help/apps',
    //   isPrivate: false,
    // },
    {
      title: t('LiveChat'),
      icon: (isActive) => (
        <FaClipboardList
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/chat',
      isPrivate: false,
    },
    {
      title: t('Partners'),
      icon: (isActive) => (
        <FaHandshake
          className={`${isActive ? 'text-font-dark' : 'text-primary'}`}
        />
      ),
      action: '/help/partners',
      isPrivate: false,
    },
  ];

  return (
    <div
      ref={ruleRef}
      className="relative flex min-h-fit w-screen flex-1 flex-col overflow-y-auto pb-8 md:pb-20 "
    >
      {/* <div
        className="flex w-full items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('Help')}
          </span>
        </div>
      </div> */}
      <ul
        ref={ruleRef}
        className="m-0 flex w-full shrink-0 gap-y-0.5 gap-x-2 overflow-x-scroll scroll-smooth bg-black py-2 md:mt-0 md:grid md:grid-cols-7 md:flex-wrap md:gap-x-[1px] md:bg-inherit md:p-0 2xl:grid-cols-8 "
      >
        {items.map((item, key) => {
          return (
            <NavLink key={key} to={item.action}>
              {({ isActive }) => (
                <li
                  className={` m-0  flex h-8 min-w-[128px] shrink-0 items-center justify-center gap-x-2  truncate rounded-full px-1 py-0.5 text-sm md:h-7 md:w-full md:justify-start md:rounded-none ${
                    isActive
                      ? ' bg-active text-active-font'
                      : 'bg-secondary-button text-font-dark'
                  } `}
                >
                  {item.icon(isActive)}
                  <span>{item.title}</span>
                </li>
              )}
            </NavLink>
          );
        })}
      </ul>
      <div className="relative flex min-h-full w-full flex-col ">
        <Outlet />
      </div>
    </div>
  );
}
