import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineArrowBackIosNew, MdOutlineClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import Search from '@pages/Search';
import { t } from 'i18next';

export default function MobileSearch({ onClose }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const userDetail = useSelector((state) => state.user.userDetail);

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 top-0 left-0 flex h-screen w-screen bg-secondary-600 pb-12  duration-500 ${
        !open ? '-left-[900px]' : 'left-0'
      }`}
    >
      <div className="relative flex h-full w-full flex-col gap-1 overflow-y-auto pb-1 ">
        <div className="sticky top-0">
          <div className="h-16 w-full shrink-0 items-center bg-primary-700 px-4">
            <div className="flex h-full w-full items-center justify-between bg-primary-700">
              <div
                className=" cursor-pointer "
                onClick={() => {
                  setOpen(false);
                  navigate('/');
                  setTimeout(onClose, 1000);
                }}
              >
                <img src={logo} className="h-10 cursor-pointer" />
              </div>
              <div></div>
            </div>
          </div>

          <div className="flex h-10 w-full shrink-0  items-center justify-between bg-secondary-900 px-4 ">
            <span
              className="flex h-full cursor-pointer items-center justify-center gap-1 "
              onClick={() => {
                setOpen(false);
                setTimeout(onClose, 1000);
              }}
            >
              <MdOutlineArrowBackIosNew className="text-lg font-bold text-white" />
              {t('back')}
            </span>
            <div>
              {/* <img src={icon} className="h-5 w-5" alt="" /> */}

              <AiOutlineCloseCircle
                className=" cursor-pointer  text-xl text-red-500 duration-200 hover:text-red-700"
                onClick={() => {
                  setOpen(false);
                  setTimeout(onClose, 1000);
                }}
              />
            </div>
          </div>

          <div>
            <div className="item-center flex w-full flex-row justify-center bg-secondary-600">
              <input
                className="h-8 w-96 rounded-l-md bg-gray-300 px-4 text-black outline-none "
                type="search"
                name="search"
                id="searchField"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // search(searchValue);
                    // setOpen((prev) => !prev);
                  }
                }}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  // search(e.target.value);
                }}
              />
              <button
                id="searchBtn1"
                name="searchBtn1"
                className="flex h-8 items-center justify-end gap-1 rounded-r bg-primary-700 px-2 text-white hover:opacity-40"
                onClick={() => {
                  // search(searchValue);
                  // setOpen((prev) => !prev);
                }}
              >
                <AiOutlineSearch className="" />
                <span>search</span>
              </button>
            </div>
          </div>
        </div>

        {
          <Search
            search_value={searchValue}
            onClose={() => {
              setOpen(false);
              setTimeout(onClose, 1000);
            }}
          />
        }

        {/* <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden "></div> */}
      </div>
    </div>
  );
}
