import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function DownloadFixture() {
  const { t } = useTranslation();
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  return (
    <div className="z-10 mb-2 flex h-9 shrink-0 items-center justify-end ">
      <a
        href={configurations.fixture_url}
        target="_blank"
        rel="noreferrer"
        className=" mx-0.5 flex h-full w-full cursor-pointer items-center justify-center gap-x-2 rounded bg-active px-2 text-xs capitalize text-active-font hover:text-white"
      >
        <FaCloudDownloadAlt className="text-xl" />
        <span>{t('Download') + ' ' + t('Fixtures')}</span>
      </a>
    </div>
  );
}
