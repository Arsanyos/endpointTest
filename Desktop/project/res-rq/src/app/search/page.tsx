'use client'
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/Input";
import { Badge } from "@/components/ui/badge";
//
import { Cross1Icon } from "@radix-ui/react-icons";

function Search() {
  const [search, setSearch] = useState('');

  // temp populat searches data
  const popular = ['Pizza', 'Special', 'Vegetarian Pizza', "Burger"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between w-full">
        <span className="text-primary font-semibold flex items-center justify-center gap-2">
          {"<"} <span className="text-gray-400">Back</span>
        </span>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Input type="Search" value={search} onChange={handleSearchChange} />
        <Image alt="sorting-icon" src="/sort.svg" height={24} width={24} />
      </div>
      <div className="flex flex-row justify-between w-full flex flex-col justify-start gap-2">
        <span className="text-lg text-gray-500">Popular</span>
        <div className="flex flex-row gap-4 flex-wrap">
          {popular.map((item, index) => {
            return (
              <Badge
                className="bg-gray-500"
                key={index}
                onClick={() => {
                  setSearch(item);
                }}
              >
                {item}
              </Badge>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full flex flex-col justify-start gap-2">
        <span className="text-lg text-gray-500">Recent Search</span>
        <div className="flex flex-col gap-4 flex-wrap">
          {popular.map((item, index) => {
            return (
              <div key={index} className="flex flex-row justify-between ">
                <Badge
                  className="bg-gray-100 text-black"
                  onClick={() => {
                    setSearch(item);
                  }}
                >
                  {item}
                </Badge>
                <Cross1Icon />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;
