import PageLoader from '@components/LoaderPages/PageLoader';
import API from '@services/API';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';
import Empty from '@components/Empty';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function About() {
  const [rules, setRules] = useState();

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  //
  const ruleRef = useRef(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/rules/', null, null)
      .then(({ data }) => {
        setRules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (ruleRef.current !== null) {
      ruleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [ruleRef.current]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={ruleRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('About')}
          </span>
        </div>
      </div>
      <div className="flex  h-full w-full flex-col gap-3 px-6 py-4 text-white">
        {!loading && configurations?.about_company && (
          <>{ReactHtmlParser(configurations?.about_company)}</>
        )}

        {!loading && !configurations?.about_company && (
          <Empty message={'Information is not available now.'} />
        )}
      </div>
      {loading && <PageLoader />}
    </div>
  );
}
