import React, { useEffect, useState } from 'react';

import API from '@services/API';
import { useTranslation } from 'react-i18next';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PageLoader from '@components/LoaderPages/PageLoader';

export default function Promotions() {
  const [loading, setLoading] = useState(false);
  const [promos, setPromos] = useState([]);

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('promo-descriptions/', null, null)
      .then((response) => {
        setPromos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-auto">
      <div
        className="flex h-9   items-center bg-header pr-2"
        onClick={() => {
          // console.log('change view to Type');
        }}
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {'PROMOTION'}
          </span>
        </div>
        {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
      </div>
      <div className="grid w-full grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {!loading &&
          promos.map((promo, idx) => (
            <div
              key={idx}
              className="col-span-1 flex cursor-pointer flex-col rounded-lg bg-secondary-600 px-4 py-3 shadow-lg hover:bg-opacity-70 "
              onClick={() => {
                navigate(`/promotion/${promo.id}`);
              }}
            >
              <img
                className="h-60 w-80 rounded-md"
                src={
                  i18n.resolvedLanguage == 'Am'
                    ? promo.thumbnail
                    : promo.thumbnail
                }
                alt="Free bet bonu"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <span className=" text-lg text-white">
                  {i18n.resolvedLanguage == 'Am' ? promo.title : promo.title}
                </span>
                <div className="flex items-center gap-2 text-active">
                  <span className="text-primary text-lg font-semibold uppercase">
                    Read More
                  </span>
                  <FaLongArrowAltRight className="text-primary text-2xl" />
                </div>
              </div>
            </div>
          ))}
        {loading && <PageLoader />}
      </div>
    </div>
  );
}
