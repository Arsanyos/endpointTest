import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaPlay } from 'react-icons/fa';

// local imports
import API from '@services/API';

export default function LobbyGamesList({ lobbys }) {
  const [loading, setLoading] = useState(false);
  const [lobbyGames, setLobbyGames] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchLobbyGames = () => {
      setLoading(true);
      API.findWithNoToken('games-virtual/game-lobby/', null, null)
        .then(({ data }) => {
          setLobbyGames(data.results);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    fetchLobbyGames();
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const MEDIA_SIZE_MD = 912;

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  return (
    <div
      className={`h-[100vh] w-56 flex-col gap-2 bg-lobby-games-list py-4 ${
        process.env.REACT_SHOW_GAMES_SIDEBAR == 'true' &&
        windowWidth > MEDIA_SIZE_MD
          ? 'flex '
          : 'hidden '
      }`}
    >
      <p className="text-md ml-2 font-semibold text-lobby-games-list-font">
        Lobby Games
      </p>
      {loading ? (
        <div className=" flex h-40  animate-pulse items-center justify-center duration-500">
          <p className="text-lobby-games-list-font">Loading...</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          {lobbyGames.length > 0 ? (
            <>
              {lobbyGames?.map((item) => {
                const id = item.game_id;
                const title = item.name;
                const image = item.images[0]?.url;
                return (
                  <Link
                    key={id}
                    to={`/games-virtual/games/${id}/detail`}
                    className="group flex cursor-pointer appearance-none flex-nowrap items-center gap-2 overflow-hidden rounded-lg py-1 px-2 transition  duration-500 hover:scale-105 "
                  >
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="relative aspect-auto w-6 "
                      />
                    )}
                    <div className="flex w-full items-center justify-between pr-1">
                      <p className="font-semibol mb-0 text-sm text-lobby-games-list-font">
                        {title}
                      </p>
                      <FaPlay className="-mb-1 text-xs text-lobby-games-list-font  group-hover:block" />
                    </div>
                  </Link>
                );
              })}
            </>
          ) : (
            <p className="text-center text-lobby-games-list-font">
              No games found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
