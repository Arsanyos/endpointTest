import Icon from '@ant-design/icons/lib/components/Icon';
import { Spin, message } from 'antd';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Virtual() {
  const { configurations } = useSelector((state) => state.configuration);
  const { authData } = useSelector((state) => state.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const virtualRef = useRef();

  const antIcon = (
    <Icon type="loading" style={{ color: '#e7dc3e', fontSize: 34 }} spin />
  );

  useEffect(() => {
    if (virtualRef.current !== null) {
      virtualRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [virtualRef.current]);

  return (
    <div ref={virtualRef} className="relative flex flex-1 ">
      {configurations?.show_virtual_games && configurations && isLoggedIn ? (
        <>
          <iframe
            id="contentiframe"
            src={`https://games1.playbetman.com/?o=${configurations.kiron_operator_id}&p=${authData.token}&s=${configurations.kiron_style}`}
            scrolling="auto"
            allowFullScreen="true"
            className=" w-full"
          />
        </>
      ) : isLoggedIn &&
        configurations?.show_virtual_games &&
        !(
          configurations?.kiron_operator_id &&
          authData?.token &&
          configurations?.kiron_style
        ) ? (
        <center>
          <Spin indicator={antIcon} size="large" />
        </center>
      ) : !isLoggedIn ? (
        <div className=" flex w-full justify-center  ">
          <div className="px-4 pt-8 text-4xl text-white md:px-8 md:pt-16">
            Please Login To Play Virtual and Casino games
          </div>
        </div>
      ) : (
        <div className=" flex w-full justify-center  ">
          <div className="px-4 pt-8 text-4xl text-white md:px-8 md:pt-16">
            Virtual and Casino games are currently not available
          </div>
        </div>
      )}
    </div>
  );
}
