import ReactHtmlParser from 'html-react-parser';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import API from '@services/API';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function PromotionsDetail() {
  const [loading, setLoading] = useState(false);

  const [selectedPromo, setSelectedPromo] = useState({});
  let { selectedPromotion } = useParams();
  const navigate = useNavigate();

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const promoRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (promoRef.current !== null) {
      promoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [promoRef.current]);

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('promo-descriptions/', null, null)
      .then((response) => {
        const selected = response.data.find(
          (item) => item.id == selectedPromotion
        );
        setLoading(false);
        setSelectedPromo(selected);
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="flex h-9   items-center bg-secondary-600 pr-2">
        <div
          ref={promoRef}
          className="flex w-full items-center justify-between px-4 "
        >
          <div
            className="cursor-pointer text-2xl font-semibold text-white "
            onClick={() => navigate('/promotion')}
          >
            <span>‹</span>
          </div>
          <div className="text-lg text-white">{t('PromotionDetail')}</div>
          <div></div>
        </div>
        {/* <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" /> */}
      </div>

      <div className="m-2 flex gap-4 rounded bg-primary-600 px-6 py-4 xl:gap-6">
        {!loading && selectedPromo?.title ? (
          <div className="m-4 flex flex-col text-white">
            <h6 className="text-white">
              {i18n.resolvedLanguage == 'Am'
                ? selectedPromo.title
                : selectedPromo.title}
            </h6>

            <span>
              <strong>
                {i18n.resolvedLanguage == 'Am'
                  ? `እንዴት ነው የሚሰራው?`
                  : `How its work?`}
              </strong>
            </span>

            {ReactHtmlParser(selectedPromo?.description)}
          </div>
        ) : null}
      </div>
      {/* </div> */}
    </div>
  );
}
