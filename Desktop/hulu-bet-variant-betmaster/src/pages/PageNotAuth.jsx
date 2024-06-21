import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

export default function PageNotAuth() {
  return (
    <div className=" m-5  h-full w-full ">
      <div className="flex w-full flex-col justify-center ">
        <div className="flex w-full justify-center">
          <HiOutlineEmojiSad className="h-20 w-20 text-gray-400 md:h-40 md:w-40 " />
        </div>
        <div className="flex flex-col items-center text-2xl text-gray-400 md:text-4xl ">
          <span className="text-center"> 401</span>{' '}
          <span className="text-center"> Your Not Authorized! </span>{' '}
          <NavLink to="/">
            <button
              title="back to home"
              className="mt-4 flex h-10 w-fit items-center justify-center gap-x-2 rounded bg-primary px-2 text-center align-middle text-lg font-semibold text-white hover:bg-primary/70 hover:text-white "
            >
              <FaChevronLeft className="text-white" />
              Home
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
