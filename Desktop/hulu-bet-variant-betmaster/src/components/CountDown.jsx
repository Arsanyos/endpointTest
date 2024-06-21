import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';

export default function CountDown({ schedule }) {
  const [countDown, setCountDown] = useState({});

  const jackpotTimer = useRef();

  useEffect(() => {
    jackpotCountDown(schedule);
  });
  const jackpotCountDown = (startTime) => {
    let duration = moment.duration(
      moment(startTime).diff(moment(moment().format('YYYY-MM-DDTHH:mm:ssZ')))
    );

    // let intervalId=0;
    clearInterval(jackpotTimer.current);
    jackpotTimer.current = setInterval(() => {
      duration.subtract(1, 's');
      //Get Days
      const days = duration.days();
      const daysFormatted = `${String(days).padStart(2, '0')} `;

      //Get Hours
      const hours = duration.hours();
      const hoursFormatted = `${String(hours).padStart(2, '0')} `;

      //Get Minutes
      const minutes = duration.minutes();
      const minutesFormatted = `${String(minutes).padStart(2, '0')} `;

      //Get Seconds
      const seconds = duration.seconds();
      const secondsFormatted = `${String(seconds).padStart(2, '0')}`;

      const inMilliseconds = duration.asMilliseconds();

      //   setJackpotTimeCountdown(
      //     [
      //       daysFormatted,
      //       hoursFormatted,
      //       minutesFormatted,
      //       secondsFormatted,
      //     ].join('')
      //   );

      setCountDown({
        days: daysFormatted,
        hours: hoursFormatted,
        minutes: minutesFormatted,
        seconds: secondsFormatted,
      });
      if (inMilliseconds !== 0) return;

      clearInterval(jackpotTimer.current);
    }, 1000);
  };
  return (
    <div className="flex w-full flex-row justify-between text-jackpot-detail-font">
      <div className="flex flex-col items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-jackpot-detail-timer-btn text-center font-semibold ">
          {countDown.days}
        </span>
        <span>Days</span>
      </div>
      <span className=" text-2xl font-semibold text-jackpot-detail-timer-btn">
        :
      </span>
      <div className="flex flex-col items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-jackpot-detail-timer-btn text-center font-semibold">
          {countDown.hours}
        </span>
        <span>Hours</span>
      </div>
      <span className="text-2xl font-semibold text-jackpot-detail-timer-btn">
        :
      </span>
      <div className="flex flex-col items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-jackpot-detail-timer-btn text-center align-middle font-semibold">
          {countDown.minutes}
        </span>
        <span>Minutes</span>
      </div>
      <span className="text-2xl font-semibold text-jackpot-detail-timer-btn ">
        :
      </span>
      <div className="flex flex-col items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-jackpot-detail-timer-btn text-center font-semibold">
          {countDown.seconds}
        </span>
        <span>seconds</span>
      </div>
    </div>
  );
}
