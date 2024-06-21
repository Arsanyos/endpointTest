import React from 'react';
import { MdSignalWifiStatusbarNotConnected } from 'react-icons/md';

export default function NotFound({ message }) {
  return (
    <div className=" flex h-screen w-full flex-1  p-5 md:h-full ">
      <div className="flex h-full w-full flex-col justify-start ">
        <div className="flex w-full justify-center">
          <MdSignalWifiStatusbarNotConnected className="h-20 w-20 text-gray-400 md:h-40 md:w-40 " />
        </div>
        <div className="flex flex-col text-2xl text-gray-400 md:text-4xl ">
          <span className="text-center"> {message}</span>
          <span className="text-center">And Please try later.</span>
        </div>
      </div>
    </div>
  );
}
