import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import { useUser } from '@hooks/useUser';
import { Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import ClientSession from '@services/client-session';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export default function Register({ login, openOTP }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [agrement, setAgrement] = useState(true);
  const [notUnderAge, setNotUnderAge] = useState(true);
  const [referCode, setReferCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const { register } = useUser();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    ClientSession.getAccessToken(function (isLoggedIn, authData) {
      if (!isLoggedIn) {
        let params = new URLSearchParams(document.location.search);
        let refererCode = params.get('referal');
        if (refererCode) {
          setReferCode(refererCode);
        }
      }
    });
  }, []);
  const createAccount = async () => {
    let data = {};
    if (
      password == '' ||
      confirmpassword == '' ||
      phone == '' ||
      firstName == ''
    ) {
      return message.error(t('PleaseFillAllFields'));
    } else if (agrement == false) {
      return message.error(t('Youmustagreetothetermsandcondition'));
    } else if (notUnderAge == false) {
      return message.error(t('ageAgrement'));
    } else if (password != confirmpassword) {
      return message.error(t('PassworddoNotMatch'));
    } else if (phone.length == 1) {
      return message.error(t('phoneformatnotcorrect'));
    } else {
      data = {
        first_name: firstName,
        username: phone,
        password: password,
      };
      if (referCode) {
        data.referal = referCode;
      }
      setLoader(true);
      await register(data, (id) => openOTP(phone, id));
      setLoader(false);
    }
  };

  return (
    <div className="w-full md:max-w-lg">
      <div className="flex h-24 w-full items-center justify-center bg-header-container">
        <img src={logo} className="h-12" />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 py-2">
        <h2 className="m-0 text-lg font-semibold uppercase">
          Create An Account
        </h2>
      </div>
      <div className="flex w-full flex-col flex-wrap justify-center gap-y-2 p-4">
        <div className="flex w-full flex-wrap justify-evenly gap-2">
          <input
            className="  flex w-full flex-1 rounded border-none bg-gray-200 px-2 py-1 outline-none md:w-auto"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Full Name"
          />
          {/* <input
            className=" flex w-full flex-1 rounded border-none bg-gray-200 px-2 py-1 outline-none md:w-auto"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          /> */}
        </div>

        <div className="flex h-8 w-full">
          <div className="flex w-1/3 items-center  justify-between rounded-l bg-secondary-button px-1 text-center text-secondary-button-font">
            <span>{configurations.country}</span>
            <span>+{configurations?.country_code}</span>
          </div>
          <input
            type="number"
            onChange={(e) => setPhone(e.target.value)}
            className="spin-button-none w-full rounded-r border-none bg-gray-200 px-2 py-1 pl-2 outline-none"
            placeholder="Phone..."
          />
        </div>
        <div className="flex w-full flex-wrap justify-evenly gap-2">
          <Input.Password
            placeholder="password..."
            style={{ borderRadius: 5, outlineStyle: 'none' }}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <AiFillEye /> : <AiFillEyeInvisible />
            }
          />
          <Input.Password
            placeholder="confirm password..."
            style={{ borderRadius: 5, outlineStyle: 'none' }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <AiFillEye /> : <AiFillEyeInvisible />
            }
          />
        </div>
        {configurations.referral_support && (
          <input
            className=" w-full rounded border-none bg-gray-200 px-2 py-1 outline-none"
            type="text"
            defaultValue={referCode}
            onChange={(e) => setReferCode(e.target.value)}
            placeholder="Referal code..."
          />
        )}

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="comments"
              name="comments"
              type="checkbox"
              defaultChecked={agrement}
              onChange={() => setAgrement(!agrement)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments" className=" text-xs text-gray-500">
              Yes, I understand and agree to the{' '}
              <span className="text-primary">Terms of Service</span> including
              the
              <span className="text-primary">User Agreement</span> and the{' '}
              <span className="text-primary">Privacy Policy</span>.
            </label>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="comments"
              name="comments"
              type="checkbox"
              defaultChecked={notUnderAge}
              onChange={() => setNotUnderAge(!notUnderAge)}
              className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
            />
          </div>
          <div className="ml-3 text-xs">
            <label htmlFor="comments" className=" text-gray-500">
              By singing up, you confirm that you are above the age of 21.
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-y-2 gap-x-4">
          <button
            className="flex h-10 w-full items-center justify-center gap-x-1 rounded bg-secondary-button py-2 px-2 text-center text-sm font-semibold uppercase text-secondary-button-font"
            onClick={createAccount}
          >
            {loader && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="fill-primary mr-2 h-4 w-4 animate-spin text-gray-200 dark:text-green-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            <span>Register</span>
          </button>
          <div className="cursor-pointer text-xs text-gray-500">
            Already have an account?{' '}
            <span className="cursor-pointer text-primary-400 " onClick={login}>
              Log In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
