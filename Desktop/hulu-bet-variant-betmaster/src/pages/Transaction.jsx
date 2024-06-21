import { useWallet } from '@hooks/useWallet';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Utils from '@services/utils';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Empty from '@components/Empty';

export default function Transaction() {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [selectedPage, setSelectedPage] = useState(0);
  const [transactionType, setTransactionType] = useState('bank');
  const [loading, setLoading] = useState(false);

  const [betHistoryDetail, setBetHistoryDetail] = useState([]);
  const userDetail = useSelector((state) => state.user.userDetail);

  const { getTransaction } = useWallet();
  const { t } = useTranslation();
  // const { id } = useParams()

  useEffect(() => {
    // get bet history
    getTrans('bank');
  }, []);

  const getTrans = async (type) => {
    setLoading(true);
    const data = await getTransaction(type);
    const key = Object.keys(data)[0];
    // setBetHistoryDetail(data.branchTransaction);
    setLoading(false);
    setBetHistoryDetail(data[key]);
  };

  const changePage = (page) => {
    setSelectedPage(page - 1);
  };

  const changeTransactionType = (e) => {
    setTransactionType(e.target.value);
    getTrans(e.target.value);
    // console.log(e.target.value);
  };

  const renderBranch = () => {
    return (
      betHistoryDetail &&
      betHistoryDetail?.length > 0 &&
      betHistoryDetail.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.created_at, 'En')}
                </div>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-left text-xs">
                  {list.transaction_type}
                </span>
              </div>

              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.amount}
                </span>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="truncate text-center text-xs">
                  {list.branch?.branchID}
                </span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };

  const renderBankTrans = () => {
    return (
      betHistoryDetail &&
      betHistoryDetail?.length > 0 &&
      betHistoryDetail.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.created_at, 'En')}
                </div>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-left text-xs">
                  {list.transaction_type}
                </span>
              </div>

              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.amount}
                </span>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-center text-xs">{list.bank}</span>
              </div>
              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-center text-xs">{list.status}</span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };

  const renderSent = () => {
    return (
      betHistoryDetail &&
      betHistoryDetail?.length > 0 &&
      betHistoryDetail.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.transaction_date, 'En')}
                </div>
              </div>

              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.to}
                </span>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-center text-xs">{list.amount}</span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };

  const renderRecived = () => {
    return (
      betHistoryDetail &&
      betHistoryDetail?.length > 0 &&
      betHistoryDetail.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.created_at, 'En')}
                </div>
              </div>

              <div className="flex w-28 flex-row items-center gap-1 text-left ">
                <span className="text-left text-xs">{list.from}</span>
              </div>

              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.amount}
                </span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };

  const renderAwarded = () => {
    return (
      betHistoryDetail &&
      betHistoryDetail?.length > 0 &&
      betHistoryDetail.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.created_at, 'En')}
                </div>
              </div>

              {/* <div className="justify-start flex w-24 flex-row items-center gap-1 text-white">
                <span className="truncate text-left text-xs uppercase">
                  {list.award_type}
                </span>
              </div> */}
              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.amount}
                </span>
              </div>
              <div className="flex w-24 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.note}
                </span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };
  const renderBetForMeTrandactionList = () => {
    return (
      betHistoryDetail.results &&
      betHistoryDetail?.results?.length > 0 &&
      betHistoryDetail.results.map((list, i) => {
        if (i >= selectedPage * 15 && i <= selectedPage * 15 + 15) {
          return (
            <div
              key={list.id}
              className={
                'flex h-12 w-full  flex-row items-center justify-between bg-table-body px-3 text-table-body-font   shadow-lg '
              }
            >
              <div className="flex w-full flex-1 flex-col items-center justify-start gap-y-1">
                <div className="w-full text-center  ">
                  {Utils.displayTime(list.created_at, 'En')}
                </div>
              </div>

              <div className="flex w-full flex-1 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.amount}
                </span>
              </div>
              <div className="flex w-full flex-1 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.commision}
                </span>
              </div>
              <div className="flex w-full flex-1 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.transaction_type_display}
                </span>
              </div>
              <div className="flex w-full flex-1 flex-row items-center justify-start gap-1 ">
                <span className="truncate text-left text-xs uppercase">
                  {list.state_display}
                </span>
              </div>
            </div>
          );
        } else return null;
      })
    );
  };

  return (
    <div className=" min-h-full w-full ">
      <div className="flex h-9 items-center justify-between bg-container-header px-2 text-lg uppercase text-white">
        <div></div>
        <div>{t('TransactionHistory')}</div>
        <div></div>
      </div>
      <div className="flex h-16 items-center justify-end px-12  ">
        {/* <Select
          style={{ width: '100%' }}
          value={transactionType}
          onChange={changeTransactionType}
        >
          <Select.Option value="">
            --- {t('SelectTransactionType')} ---
          </Select.Option>
          <Select.Option value="branch">
            {t('BranchTransactions')}
          </Select.Option>
          <Select.Option value="bank">{t('BankTransactions')}</Select.Option>
          <Select.Option value="sent">{t('SentTransactions')}</Select.Option>
          <Select.Option value="recived">
            {t('RecivedTransactions')}
          </Select.Option>
          <Select.Option value="awarded">
            {t('AwardedTransactions')}
          </Select.Option>
        </Select> */}
        <select
          className="block w-60 appearance-none rounded border-0 bg-secondary-900 p-2 px-4 text-white focus:border-0 focus:outline-none focus:ring-0  "
          value={transactionType}
          onChange={changeTransactionType}
        >
          <option className="flex truncate" value="branch">
            {t('BranchTransactions')}
          </option>
          <option className="flex truncate" value="bank">
            {t('BankTransactions')}
          </option>
          <option className="flex truncate" value="sent">
            {t('SentTransactions')}
          </option>
          <option className="flex truncate" value="recived">
            {t('RecivedTransactions')}
          </option>
          {userDetail?.member?.member_type == 2 && (
            <option className="flex truncate" value="betForMeTransactions">
              {/* {t('BetForMe')} */}
              {'BetForMe'}
            </option>
          )}
        </select>
      </div>
      {/* Header */}
      {!loading && transactionType == 'branch' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header-font ">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="truncate text-left ">
                {t('TransactionType')}
              </span>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Branch')}</span>
            </div>
          </div>
        </div>
      )}
      {!loading && transactionType == 'bank' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header-font ">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('TransactionType')}</span>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Bank')}</span>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Status')}</span>
            </div>
          </div>
        </div>
      )}
      {!loading && transactionType == 'sent' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header ">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('To')}</span>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
          </div>
        </div>
      )}
      {!loading && transactionType == 'recived' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header-font ">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('From')}</span>
            </div>
            <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
          </div>
        </div>
      )}
      {!loading && transactionType == 'awarded' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header   px-3 text-table-header-font ">
            <div className="flex w-24 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            {/* <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('AwardType')}</span>
            </div> */}
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
            <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Note')}</span>
            </div>
          </div>
        </div>
      )}
      {!loading && transactionType == 'betForMeTransactions' && (
        <div className="mt-1 flex w-full flex-col gap-y-[2px] ">
          <div className="flex h-12 w-full  flex-row items-center justify-between bg-table-header-font   px-3 text-table-header-font ">
            <div className="jusstify-left flex w-full flex-1 flex-col items-center gap-y-1">
              <div className="w-full text-center  text-white ">{t('Date')}</div>
            </div>
            <div className="jusstify-left flex w-full flex-1 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Amount')}</span>
            </div>
            <div className="jusstify-left flex w-full flex-1 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Commission')}</span>
            </div>
            <div className="jusstify-left flex w-full flex-1 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('TransactionType')}</span>
            </div>
            <div className="jusstify-left flex w-full flex-1 flex-row items-center gap-1 text-left text-white">
              <span className="text-left ">{t('Status')}</span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-1 flex w-full flex-col gap-y-[2px] bg-table-container">
        {!loading && transactionType == 'branch' && renderBranch()}
        {!loading && transactionType == 'bank' && renderBankTrans()}
        {!loading && transactionType == 'sent' && renderSent()}
        {!loading && transactionType == 'recived' && renderRecived()}
        {!loading && transactionType == 'awarded' && renderAwarded()}
        {!loading &&
          transactionType == 'betForMeTransactions' &&
          renderBetForMeTrandactionList()}
        {!loading && betHistoryDetail && betHistoryDetail.length > 15 ? (
          <center>
            <Pagination
              current={selectedPage + 1}
              total={betHistoryDetail.length}
              pageSize={15}
              onChange={changePage}
            />
          </center>
        ) : (
          ''
        )}
        {loading && (
          <div className="mb-0.5 flex w-full animate-pulse flex-col gap-y-1 ">
            <div className="flex h-12 w-full  flex-row items-center justify-between bg-secondary-700 px-3 text-white ">
              <div className="flex w-24 flex-col items-center gap-y-1">
                <div className="h-3  w-20 rounded-l-full rounded-r-full bg-slate-400 text-center"></div>
              </div>
              <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
              {/* <div className="flex w-24 flex-row items-center gap-1 text-left text-white">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div> */}
              <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
              <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
                <span className="h-3 w-24 rounded-l-full rounded-r-full bg-slate-400 text-left"></span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-y-[2px]">
            {[...Array(10).keys()].map((i, index) => {
              return (
                <div
                  key={index}
                  className={
                    'flex h-10 w-full animate-pulse flex-row items-center justify-between bg-secondary-700 px-3 text-white   shadow-lg '
                  }
                >
                  <div className="flex w-24 flex-col items-center gap-y-1">
                    <div className="h-2.5  w-20 rounded-r-full rounded-l-full bg-gray-400 text-center text-gray-400 "></div>
                  </div>

                  <div className="flex w-28 flex-row items-center gap-1 text-left text-gray-400">
                    <span className="h-2.5 w-24 rounded-l-full rounded-r-full bg-gray-400 text-left text-xs"></span>
                  </div>

                  <div className="flex w-24 flex-row items-center justify-start gap-1 text-white">
                    <span className="h-2.5 w-24 truncate rounded-l-full rounded-r-full bg-gray-400 text-left text-xs uppercase"></span>
                  </div>

                  {/* <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
                    <span className="h-2.5 w-24 bg-gray-400 text-center text-xs rounded-l-full rounded-r-full"></span>
                  </div> */}
                  <div className="flex w-28 flex-row items-center gap-1 text-left text-white">
                    <span className="h-2.5 w-24 rounded-l-full rounded-r-full bg-gray-400 text-center text-xs"></span>
                  </div>
                </div>
              );
            })}
            <div className="flex h-9 items-center justify-center gap-x-2">
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <div className="flex items-center justify-center gap-x-1  text-white">
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
              </div>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
              <span className="h-3 w-5 rounded-lg bg-secondary-200"></span>
            </div>
          </div>
        )}

        {!loading && betHistoryDetail.length == 0 && (
          <Empty
            className=" bg-secondary-700"
            message={'No bet history for selected date.'}
          />
        )}
      </div>
    </div>
  );
}
