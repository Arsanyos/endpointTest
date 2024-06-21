import React from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfToday,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isThisMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
  toDate,
} from 'date-fns';
import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HuluDatePicker({
  onChange,
  className,
  defaultDate = null,
  disabledDate = false,
  isFutureDisabled = false,
}) {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(defaultDate ?? today);
  let [currentMonth, setCurrentMonth] = useState(
    format(defaultDate ?? today, 'MMM-yyyy')
  );
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const dateStyle = (day) => {
    return classNames(
      isEqual(day, selectedDay) && 'text-white',
      !isEqual(day, selectedDay) && isToday(day) && 'text-primary',
      !isEqual(day, selectedDay) &&
        !isToday(day) &&
        isSameMonth(day, firstDayCurrentMonth) &&
        !isBefore(day, today) &&
        !(isAfter(day, today) && isFutureDisabled) &&
        'text-gray-900',
      !isEqual(day, selectedDay) &&
        !isToday(day) &&
        !isSameMonth(day, firstDayCurrentMonth) &&
        'text-gray-400',
      disabledDate && isBefore(day, today) && 'bg-gray-200 text-gray-400',
      isFutureDisabled && isAfter(day, today) && 'bg-gray-200 text-gray-400',
      isFutureDisabled &&
        isBefore(day, today) &&
        isSameMonth(day, firstDayCurrentMonth) &&
        !isEqual(day, selectedDay) &&
        'text-gray-900',
      isEqual(day, selectedDay) && isToday(day) && 'bg-primary-700 ',
      isEqual(day, selectedDay) && !isToday(day) && 'bg-primary-700 ',
      !isEqual(day, selectedDay) && 'hover:bg-primaryLight',
      (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
      ((disabledDate && isBefore(day, today)) ||
        (isFutureDisabled && isAfter(day, today))) &&
        'hover:bg-gray-200 ',
      'mx-auto flex h-6 w-6 xs:h-8 xs:w-8 items-center justify-center rounded-full'
    );
  };

  return (
    <div className={classNames('pt-12 pb-2', className)}>
      <div className="mx-auto max-w-md px-4 sm:px-7 md:max-w-4xl md:px-6">
        <div className="">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-gray-900">
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              disabled={disabledDate && isThisMonth(firstDayCurrentMonth)}
              onClick={previousMonth}
              className={classNames(
                disabledDate && isThisMonth(firstDayCurrentMonth)
                  ? ' hover:text-gray-400'
                  : 'hover:rounded-full hover:bg-primaryLight',
                '-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400  hover:text-gray-500'
              )}
            >
              <span className="sr-only">Previous month</span>
              <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={nextMonth}
              disabled={isFutureDisabled && isThisMonth(firstDayCurrentMonth)}
              type="button"
              className={classNames(
                isFutureDisabled && isThisMonth(firstDayCurrentMonth)
                  ? ' hover:text-gray-400'
                  : 'hover:rounded-full hover:bg-primaryLight',
                '-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400  hover:text-gray-500'
              )}
            >
              <span className="sr-only">Next month</span>
              <HiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-7 text-center text-xs leading-6 text-gray-500 ">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-xs sm:text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  'py-1.5'
                )}
              >
                <button
                  type="button"
                  disabled={
                    (disabledDate && isBefore(day, today)) ||
                    (isFutureDisabled && isAfter(day, today)) ||
                    false
                  }
                  onClick={() => {
                    setSelectedDay(day);
                    onChange(day);
                  }}
                  className={dateStyle(day)}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
