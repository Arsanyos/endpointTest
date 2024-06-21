import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

let currentIndex = 0;
const OTPField = ({ onOTPChange }) => {
  const [otp, setOtp] = useState(new Array(5).fill(''));
  const [activeOtpIdx, setActiveOtpIdx] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIdx]);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentIndex] = value.substring(value.length - 1);
    if (!value) setActiveOtpIdx(currentIndex - 1);
    else setActiveOtpIdx(currentIndex + 1);
    setOtp(newOtp);
    onOTPChange(newOtp.join(''));
  };

  const handleOnKeyDown = ({ key }, index) => {
    // console.log(key);
    currentIndex = index;
    if (key === 'Backspace' || (key === 'ArrowLeft' && currentIndex > 0)) {
      //   e.preventDefault();
      setActiveOtpIdx(currentIndex - 1);
      //   currentIndex = index - 1;
    } else if (key === 'ArrowRight' && otp.length - 1 > currentIndex) {
      setActiveOtpIdx(currentIndex + 1);
      //   currentIndex = index + 1;
    }
  };
  const onPaste = (e) => {
    e.preventDefault();
    // console.log(e.clipboardData);
    const pasted = e.clipboardData.getData('text/plain');
    setOtp(pasted.split('').slice(0, 5));
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-2">
      {otp.map((_, index) => {
        return (
          <React.Fragment key={index}>
            <input
              type="number"
              ref={index === activeOtpIdx ? inputRef : null}
              value={otp[index]}
              onChange={handleOnChange}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              onPaste={onPaste}
              //   onFocus={() => {
              //     console.log(index);
              //     setActiveOtpIdx(index);
              //     currentIndex = index;
              //   }}
              className="spin-button-none h-8 w-8 rounded border-2 border-gray-400 bg-transparent text-center text-xl font-semibold text-gray-400 outline-none transition focus:border-primary focus:text-gray-700"
            />
            {/* {index === otp.length - 1 ? null : (
              <span className="w-2 bg-gray-400 py-0.5" />
            )} */}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OTPField;
