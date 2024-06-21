import React, { useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';

export default function Modal({
  visible,
  onCancel,
  onOk,
  center = false,
  myClass = '',
  children,
}) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [visible]);
  if (!visible) return null;

  return (
    <div>
      {visible ? (
        <div
          className={`fixed inset-0 z-50 max-h-screen w-full lg:my-4 ${
            center && ' justify-center'
          }`}
        >
          <div
            className="fixed inset-0 h-screen w-screen bg-black opacity-40"
            onClick={() => onCancel()}
          />
          <div
            className={`flex ${
              center ? 'h-screen' : 'max-h-screen py-20'
            } w-full items-center px-4 lg:my-8`}
          >
            <div className="max-w-screen relative mx-auto  flex-1  transform overflow-hidden rounded-md  bg-white shadow-lg transition-all md:flex-none ">
              <button
                onClick={() => onCancel()}
                className=" group absolute top-2 right-1 z-10 m-0 flex aspect-square w-6 cursor-pointer items-center  justify-center rounded-full hover:bg-active/40"
              >
                <MdOutlineClose
                  className={`text-lg ${
                    myClass ? myClass : 'text-gray-200 group-hover:text-white'
                  } duration-200 `}
                />
              </button>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
