import { Carousel } from 'antd';
import { useState } from 'react';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Utils from '@services/utils';
import classNames from 'classnames';

function SliderTop() {
  const [device, setDevice] = useState(1);
  const location = useLocation();
  const { i18n } = useTranslation();

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const MediaSize = 768;

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
      handleResize();
    });
    // if (window.innerWidth < 820) {
    //   setDevice(2);
    // }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 820) {
      setDevice(2);
    } else {
      setDevice(1);
    }
  };
  const banner_list = configurations?.front_page_images?.filter(
    (banner) =>
      (banner.image_channel == device || banner.image_channel == 3) &&
      banner.image_location == 1 &&
      (banner.locale == null ||
        i18n.resolvedLanguage.toUpperCase() ===
          banner.locale?.shortcode?.toUpperCase())
  );

  if (banner_list?.length == 0 || !banner_list) return null;

  return (
    <div
      className={classNames(
        '',
        process.env.REACT_STICKY_BANNER == 'true' && ' sticky top-0 z-20 '
      )}
    >
      <div
        className={`${
          location.pathname == '/' || location.pathname == '/jackpot'
            ? 'mb-0.5 w-full bg-slate-200 md:mt-0'
            : ' h-0'
        } duration-300`}
      >
        {(location.pathname == '/' || location.pathname == '/jackpot') && (
          <Carousel
            autoplay={true}
            autoplaySpeed={5000}
            dots={false}
            // ref={(node) => (this.carousel = node)}
          >
            {i18n.resolvedLanguage &&
              banner_list.map((banner, index) => {
                const height =
                  banner.frontend_template_max_height > 0
                    ? ` h-[${banner.frontend_template_max_height}px] `
                    : ' h-full w-full';
                return (
                  <div key={index}>
                    {banner.image_channel == device ||
                    banner.image_channel == 3 ? (
                      banner.image_link != '' ? (
                        <>
                          {Utils.validURL(banner.image_link) ? (
                            <a
                              href={`${banner.image_link}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={banner.photo}
                                alt="virtual"
                                className=" h-full w-full"
                              />
                            </a>
                          ) : (
                            <Link to={`${banner.image_link}`}>
                              <img
                                src={banner.photo}
                                alt="virtual"
                                className=" h-full w-full"
                              />
                            </Link>
                          )}
                        </>
                      ) : (
                        <img
                          src={
                            i18n.resolvedLanguage == 'Am' &&
                            banner.locale?.shortcode?.toUpperCase() == 'AM'
                              ? banner.photo
                              : banner.photo
                          }
                          className={` ${height} w-full`}
                          alt="Banner"
                        />
                      )
                    ) : banner.image_link != '' ? (
                      <NavLink to={`${banner.image_link}`}>
                        <img
                          src={
                            i18n.resolvedLanguage == 'Am'
                              ? banner.photo
                              : banner.photo
                          }
                          className={` ${height} w-full`}
                          alt="Banner"
                        />
                      </NavLink>
                    ) : (
                      <img
                        src={
                          i18n.resolvedLanguage == 'Am'
                            ? banner.photo
                            : banner.photo
                        }
                        className={` ${height} w-full`}
                        alt="Banner"
                      />
                    )}
                  </div>
                );
              })}
          </Carousel>
        )}
      </div>
    </div>
  );
}
export default SliderTop;
