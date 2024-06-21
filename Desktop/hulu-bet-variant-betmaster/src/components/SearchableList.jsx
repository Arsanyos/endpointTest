import { Combobox, Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheck } from 'react-icons/bs';
import { GiTrashCan } from 'react-icons/gi';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const SportICon = ({ className }) => (
  <svg
    version="1.1"
    className={classNames(
      'h-3 w-3 bg-red-500 fill-current text-xl text-white',
      className
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 700 700"
  >
    <g>
      <path
        d="M445.4,176.6c0-14.4-7.7-27.7-20.1-34.9c-12.5-7.2-27.8-7.2-40.3,0c-12.5,7.2-20.1,20.5-20.1,34.9
    s7.7,27.7,20.1,34.9c12.5,7.2,27.8,7.2,40.3,0C437.7,204.3,445.4,191,445.4,176.6z"
      />
      <path
        d="M444,260.4c25.8,14.5,44.7,38.8,52.4,67.5c7.7,28.6,3.5,59.1-11.7,84.6c-3.9,6.6-11,10.6-18.7,10.5
    c-7.6-0.1-14.7-4.3-18.4-10.9c-3.7-6.7-3.6-14.8,0.3-21.4c8.7-14.6,11.5-32.1,7.9-48.7c-3.6-16.6-13.5-31.3-27.5-41
    c-0.9-0.6-2-0.8-3-0.5s-1.9,1-2.4,1.9L269.9,602.7c-4,7.7-11.8,12.7-20.5,13.2c-8.7,0.4-16.9-3.8-21.7-11.1
    c-4.7-7.3-5.3-16.5-1.4-24.3L305,426.2v0c2.3-4.6,0.5-10.1-4-12.5c-4.6-2.3-10.1-0.5-12.5,4l-51.5,101c-4,7.7-11.8,12.7-20.5,13.2
    c-8.7,0.4-16.9-3.8-21.7-11.1c-4.8-7.3-5.3-16.5-1.4-24.3l112.9-221.5c0.6-1.2,0.5-2.5-0.2-3.6c-0.7-1.1-1.9-1.7-3.2-1.7l-81.6,2.6
    c-7.6,0.2-14.8-3.6-18.9-10.1c-4-6.5-4.3-14.6-0.7-21.4c3.6-6.7,10.5-11,18.2-11.3l143.2-4.5v0c11.1-0.4,22.1,2.3,31.9,7.8
    L444,260.4z"
      />
      <path
        d="M195.1,607.5c0-15.1-8-29-21.1-36.5c-13.1-7.5-29.1-7.5-42.2,0c-13.1,7.5-21.1,21.5-21.1,36.5
    c0,15.1,8,29,21.1,36.5c13.1,7.5,29.1,7.5,42.2,0C187.1,636.5,195.1,622.6,195.1,607.5L195.1,607.5z"
      />
    </g>
  </svg>
);
export default function SearchableList({ onChange, currentSelected, list }) {
  const { t } = useTranslation();
  let current = list?.find((item) => item.id == currentSelected) || {};
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? list
      : list?.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="flex flex-1">
      <Combobox value={current} onChange={onChange}>
        <div className="relative">
          <div className="relative flex h-7 w-full max-w-[160px] cursor-default items-center justify-between gap-x-1 rounded-lg bg-primaryLight py-1 pl-3 pr-1 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-primaryLight focus:border-none focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm sm:leading-6 md:min-w-[160px] md:max-w-none">
            {current?.avatar ? (
              <img
                src={current?.avatar}
                alt=""
                className="h-3 w-3 flex-shrink-0 rounded-full"
              />
            ) : (
              <SportICon className={'h-4 w-4 flex-shrink-0 rounded-full'} />
            )}
            <Combobox.Input
              as={Fragment}
              // className="h-full w-full rounded-sm border-none bg-primaryLight px-2 text-sm leading-5 text-gray-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 "
              // displayValue={(person) => person.name}
              onChange={(event) => setQuery(event.target.value)}
            >
              <input
                placeholder={current.name || 'Select  League'}
                className="h-full w-full rounded-sm border-none bg-primaryLight px-2 text-sm leading-5 text-gray-900 placeholder:text-gray-900 focus:outline-none focus:placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-slate-300 "
              />
            </Combobox.Input>
            <Combobox.Button className="flex items-center pr-2">
              <HiChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {currentSelected && (
                <Combobox.Option
                  key={0}
                  className={({ active }) =>
                    `relative flex cursor-pointer select-none justify-between bg-gray-200 py-2 px-2 ${
                      active
                        ? 'bg-primaryLight text-secondary-200'
                        : 'text-gray-900'
                    }`
                  }
                  value={'clear'}
                >
                  {({ selected, active }) => {
                    return (
                      <>
                        <div className="flex items-center gap-1">
                          <GiTrashCan
                            alt=""
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                          />
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {t('CLEAR')}
                          </span>
                        </div>
                      </>
                    );
                  }}
                </Combobox.Option>
              )}
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative flex cursor-default select-none justify-between py-2 px-2 ${
                        active
                          ? 'bg-primaryLight text-primary'
                          : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => {
                      return (
                        <>
                          <div className="flex items-center gap-1">
                            <img
                              src={item.avatar}
                              alt=""
                              className="h-3 w-3 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          {selected ? (
                            <span
                              className={`flex items-center pl-3 ${
                                active ? 'text-primary' : 'text-primary'
                              }`}
                            >
                              <BsCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
