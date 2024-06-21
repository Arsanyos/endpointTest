import API from '@services/API';
import { message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useBet = () => {
  const [betHistory, setBetHistory] = useState([]);
  const [nextpageUrl, setNextpageUrl] = useState('');
  const [prevpageUrl, setPrevpageUrl] = useState('');
  const [apiDataLength, setApiDataLength] = useState(0);
  const { t } = useTranslation();

  const getBetHistory = (page) => {
    return new Promise((resolve, reject) =>
      API.find(`user.onlineslips/?page=${page + 1}`, null, null)
        .then((response) => {
          if (response.data) {
            setBetHistory(response.data.results);
            setApiDataLength(response.data.count);
            setNextpageUrl(response.data.next);
            setPrevpageUrl(response.data.previous);
            const betHistoryData = {
              betHistory: response.data.results,
              apiDataLength: response.data.count,
              nextpageUrl: response.data.next,
              prevpageUrl: response.data.previous,
            };

            resolve(betHistoryData);
          }
        })
        .catch((err) => {
          if (!err.response) {
            // return message.error('Error While Loading Data');
            reject(message.error('Error While Loading Data'));
          }
          if (err.code == 'ERR_NETWORK') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response?.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const getBetHistoryDetail = (tid) => {
    return new Promise((resolve, reject) =>
      API.find(`online/slips/${tid}/`, null, null)
        .then((response) => {
          if (response.data) {
            const betHistoryDetail = {
              betHistoryDetail: response.data,
            };
            resolve(betHistoryDetail);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code == 'ERR_NETWORK') {
            reject(message.error(err.message));
          }
          reject(
            message.error(err.response?.data[Object.keys(err.response.data)[0]])
          );
        })
    );
  };

  const getChashout = (tid) => {
    return new Promise((resolve, reject) =>
      API.create(`online/cashout-claim/${tid}/`, null, null)
        .then((response) => {
          if (response.status == 200) {
            message.success(t('CashoutSuccessful'));
            resolve();
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          }
          if (err.code == 'ERR_NETWORK') {
            message.error(err.message);
            reject();
          }
          message.error(err.response?.data[Object.keys(err.response.data)[0]]);
          reject();
        })
    );
  };

  const getJackpotHistory = (page) => {
    return new Promise((resolve, reject) =>
      API.findJackpot(
        `super-jackpot/mine/?page=${page + 1}&page_size=5`,
        null,
        null
      )
        .then((response) => {
          if (response.data) {
            const jackpotHistory = {
              jackpotHistoryData: response.data,
              jackpotHistory: response.data.results,
            };
            resolve(jackpotHistory);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code == 'ERR_NETWORK') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response?.data[Object.keys(err.response.data)[0]]
                ? err.response.data[Object.keys(err.response.data)[0]]
                : err.response?.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const getJackpotHistoryDetail = (id) => {
    const url = `super-jackpot/mine/${id}/`;
    return new Promise((resolve, reject) =>
      API.findJackpot(url, null, null)
        .then((response) => {
          if (response.data) {
            const jackpotHistoryDetail = {
              jackpotHistoryDetail: response.data,
            };
            resolve(jackpotHistoryDetail);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code == 'ERR_NETWORK') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response?.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const getSimilarJackpotBetsCount = (ticketHash) => {
    return new Promise((resolve, reject) =>
      API.create(
        `super-jackpot/mine/similar/`,
        { ticket_hash: ticketHash },
        null
      )
        .then((response) => {
          resolve({
            count: response.data.similar_count,
          });
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          }
          if (err.code == 'ERR_NETWORK') {
            message.error(err.message);
            reject();
          }
          message.error(err.response?.data[Object.keys(err.response.data)[0]]);
          reject();
        })
    );
  };

  return {
    getChashout,
    getBetHistory,
    getJackpotHistory,
    getBetHistoryDetail,
    getJackpotHistoryDetail,
    getSimilarJackpotBetsCount,
  };
};
