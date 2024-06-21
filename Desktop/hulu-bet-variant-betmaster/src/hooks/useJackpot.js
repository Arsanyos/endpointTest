import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  updateSelectedPicks,
  updateJackpotArchive,
  updateJackpotHistory,
} from '../store/jackpotSlice';
import API from '../services/API';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export const useJackpot = () => {
  const dispatch = useDispatch();

  const allJackpotList = useSelector((state) => state.Jackpot.allJackpotList);
  const selectedPicks = useSelector((state) => state.Jackpot.selectedPicks);
  const jackpots = useSelector((state) => state.Jackpot.jackpots);
  const selectedJackpotYear = useSelector(
    (state) => state.Jackpot.selectedJackpotYear
  );
  const selectedJackpotMonth = useSelector(
    (state) => state.Jackpot.selectedJackpotMonth
  );
  const { t, i18n } = useTranslation();

  const getJackpotHistory = () => {
    API.findJackpot(`super-jackpot/mine/?page=1&page_size=5`, null, null)
      .then((response) => {
        if (response.data) {
          dispatch(updateJackpotArchive({ jackpotData: response.data }));
          dispatch(
            updateJackpotHistory({ jackpotHistory: response.data.results })
          );
        }
      })
      .catch((err) => {
        if (!err.response) {
          return message.error('Error While Loading Data');
        }
        return message.error(
          err.response.data[Object.keys(err.response.data)[0]][0]
        );
      });
  };

  const jackpotList = (paginate) => {
    let url = paginate
      ? 'super-jackpot/' + paginate.split('/super-jackpot/')[1]
      : paginate;
    const monthNum = moment(moment().month(selectedJackpotMonth)).get('month');
    let urlPath = `super-jackpot/archived/?year=${
      selectedJackpotYear || ''
    }&month=${monthNum || ''}`;
    if (selectedJackpotMonth == '') {
      urlPath = `super-jackpot/archived/?year=${
        selectedJackpotYear || ''
      }&month`;
    }
    if (!url) {
      url = urlPath;
    }
    API.findJackpotWithNoToken(url, null, null)
      .then((response) => {
        if (response.data) {
          // console.log(response.data.results);
          dispatch(
            updateJackpotArchive({
              jackpotSelectedList: response.data.results,
              allJackpotList: response.data,
            })
          );
        }
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response) {
          return message.error('Error While Loading Data');
        }
        return message.error(
          err.response.data[Object.keys(err.response.data)[0]][0]
        );
      });
  };

  const filterJackpotList = () => {
    const selectedList = allJackpotList.filter((item) => {
      const currYear = new Date(item.finished).getFullYear();
      const currMonth = new Date(item.finished).getMonth();
      const monthNum = moment(moment().month(selectedJackpotMonth)).get(
        'month'
      );
      if (monthNum == currMonth && selectedJackpotYear == currYear) {
        return true;
      }
      return false;
    });
    dispatch(updateJackpotArchive({ jackpotSelectedList: selectedList }));
  };

  const addQuickpick = () => {
    let picks = [];
    let list = [1, 2, 3];
    jackpots[0].events.forEach((j) => {
      if (j.is_reserve == false) {
        let pickIndex = list[Math.floor(Math.random() * list.length)];
        picks.push({
          event_id: j.id,
          pick: pickIndex.toString(),
        });
      }
    });
    jackpots[0].events.forEach((j) => {
      if (j.is_reserve == true) {
        let pickIndex = list[Math.floor(Math.random() * list.length)];
        picks.push({
          event_id: j.id,
          pick: pickIndex.toString(),
        });
      }
    });
    dispatch(updateSelectedPicks({ selectedPicks: picks }));
  };

  const addJackpotToSlip = (pickId, pick) => {
    let picks = [...selectedPicks];
    let changedPicked = picks.map((j) => {
      if (j.event_id == pickId) {
        j.pick = pick;
        return j;
      }
      return j;
    });
    if (
      selectedPicks.length == 0 ||
      selectedPicks.length < jackpots[0].events.length
    ) {
      const exists = selectedPicks.filter((item) => item.event_id == pickId);
      if (exists.length == 0) {
        picks.push({
          event_id: pickId,
          pick: pick,
        });
        changedPicked = picks;
      }
    }
    dispatch(updateSelectedPicks({ selectedPicks: changedPicked }));
  };

  const placeJackpotBet = () => {
    if (
      selectedPicks.length == 0 ||
      selectedPicks.length != jackpots[0].events.length
    ) {
      message.warning('Please Select All first');
    } else
      API.create(
        `super-jackpot/place-bet/`,
        {
          selected_picks: selectedPicks,
          jackpot_id: jackpots[0].id,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            dispatch(updateSelectedPicks({ selectedPicks: [] }));
          }
          return message.success(
            t('Jackpot') + ' ' + t('BetPlacedSuccessfully')
          );
        })
        .catch((err) => {
          if (!err.response) {
            return message.error('Error While Loading Data');
          }
          return message.error(
            err.response.data[Object.keys(err.response.data)[0]][0]
          );
        });
  };

  const isJackpotPick = (id, pick) => {
    if (
      selectedPicks &&
      selectedPicks.filter((f) => f.event_id == id && f.pick === pick).length !=
        0
    ) {
      return true;
    } else {
      return false;
    }
  };

  return {
    getJackpotHistory,
    jackpotList,
    filterJackpotList,
    isJackpotPick,
    addQuickpick,
    addJackpotToSlip,
    placeJackpotBet,
  };
};
