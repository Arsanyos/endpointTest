import API from '@services/API';
import ClientSession from '@services/client-session';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function GameViewLight() {
  const [gameURL, setGameURL] = useState(null);
  const [loading, setLoading] = useState(false);
  //   let { gameID } = useParams();
  const location = useLocation();

  useEffect(() => {
    const url = location.pathname.slice(1); // Remove "/"
    getLauncherURL(url);
  }, [location.pathname]);

  const getLauncherURL = (url) => {
    setLoading(true);

    // API.find(`games-virtual/games/${gameID}/detail/`, null, null)
    API.find(url, null, null)
      .then(({ data }) => {
        setLoading(false);
        setGameURL(data.launch_url);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error.message);
      });
  };

  return (
    <div className="flex h-full w-full flex-1  items-center justify-center">
      {!loading && gameURL && (
        <iframe
          id="contentiframe"
          src={gameURL}
          allowFullScreen={true}
          style={{ width: '100%', height: '90vh' }}
        />
      )}

      {!loading && !ClientSession.isAuth() && (
        <center>
          <div className="notFound m-5 ">
            <div className="text-4xl text-white ">
              Please Login To Play games
            </div>
          </div>
        </center>
      )}
      {ClientSession.isAuth() && loading && <VirtualGameSkeleton />}
    </div>
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
