import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheck } from 'react-icons/bs';
import { GiTrashCan } from 'react-icons/gi';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
export default function List({ onChange, selected, list }) {
  const { t } = useTranslation();
  let current = list?.find((item) => item.id == selected) || {};
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="relative flex flex-1">
            <Listbox.Button className="relative h-7 w-full max-w-[160px] cursor-default items-center rounded-lg bg-primaryLight pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-primaryLight focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm sm:leading-6 md:min-w-[160px] md:max-w-none">
              <span className="flex items-center">
                <img
                  src={current?.avatar}
                  alt=""
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                />
                <span className="ml-2 block truncate">{current?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                {!open ? (
                  <HiChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <HiChevronUp
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {/* {selected && (
                  <Listbox.Option
                    key={0}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'bg-primaryLight text-secondary-200'
                          : 'text-gray-900',
                        'relative cursor-pointer select-none bg-gray-200 py-2 pl-3 pr-6'
                      )
                    }
                    value={'clear'}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex w-full items-center">
                          <GiTrashCan
                            alt=""
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {t('CLEAR')}
                          </span>
                        </div>
                      </>
                    )}
                  </Listbox.Option>
                )} */}
                {list.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'bg-primaryLight text-primary'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-6'
                      )
                    }
                    value={item.id}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex w-full items-center">
                          <img
                            src={item.avatar}
                            alt=""
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {item.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-primary' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-2'
                            )}
                          >
                            <BsCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
