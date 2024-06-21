import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import SliderTop from './SliderTop';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { NARROW_TEMPLATE, WIDE_TEMPLATE } from '@services/constants';
import { useIsVisible } from '@hooks/useIsVisible';
import classNames from 'classnames';
import CommonFooter from '@pages/CommonFooter';
export default function Layout() {
  const [device, setDevice] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const UIMode = useSelector((state) => state.configuration.UIMode);

  const MediaSizeMd = 768;
  const MediaSizeLg = 1024;

  const isRightBarOpen = useSelector(
    (state) => state.configuration.isRightBarOpen
  );
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  // const ref = useRef();
  // const isVisible = useIsVisible(ref);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
      // handleResize();
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  // const handleResize = () => {
  //   if (window.innerWidth < 820) {
  //     setDevice(2);
  //   } else {
  //     setDevice(1);
  //   }
  // };

  return (
    <div
      className={`flex ${
        configurations?.frontend_template == WIDE_TEMPLATE
          ? 'h-full'
          : 'h-screen'
      } w-full flex-col overflow-y-auto `}
    >
      {configurations?.frontend_template == WIDE_TEMPLATE &&
        UIMode !== 'cashier' &&
        !['/jackpot'].includes(location.pathname.toLowerCase()) && (
          <SliderTop />
        )}
      <div
        className={classNames(
          'relative flex  flex-row md:gap-x-1 ',
          configurations.frontend_template == NARROW_TEMPLATE
            ? 'h-full w-full'
            : 'flex-grow-0'
        )}
      >
        {process.env.REACT_RIGHTBAR_SCROLL == 'false' && (
          <>
            <aside className="hidden h-full min-w-fit flex-col bg-secondary-200 lg:flex">
              <LeftBar />
            </aside>
            <div
              className={classNames(
                'flex w-full gap-3 md:flex-row md:overflow-x-auto ',
                configurations?.frontend_template == NARROW_TEMPLATE
                  ? 'h-full overflow-y-auto '
                  : ''
              )}
            >
              <aside
                className={classNames(
                  'hidden h-full w-full flex-1 flex-shrink bg-secondary-200 md:flex  lg:hidden',
                  configurations?.frontend_template == NARROW_TEMPLATE
                    ? 'h-full overflow-y-auto '
                    : ''
                )}
              >
                <LeftBar />
              </aside>
              <main
                className={classNames(
                  ' relative flex  w-full shrink flex-grow flex-col overflow-auto  bg-primary-400 pb-20 ',
                  configurations?.frontend_template == NARROW_TEMPLATE
                    ? 'h-fit  '
                    : ' h-full'
                )}
              >
                {configurations?.frontend_template == NARROW_TEMPLATE &&
                  UIMode !== 'cashier' &&
                  !['/jackpot'].includes(location.pathname.toLowerCase()) && (
                    <SliderTop />
                  )}
                <Outlet />
                {process.env.REACT_SHOW_MULA_FOOTER !== 'true' && (
                  <CommonFooter />
                )}
              </main>
            </div>
          </>
        )}
        {process.env.REACT_RIGHTBAR_SCROLL == 'true' && (
          <div className="relative flex h-full w-full gap-x-1 overflow-y-auto">
            <aside className="hidden h-fit min-w-fit flex-col bg-secondary-200 lg:flex">
              <LeftBar />
            </aside>
            <div
              className={classNames(
                'flex h-fit min-h-full w-full gap-3 md:flex-row md:overflow-x-auto ',
                configurations?.frontend_template == NARROW_TEMPLATE ? '  ' : ''
              )}
            >
              <aside
                className={classNames(
                  'hidden h-fit  w-full flex-1 flex-shrink bg-secondary-200 md:flex  lg:hidden',
                  configurations?.frontend_template == NARROW_TEMPLATE
                    ? ' '
                    : ''
                )}
              >
                <LeftBar />
              </aside>
              <main
                className={classNames(
                  ' relative flex h-fit min-h-full  w-full  flex-grow flex-col bg-primary-400 pb-20 md:overflow-y-hidden ',
                  configurations?.frontend_template == NARROW_TEMPLATE
                    ? '  '
                    : ' '
                )}
              >
                {configurations?.frontend_template == NARROW_TEMPLATE &&
                  UIMode !== 'cashier' &&
                  !['/jackpot'].includes(location.pathname.toLowerCase()) && (
                    <SliderTop />
                  )}
                <Outlet />
                {process.env.REACT_SHOW_MULA_FOOTER !== 'true' && (
                  <CommonFooter />
                )}
              </main>
            </div>
          </div>
        )}
        {(windowWidth > MediaSizeLg ||
          (windowWidth < MediaSizeLg && isRightBarOpen)) && (
          <aside
            className={classNames(
              'relative flex h-full min-w-fit flex-col overflow-hidden bg-leftbar-container ',
              configurations.frontend_template == NARROW_TEMPLATE
                ? 'overflow-y-auto'
                : ' '
            )}
          >
            {windowWidth > MediaSizeLg && <RightBar />}
            <AnimatePresence>
              {windowWidth < MediaSizeLg && isRightBarOpen && (
                <motion.div
                  className="fixed top-0 left-0 z-10 flex md:relative"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%', transition: { duration: 0.3 } }}
                  transition={{ type: 'keyframes' }}
                >
                  <RightBar />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        )}
      </div>
    </div>
  );
}
