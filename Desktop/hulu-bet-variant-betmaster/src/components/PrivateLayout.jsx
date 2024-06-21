import { Outlet } from 'react-router-dom';
import RightBar from './RightBar';
import UserInfoLeftBar from './UserInfoLeftBar';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { NARROW_TEMPLATE } from '@services/constants';
import classNames from 'classnames';

export default function PrivateLayout(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isRightBarOpen = useSelector(
    (state) => state.configuration.isRightBarOpen
  );

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const MediaSizeLg = 1024;

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });

    return window.removeEventListener('resize', () => null);
  }, []);

  const openForSmScreen = window.innerWidth < MediaSizeLg && isRightBarOpen;
  const openForLgScreen = window.innerWidth < MediaSizeLg && isRightBarOpen;
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden ">
      <div className=" mt-0.5 flex h-full flex-1 flex-row flex-wrap md:gap-x-1  lg:flex-nowrap">
        <div className=" max-w-64 hidden h-full bg-primary-100 lg:flex">
          <UserInfoLeftBar />
        </div>
        <div className="flex h-full w-full gap-3 md:flex-row">
          <div className="hidden h-full bg-primary-100 md:flex lg:hidden">
            <UserInfoLeftBar />
          </div>
          <div className="flex h-full w-screen flex-1 overflow-y-auto bg-primary-100 md:w-full">
            <Outlet />
          </div>
        </div>

        <aside
          className={classNames(
            'relative flex h-full min-w-fit flex-col overflow-hidden bg-rightbar-container ',
            configurations.frontend_template == NARROW_TEMPLATE
              ? 'overflow-y-auto'
              : ' '
          )}
        >
          {openForSmScreen && <RightBar />}
          <AnimatePresence>
            {openForLgScreen && (
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
      </div>
    </div>
  );
}
