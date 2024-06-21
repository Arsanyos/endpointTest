import { DeleteFilled, StarFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClientSession from '../../services/client-session';
import { updateFavGamesList } from '../../store/coreDataSlice';
import React from 'react';

export default function Favorite({ open, onClose }) {
  const favGamesList = useSelector((state) => state.coreData.favGamesList);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const removeFavs = () => {
    dispatch(updateFavGamesList({ favGamesList: [] }));
    ClientSession.storeFav([], (err) => {});
  };
  return (
    <div className="flex flex-col bg-leftbar-group-header">
      <div
        className="group flex h-9 shrink-0  cursor-pointer flex-row items-center justify-between pb-2 pl-1 pt-4  "
        onClick={() => {
          // setExpand((prev) => !prev);
        }}
      >
        <div className="flex items-center  gap-5 ">
          <div className=" flex  items-center gap-5  border-l-2 border-success px-2 ">
            <div
              className={`flex w-full whitespace-pre text-leftbar-group-header-font duration-500 ${
                !open && 'translate-x-28 overflow-hidden opacity-0'
              }`}
            >
              {t('FAVOURITELEAGUES')}
            </div>
          </div>
        </div>
        <div
          className={`whitespace-pre duration-500 hover:opacity-50 ${
            !open && 'translate-x-28 overflow-hidden opacity-0'
          }`}
        >
          <DeleteFilled
            onClick={removeFavs}
            style={{ color: 'red', float: 'right', paddingRight: '15px' }}
          />
        </div>
        <div
          className={`${
            open && 'hidden'
          } absolute left-14 z-50 -mt-12 flex w-0 translate-y-1/2 flex-col gap-[1px] divide-y-[1px] divide-primary-600 overflow-hidden whitespace-pre rounded-md bg-leftbar-group-items-font px-0 py-0 font-semibold drop-shadow-lg group-hover:left-14 group-hover:w-64 group-hover:duration-500  `}
        >
          <PopulateFavGames favGamesList={favGamesList} onClose={onClose} />
        </div>
      </div>
      <div className="mb-[1px] flex flex-col gap-[1px] divide-y-[1px] divide-primary-600 bg-leftbar-group-items px-2 ">
        {open && (
          <PopulateFavGames favGamesList={favGamesList} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

const PopulateFavGames = ({ favGamesList, onClose }) => {
  const navigate = useNavigate();

  const { i18n } = useTranslation();

  return favGamesList.map((p, i) => {
    return (
      <div
        key={'favList' + i}
        className={` pl-2 duration-500 ${
          !open && 'translate-x-28 overflow-hidden opacity-0'
        }`}
      >
        <div
          className="flex min-h-[32px] cursor-pointer flex-row items-center justify-between  "
          onClick={(e) => {
            e.preventDefault();
            if (onClose) onClose();
            navigate(`/matchs/${p.id}`);
          }}
        >
          <div className={`flex flex-row items-center gap-2 duration-500 `}>
            <img src={p.logo} className="h-4 w-4 rounded-full" />
            <div
              className={`flex items-center justify-between text-leftbar-group-items-font`}
            >
              {i18n.resolvedLanguage.toUpperCase() == 'AM' &&
              p.locales &&
              p.locales.length != 0
                ? p.locales[0].translation
                : p.name}
            </div>
          </div>
        </div>
      </div>
    );
  });
};
