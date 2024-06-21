import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import API from '../services/API';
import Utils from '../services/utils';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CountryLeagues from './CountryLeagues';
import { updateConfigurationsCountryFilterTime } from '@ReduxStore/configurationSlice';

function CountryList({
  league_groups,
  sportTypeId,
  onClose,
  onCountrySelect,
  onLeagueSelect,
}) {
  const [countryId, setCountryId] = useState();

  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const league_group_leagues = useSelector(
    (state) => state.coreData.league_group_leagues
  );
  const changeSelectedCountry = (id) => {
    if (countryId != id) {
      setCountryId(id);
    } else {
      setCountryId(null);
    }
  };
  return league_groups.map((country, i) => {
    const is_country_selected = countryId == country.id;

    country = {
      id: country.id,
      text:
        i18n.resolvedLanguage == 'Am' && country.locales[0]
          ? country.locales[0].translation
          : country.name,
      icon: country.logo,
      extra: true,
      order: country.order,
      name: country.name,
      locales: country.locales,
    };
    country.child = league_group_leagues[country.id];

    if (
      !league_group_leagues[country.id] ||
      league_group_leagues[country.id].length == 0 ||
      league_group_leagues[country.id].filter((l) => l.match_count != 0)
        .length == 0
    ) {
      return null;
    }

    return (
      <div key={'country_' + i} className=" text-leftbar-country-font">
        <div
          className="group flex h-8 cursor-pointer flex-row items-center justify-between "
          onClick={(e) => {
            e.preventDefault();
            if (onCountrySelect) {
              onCountrySelect(country.id);
              dispatch(
                updateConfigurationsCountryFilterTime({
                  countryTimeFilter: 'All',
                })
              );
            } else {
              dispatch(
                updateConfigurationsCountryFilterTime({
                  countryTimeFilter: 'All',
                })
              );
              navigate(`matchs/${sportTypeId}/${country.id}`);
            }
            if (onClose) onClose();
          }}
        >
          <div className="flex flex-row items-center gap-2 ">
            <div span={3}>
              {country.icon ? (
                <img
                  src={
                    Utils.validURL(country.icon)
                      ? country.icon
                      : new URL(country.icon, API.API_BASE_URL)
                  }
                  className="h-4 w-4 rounded-full"
                />
              ) : null}
            </div>
            <div className="flex items-center justify-between truncate ">
              {country.text}
            </div>
          </div>
          <span
            className={`  ${
              is_country_selected
                ? 'block '
                : 'block group-hover:block  group-hover:cursor-pointer md:hidden'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              changeSelectedCountry(country.id);
            }}
          >
            {is_country_selected ? '-' : '+'}
          </span>
        </div>

        {is_country_selected && (
          <div className="ml-6 flex flex-col gap-[1px] divide-y-[1px] divide-primary-600  ">
            <CountryLeagues
              leagueId={country.id}
              onClose={onClose}
              onLeagueSelect={onLeagueSelect}
            />
          </div>
        )}
      </div>
    );
  });
}

export default CountryList;
