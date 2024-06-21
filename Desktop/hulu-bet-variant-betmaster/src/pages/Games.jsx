import { Listbox, Transition } from '@headlessui/react';
import API from '@services/API';
import Utils from '@services/utils';
import classNames from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheck } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import { HiChevronDown, HiChevronUp, HiOutlineEmojiSad } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import LobbyGamesList from '@components/GameItem/LobbyGamesList';

export default function Games() {
  const [loading, setLoading] = useState(false);
  const [lobbys, setLobbys] = useState([]);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategpry] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');

  // games-virtual/game-lobby/
  useEffect(() => {
    getGameCategorys();
    getGameProviders();
  }, []);

  useEffect(() => {
    getGames(
      selectedCategory,
      selectedProvider != 'all' ? selectedProvider : ''
    );
  }, [selectedProvider, selectedCategory]);

  const getGames = (category = '', provider = '') => {
    let url = `games-virtual/game-lobby/?category=${category}&provider=${provider}`;
    setLoading(true);
    API.findWithNoToken(url, null, null)
      .then(({ data }) => {
        setGames(data.results);
        if (category == '' && provider == '') {
          setLobbys(data.results);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGameCategorys = () => {
    API.findWithNoToken(`games-virtual/main-categories/`, null, null)
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const getGameProviders = () => {
    API.findWithNoToken(`games-virtual/providers/`, null, null)
      .then(({ data }) => {
        setProviders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex h-full w-full">
      <LobbyGamesList />
      <div className="flex  w-full flex-1 flex-col  justify-start bg-primary-400 p-4 md:h-full md:p-8">
        <div className=" flex w-full  items-center  rounded-full bg-primary-600 p-1.5">
          <AnimatePresence>
            <ul className="relative m-0 flex h-8 w-full items-center gap-x-2 overflow-x-auto rounded-full  md:h-11">
              <li
                role="button"
                key={'lobby'}
                className={`relative m-0 flex h-full w-fit shrink-0 cursor-pointer items-center justify-center  gap-x-2 truncate rounded-full px-4  py-0.5 text-sm ${
                  selectedCategory == '' ? 'text-black' : 'text-white'
                } `}
                onClick={() => setSelectedCategpry('')}
              >
                {selectedCategory == '' && (
                  <motion.div
                    layoutId="active-game-pill"
                    className=" absolute inset-0 rounded-full  bg-active"
                  />
                )}
                <span className="relative z-10">{'Lobby'}</span>
              </li>
              {categories?.map((category, i) => {
                category;
                return (
                  <li
                    role="button"
                    key={i}
                    onClick={() => setSelectedCategpry(category.category_id)}
                    className={`relative m-0  flex h-full w-fit shrink-0 cursor-pointer items-center justify-center gap-x-2 truncate  rounded-full px-4 py-0.5 text-sm ${
                      selectedCategory == category.category_id
                        ? 'text-black'
                        : 'text-white'
                    }  duration-300 hover:bg-secondary-700  `}
                  >
                    {selectedCategory == category.category_id && (
                      <motion.div
                        layoutId="active-game-pill"
                        className=" absolute inset-0 rounded-full  bg-active"
                      />
                    )}
                    <span className="relative z-10">{category.name}</span>
                  </li>
                );
              })}
            </ul>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex">
          {providers && providers.length > 0 && (
            <List
              selected={selectedProvider}
              list={[
                {
                  id: 'all',
                  name: 'All Providers',
                },
                ...(providers?.map((item) => {
                  return {
                    id: item.provider_id,
                    name: item.name,
                  };
                }) ?? []),
              ]}
              onChange={(value) => {
                // console.log(value);
                setSelectedProvider(value);
              }}
            />
          )}
        </div>
        <div className="mt-6 flex h-full flex-col ">
          <h2 className="text-lg font-semibold capitalize text-font-light">
            {selectedProvider !== 'all'
              ? providers?.find((item) => item.provider_id == selectedProvider)
                  ?.name ?? ''
              : 'All providers'}
          </h2>
          {!loading && games && (
            <div className="my-3 grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6 ">
              {games?.map((item, i) => {
                return (
                  <GameItem
                    key={i}
                    id={item.game_id}
                    title={item.name}
                    image={
                      item.images[2]?.url ??
                      item.images[1]?.url ??
                      item.images[0]?.url
                    }
                    provider={''}
                  />
                );
              })}
            </div>
          )}
          {loading && (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6  ">
              {[...Array(6).keys()].map((i, index) => {
                return <LoadingSkeleton key={index} />;
              })}
            </div>
          )}
          {games.length == 0 && !loading && (
            <div className="mt-6 flex flex-wrap gap-4  ">
              <VirtualGames404
                message={'No games available for the selected type'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="relative aspect-[3/4] h-full w-full shrink-0 animate-pulse rounded-lg bg-secondary-700 " />
  );
}

function GameItem({ id, title, image, provider }) {
  return (
    <Link
      to={`/games-virtual/games/${id}/detail`}
      className=" group relative flex cursor-pointer appearance-none overflow-hidden rounded-lg  shadow-md  transition  duration-500 hover:-translate-y-2 "
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="relative aspect-auto w-full bg-secondary-700 "
        />
      )}
      <div className="absolute hidden h-full w-full bg-transparent text-white transition delay-300 duration-300 group-hover:flex group-hover:bg-sky-600/80">
        <h2 className="absolute top-2 left-2 text-sm font-semibold text-white ">
          {title}
        </h2>
        <h2 className="absolute bottom-2 left-2 text-sm font-semibold text-white ">
          {provider}
        </h2>
        <FaPlay className=" absolute left-[calc(50%-20px)] top-[calc(50%-20px)]  hidden text-3xl  group-hover:block" />
      </div>
    </Link>
  );
}

function List({ onChange, selected, list }) {
  let current = list?.find((item) => item.id == selected) || {};
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="relative flex w-full flex-1 md:max-w-[240px]">
            <Listbox.Button className="focus:ring-primary relative h-7 w-full flex-1 cursor-default items-center rounded-lg bg-primaryLight pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-primaryLight focus:outline-none focus:ring-1 sm:text-sm sm:leading-6 md:min-w-[160px] md:max-w-[240px]">
              <span className="flex items-center">
                {/* <img
                  src={current?.avatar}
                  alt=""
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                /> */}
                <span className="ml-2 block truncate">{current?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                {!open ? (
                  <HiChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <HiChevronUp
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-8  max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {list?.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'text-primary bg-primaryLight'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-6'
                      )
                    }
                    value={item.id}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex w-full items-center">
                          {/* <img
                            src={item.avatar}
                            alt=""
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                          /> */}
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {item.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-primary' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-2'
                            )}
                          >
                            <BsCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

function VirtualGames404({ message }) {
  return (
    <>
      <div className="flex h-full w-full flex-col justify-start ">
        <div className="flex w-full justify-center">
          <HiOutlineEmojiSad className="h-14 w-14 text-gray-400 md:h-40 md:w-40 " />
        </div>
        <div className="flex flex-col text-2xl text-gray-400 md:text-4xl ">
          <span className="text-center"> {message}</span>
        </div>
      </div>
    </>
  );
}
