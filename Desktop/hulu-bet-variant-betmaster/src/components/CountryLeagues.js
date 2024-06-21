import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function CountryLeagues({ leagueId, onClose = null, onLeagueSelect = null }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const league_group_leagues = useSelector(
    (state) => state.coreData.league_group_leagues
  );
  return league_group_leagues[leagueId].map((c, k) => {
    if (c.match_count == 0) {
      return null;
    }
    let league_name =
      i18n.resolvedLanguage.toUpperCase() == 'AM' &&
      c.locales &&
      c.locales.length != 0
        ? c.locales[0].translation
        : c.name;
    return (
      <div
        key={'child' + k}
        className="flex h-9 cursor-pointer flex-row items-center justify-between "
        onClick={(e) => {
          e.preventDefault();
          if (onLeagueSelect) {
            onLeagueSelect(c.id);
          } else navigate(`/matchs/${c.id}`);
          if (onClose) onClose();
        }}
      >
        <span className="truncate">{league_name}</span>
        <span>({c.match_count})</span>
      </div>
    );
  });
}

export default CountryLeagues;
