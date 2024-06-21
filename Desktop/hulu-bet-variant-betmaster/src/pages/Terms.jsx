import API from '@services/API';
import React, { useEffect, useRef, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';
import PageLoader from '@components/LoaderPages/PageLoader';
import Empty from '@components/Empty';

export default function Terms() {
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState([]);
  const termsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/terms/', null, null)
      .then((response) => {
        setTerms(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (termsRef.current !== null) {
      termsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [termsRef.current]);

  // console.log(configurations);
  // console.log(terms);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div
        ref={termsRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {'Terms and Conditions'}
          </span>
        </div>
      </div>

      <div className="flex  flex-col gap-3 px-6 py-4 text-white">
        {!loading && terms?.note && <>{ReactHtmlParser(terms.note)}</>}
        {!loading && !terms?.note && (
          <Empty message={'Terms and conditions not available now.'} />
        )}
      </div>
      {loading && <PageLoader />}
    </div>
  );
}
