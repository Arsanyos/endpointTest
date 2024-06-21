import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function GameItemSquare({ id, url, title, image, provider }) {
  return (
    <Link
      //   to={`/games-virtual/games/${id}/detail`}
      to={url}
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
