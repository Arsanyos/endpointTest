import React, { useEffect, useRef, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { DatePicker, Select, message } from 'antd';
import { BiCalendar } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import Modal from '@components/Modal';
import ChangePassword from '@pages/ChangePassword';
import { useUser } from '@hooks/useUser';
import { useTranslation } from 'react-i18next';
import { BsPersonCircle } from 'react-icons/bs';

const PorfileIcon = () => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      className=" fill-current  text-2xl text-white md:text-4xl"
      viewBox="0 0 700 700"
      xmlSpace="preserve"
    >
      <path
        d="M350,186.5c-57.8,0-105,47.2-105,105s47.2,105,105,105s105-47.2,105-105S407.8,186.5,350,186.5z M350,361.5
c-38.5,0-70-31.5-70-70s31.5-70,70-70s70,31.5,70,70S388.5,361.5,350,361.5z"
      />
      <path
        d="M350,99c-135.6,0-245,109.4-245,245c0,66.5,27.1,127.8,70,171.5c10.5,10.5,21.9,20.1,35,28.9c39.4,28,87.5,43.8,140,43.8
s100.6-16.6,140-43.8c12.2-8.8,23.6-18.4,35-28.9c43.8-44.6,70-105,70-171.5C595,208.4,485.6,99,350,99z M350,554
c-52.5,0-99.8-19.2-136.5-50.8c9.6-31.5,38.5-54.2,72.6-54.2h128.6c34.1,0,63,22.8,72.6,54.2C449.7,534.7,402.5,554,350,554L350,554
z M513.6,475.2c-18.4-36.8-56-61.2-98.9-61.2H286.1c-43.8,0-81.4,25.4-98.9,61.2C157.5,439.4,140,393.9,140,344
c0-115.5,94.5-210,210-210s210,94.5,210,210C560,393.9,542.5,439.4,513.6,475.2L513.6,475.2z"
      />
    </svg>
  );
};

export default function Profile() {
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const profileRef = useRef(null);
  const userDetail = useSelector((state) => state.user.userDetail);
  const { updateProfile } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (userDetail) setUserData({ ...userDetail });
  }, [userDetail]);

  const profileEvent = () => {
    profileRef.current.click();
  };

  const handleUpdate = async () => {
    setLoader(true);
    await updateProfile(userData)
      .then((resp) => {
        message.success(resp);
        setLoader(false);
      })
      .catch((err) => {
        message.error(err);
        setLoader(false);
      });
  };
  const handleChange = (e) => {
    const profileImg = e.target.files[0];
  };
  const changevalue = (e) => {
    let d = { ...userData };
    d[e.target.name] = e.target.value;
    setUserData({ ...d });
  };
  const handleOptionChange = (e) => {
    let d = { ...userData };
    let dm = d.member ? { ...d.member } : {};

    dm[e.target.name] = e.target.value;
    d.member = dm;

    setUserData({ ...d });
  };

  const handleRegionChangevalue = (value) => {
    let d = { ...userData };
    let dm = d.member ? { ...d.member } : {};
    dm.region = value;
    d.member = dm;
    setUserData({ ...d });
  };
  const handleGenderChangevalue = (value) => {
    let d = { ...userData };
    let dm = d.member ? { ...d.member } : {};
    dm.gender = value;
    d.member = dm;
    setUserData({ ...d });
  };
  const handleBirthChangevalue = (value) => {
    let d = { ...userData };
    let dm = d.member ? { ...d.member } : {};
    dm.birthday = value;
    d.member = dm;
    setUserData({ ...d });
  };

  const regions = [
    { name: 'Addis Ababa', label: t('AddisAbaba') },
    { name: 'Dire Dawa', label: t('DireDawa') },
    { name: 'Tigray', label: t('Tigray') },
    { name: 'Afar', label: t('Afar') },
    { name: 'Amhara', label: t('Amhara') },
    { name: 'Oromia', label: t('Oromia') },
    { name: 'Somali', label: t('Somali') },
    { name: 'Benishangul-Gumuz', label: t('Benishangul') },
    { name: 'Sidama', label: t('Sidama') },
    {
      name: 'SNNP',
      label: t('SouthernNationsNationalities'),
    },
    { name: 'Gambella', label: t('Gambella') },
    { name: 'Harari', label: t('Harari') },
  ];

  return (
    <div className=" flex w-full flex-col items-center justify-center gap-y-4 px-8 py-8 md:px-24">
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-700 md:h-24 md:w-24 "
        onClick={profileEvent}
      >
        {/* <img src={user} className="h-12 w-12 md:h-20 md:w-20" /> */}
        {/* <BsPersonCircle className="h-12 w-12 text-white md:h-28 md:w-28" /> */}
        <PorfileIcon />
        <div className=" absolute -right-1 bottom-6 flex h-5 w-5 items-center justify-center rounded-full bg-white text-secondary-600">
          <MdModeEdit className="text-primary" />
        </div>
      </div>
      <div className=" flex w-full flex-col flex-wrap justify-center gap-y-2 sm:max-w-sm">
        <div className="flex w-full flex-wrap gap-y-2 gap-x-4">
          <input
            className="w-full rounded border-none px-2 py-1 outline-none"
            type="text"
            onChange={changevalue}
            value={userData.first_name}
            name="first_name"
            placeholder="Full Name"
          />
          {/* <input
            className="w-full rounded border-none px-2 py-1 outline-none"
            type="text"
            onChange={changevalue}
            name="last_name"
            value={userData.last_name}
            placeholder="Last Name"
          /> */}
        </div>
        {/* <Select
          placeholder="Geneder"
          className="w-"
          name="geneder"
          value={userData.member?.gender}
          onChange={handleGenderChangevalue}
          style={{
            color: '#898989',
            border: 'none',
            borderRadius: 4,
            width: '100%',
          }}
        >
          <Select.Option value="female">{t('Female')}</Select.Option>
          <Select.Option value="male">{t('Male')}</Select.Option>
        </Select> */}
        {/* <DatePicker
          className=" rounded"
          name="birthday"
          value={userData.member?.birthday}
          onChange={handleBirthChangevalue}
          format={'DD/MM/YYYY'}
          suffixIcon={<BiCalendar className="text-secondary-800" />}
          style={{
            // background: '#898989',
            color: '#898989',
            border: 'none',
            borderRadius: 4,
            width: '100%',
          }}
        />
        <input
          className="w-full rounded border-none px-2 py-1 outline-none"
          type="email"
          value={userData.email}
          onChange={changevalue}
          name="email"
          suffix={<BiCalendar className="text-secondary-800" />}
          placeholder="Email"
        /> */}
        <input
          className=" w-full rounded border-none bg-gray-300 px-2 py-1 outline-none"
          type="text"
          onChange={changevalue}
          name="username"
          value={userData.username}
          disabled
          placeholder="phone"
        />
        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Region..."
          name="region"
          onChange={handleRegionChangevalue}
          value={userData.member?.region}
          style={{
            color: '#898989',
            border: 'none',
            outline: 'none',
            borderRadius: 4,
            width: '100%',
          }}
        >
          {/* <Select.Option value="Addis Abeba">Addis Ababa</Select.Option>
          <Select.Option value="oromia">Oromia</Select.Option> */}
          {regions.map((region, i) => {
            return (
              <Select.Option key={i} value={region.name}>
                {region.label}
              </Select.Option>
            );
          })}
        </Select>
        <input
          className="  w-full rounded border-none px-2 py-1 outline-none"
          type="text"
          onChange={handleOptionChange}
          name="city"
          value={userData.member?.city}
          placeholder={`${t('City')}...`}
        />
        <input
          className="w-full rounded border-none px-2 py-1 outline-none"
          type="text"
          onChange={handleOptionChange}
          name="zone"
          value={userData.member?.zone}
          placeholder={`${t('Zone')}...`}
        />
        <input
          className="w-full rounded border-none px-2 py-1 outline-none"
          type="text"
          onChange={handleOptionChange}
          name="woreda"
          value={userData.member?.woreda}
          placeholder={`${t('Woreda')}...`}
        />
        <div className="flex flex-wrap gap-y-2 gap-x-4">
          <input
            className="w-full rounded border-none px-2 py-1 outline-none"
            type="text"
            onChange={handleOptionChange}
            name="location"
            value={userData.member?.location}
            placeholder={`${t('SpecificLocation')}...`}
          />
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-y-2 gap-x-4">
          {/* <button
            className="h-8 w-32 rounded bg-primary-700 text-center font-semibold uppercase text-white"
            onClick={handleUpdate}
          >
            {t('Update')}
          </button> */}
          <button
            disabled={Loader}
            className="flex h-10 items-center justify-center gap-x-1 rounded bg-primary-700 py-2 px-4 text-center text-lg font-semibold uppercase text-white"
            onClick={handleUpdate}
          >
            {Loader && (
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
            <span>{t(`Update`)}</span>
          </button>
          <div
            className="flex cursor-pointer "
            onClick={() => setChangePasswordVisible(true)}
          >
            <span className=" cursor-pointer font-semibold text-active hover:opacity-70">
              Change password?
            </span>
            {/* <span className="cursor-pointer font-semibold text-primary hover:opacity-70">
              send Reset Code
            </span> */}
          </div>
        </div>
      </div>
      <Modal
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        onOk={() => setChangePasswordVisible(false)}
      >
        <ChangePassword
          done={() => {
            setChangePasswordVisible(false);
          }}
        />
      </Modal>
    </div>
  );
}
