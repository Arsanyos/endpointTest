import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { updateEventGames } from '../store/eventSlice';
import {
  updateFavGamesList,
  updateMarketTypeFavs,
} from '../store/coreDataSlice';
import API from '../services/API';
import slip_ball_icon from '../assets/img/slip_ball_icon.png';
import Utils from '../services/utils';
import ClientSession from '../services/client-session';
import { useTranslation } from 'react-i18next';
import FormatEntity from '@services/format_entity';
import MultiBonus from '@services/multibetbonus';
import flatoddutils from 'flatoddutils';
import { message } from 'antd';

export const useEvent = () => {
  const dispatch = useDispatch();

  const league_events = useSelector((state) => state.coreData.league_events);
  const coreData = useSelector((state) => state.coreData.coreData);
  const timeFilter = useSelector((state) => state.configuration.timeFilter);
  const favGamesList = useSelector((state) => state.coreData.favGamesList);
  const marketTypeFav = useSelector((state) => state.coreData.marketTypeFav);
  const allEvents = useSelector((state) => state.coreData.allEvents);
  const { t, i18n } = useTranslation();
  const slips = useSelector((state) => state.slip.slips);
  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const bet_types = useSelector((state) => state.coreData.bet_types);

  const groupedData = useSelector((state) => state.Event?.groupedData);
  const league_groups = useSelector((state) => state.coreData?.league_groups);
  const sportTypeEvents = useSelector(
    (state) => state.coreData.sportTypeEvents
  );
  const sportTypeId = useSelector((state) => state.configuration.sportTypeId);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const sport_type_league_groups = useSelector(
    (state) => state.coreData.sport_type_league_groups
  );
  const leagues = useSelector((state) => state.coreData?.leagues);

  const getEvent = (id, timeFilter) => {
    let data = league_events[id] ? league_events[id] : [];
    console.log('data', data);

    if (timeFilter != 'ALL') {
      data = data.filter((e) => {
        let gmameTime = moment(e.schedule);
        let now = moment(coreData ? coreData.time : null);
        let diff = Math.abs(moment.duration(gmameTime.diff(now)).asHours());
        if (diff <= timeFilter) {
          return true;
        } else {
          return false;
        }
      });
    }
    dispatch(
      updateEventGames({
        selectedEventGames: data,
        selectedEventGames2: data,
      })
    );
  };
  const getLeagueEvent = (id, timeFilter) => {
    let data = league_events[id] ? league_events[id] : [];
    if (timeFilter != 'All') {
      data = data.filter((e) => {
        let gmameTime = moment(e.schedule);
        let now = moment(coreData ? coreData.time : null);
        let diff = Math.abs(moment.duration(gmameTime.diff(now)).asHours());
        if (diff <= timeFilter) {
          return true;
        } else {
          return false;
        }
      });
    }
    return data;
  };

  const getFavLeagueEvents = (fav_leagues) => {
    return fav_leagues.map((league) => {
      const leage_detail = { ...league };
      leage_detail.text = leagues[league.id].name;
      leage_detail.order = leagues[league.id].order;
      leage_detail.locales = leagues[league.id].locales;
      leage_detail.league_group_id = leagues[league.id].league_group;
      const league_events = getLeagueEvent(league.id, 'All');
      leage_detail.events = league_events;
      return leage_detail;
    });
  };

  const getSportTypeLogo = (leagueId) => {
    if (
      coreData.leagues &&
      coreData.leagues.length > 0 &&
      coreData.leagues.filter((l) => l.id == leagueId).length != 0
    ) {
      var stid = coreData.leagues.filter((l) => l.id == leagueId)[0].sport_type;
      var st = coreData.sport_types.filter((l) => l.id == stid)[0];
      return Utils.validURL(st.logo)
        ? st.logo
        : new URL(st.logo, API.API_BASE_URL);
    } else {
      return slip_ball_icon;
    }
  };
  const getLogoBySportType = (sportID) => {
    if (coreData.sport_types && coreData.sport_types.length > 0) {
      var st = coreData.sport_types.filter((l) => l.id == sportID)[0];
      return Utils.validURL(st.logo)
        ? st.logo
        : API.API_BASE_URL + '' + st.logo;
    } else {
      return slip_ball_icon;
    }
  };

  const searchEvent = (value) => {
    if (value == '' && allEvents != undefined) {
      return [...allEvents];
    } else {
      const data = allEvents.filter(
        (s) =>
          s.hom.toLowerCase().includes(value.toLowerCase()) ||
          s.awy.toLowerCase().includes(value.toLowerCase())
      );
      return data;
    }
  };

  const searchLeagueEvent = (query, grouped_Data) => {
    if (query == '' && grouped_Data != undefined) {
      return [...grouped_Data];
    } else {
      const current_grouped_Data = [...grouped_Data];
      const filtered_grouped_Data = current_grouped_Data.filter((gd) => {
        if (
          gd?.text.toLowerCase().includes(query.toLowerCase())
          // || gd.awy.toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        } else {
          const filtered_events = gd.events.filter(
            (s) =>
              s.hom.toLowerCase().includes(query.toLowerCase()) ||
              s.awy.toLowerCase().includes(query.toLowerCase())
          );
          if (filtered_events.length == 0) return false;
          gd.events = filtered_events;
          return gd;
        }
      });
      return filtered_grouped_Data;
    }
  };
  const searchMarket = (query, market_list) => {
    if (query == '' && market_list != undefined) {
      return [...market_list];
    } else {
      const current_market_list = [...market_list];
      const filtered_market_list = current_market_list.filter((gd) => {
        if (gd.bet_group?.name.toLowerCase().includes(query.toLowerCase())) {
          return true;
        } else {
          const group_item = { ...gd };
          const filtered_odds = gd.odds?.filter((o) =>
            o.bet_type.name.toLowerCase().includes(query.toLowerCase())
          );
          if (filtered_odds.length == 0) return false;
          group_item.odds = filtered_odds;
          return group_item;
        }
      });
      return filtered_market_list;
    }
  };

  const getSportType = (lid) => {
    var lg = coreData.leagues.filter((l) => l.id == lid)[0];
    if (lg == null) {
      return -1;
    } else {
      return lg.sport_type;
    }
  };

  const addToFav = (id, icon, name) => {
    if (isfav(id)) {
      let f = favGamesList?.filter((f) => f.id != id);
      dispatch(updateFavGamesList({ favGamesList: f }));
      ClientSession.storeFav(f, (err) => {});
    } else {
      let f = [...favGamesList];
      f.push({ id: id, logo: icon, name: name });
      dispatch(updateFavGamesList({ favGamesList: f }));
      ClientSession.storeFav(f, (err) => {});
    }
  };
  const addMarketTypeToFav = (id) => {
    // const favMarketTypesList = ClientSession.getMarketTypeFav();
    if (isMarketTypeFav(id)) {
      let favs = marketTypeFav?.filter((mtId) => mtId != id);
      dispatch(updateMarketTypeFavs({ marketTypeFav: favs }));
      ClientSession.storeMarketTypeFav(favs);
    } else {
      let favs = [...marketTypeFav];
      favs.push(id);
      dispatch(updateMarketTypeFavs({ marketTypeFav: favs }));
      ClientSession.storeMarketTypeFav(favs);
    }
  };

  const isfav = (id) => {
    if (favGamesList.filter((f) => f.id == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };
  const isMarketTypeFav = (id) => {
    // const favMarketTypesList = ClientSession.getMarketTypeFav();
    return marketTypeFav?.includes(id);
  };

  const localizeBetTypes = (id, value) => {
    if (i18n.resolvedLanguage == 'Am') {
      if (bet_types[id]?.locales?.filter((l) => l.locale == 1)[0]) {
        return bet_types[id].locales.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const getSlips = (id) => {
    return new Promise((resolve, reject) => {
      const url = `online/slips/${id}/public/`;
      API.findWithNoToken(url, null, null)
        .then((response) => {
          if (response.data) resolve(response.data);
          reject('Slip not found!');
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getSummary = (stake, slipData) => {
    const match_count = slipData?.length;

    let total_odd = match_count == 0 ? 0 : 1;

    slipData.forEach((s) => {
      total_odd = total_odd * s.odd;
    });

    const max_odd = slipData.reduce(
      (prev_odd, cur) => (cur.odd > prev_odd ? cur.odd : prev_odd),
      0
    );
    const min_odd = slipData.reduce(
      (prev_odd, cur) => (cur.odd < prev_odd ? cur.odd : prev_odd),
      Infinity
    );

    const multiSC = flatoddutils?.getSlipComputer(
      configurations?.slip_computer_class, //slip computer class name
      stake,
      total_odd, // total odd
      match_count, // match count
      min_odd, // min_odd
      max_odd // max_odd
    );

    // debugger;

    const stake_Net = multiSC.get_stake();
    const vat_tax = multiSC.get_initial_tax();
    const win_value = multiSC.get_win_value();
    const total_tax = multiSC.calculate_tax();
    const paynet = multiSC.get_net_pay();
    const bonus = multiSC.get_bonus_value();
    const bonus_msg = multiSC.get_note();
    let percentage = 0;
    if (match_count > 2 && multiSC.is_odd_bonus_eligible) {
      percentage = multiSC.get_percentages(match_count);
    }
    const winning_or_with_holding_tax_label = multiSC.get_after_0_label(
      i18n.language
    ); // -> Winning Tax/With holding tax
    const vat_or_excise_tax_label = multiSC.get_before_0_label(i18n.language); // -> Vat/Excise Tax

    let summeryData = {
      stakeNet: Number(stake_Net)?.toFixed(2),
      vat: Number(vat_tax)?.toFixed(2),
      tax_label: winning_or_with_holding_tax_label,
      vat_label: vat_or_excise_tax_label,
      win: Number(win_value)?.toFixed(2),
      tax: Number(total_tax)?.toFixed(2),
      netWin: Number(paynet)?.toFixed(2),
      bonus: Number(bonus)?.toFixed(2),
      bonusMsg: bonus_msg,
      percentage: percentage,
    };
    return summeryData;
  };

  const getSummaryFlatOddUtils = (stake, slipData, slipClass) => {
    const match_count = slipData?.length;

    let total_odd = match_count == 0 ? 0 : 1;

    slipData.forEach((s) => {
      total_odd = total_odd * s.odd;
    });

    const max_odd = slipData.reduce(
      (prev_odd, cur) => (cur.odd > prev_odd ? cur.odd : prev_odd),
      0
    );
    const min_odd = slipData.reduce(
      (prev_odd, cur) => (cur.odd < prev_odd ? cur.odd : prev_odd),
      Infinity
    );

    const multiSC = flatoddutils?.getSlipComputer(
      slipClass, //slip computer class name
      stake,
      total_odd, // total odd
      match_count, // match count
      min_odd, // min_odd
      max_odd // max_odd
    );

    // debugger;

    const stake_Net = multiSC.get_stake();
    const vat_tax = multiSC.get_initial_tax();
    const win_value = multiSC.get_win_value();
    const total_tax = multiSC.calculate_tax();
    const paynet = multiSC.get_net_pay();
    const bonus = multiSC.get_bonus_value();
    const bonus_msg = multiSC.get_note();
    let percentage = 0;
    if (match_count > 2 && multiSC.is_odd_bonus_eligible) {
      percentage = multiSC.get_percentages(match_count);
    }
    const winning_or_with_holding_tax_label = multiSC.get_after_0_label(
      i18n.language
    ); // -> Winning Tax/With holding tax
    const vat_or_excise_tax_label = multiSC.get_before_0_label(i18n.language); // -> Vat/Excise Tax

    let summeryData = {
      stakeNet: stake_Net?.toFixed(2),
      vat: vat_tax?.toFixed(2),
      tax_label: winning_or_with_holding_tax_label,
      vat_label: vat_or_excise_tax_label,
      win: win_value?.toFixed(2),
      tax: total_tax?.toFixed(2),
      netWin: paynet?.toFixed(2),
      bonus: bonus?.toFixed(2),
      bonusMsg: bonus_msg,
      percentage: percentage,
    };

    return summeryData;
  };

  const prepareSlip = (data) => {
    let newSlips = { ...slips };
    data.game_picks.forEach(async (g) => {
      try {
        let title =
          (i18n.resolvedLanguage == 'Am' && g.match.hometeam_locale != null
            ? g.match.hometeam_locale
            : g.match.hom) +
          ' ' +
          t('VS') +
          ' ' +
          (i18n.resolvedLanguage == 'Am' && g.match.awayteam_locale
            ? g.match.awayteam_locale
            : g.match.awy);

        const betType = Utils.replaceName(
          localizeBetTypes(g.bet_type.id, g.bet_type ? g.bet_type.name : ''),
          g.item ? g.item.param : '',
          g.match.hom,
          g.match.awy,
          g.match.hometeam_locale,
          g.match.awayteam_locale,
          i18n.resolvedLanguage
        );
        const formatedBetType = FormatEntity.formatPickName(
          betType,
          null,
          g.item.specifier
        );
        const formatedGroupType = FormatEntity.formatMarketName(
          g.bet_group.name,
          Object.values(g.item.specifier).length > 0
            ? g.match //selectedEvent
            : null,
          g.item.specifier
        );
        const betgroup = Utils.replaceName(
          formatedGroupType,
          g.item ? g.item.param : '',
          g.match.hom,
          g.match.awy,
          g.match.hometeam_locale,
          g.match.awayteam_locale,
          i18n.resolvedLanguage
        );

        const game = { ...g };
        game.matchId = g.match.id;
        game.gleague = g.league;
        game.title = title;
        game.gameType = betgroup;
        game.pick = formatedBetType;
        game.id = g.odd_id;
        game.odd = g.odd;
        const s = [...newSlips[selectedSlip]];
        s.push(game);

        newSlips = { ...newSlips };
        newSlips[selectedSlip] = s;
      } catch (err) {
        message.error(err);
      }
    });
    return newSlips;
  };

  const getDateForDayOfWeek = (amount) => {
    return moment().add(amount, 'days').format('DD/MM/YYYY'); // Current Date
  };

  const isOnTheSameDay = (schedule, filterDate) => {
    return (
      moment(schedule).format('DD/MM/YYYY') == filterDate ||
      (process.env.REACT_IS_LOCAL_TIME == 'true' &&
        moment(schedule).subtract(6, 'hours').format('DD/MM/YYYY') ==
          filterDate)
    );
  };

  const organiseByLeague = (
    sportId = sportTypeId,
    selectedDate,
    upComingDate,
    countryId = null
  ) => {
    let group =
      sportTypeEvents && sportTypeEvents[sportId]
        ? sportTypeEvents[sportId]?.reduce((r, a) => {
            r[a.league] = [...(r[a.league] || []), a];
            return r;
          }, {})
        : [];

    let leageIds = Object.keys(group);
    let grouped_data = coreData?.leagues
      ?.map((l) => {
        if (leageIds?.includes(l.id + '')) {
          return {
            text:
              (i18n.resolvedLanguage == 'Am' &&
              coreData?.league_groups?.filter(
                (lg) => lg.id == l.league_group
              )[0].locales[0] != null
                ? coreData.league_groups.filter(
                    (lg) => lg.id == l.league_group
                  )[0].locales[0].translation
                : coreData.league_groups?.filter(
                    (lg) => lg.id == l.league_group
                  )[0]?.name) +
              ' ' +
              (i18n.resolvedLanguage == 'Am' && l.locales[0] != null
                ? l.locales[0].translation
                : l.name),
            icon: Utils.validURL(
              coreData.league_groups?.filter((lg) => lg.id == l.league_group)[0]
                ?.logo
            )
              ? coreData.league_groups?.filter(
                  (lg) => lg.id == l.league_group
                )[0]?.logo
              : new URL(
                  coreData.league_groups?.filter(
                    (lg) => lg.id == l.league_group
                  )[0]?.logo,
                  API.API_BASE_URL
                ),
            id: l.id,
            order: l.order,
            events: group[l.id],
            league_group_id: l.league_group,
            sport_type: l.sport_type,
          };
        } else {
          return null;
        }
      })
      .filter((g) => g != null && g.sport_type == sportId)
      .sort((a, b) => (a.order > b.order ? 1 : -1));

    let new_grouped_data = grouped_data
      ? grouped_data
          ?.map((g) => {
            if (
              countryId != null &&
              countryId != g.league_group_id &&
              countryId != 'All'
            ) {
              return null;
            }
            let currentDate = selectedDate;
            if (
              selectedDate == null &&
              upComingDate != null &&
              upComingDate != 'other' &&
              upComingDate != 'All'
            ) {
              currentDate = getDateForDayOfWeek(upComingDate);
            }
            let hasEvent = g.events.some((event) => {
              return isOnTheSameDay(event.schedule, currentDate);
            });

            if (upComingDate == 'All') {
              let upcoming_data = { ...g };
              upcoming_data.text = leagues[g.id].name;
              upcoming_data.locales = leagues[g.id].locales;
              return upcoming_data;
            }

            if (hasEvent) {
              let upcoming_data = { ...g };
              let valid_events = g.events.filter((event) => {
                return isOnTheSameDay(event.schedule, currentDate);
              });
              upcoming_data.events = valid_events;
              upcoming_data.text = leagues[g.id].name;
              upcoming_data.locales = leagues[g.id].locales;
              return upcoming_data;
            }
          })
          .filter((item) => item)
      : [];
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (a.events.length < 2) return 0;
      return a.order > b.order ? 1 : -1;
    });
    return new_grouped_data;
  };

  const organiseByTime = (id, selectedDate, upComingDate, countryId = null) => {
    let new_grouped_data = sportTypeEvents[id]
      ?.map((event) => {
        const league_data = leagues[event.league];
        const groupData = { ...league_groups[league_data.league_group] };
        groupData.events = [{ ...event }];
        groupData.text = league_data.name;
        groupData.locales = league_data.locales;
        groupData.icon = groupData.logo;
        const gd = groupData;

        return gd;
      })
      .filter((g) => {
        if (countryId != null && countryId != g.id && countryId != 'All')
          return false;
        let currentDate = selectedDate;
        if (upComingDate == 'All') {
          return true;
        }
        if (
          selectedDate == null &&
          upComingDate != null &&
          upComingDate != 'other' &&
          upComingDate != 'All'
        ) {
          currentDate = getDateForDayOfWeek(upComingDate);
        }
        return g.events.some((event) =>
          isOnTheSameDay(event.schedule, currentDate)
        );
      });
    new_grouped_data = new_grouped_data?.sort((a, b) => {
      if (moment(a.events[0].schedule) < moment(b.events[0].schedule)) {
        return -1;
      }
      if (moment(a.events[0].schedule) > moment(b.events[0].schedule)) {
        return 1;
      }
      return 0;
    });
    return new_grouped_data;
  };

  const organiseByTimeGroup = (
    sportId,
    selectedDate,
    upComingDate,
    countryId = null
  ) => {
    let group =
      sportTypeEvents && sportTypeEvents[sportId]
        ? sportTypeEvents[sportId]?.reduce((r, a) => {
            r[moment(a.schedule).format('DD/MM/YYYY')] = [
              ...(r[moment(a.schedule).format('DD/MM/YYYY')] || []),
              a,
            ];
            // console.log(a);
            return r;
          }, {})
        : [];

    let date_key = Object.keys(group);
    date_key.forEach((date) => {
      let new_grouped_data = group[date]
        ?.map((event) => {
          const league_data = leagues[event.league];
          const groupData = { ...league_groups[league_data.league_group] };
          groupData.event = { ...event };
          groupData.text = league_data.name;
          groupData.date = date;
          groupData.locales = league_data.locales;
          groupData.icon = groupData.logo;
          // const gd = groupData;

          return groupData;
        })
        .filter((g) => {
          if (countryId != null && countryId != g.id && countryId != 'All')
            return false;
          let currentDate = selectedDate;
          if (upComingDate == 'All') {
            return true;
          }
          if (
            selectedDate == null &&
            upComingDate != null &&
            upComingDate != 'other' &&
            upComingDate != 'All'
          ) {
            currentDate = getDateForDayOfWeek(upComingDate);
          }
          return isOnTheSameDay(g.event?.schedule, currentDate);
        });
      group[date] = new_grouped_data;
    });

    // console.log(group);
    return group;
  };

  return {
    getEvent,
    getLeagueEvent,
    addToFav,
    addMarketTypeToFav,
    isMarketTypeFav,
    isfav,
    getSportTypeLogo,
    getLogoBySportType,
    getSportType,
    searchEvent,
    searchLeagueEvent,
    searchMarket,
    getSlips,
    getSummary,
    prepareSlip,
    organiseByTime,
    organiseByLeague,
    organiseByTimeGroup,
    getFavLeagueEvents,
    localizeBetTypes,
    getSummaryFlatOddUtils,
  };
};
