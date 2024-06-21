import React from 'react';
import { HiOutlineEmojiSad } from 'react-icons/hi';

export default function Empty({ message }) {
  return (
    <div className=" flex h-full w-full  flex-1 p-5 ">
      <div className="flex h-full w-full flex-col justify-start ">
        <div className="flex w-full justify-center">
          <HiOutlineEmojiSad className="h-20 w-20 text-gray-400 md:h-40 md:w-40 " />
        </div>
        <div className="flex flex-col text-2xl text-gray-400 md:text-4xl ">
          <span className="text-center"> {message}</span>
          <span className="text-center">Please try again.</span>
        </div>
      </div>
    </div>
  );
}
