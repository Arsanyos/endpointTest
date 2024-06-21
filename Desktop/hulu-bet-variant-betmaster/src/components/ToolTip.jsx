import React from 'react';

export default function ToolTip({
  children,
  tooltip,
  localtion = 'right',
  onClick = () => {},
}) {
  return (
    <span onClick={onClick} className="group relative z-50">
      <>{children}</>
      <div
        className={`min-w-40 absolute  ${localtion.toLowerCase()}-0 top-0 z-50  h-0 max-w-lg  overflow-hidden  whitespace-pre px-0 group-hover:top-5 group-hover:h-fit group-hover:py-0 group-hover:duration-500 `}
      >
        <div className="py-1">
          <div
            className={`absolute ${localtion.toLowerCase()}-1  h-2 w-2 rotate-45 bg-secondary-900/80 `}
          ></div>
        </div>
        <div className=" rounded-md bg-secondary-900/75 p-2 text-white drop-shadow-lg">
          {tooltip}
        </div>
        {/* <div className="tooltip-arrow" data-popper-arrow></div> */}
      </div>
    </span>
  );
}
