// import logo from '@assets/logo.png';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { SocialIcon } from 'react-social-icons';

export default function CommonFooter() {
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  if (!configurations.email) return null;

  return (
    <div className="flex w-full justify-center ">
      <ul className=" text-primary flex max-w-xl flex-col justify-center gap-2 overflow-x-auto rounded-xl p-2 text-2xl text-white ">
        {configurations.email && (
          <li className="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-primary h-4 w-4 shrink-0"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <a
              className="text-active hover:text-white active:text-active"
              href={`mailto:${configurations.email}?subject = Feedback`}
            >
              {configurations.email}
            </a>
          </li>
        )}
        {configurations.telphone && (
          <li className="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className=" h-4 w-4 shrink-0 text-primary-500"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col">
              <div
                className="text-primary hover:text-primary active:text-primary flex gap-x-2 text-sm"
                // href="tel:+251 9-27-111-119"
              >
                {configurations.telphone && (
                  <span className="flex flex-wrap gap-1 ">
                    {[...configurations.telphone.split(',')].map(
                      (item, idx, arr) => (
                        <span key={item}>
                          {idx != arr.length - 1 ? item + ',' : item}
                        </span>
                      )
                    )}
                  </span>
                )}
              </div>
            </div>
          </li>
        )}
        <li className="flex items-center gap-y-1 gap-x-2 px-2 py-1">
          <div className="flex w-full justify-around gap-4 ">
            {configurations.facebook && (
              <a
                href={configurations.facebook ?? ''}
                target={'_blank'}
                // className="flex  max-h-12 w-full  items-center gap-x-2 rounded bg-primary px-2 py-1 font-semibold text-font-dark md:h-12 md:w-40"
                rel="noreferrer noopener"
              >
                <FacebookIcon
                  {...{
                    round: true,
                    size: 30,
                  }}
                />
              </a>
            )}

            {configurations.instagram && (
              <a
                href={configurations.instagram ?? ''}
                target={'_blank'}
                className="flex  items-center"
                rel="noreferrer noopener"
              >
                <SocialIcon
                  network="instagram"
                  url={configurations.instagram ?? ''}
                  style={{ height: 29, width: 29 }}
                />
              </a>
            )}
            {configurations.twitter && (
              <a
                href={configurations.twitter ?? ''}
                target={'_blank'}
                // className="flex  max-h-12 w-full  items-center gap-x-2 rounded bg-primary px-2 py-1 font-semibold text-font-dark md:h-12 md:w-40"
                rel="noreferrer noopener"
              >
                <TwitterIcon
                  {...{
                    round: true,
                    size: 30,
                  }}
                />
              </a>
            )}
            {configurations.telegram && (
              <a
                href={configurations.telegram ?? ''}
                target={'_blank'}
                // className="flex  max-h-12 w-full  items-center gap-x-2 rounded bg-primary px-2 py-1 font-semibold text-font-dark md:h-12 md:w-40"
                rel="noreferrer noopener"
                // url={HOME_URL}
                // title={"title"}
              >
                <TelegramIcon
                  {...{
                    round: true,
                    size: 30,
                  }}
                />
              </a>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
