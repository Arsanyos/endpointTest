import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { MdSignalWifiStatusbarNotConnected } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import API from '@services/API';
import ClientSession from '@services/client-session';

import virtualBackdrop from '@assets/img/virtual-game-backdrop.jpg';

import LobbyGamesList from '@components/GameItem/LobbyGamesList';

export default function GameView({ loginVisible, setLoginVisible }) {
  const [gameURL, setGameURL] = useState(null);
  const [demoURL, setDemoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [isDemoOpened, setIsDemoOpened] = useState(false);
  let { gameID } = useParams();

  useEffect(() => {
    const url = location.pathname.slice(1);
    gameID && !ClientSession.isAuth() && getDemoLauncherURL();
    ClientSession.isAuth() && getLauncherURL(url);
  }, [loginVisible, gameID]);

  const getDemoLauncherURL = () => {
    setDemoLoading(true);

    // const demoURL = gameID ? `games-virtual/demo-games/${gameID}/detail/` : url;
    // `games-virtual/demo-games/${gameID}/detail/`,
    API.findWithNoToken(
      `games-virtual/demo-games/${gameID}/detail/`,
      null,
      null
    )
      .then(({ data }) => {
        setDemoLoading(false);
        setDemoURL(data?.launcher_url);
      })
      .catch((error) => {
        setDemoLoading(false);
        console.error(error.message);
      });
  };

  const getLauncherURL = (url) => {
    setLoading(true);

    const gameURL = gameID ? `games-virtual/games/${gameID}/detail/` : url;
    // API.find(`games-virtual/games/${gameID}/detail/`, null, null)
    API.find(gameURL, null, null)
      .then(({ data }) => {
        setLoading(false);
        setGameURL(gameID ? data?.launcher_url : data?.launch_url);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error.message);
      });
  };

  return (
    <div className="flex h-full w-full">
      <LobbyGamesList />
      <div className="m-0.5 flex h-full w-full items-center justify-center md:h-[99%]">
        {!loading && !demoLoading && gameURL && (
          <iframe
            id="contentiframe"
            src={gameURL}
            allowFullScreen={true}
            className="h-full w-full"
          />
        )}

        {!demoLoading && !ClientSession.isAuth() && !isDemoOpened && (
          <div
            className=" h-full w-full overflow-hidden  bg-cover bg-no-repeat text-center "
            style={{ backgroundImage: `url(${virtualBackdrop})` }}
          >
            {!loginVisible && (
              <div
                className="h-full w-full overflow-hidden"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
              >
                <div className="flex h-full items-center justify-center">
                  <div>
                    <h4 className="mb-6 text-xl font-semibold text-white">
                      Play to Win Big
                    </h4>
                    <div className="flex flex-wrap justify-center gap-5">
                      <button
                        type="button"
                        className="rounded  bg-green-600 px-7 pb-[8px] pt-[10px] text-sm font-medium capitalize leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-green-400 hover:bg-opacity-80 hover:text-green-900 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-80"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        onClick={() => setLoginVisible(true)}
                      >
                        {demoURL ? 'Login For real play' : 'Login to play'}
                      </button>
                      {demoURL && (
                        <button
                          type="button"
                          className="rounded  bg-slate-600 px-7 pb-[8px] pt-[10px] text-sm font-medium capitalize leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-slate-400 hover:bg-opacity-80 hover:text-gray-900 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-80"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          onClick={() => {
                            setIsDemoOpened(true);
                            setGameURL(demoURL);
                          }}
                        >
                          Play Demo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!ClientSession.isAuth() && demoLoading && <VirtualGameSkeleton />}
        {ClientSession.isAuth() && loading && <VirtualGameSkeleton />}
        {ClientSession.isAuth() && !loading && !gameURL && (
          <VirtualGame404 message={'Virtual game not found!'} />
        )}
      </div>
    </div>
  );
}

function VirtualGame404({ message }) {
  return (
    <>
      <div className="flex h-full w-full flex-col justify-start ">
        <div className="flex w-full justify-center">
          <MdSignalWifiStatusbarNotConnected className="h-20 w-20 text-gray-400 md:h-40 md:w-40 " />
        </div>
        <div className="flex flex-col text-2xl text-gray-400 md:text-4xl ">
          <span className="text-center"> {message}</span>
          <span className="text-center"> Please try later.</span>
        </div>
      </div>
    </>
  );
}

function VirtualGameSkeleton() {
  return (
    <>
      <div className="mt-6 grid w-full grid-cols-2  gap-4 px-2 md:grid-cols-6 md:px-6  ">
        {[...Array(6).keys()].map((i, index) => {
          return <LoadingSkeleton key={index} />;
        })}
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="relative aspect-square w-full flex-1 shrink-0 animate-pulse rounded-lg bg-secondary-700 " />
  );
}
