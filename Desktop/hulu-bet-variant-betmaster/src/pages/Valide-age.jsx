import howToPlayNew from '@assets/howToPlayNew.json';
import Collapse from '@components/Collapse';
import PageLoader from '@components/LoaderPages/PageLoader';
import API from '@services/API';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Empty from '@components/Empty';

export default function ValidAge() {
  const [expand, setExpand] = useState(false);
  const [rules, setRules] = useState();
  const [selectedItem, setSelectedItem] = useState(null);

  const ruleRef = useRef(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/rules/', null, null)
      .then(({ data }) => {
        setRules(data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
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
    <div>
      <div
        ref={ruleRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('underAgeRule')}
          </span>
        </div>
      </div>

      {!loading && configurations?.underage_rule && (
        <div className="flex  flex-col gap-3 px-6 py-4 text-white">
          {ReactHtmlParser(configurations.underage_rule)}
        </div>
      )}
      {!loading && !rules?.note && (
        <Empty message={'Under age rules not available now.'} />
      )}
      {loading && <PageLoader />}
    </div>
  );
}
