import { message } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ClientSession from '../services/client-session';
import { updateSlips } from '../store/slipSlice';

export const useSlips = () => {
  const dispatch = useDispatch();

  const selectedSlip = useSelector((state) => state.slip.selectedSlip);
  const slips = useSelector((state) => state.slip.slips);
  const maxmatches = useSelector((state) => state.slip.maxmatches);
  const { t } = useTranslation();

  const addToSlip = async (
    full,
    g,
    title,
    gameType,
    pick,
    matchId,
    oddId,
    odd
  ) => {
    if (isAddedToSlip(oddId)) {
      removeFromSlip(oddId);
    } else {
      try {
        const s = slips[selectedSlip].filter((s) => s.matchId != matchId);

        if (s.length >= maxmatches) {
          return message.error(
            `${t('MaximumamountofMatchesis')} ${maxmatches}`,
            5
          );
        }

        const game = { ...g };
        game.matchId = matchId;
        game.gleague = full.league;
        game.title = title;
        game.gameType = gameType;
        game.pick = pick;
        game.id = oddId;
        game.odd = odd;
        s.unshift(game);
        let newSlips = { ...slips };
        newSlips[selectedSlip] = s;

        dispatch(updateSlips({ slips: newSlips }));

        ClientSession.storeSlip(newSlips, (err) => {});
        ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
      } catch (err) {
        // console.log(err);
      }
    }
  };
  const removeFromSlip = (id) => {
    // console.log('removedSlip');
    let s = slips[selectedSlip].filter((s) => s.id != id);
    let newSlips = { ...slips };
    newSlips[selectedSlip] = s;
    dispatch(updateSlips({ slips: newSlips }));
    ClientSession.storeSlip(newSlips, (err) => {});
    ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
  };
  const isAddedToSlip = (id) => {
    if (slips[selectedSlip].filter((s) => s.id == id).length == 0) {
      return false;
    } else {
      return true;
    }
  };
  const removeAllFromSlip = async () => {
    let newSlips = { ...slips };
    newSlips[selectedSlip] = [];
    dispatch(updateSlips({ slips: newSlips }));
    // getSummary();
    ClientSession.storeSlip(newSlips, (err) => {});
  };
  return { addToSlip, removeFromSlip, removeAllFromSlip, isAddedToSlip };
};
