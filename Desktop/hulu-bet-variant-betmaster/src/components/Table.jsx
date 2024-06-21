import React from 'react';
import ToolTip from './ToolTip';
import FormatEntity from '@services/format_entity';
import Utils from '@services/utils';
import { useTranslation } from 'react-i18next';

export default function Table(props) {
  const { data, bet_types, lang } = props;
  const { t, i18n } = useTranslation();

  return (
    <table className="w-full overflow-hidden rounded-lg">
      <thead className="flex h-9 w-full items-center justify-evenly  bg-[#C7C7C7]">
        <th className="w-1/2 text-center">Date</th>
        <th className="w-1/2 text-center">Match</th>
        <th className="w-1/2 text-center">Market</th>
        <th className="w-1/2 text-center">Your Pick</th>
      </thead>
      <tbody className="flex h-40 w-full flex-col bg-[#F1F1F1]">
        {data?.map((s, i) => {
          const betType = Utils.replaceName(
            Utils.localizeBetTypes(
              bet_types[s.bet_type.id],
              s.bet_type ? s.bet_type.name : ''
            ),
            s.item ? s.item.param : '',
            s.match.hom,
            s.match.awy,
            s.match.hometeam_locale,
            s.match.awayteam_locale
          );
          const formatedPick = FormatEntity.formatPickName(
            betType,
            null,
            s.item.specifier
          );
          const formatedGroupType = FormatEntity.formatMarketName(
            s.bet_group.name,
            Object.values(s.item.specifier).length > 0
              ? this.state.selectedEvent
              : null,
            s.item.specifier
          );
          const betMarket = Utils.replaceName(
            formatedGroupType,
            s.item ? s.item.param : '',
            s.match.hom,
            s.match.awy
          );
          return (
            <div className="flex flex-col" key={i}>
              <tr className="flex rounded-[5px] border-0 border-b-2 p-2.5 odd:bg-[#C7C7C7]  even:bg-neutral-100">
                <td className="flex items-center justify-center">
                  <ToolTip placement="bottom" title={t('MATCHES')}>
                    <span
                      style={{
                        color: 'white',
                        paddingTop: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {(i18n.resolvedLanguage == 'Am' &&
                      s.match.hometeam_locale != null
                        ? s.match.hometeam_locale
                        : s.match.hom) +
                        ' ' +
                        t('VS') +
                        ' ' +
                        (i18n.resolvedLanguage == 'Am' &&
                        s.match.awayteam_locale != null
                          ? s.match.awayteam_locale
                          : s.match.awy)}
                    </span>
                  </ToolTip>
                </td>
                <td className="flex items-center justify-center">
                  <ToolTip placement="bottom" title={t('Market')}>
                    <span
                      style={{
                        color: 'white',
                        paddingTop: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {betMarket}
                    </span>
                  </ToolTip>
                </td>
                <td className="flex items-center justify-center">
                  <ToolTip placement="bottom" title={t('YOURPICK')}>
                    <span
                      style={{
                        color: 'white',
                        paddingTop: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {formatedPick}
                    </span>
                  </ToolTip>
                </td>
                <td className="flex items-center justify-center">
                  <ToolTip placement="bottom" title={t('ODD')}>
                    <span
                      style={{
                        color: 'white',
                        paddingTop: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {s.odd}
                    </span>
                  </ToolTip>
                </td>
              </tr>
            </div>
          );
        })}
      </tbody>
    </table>
  );
}
