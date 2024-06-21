import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';
import { useUser } from '@hooks/useUser';
import { Input, message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function ChangePassword({ done }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const { changePassword } = useUser();
  const { t } = useTranslation();

  const handleChangePassword = () => {
    if (currentPassword == '' || password == '' || confirmPassword == '') {
      return message.error(t('PasswordCannotBeEmpty'));
    } else if (password != confirmPassword) {
      return message.error(t('PassworddoNotMatch'));
    } else {
      changePassword({ currentPassword, password, confirmPassword })
        .then((msg) => {
          done();
          return msg;
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
          <h2 className="font-semibold uppercase">Change PASSWORD</h2>
          <span className="text-center ">
            Set a new secure password for your {configurations.name} account.
          </span>
        </div>
        <Input.Password
          placeholder="current password..."
          style={{ borderRadius: 5, outlineStyle: 'none' }}
          onChange={(e) => setCurrentPassword(e.target.value)}
          iconRender={(visible) =>
            visible ? <AiFillEye /> : <AiFillEyeInvisible />
          }
        />
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
            className="h-8 w-24 rounded bg-primary-700 py-2 text-center font-semibold uppercase text-white"
            onClick={handleChangePassword}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
