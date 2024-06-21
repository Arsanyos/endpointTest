import phone from '@assets/img/phone.png';
import React from 'react';
// import phone_telegram from '@assets/img/Phone_Telegram.png';
import phone_am from '@assets/img/phone_am.png';
import { useTranslation } from 'react-i18next';
import { AiFillAndroid, AiFillApple } from 'react-icons/ai';
import { useSelector } from 'react-redux';
export default function Apps() {
  const ref = React.useRef();
  const { i18n } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  if (!configurations.android_app_url && !configurations.ios_app_url)
    return null;

  return (
    <div className="flex h-full items-start justify-center overflow-hidden overflow-y-scroll py-4 ">
      <div className="flex flex-col gap-y-4 overflow-hidden px-6 pt-4 text-white md:flex-row md:gap-8 md:pt-8 ">
        <div className=" hidden w-full flex-1 justify-end md:flex ">
          <img src={phone} className="w-64" alt="" />
        </div>
        <div className="flex w-full flex-1 flex-col items-start justify-start gap-y-4 md:h-[521px] md:justify-end md:gap-y-8 ">
          <p className="text-whtie mb-0 text-2xl font-semibold md:text-4xl">
            {/* {i18n.resolvedLanguage == 'Am'
              ? 'በሞባይል መተግበሪያችን እና በቴሌግራም ቦት በቀላሉ ይጫወቱ'
              : 'Bet easily with our mobile app and Telegram bot'} */}
            {i18n.resolvedLanguage == 'Am'
              ? 'በሞባይል መተግበሪያችን በቀላሉ ይጫወቱ'
              : 'Bet easily with our mobile app'}
          </p>
          <div className="md:jus flex w-full justify-evenly gap-4 md:w-auto  md:flex-col">
            {configurations.android_app_url && (
              <a
                href={configurations.android_app_url}
                target={'_self'}
                // download={'Topbet7.apk'}
                className="flex  max-h-12 w-full  items-center gap-x-2 rounded bg-primary-700 px-2 py-1 font-semibold text-font-dark md:h-12 md:w-40"
                rel="noreferrer noopener"
              >
                <AiFillAndroid className="text-xl " />
                <span>Android</span>
              </a>
            )}
            {configurations.ios_app_url && (
              <a
                href={configurations.ios_app_url}
                target={'_self'}
                // download={'Topbet7.apk'}
                className="flex  max-h-12 w-full  items-center gap-x-2 rounded bg-primary-700 px-2 py-1 font-semibold text-font-dark md:h-12 md:w-40"
                rel="noreferrer noopener"
              >
                <AiFillApple className="text-xl " />
                <span>Ios</span>
              </a>
            )}

            {/* <a
              href="#"
              target={'_self'}
              className="flex h-12 w-full items-center gap-x-2 rounded bg-sky-500 px-2 py-1 font-semibold text-font-light md:w-40"
              rel="noreferrer noopener"
            >
              <FaTelegramPlane className="text-xl " />
              <span>Telegram bot</span>
            </a> */}
          </div>
        </div>
        <div className="flex snap-x flex-col items-center justify-center gap-x-4 text-white md:hidden ">
          {/* <div className="flex w-fit shrink-0 snap-center flex-col gap-y-2">
            <h4 className="m-0 w-64 text-white">Inside Telegram</h4>
            <p className="m-0 w-64">
              {i18n.resolvedLanguage == 'Am'
                ? 'የምትወደውን የቻት አፕ ቴሌግራም አትተው'
                : "Don't leave your favorite chat app Telegram"}
            </p>
            <img src={phone_telegram} className="w-full flex-shrink-0" alt="" />
          </div> */}
          <div className="flex w-full shrink-0  snap-center flex-col gap-y-2">
            <h4 className="m-0 w-64 font-semibold text-white">
              {i18n.resolvedLanguage == 'Am' ? 'አዲስ አቀራረብ' : 'A new approach'}
            </h4>
            <p className="m-0 w-64">
              {i18n.resolvedLanguage == 'Am'
                ? 'ለአጠቃቀም ቀላል በሆነ የሞባይል መተግበሪያ በተመቻቸ ሁኔታ ይጫወቱ።'
                : 'Bet conveniently with an easy to use mobile app.'}
            </p>
            <img
              src={i18n.resolvedLanguage == 'Am' ? phone_am : phone}
              className="w-full flex-shrink-0"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
