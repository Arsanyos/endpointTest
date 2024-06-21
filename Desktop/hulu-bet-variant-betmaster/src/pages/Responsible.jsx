import API from '@services/API';
import React, { useEffect, useRef, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';
import PageLoader from '@components/LoaderPages/PageLoader';
import Empty from '@components/Empty';
import { useTranslation } from 'react-i18next';

export default function responsible() {
  const [loading, setLoading] = useState(false);
  const [responsible, setResponsible] = useState([]);
  const responsibleRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/responsible/', null, null)
      .then((response) => {
        setResponsible(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (responsibleRef.current !== null) {
      responsibleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [responsibleRef.current]);

  // console.log(configurations);
  // console.log(responsible);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div
        ref={responsibleRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('ResponsibleGaming')}
          </span>
        </div>
      </div>

      <div className="flex  flex-col gap-3 px-6 py-4 pb-20 text-white">
        {!loading && responsible?.note && (
          <>{ReactHtmlParser(responsible.note)}</>
        )}
        {!loading && !responsible?.note && (
          <Empty message={'responsible and conditions not available now.'} />
        )}
      </div>
      {loading && <PageLoader />}
    </div>
  );
}
