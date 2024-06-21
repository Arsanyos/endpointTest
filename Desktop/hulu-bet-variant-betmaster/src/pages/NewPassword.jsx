import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import { Input, message } from 'antd';
import { useUser } from '@hooks/useUser';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function NewPassword({ otp, phone, done }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { resetPassword } = useUser();
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const changePassword = () => {
    if (password == '' || confirmPassword == '') {
      return message.error(t('PasswordCannotBeEmpty'));
    } else if (password != confirmPassword) {
      return message.error(t('PassworddoNotMatch'));
    } else {
      resetPassword({ phone, otp, password })
        .then(() => {
          done();
        })
        .catch((err) => {
          return err;
        });
    }
  };
  return (
    <div className="max-w-lg">
      <div className="flex h-24 w-full items-center justify-center bg-header-container">
        <img src={logo} className="h-12" />
      </div>

      <div className="flex w-full flex-col flex-wrap justify-center gap-y-2 p-4">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h2 className="font-semibold">NEW PASSWORD</h2>
          <span className="text-center ">
            Set a new secure password for your {configurations.name} account.
          </span>
        </div>

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

        <div className="mt-4 flex flex-col items-center justify-center gap-y-2 gap-x-4">
          <button
            className="h-8 w-24 rounded bg-secondary-button py-2 text-center font-semibold uppercase text-secondary-button-font"
            onClick={changePassword}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
