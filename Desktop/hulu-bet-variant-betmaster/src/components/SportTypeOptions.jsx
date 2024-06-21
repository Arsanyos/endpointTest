import React from 'react';

import { useSelector } from 'react-redux';
import CountryList from './CountryList';

export default function SportTypeOptions({
  st,
  onClose,
  onCountrySelect = null,
  onLeagueSelect = null,
}) {
  const sport_type_league_groups = useSelector(
    (state) => state.coreData.sport_type_league_groups
  );

  return (
    <>
      <div className="min-w-48 flex flex-col gap-[1px] ">
        <div className="flex flex-col divide-y-[1px] divide-primary-600">
          <CountryList
            sportTypeId={st.id}
            league_groups={sport_type_league_groups[[st.id]]}
            onClose={onClose}
            onCountrySelect={onCountrySelect}
            onLeagueSelect={onLeagueSelect}
          />
        </div>
      </div>
    </>
  );
}
