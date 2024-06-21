import { Divider, Input, InputNumber, message } from 'antd';
import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';

import { AiOutlineGift } from 'react-icons/ai';
import { BsCheck2Circle } from 'react-icons/bs';

import Modal from '@components/Modal';
import { useWallet } from '@hooks/useWallet';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaUpload } from 'react-icons/fa';

const BankNote = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22.268"
    height="17.693"
    className={`${className} `}
    // {...className}
    viewBox="0 0 22.268 17.693"
  >
    <g id="banknotes" transform="translate(0.185 459.125)">
      <path
        id="Path_258"
        data-name="Path 258"
        d="M6.945-455.017C2.434-452.409.023-451-.011-450.931c-.116.215-.026.3.808.782.434.249.786.46.786.473s-.327.206-.722.43c-.778.443-.911.546-.911.7s.116.236.881.675c.378.215.7.408.722.425a3.583,3.583,0,0,1-.73.477,8.333,8.333,0,0,0-.816.511.262.262,0,0,0,.021.339c.095.116,7.845,4.563,7.948,4.563.069,0,.9-.473,3.961-2.243.391-.223,1.4-.812,2.256-1.3,2.462-1.422,5.585-3.227,6.659-3.845.541-.314,1.01-.6,1.04-.64a.269.269,0,0,0-.043-.361,7.96,7.96,0,0,0-.812-.5c-.4-.223-.722-.417-.722-.43s.327-.206.722-.43c.778-.443.911-.546.911-.7s-.116-.236-.881-.674c-.378-.219-.7-.408-.722-.43a4.154,4.154,0,0,1,.739-.477c1.19-.687,1.2-.64-.361-1.547C16.8-457.406,14-459,13.927-459,13.884-459,10.743-457.208,6.945-455.017Zm10.543-1.293c1.921,1.1,3.506,2.015,3.523,2.032s-4.722,2.793-5.035,2.943c-.06.026-.18-.021-.481-.189-.451-.258-.46-.262-.4-.284.026-.009.692-.391,1.482-.851,1.564-.9,1.615-.941,1.5-1.194a1.676,1.676,0,0,1-.064-.473,1,1,0,0,0-.043-.374c-.056-.056-3.1-1.809-3.261-1.873a.446.446,0,0,0-.344,0,2.238,2.238,0,0,1-1.113-.03c-.249-.069-.361-.082-.43-.052s-.769.434-1.594.911-1.512.864-1.53.864a5.1,5.1,0,0,1-.477-.254l-.438-.258.168-.1c1.4-.838,4.949-2.857,4.988-2.844S15.568-457.415,17.488-456.31Zm-4.155.339a2.48,2.48,0,0,0,1.005.017L14.55-456l1.414.812,1.409.812.026.254a.8.8,0,0,1,0,.288c-.013.017-.683.408-1.482.868l-1.452.838-.219-.125c-.58-.326-3.914-2.247-3.927-2.256s.477-.292,1.074-.636,1.186-.683,1.3-.756C12.938-456.048,12.986-456.053,13.334-455.971Zm-1.5,3.02c1.916,1.1,3.553,2.041,3.643,2.1l.159.1-.009,2.071-.013,2.071-.752.438a8.634,8.634,0,0,1-.8.443A10.272,10.272,0,0,1,14-447.756a13.86,13.86,0,0,0-.052-2.1c-.03-.039-.782-.481-1.667-.992-4.537-2.6-5.628-3.235-5.633-3.27a6.544,6.544,0,0,1,.765-.481c.644-.37.778-.43.851-.391C8.311-454.97,9.918-454.051,11.83-452.951ZM6.4-453.539c.211.125.391.236.4.249s-.649.412-1.461.881a16.61,16.61,0,0,0-1.525.941c-.052.09-.039.172.06.434a.475.475,0,0,1,.017.335.446.446,0,0,0,0,.262,15.071,15.071,0,0,0,1.719,1.053l1.671.958.253-.069a2.08,2.08,0,0,1,1.074.022,3.772,3.772,0,0,0,.387.086c.026,0,.473-.245.992-.541s1.229-.7,1.577-.907l.64-.37.176.1c.1.052.305.172.455.258l.275.159-.1.064c-.056.039-1.212.7-2.565,1.487l-2.466,1.422-3.527-2.024C2.507-449.849.9-450.772.887-450.79a3.617,3.617,0,0,1,.644-.412c.369-.215,1.512-.872,2.543-1.469s1.886-1.087,1.908-1.087A3.172,3.172,0,0,1,6.4-453.539Zm3.132,1.8,2.054,1.182c.009.009-.58.357-1.306.773l-1.323.765-.365-.073a2.412,2.412,0,0,0-1-.026l-.241.047-1.371-.782c-.752-.43-1.388-.8-1.418-.829a.714.714,0,0,1-.064-.3l-.013-.249,1.478-.855c.816-.468,1.491-.846,1.5-.842S8.41-452.384,9.531-451.739Zm10.853-.657a3.483,3.483,0,0,1,.627.408c-.064.06-4.735,2.741-4.778,2.741a2.816,2.816,0,0,1-.043-.752v-.752l.163-.1c.086-.056.808-.477,1.6-.928s1.5-.864,1.568-.907a.674.674,0,0,1,.168-.082C19.71-452.77,20.019-452.6,20.384-452.4Zm.009,2.269c.361.206.653.378.644.387s-1.027.6-2.269,1.31-2.32,1.336-2.393,1.383l-.142.086v-1.577l.378-.215c.206-.116.984-.567,1.723-1s1.362-.773,1.375-.769S20.032-450.334,20.393-450.128ZM5.059-447.7c1.564.9,2.874,1.633,2.917,1.633s.915-.485,1.942-1.078,2.23-1.285,2.668-1.542l.8-.46.017.756a5.194,5.194,0,0,1-.009.791c-.047.052-5.375,3.123-5.418,3.123-.026,0-1.426-.795-3.124-1.77s-3.282-1.882-3.532-2.024-.455-.262-.464-.266,1.323-.795,1.349-.795C2.214-449.333,3.495-448.6,5.059-447.7Zm0,2.256c1.787,1.027,2.849,1.611,2.922,1.611a5.737,5.737,0,0,0,.992-.507c3.394-1.963,4.327-2.5,4.4-2.526s.073.03.073.743v.769l-2.733,1.577L7.976-442.2,4.41-444.246a25.147,25.147,0,0,1-3.484-2.092l.657-.382a6.477,6.477,0,0,1,.623-.335C2.232-447.056,3.512-446.33,5.059-445.445Z"
        transform="translate(0 0)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
      <path
        id="Path_259"
        data-name="Path 259"
        d="M310.748-363.643c-.726.421-.748.438-.748.584a.278.278,0,0,0,.266.305,6.39,6.39,0,0,0,1.4-.765.286.286,0,0,0-.06-.391.4.4,0,0,0-.185-.09A5.287,5.287,0,0,0,310.748-363.643Z"
        transform="translate(-296.731 -90.918)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
      <path
        id="Path_260"
        data-name="Path 260"
        d="M166.82-282.592a6.109,6.109,0,0,0-.76.481.284.284,0,0,0,.223.451,8.086,8.086,0,0,0,1.517-.851.382.382,0,0,0,.095-.193.41.41,0,0,0-.288-.3A6.065,6.065,0,0,0,166.82-282.592Z"
        transform="translate(-158.921 -168.438)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
    </g>
  </svg>
);

export default function BetForMeWallet() {
  const [amountHC, setAmountHC] = useState(null);
  const [forPhone, setForPhone] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);

  const [betForMeTransactionID, setBetForMeTransactionID] = useState(null);
  const [amountWD, setAmountWD] = useState(null);
  const [withdrowAmmount, setWithdrowAmmount] = useState(null);
  const [transactionFee, setTransactionFee] = useState(null);
  const [netPay, setNetPay] = useState(null);

  const [loadingDepositeForMe, setLoadingDepositeForMe] = useState(false);
  const [loadingWithdrawForMe, setLoadingWithdrawForMe] = useState(false);
  const [loadingWithdrawForMeConfrim, setLoadingWithdrawForMeConfirm] =
    useState(false);
  const [showCode, setShowCode] = useState(false);
  const [OTP, setOTP] = useState('');
  const [showBetForMeDepositeConfirm, setShowBetForMeDepositeConfirm] =
    useState(false);
  const [showBetForMeWithdrawConfirm, setShowBetForMeWithdrawConfirm] =
    useState(false);
  const [showBetForMeWithdraw, setShowBetForMeWithdraw] = useState(false);
  const [showBetForMeDepositeSuccess, setShowBetForMeDepositeSuccess] =
    useState(false);
  const [showBetForMeWithdrawSuccess, setShowBetForMeWithdrawSuccess] =
    useState(false);

  const userDetail = useSelector((state) => state.user.userDetail);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const { depositeBetForMe, withdrawBetForMe, withdrawBetForMeConfirm } =
    useWallet();

  const { t, i18n } = useTranslation();

  const depositeForMe = () => {
    if (
      amountHC < configurations?.minimum_deposit_amount ||
      amountHC > configurations?.maximum_deposit_amount
    ) {
      return message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
    }
    if (forPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountHC == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    } else {
      setLoadingDepositeForMe(true);
      depositeBetForMe(amountHC, forPhone)
        .then((response) => {
          setLoadingDepositeForMe(false);
          setShowBetForMeDepositeSuccess(true);
          setShowBetForMeDepositeConfirm(false);
          // setForPhone('');
          // console.log(response);
        })
        .catch((err) => {
          // console.log(err);
          setLoadingDepositeForMe(false);
        });
    }
  };
  const withdrawForMe = () => {
    if (
      amountWD < configurations?.minimum_deposit_amount ||
      amountWD > configurations?.maximum_deposit_amount
    ) {
      return message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
    }
    if (forPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountWD == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    } else {
      setLoadingWithdrawForMeConfirm(true);
      withdrawBetForMeConfirm(betForMeTransactionID, OTP, forPhone) // TODO: transaction ID
        .then((response) => {
          setLoadingWithdrawForMeConfirm(false);
          setShowBetForMeWithdrawConfirm(false);
          setShowBetForMeWithdraw(false);
          setShowBetForMeWithdrawSuccess(true);
          // setForPhone('');
          setBetForMeTransactionID('');
          setOTP('');
          // console.log(response);
          // TODO: Show success  and Commision Message
        })
        .catch((err) => {
          // console.log(err);
          setLoadingWithdrawForMeConfirm(false);
        });
    }
  };

  const onTabChange = (key) => {
    setSelectedTab(key);
  };

  const depositeForMeHandler = () => {
    if (
      amountHC < configurations?.minimum_deposit_amount ||
      amountHC > configurations?.maximum_deposit_amount
    ) {
      return message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
    }
    if (forPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountHC == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    }

    setShowBetForMeDepositeConfirm(true);
  };

  const withdrawForMeHandler = () => {
    if (
      amountWD < configurations?.minimum_deposit_amount ||
      amountWD > configurations?.maximum_deposit_amount
    ) {
      return message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
    }
    if (forPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountWD == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    }
    // TODO: Implement withdraw modal
    setLoadingWithdrawForMe(true);
    withdrawBetForMe(amountWD, forPhone)
      .then((response) => {
        setLoadingWithdrawForMe(false);
        setShowBetForMeWithdrawConfirm(true);
        setShowBetForMeWithdraw(false);
        setBetForMeTransactionID(response.uuid);
        // console.log(response.uuid);
      })
      .catch((err) => {
        // console.log(err);
        setLoadingWithdrawForMe(false);
      });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="min-h-32 relative flex flex-col gap-4 py-4 px-4 md:px-8">
        <div className="flex flex-1 flex-col rounded ">
          <div className="flex snap-x gap-y-2 gap-x-4 overflow-auto md:flex-wrap ">
            <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-primary-500/80 p-4 pr-0 md:w-48 ">
              <div className="flex justify-between">
                <h1 className="flex text-white">{t('Balance')} </h1>
                <BankNote className="text-md mr-2 " />
              </div>
              <div className="flex gap-2 border-t-[1px] border-white ">
                <span className="text-2xl font-semibold text-white">
                  {userDetail.member && userDetail.member?.wallet?.balance
                    ? userDetail.member.wallet.balance.toFixed(2)
                    : '0.00'}
                </span>
                <span className="text-md mb-1 flex items-end text-white">
                  {t(configurations?.currency)}
                </span>
              </div>
            </div>

            {userDetail?.member?.member_type != 1 && (
              <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-white p-4 pr-0 md:w-48 ">
                <div className="flex justify-between ">
                  <h1 className="flex text-active">{t('Rewards')} </h1>
                  <AiOutlineGift className="mr-2 text-lg text-active " />
                </div>
                <div className="flex gap-2 border-t-[1px] border-primary ">
                  <span className="text-2xl font-semibold text-active">
                    {userDetail.member && userDetail.member?.wallet?.payable
                      ? userDetail.member.wallet.payable.toFixed(2)
                      : '0.00'}
                  </span>
                  <span className="text-md mb-1 flex items-end text-active">
                    {t(configurations?.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 px-4 md:px-8">
        <ul className="mb-0 flex h-9 w-full gap-[2px] text-center text-sm font-medium text-gray-200 md:w-fit ">
          {userDetail?.member?.member_type != 1 && (
            <li
              key={1}
              onClick={() => onTabChange(1)}
              className={` ${
                selectedTab == 1
                  ? 'bg-active text-active-font'
                  : 'bg-primary-700'
              } flex h-full w-full flex-1 cursor-pointer items-center justify-start gap-x-1 rounded-tl px-2 text-center duration-500 hover:bg-active/60 md:w-40`}
            >
              <FaDownload />
              <span className="leading-tight	">
                {t('Deposite') + ' ' + t('To')}
              </span>
            </li>
          )}

          {userDetail?.member?.member_type != 1 && (
            <li
              key={2}
              onClick={() => onTabChange(2)}
              className={` ${
                selectedTab == 2
                  ? 'bg-active text-active-font'
                  : 'bg-primary-700'
              } flex h-full w-full flex-1 cursor-pointer items-center justify-start gap-x-1 rounded-tr px-2 text-center duration-500 hover:bg-active/60 md:w-40`}
            >
              <FaUpload />
              <span className="leading-tight	">
                {t('Withdraw') + ' ' + t('From')}
              </span>
            </li>
          )}
        </ul>
        <div className="flex min-h-max flex-1 flex-col items-center justify-center rounded-b bg-primary-200  px-2 md:rounded-tr">
          <div className=" flex w-full flex-wrap gap-2 py-4 ">
            {selectedTab == 1 && (
              <div className="flex w-full flex-col gap-2 text-white md:w-80">
                <Input
                  value={forPhone}
                  style={{ width: '100%', marginBottom: 10 }}
                  placeholder={t('To') + ' ' + t('Phone')}
                  name="forPhone"
                  onChange={(e) => setForPhone(e.target.value)}
                />
                <div className="flex  w-full flex-col gap-1">
                  <InputNumber
                    value={amountHC}
                    placeholder={t('Amount')}
                    style={{
                      width: '100%',
                      marginBottom: 10,
                      color:
                        amountHC > configurations?.maximum_deposit_amount ||
                        amountHC < configurations?.minimum_deposit_amount
                          ? 'red'
                          : '',
                    }}
                    name="amountHC"
                    onChange={(e) => {
                      setAmountHC(e);
                    }}
                  />
                </div>
                <div className="flex w-full justify-start">
                  <button
                    onClick={depositeForMeHandler}
                    className="h-8 rounded bg-active px-2 text-active-font"
                    disabled={loadingDepositeForMe}
                  >
                    {loadingDepositeForMe && (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-4 w-4 animate-spin fill-primary-200 text-active"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    {t('Deposite')}
                  </button>
                </div>
              </div>
            )}
            {selectedTab == 2 && (
              <div className="flex w-full flex-col gap-2 text-white md:w-80">
                <Input
                  value={forPhone}
                  style={{ width: '100%', marginBottom: 10 }}
                  placeholder={t('From') + ' ' + t('Phone')}
                  name="forPhone"
                  onChange={(e) => setForPhone(e.target.value)}
                />
                <div className="flex  w-full flex-col gap-1">
                  {/* <p className="m-0 p-0">{t('Amount')}</p> */}
                  <InputNumber
                    value={amountWD}
                    placeholder={t('Amount')}
                    style={{
                      width: '100%',
                      marginBottom: 10,
                      color:
                        amountWD > configurations?.maximum_deposit_amount ||
                        amountWD < configurations?.minimum_deposit_amount
                          ? 'red'
                          : '',
                    }}
                    name="amountWD"
                    onChange={(e) => {
                      setAmountWD(e);
                    }}
                  />
                </div>
                <div className="flex w-full justify-start">
                  <button
                    onClick={withdrawForMeHandler}
                    disabled={loadingWithdrawForMe}
                    className="flex h-8 items-center justify-center gap-2 rounded bg-active px-2 text-active-font"
                  >
                    {loadingWithdrawForMe && (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-4 w-4 animate-spin fill-primary-200 text-active"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    {t('Withdraw')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        visible={showBetForMeDepositeConfirm}
        onCancel={() => setShowBetForMeDepositeConfirm(false)}
        onOk={() => setShowBetForMeDepositeConfirm(false)}
      >
        <div className="flex w-full flex-col items-center md:w-80">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-72 flex-col justify-center gap-2 p-4">
            <br />
            <h3 className="text-lg text-active">
              {t('Deposite') + ' ' + t('Confirm')}
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                disabled
                value={forPhone}
                className=" h-8 w-full rounded bg-neutral-200 px-2 "
              />
              <input
                type="text"
                disabled
                value={`${t(configurations?.currency)} ${amountHC}`}
                className=" h-8 w-full rounded bg-neutral-200 px-2 "
              />
            </div>
            <div className="flex justify-between text-white">
              <button
                onClick={depositeForMe}
                className="flex h-9 w-24 items-center justify-center gap-x-1 rounded bg-primary-500 px-1 py-2"
              >
                {loadingDepositeForMe && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 animate-spin fill-primary-200 text-active"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {t('Confirm')}
              </button>
              <button
                onClick={() => setShowBetForMeDepositeConfirm(false)}
                className="h-9 w-24 rounded bg-secondary-200"
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={showBetForMeWithdrawConfirm}
        onCancel={() => setShowBetForMeWithdrawConfirm(false)}
        onOk={() => setShowBetForMeWithdrawConfirm(false)}
      >
        <div className="flex w-full flex-col items-center md:w-96">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-full flex-col justify-center gap-3 p-4">
            <div className="flex gap-3">
              <div className="flex flex-col justify-between gap-2">
                <BsCheck2Circle className="h-7 text-xl text-active" />
                <div></div>
              </div>
              <div className="flex w-full flex-col justify-center gap-2 ">
                <h3 className="m-0 text-lg  font-semibold uppercase text-black">
                  {t('OTPsentSuccessfully')}!
                </h3>
                {i18n.resolvedLanguage == 'En' ? (
                  <span className="font-normal ">
                    OTP is sent to the recipient’s number. Please enter the OTP
                    to confirm the withdrawal.
                  </span>
                ) : (
                  <span className="font-normal ">
                    OTP ወደ ተቀባዩ ቁጥር ይላካል። መውጣቱን ለማረጋገጥ እባክዎ OTP ያስገቡ።
                  </span>
                )}
              </div>
            </div>
            <h3 className="m-0 text-xl text-active">
              {t('Withdraw') + ' ' + t('Confirm')}
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                disabled
                value={forPhone}
                className=" h-8 w-full rounded bg-neutral-200 px-2 "
              />
              <input
                type="number"
                prefix={t(configurations?.currency)}
                value={OTP}
                placeholder={t('OTP')}
                onChange={(e) => setOTP(e.target.value)}
                className="spin-button-none h-8 w-full rounded bg-neutral-200 px-2 invalid:border-red-500 "
              />
            </div>
            <div className="flex justify-between text-white">
              <button
                onClick={withdrawForMe}
                className="flex h-9 w-24 items-center justify-center gap-x-1 rounded bg-primary-500 px-1 py-2"
              >
                {loadingWithdrawForMeConfrim && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 animate-spin fill-primary-200 text-active"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {t('Confirm')}
              </button>
              <button
                onClick={() => setShowBetForMeDepositeConfirm(false)}
                className="h-9 w-24 rounded bg-secondary-200"
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        visible={showBetForMeDepositeSuccess}
        onCancel={() => setShowBetForMeDepositeSuccess(false)}
        onOk={() => setShowBetForMeDepositeSuccess(false)}
      >
        <div className="flex w-full flex-col items-center md:max-w-lg	">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex gap-3 p-4">
            <div className="flex flex-col justify-between gap-2">
              <BsCheck2Circle className="h-7 text-xl text-active" />
              <div></div>
            </div>
            <div className="flex w-full flex-col justify-center gap-2 ">
              <h3 className="m-0 text-lg  font-semibold uppercase text-black">
                {t('Transaction') + ' ' + t('Successfull')}!
              </h3>
              <span className="font-normal ">
                You have deposited {amountHC} {t(configurations?.currency)} to{' '}
                {forPhone} successfully.
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={showBetForMeWithdrawSuccess}
        onCancel={() => setShowBetForMeWithdrawSuccess(false)}
        onOk={() => setShowBetForMeWithdrawSuccess(false)}
      >
        <div className="flex w-full flex-col items-center md:max-w-lg	">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex gap-3 p-4">
            <div className="flex flex-col justify-between gap-2">
              <BsCheck2Circle className="h-7 text-xl text-active" />
              <div></div>
            </div>
            <div className="flex w-full flex-col justify-center gap-2 ">
              <h3 className="m-0 text-lg  font-semibold uppercase text-white">
                {t('Transaction') + ' ' + t('Successfull')}!
              </h3>
              {/* TODO:  */}
              <span className="font-normal ">
                You have successfully withdrawn for recipient.
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        visible={showCode}
        onOk={() => setShowCode(!showCode)}
        onCancel={() => setShowCode(!showCode)}
      >
        <div className="max-w-lg">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <br />
            <div className="px-4">
              <h2 className="text-lg uppercase text-active">
                {t('WithdrawMoney')}
              </h2>
            </div>
            <div className="withdrawMoney px-4 py-2">
              <div
                className="flex justify-between "
                style={{ marginBottom: 10 }}
              >
                <div style={{ fontWeight: 600 }}>{t('WithdrawDetails')}</div>
                <div style={{ color: 'gray' }}></div>
              </div>
              <div className="flex justify-between ">
                <div>{t('Withdraw') + ' ' + t('Amount')}</div>
                <div style={{ fontWeight: 500 }}>
                  {withdrowAmmount} {t(configurations?.currency)}
                </div>
              </div>
              <div className="flex justify-between ">
                <div>{t('Transaction') + ' ' + t('Fee')}</div>
                <div style={{ fontWeight: 500 }}>
                  {transactionFee} {t(configurations?.currency)}
                </div>
              </div>
              <div className="flex justify-between ">
                <div>{t('NetPay')}</div>
                <div style={{ fontWeight: 500 }}>
                  {netPay} {t(configurations?.currency)}
                </div>
              </div>
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              {i18n.resolvedLanguage == 'Am' ? (
                <div>የመውጫ ቁጥሮ በኣጭር መልእክት ተልኮሎታል።</div>
              ) : (
                <div>Your withdraw code is sent to you via SMS.</div>
              )}
              {i18n.resolvedLanguage == 'En' ? (
                <div>
                  Please go to a nearby {configurations.name} Betting shop and
                  withdraw the money using the withdraw code.
                  <br />
                  Make sure not to share the withdraw code with anyone.
                </div>
              ) : (
                <div>
                  እባኮ በኣቅራቢያዎ ወዳለ {configurations.name} ስፖርት ሱቅ በመሄድ የወጪ ኣጭር
                  ቁጥሩን በመጠቀም ገንዘቦን ይውሰዱ።
                  <br />
                  የወጪ ማረጊያ ቁጥሩ ለሌላ ሰው ኣለማጋራቶን አርግጠኛ ይሁኑ።
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
