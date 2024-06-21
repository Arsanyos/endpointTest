import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SliderTop from './SliderTop';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  MEDIA_SIZE_SM,
  NARROW_TEMPLATE,
  WIDE_TEMPLATE,
} from '@services/constants';
import { useIsVisible } from '@hooks/useIsVisible';
import classNames from 'classnames';
import CommonFooter from '@pages/CommonFooter';
import Header from './Header';
import Footer from '@pages/Footer';
import MobileNavBar from './MobileNavBar';
export default function CommonLayout({ loginVisible, setLoginVisible }) {
  const [device, setDevice] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const MediaSizeMd = 768;
  const MediaSizeLg = 1024;

  const isRightBarOpen = useSelector(
    (state) => state.configuration.isRightBarOpen
  );
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  return (
    <div
      className={`flex ${
        configurations?.frontend_template == WIDE_TEMPLATE
          ? 'min-h-full '
          : 'h-screen'
      } w-screen flex-col overflow-y-auto bg-body-container `}
    >
      {location.pathname != '/signup' &&
        location.pathname != '/login' &&
        location.pathname != '/check-coupon' &&
        location.pathname != '/slips' && (
          <Header
            loginVisible={loginVisible}
            setLoginVisible={setLoginVisible}
          />
        )}

      <div className="relative flex h-full w-full flex-1 gap-x-1 overflow-y-auto">
        <div
          className={classNames(
            'flex h-full w-full gap-3 md:flex-row md:overflow-x-auto ',
            configurations?.frontend_template == NARROW_TEMPLATE ? '  ' : ''
          )}
        >
          <main
            className={classNames(
              ' relative flex  w-full shrink flex-grow flex-col bg-primary-400   ',
              configurations?.frontend_template == NARROW_TEMPLATE
                ? 'min-h-fit  '
                : ' h-full'
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {process.env.REACT_SHOW_MULA_FOOTER === 'true' ? (
        <></>
      ) : windowWidth < MEDIA_SIZE_SM &&
        process.env.REACT_MOBILE_BOTTOM_TAB_INFO === 'true' ? (
        <Footer />
      ) : (
        <MobileNavBar />
      )}
    </div>
  );
}
