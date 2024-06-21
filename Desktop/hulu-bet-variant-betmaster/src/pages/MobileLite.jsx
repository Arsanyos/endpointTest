import GameItemSkeleton from '@components/GameItem/GameItemSkeleton';
import GameItemSquare from '@components/GameItem/GameItemSquare';
import VirtualGames404 from '@components/GameItem/VirtualGames404';
import API from '@services/API';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function MobileLite() {
  const [loading, setLoading] = useState(false);
  const [mobileLiteGames, setMobileLiteGames] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getMobileLiteGames();
  }, []);

  const getMobileLiteGames = () => {
    let url = `mobile-lite/games`;
    setLoading(true);
    API.findWithNoToken(url, null, null)
      .then(({ data }) => {
        setMobileLiteGames(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex  w-full flex-1 flex-col justify-start p-4 md:h-full md:p-8 ">
      <div className=" flex flex-col ">
        {/* list of lobbys with thier category titles */}
        {/* {loading && ( */}
        <h2 className="text-lg font-semibold text-white">{t('KironLite')}</h2>
        {/* )} */}
        {!loading && (
          <div className=" grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6  ">
            {mobileLiteGames?.map((item, i) => {
              return (
                <GameItemSquare
                  key={i}
                  id={item.game_id}
                  url={`/mobile-lite/games/${item.game_id}/detail`}
                  title={item.name}
                  image={item.thumbnail_url}
                  provider={'Game provider'}
                />
              );
            })}
          </div>
        )}
        {loading && (
          <div className=" grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6  ">
            {[...Array(6).keys()].map((i, index) => {
              return <GameItemSkeleton key={index} />;
            })}
          </div>
        )}
        {mobileLiteGames.length == 0 && !loading && (
          <div className=" flex flex-wrap gap-4  ">
            <VirtualGames404 message={'No mbile games available.'} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileLite;
