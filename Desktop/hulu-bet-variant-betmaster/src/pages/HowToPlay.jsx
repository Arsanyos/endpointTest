import howToPlayNew from '@assets/howToPlayNew.json';
import Collapse from '@components/Collapse';
import PageLoader from '@components/LoaderPages/PageLoader';
import API from '@services/API';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Empty from '@components/Empty';

export default function HowToPlay() {
  const [expand, setExpand] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const ruleRef = useRef(null);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/rules/', null, null)
      .then((response) => {
        setRules(response.data);
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

    // return (ruleRef.current = null);
  }, [ruleRef.current]);

  const changeCollapseFAQ = (id) => {
    if (selectedItem == id && expand == true) {
      setExpand((expand) => !expand);
    } else if (selectedItem == id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else if (selectedItem != id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else {
      setSelectedItem(id);
    }
  };

  return (
    <div>
      <div
        ref={ruleRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('Howtoplay')}
          </span>
        </div>
      </div>

      <div className="flex  flex-col gap-3 px-6 py-4 text-white ">
        {!loading && rules?.note && <>{ReactHtmlParser(rules.note)}</>}
      </div>
      {!loading && !rules?.note && (
        <Empty message={'How to play not available now.'} />
      )}
      {loading && <PageLoader />}
    </div>
  );
}
