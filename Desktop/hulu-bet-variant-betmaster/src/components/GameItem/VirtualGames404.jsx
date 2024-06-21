import React from 'react';
import { HiOutlineEmojiSad } from 'react-icons/hi';

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

export default VirtualGames404;
