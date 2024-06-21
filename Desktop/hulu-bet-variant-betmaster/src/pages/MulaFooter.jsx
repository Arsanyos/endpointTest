import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FaTelegram, FaChevronUp } from 'react-icons/fa';
import { BiMailSend, BiPhone } from 'react-icons/bi';
import {
  InstagramOutlined,
  FacebookOutlined,
  TikTokOutlined,
  XOutlined,
} from '@ant-design/icons';

import underAge from '@assets/age21.png';
import logo from '@assets/logo.png';

// =============================================== Mula Footer ===============================================
export default function MulaFooter() {
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const { t } = useTranslation();

  const [expandFooter, setExpandFooter] = useState(false);

  const [isBelowMDSize, setIsBelowMDSize] = useState(window.innerWidth < 768);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsBelowMDSize(window.innerWidth < 768);
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);

  const bottomSlipNavEnabled =
    process.env.REACT_ENABLE_SLIP_NAV == 'true' &&
    (slips[selectedSlip]?.length > 0 ||
      slips[1]?.length > 0 ||
      slips[2]?.length > 0 ||
      slips[3]?.length > 0);

  const footerNavLinks = [
    {
      label: 'Howtoplay',
      linkTo: isBelowMDSize ? '/help/rules' : '/rules',
    },
    {
      label: 'PrivacyPolicy',
      linkTo: isBelowMDSize ? '/help/privacy' : '/privacy',
    },
    {
      label: 'TermsandConditions',
      linkTo: isBelowMDSize ? '/help/terms' : '/terms',
    },
    {
      label: 'ResponsibleGaming',
      linkTo: isBelowMDSize ? '/help/responsible' : '/responsible',
    },
    {
      label: 'FAQ',
      linkTo: isBelowMDSize ? '/help/faq' : '/faq',
    },
  ];

  return (
    <div className="mt-[2px] pt-[2px]">
      <button
        onClick={() => {
          setExpandFooter(!expandFooter);
        }}
        className="mx-auto flex h-4 w-32 cursor-pointer items-center justify-center gap-2 rounded-t-2xl bg-primary-900 p-2 "
      >
        <FaChevronUp
          className={` ${
            expandFooter && ' rotate-180 '
          } mt-[2px] text-slate-100 duration-300`}
        />
      </button>
      <div
        className={`${
          expandFooter ? 'hidden' : 'flex'
        } h-8 w-full items-center justify-between bg-primary-900 px-2 text-footer-item-font  `}
      >
        <div
          role="button"
          className="flex  h-6 w-14 cursor-pointer items-center gap-2 rounded bg-secondary-700 md:hidden"
        >
          <Link
            to={'/help/rules'}
            className=" w-12 cursor-pointer px-1 text-center text-font-dark focus:text-font-dark active:text-font-dark  "
          >
            {t('Info')}
          </Link>
        </div>
        <Link
          to="/help/age"
          className="hidden items-center justify-center px-1 text-center md:flex  "
        >
          <img
            src={configurations.underage_img ?? underAge}
            title="21+ and above"
            className="h-7 w-7"
          />
        </Link>
        <div className="flex items-center gap-x-1 ">
          <span>{configurations.name}</span>
          &copy;{new Date().getFullYear()}
          <span className="ml-2 block text-xs md:hidden">
            V. {process.env.VERSION}
          </span>
        </div>
        <span className="hidden text-xs md:block">
          V. {process.env.VERSION}
        </span>
        <Link
          to="/help/age"
          className="flex items-center justify-center px-1 text-center md:hidden "
        >
          <img
            src={configurations.underage_img ?? underAge}
            title="21+ and above"
            className="h-7 w-7"
          />
        </Link>
      </div>
      <div
        className={`${
          expandFooter ? 'flex transition duration-500 ease-in-out' : 'hidden'
        } ${
          bottomSlipNavEnabled ? 'pb-12 md:pb-4' : 'pb-4'
        } w-full justify-center bg-primary-900 p-6`}
      >
        <ul className="relative m-0 grid w-full grid-cols-1 gap-4 text-secondary-200 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <li className="flex flex-col gap-y-3 overflow-auto">
            <h1 className=" m-0  text-xl text-white ">ABOUT THE COMPANY</h1>
            <Link
              to="/"
              onClick={() => {
                setExpandFooter(false);
              }}
            >
              <img src={logo} className={`h-12 cursor-pointer`} />
            </Link>
            <p className=" text-balance text-start text-sm leading-tight text-white  ">
              {configurations.about_company}
              <br />
              {configurations.name} &copy;{new Date().getFullYear()}
            </p>
          </li>
          <li className="flex flex-col gap-y-1 overflow-auto">
            <h1 className="text-xl text-white ">IMPORTANT LINKS</h1>
            <nav className=" text-balance flex flex-col gap-y-2 text-start text-secondary-600 ">
              {footerNavLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.linkTo}
                  onClick={() => {
                    setExpandFooter(false);
                  }}
                  className="w-fit text-footer-item-font hover:text-footer-item-active-font  active:text-footer-item-active-font"
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </li>
          <li className="flex flex-col  gap-y-3 overflow-auto">
            <h1 className=" m-0  text-xl text-white ">ABOUT THE APP</h1>
            <div className="flex items-center gap-2">
              <img
                src={configurations.underage_img ?? underAge}
                alt=""
                className="h-10 w-10 "
              />
              <p className="flex text-sm text-amber-300">
                {configurations.underage_rule}
              </p>
            </div>

            <h2 className="text-lg text-white">
              Version {process.env.VERSION}
            </h2>
          </li>
          <li className="flex flex-col gap-y-3 overflow-auto text-footer-item-font">
            <h1 className=" m-0  text-xl text-white ">REACH US</h1>
            {configurations.telphone && (
              <div className="flex gap-x-2 text-sm">
                <BiPhone className="shrink-0 text-lg " />
                <span className="flex flex-wrap gap-1 ">
                  {[...configurations.telphone.split(',')].map(
                    (item, idx, arr) => (
                      <span key={item}>
                        {idx != arr.length - 1 ? item + ',' : item}
                      </span>
                    )
                  )}
                </span>
              </div>
            )}
            {configurations.email && (
              <div className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font">
                <BiMailSend className="shrink-0 text-lg" />
                {configurations.email}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {configurations.telegram && (
                <a
                  target="_blank"
                  href={configurations.telegram}
                  className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font"
                  rel="noreferrer"
                >
                  <FaTelegram className="shrink-0 text-lg" />
                  Telegram
                </a>
              )}
              {configurations.facebook && (
                <a
                  target="_blank"
                  href={configurations.facebook}
                  className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font"
                  rel="noreferrer"
                >
                  <FacebookOutlined className="shrink-0 text-lg" />
                  Facebook
                </a>
              )}
              {configurations.instagram && (
                <a
                  target="_blank"
                  href={configurations.instagram}
                  className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font"
                  rel="noreferrer"
                >
                  <InstagramOutlined className="shrink-0 text-lg" />
                  Instagram
                </a>
              )}
              {configurations.tiktok && (
                <a
                  target="_blank"
                  href={configurations.tiktok}
                  className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font"
                  rel="noreferrer"
                >
                  <TikTokOutlined className="shrink-0 text-lg" />
                  TikTok
                </a>
              )}
              {configurations.twitter && (
                <a
                  target="_blank"
                  href={configurations.twitter}
                  className="flex w-fit gap-x-2 text-sm text-footer-item-font hover:text-footer-item-active-font active:text-footer-item-active-font"
                  rel="noreferrer"
                >
                  <XOutlined className="shrink-0 text-lg" />
                  Twitter (X)
                </a>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
