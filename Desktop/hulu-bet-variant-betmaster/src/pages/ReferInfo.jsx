import { message } from 'antd';
import { FaCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import React from 'react';
import API from '@services/API';
import { useTranslation } from 'react-i18next';
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

export default function ReferInfo() {
  const userDetail = useSelector((state) => state.user.userDetail);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const { t, i18n } = useTranslation();

  const referalURL = `${API.HOME_URL}?referal=` + userDetail.id;
  const handleCopy = () => {
    navigator.clipboard.writeText(referalURL);
    message.success('Copied!');
  };

  const ICON_DEFAULTS = {
    round: true,
    size: 30,
  };
  return (
    <div className=" flex h-full w-full flex-1 flex-col items-center justify-start gap-y-4 bg-white px-8 py-8 md:bg-inherit">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 md:w-[350px]">
        <h1 className="text-2xl font-semibold text-black  ">
          {t('ReferalCode')}
        </h1>
        <div className="flex justify-center gap-x-2 text-black  ">
          <h1 className="text-4xl font-semibold text-black   ">
            {userDetail.id}
          </h1>
          <FaCopy
            role="button"
            className="cursor-pointer text-lg text-active"
            onClick={handleCopy}
          />
        </div>
        <hr className="w-full bg-gray-300 text-white md:bg-white" />
        <div className="flex flex-col items-center justify-center gap-1 text-black ">
          <p className="m-0">Share referral code via:</p>
          <div className="flex gap-2 text-black ">
            <FacebookShareButton url={referalURL}>
              <FacebookIcon {...ICON_DEFAULTS} />
            </FacebookShareButton>
            <WhatsappShareButton url={referalURL}>
              <WhatsappIcon {...ICON_DEFAULTS} />
            </WhatsappShareButton>
            <TwitterShareButton url={referalURL}>
              <TwitterIcon {...ICON_DEFAULTS} />
            </TwitterShareButton>
            <TelegramShareButton
              url={referalURL}
              // title={"title"}
            >
              <TelegramIcon {...ICON_DEFAULTS} />
            </TelegramShareButton>
          </div>
        </div>
        <p className="m-0 text-lg text-black ">
          Note: With every successful referral, you earn{' '}
          {t(configurations?.currency)} 10. Your earnings will be directly
          credited to your wallet.
        </p>
      </div>
    </div>
  );
}
