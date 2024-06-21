import React, {
  Fragment,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';

import { useWallet } from '@hooks/useWallet';

import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';

import partner3 from '@assets/img/partners/lion.png';
import wegagen from '@assets/img/partners/wegagen.png';
import amole from '@assets/img/partners/amole.png';
import ebirr from '@assets/img/partners/ebirr.png';
import cbe from '@assets/img/partners/cbebirr.png';
import teleBirr from '@assets/img/partners/telebirr.jpg';
import santim from '@assets/img/partners/santim.png';
import chapa from '@assets/img/partners/chapa.png';
import kacha from '@assets/img/partners/kacha.png';
import unayo from '@assets/img/partners/unayo.png';
import yo_uganda from '@assets/img/partners/yo_uganda.png';

import { Input, InputNumber, Select as AntSelect, message } from 'antd';
import { BsBank2, BsCheck } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { Listbox } from '@headlessui/react';
import { BiCheck, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import {
  updateConfigurations,
  updateConfigurationsSportType,
} from '@ReduxStore/configurationSlice';
import API from '@services/API';
import { useCoreData } from '@hooks/useCoreData';

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
];

const PAYMENT_TYPE_LOGOS = {
  hellocash: partner3,
  amole: amole,
  hellocashwegagen: wegagen,
  ebirr: ebirr,
  cbebirr: cbe,
  telebirr: teleBirr,
  santim: santim,
  chappa: chapa,
  kacha: kacha,
  unayo: unayo,
  yo_uganda: yo_uganda,
};

export default function MobileDeposit() {
  const [supportedPaymentMethods, setSupportedPaymentMethods] = useState({});
  const [transferType, setTransferType] = useState(null);
  const [amountHC, setAmountHC] = useState(50);
  const [supportedSantimDepositBanks, setSupportedSantimDepositBanks] =
    useState([]);
  const [loadingDeposite, setLoadingDeposite] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({});
  // const [selectedBank, setSelectedBank] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [hppUrl, setHppUrl] = useState(null);
  const [reqMode, setReqMode] = useState(null);
  const [billReferenceNumber, setBillReferenceNumber] = useState(null);

  const [chappaURL, setChappaURL] = useState(null);
  const [checkoutURL, setCheckouURL] = useState(null);
  const [hppRequestId, setHppRequestId] = useState(null);
  const [referenceId, setReferenceId] = useState(null);

  const [showCBEBirrOTP, setShowCBEBirrOTP] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const userDetail = useSelector((state) => state.user.userDetail);
  const [reciverPhone, setReciverPhone] = useState(userDetail.username || null);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const dispatch = useDispatch();

  const {
    getTransaction,
    requestWithdrow,
    amoleConfirm,
    transfer,
    withdrowHellocash,
    depositHellocash,
    cbeConfirm,
  } = useWallet();
  const { getConfiguration } = useCoreData();

  const walletRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    let supported_payment_methods = {};
    configurations?.supported_payment_methods?.forEach((item) => {
      if (!supported_payment_methods[item.key]) {
        supported_payment_methods[item.key] = { ...item };
        if (item.key == 'hellocash') {
          supported_payment_methods[item.key].logo = partner3;
        } else if (item.key == 'amole') {
          supported_payment_methods[item.key].logo = amole;
        } else if (item.key == 'hellocashwegagen') {
          supported_payment_methods[item.key].logo = wegagen;
        } else if (item.key == 'ebirr') {
          supported_payment_methods[item.key].logo = ebirr;
        } else if (item.key == 'cbebirr') {
          supported_payment_methods[item.key].logo = cbe;
        } else if (item.key == 'telebirr') {
          supported_payment_methods[item.key].logo = teleBirr;
        } else if (item.key == 'santim') {
          supported_payment_methods[item.key].logo = santim;
        } else if (item.key == 'chappa') {
          supported_payment_methods[item.key].logo = chapa;
        } else if (item.key == 'kacha') {
          supported_payment_methods[item.key].logo = kacha;
        } else if (item.key == 'unayo') {
          supported_payment_methods[item.key].logo = unayo;
        } else if (item.key == 'yo_uganda') {
          supported_payment_methods[item.key].logo = yo_uganda;
        }
      }
    });

    setReciverPhone(userDetail.username);
    setSupportedPaymentMethods(supported_payment_methods);
    setSupportedSantimDepositBanks(
      configurations?.supported_santimpay_deposit_banks
    );
    setAmountHC(configurations.minimum_deposit_amount);
  }, [configurations]);

  useEffect(() => {
    !configurations && getConfiguration();
  }, []);

  useEffect(() => {
    if (chappaURL && document?.forms?.submitDepositChappa) {
      document.forms.submitDepositChappa.submit();
    }
    if (checkoutURL && document?.forms?.submitCheckout) {
      document.forms.submitCheckout.submit();
    }
  }, [chappaURL, checkoutURL]);

  const changeBankType = (type) => {
    setTransferType(type);
  };

  const depHellocash = () => {
    if (
      amountHC < configurations?.minimum_deposit_amount ||
      amountHC > configurations?.maximum_deposit_amount
    ) {
      return message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
    }
    if (transferType == null) return message.error(t('SelectPaymentMethod'));
    if (transferType?.toLocaleLowerCase() == 'chappa' && reciverPhone == '') {
      return message.error('Please fill account number');
    }
    if (transferType.toLocaleLowerCase() == 'santim' && reciverPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountHC == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    }

    setLoadingDeposite(true);

    let bank = selectedProvider;
    const is_paymnet_type_in_santim = supportedSantimDepositBanks?.some(
      (item) => item.code === transferType
    );
    let selected_payment_method = is_paymnet_type_in_santim
      ? 'santim'
      : transferType;
    if (
      supportedSantimDepositBanks?.some((item) => item.code === transferType)
    ) {
      bank = transferType;
    }

    depositHellocash(selected_payment_method, amountHC, reciverPhone, bank)
      .then((response) => {
        setSelectedProvider(null);
        setLoadingDeposite(false);
        if (selected_payment_method.toLocaleLowerCase() == 'chappa') {
          setChappaURL(response.chappaURL);
        } else if (selected_payment_method.toLocaleLowerCase() == 'telebirr') {
          setChappaURL(response.teleBirrURL);
        } else if (selected_payment_method.toLocaleLowerCase() == 'santim') {
          message.success(t('TransferSuccessfull'));
          // setCheckouURL(response.checkoutURL);
        } else if (selected_payment_method.toLocaleLowerCase() == 'cbebirr') {
          setShowCBEBirrOTP(true);
          setReqMode('deposite');
          setBillReferenceNumber(response.billReferenceNumber);
        } else if (selected_payment_method.toLocaleLowerCase() == 'ebirr') {
          setReqMode('deposite');
          setHppRequestId(response.hppRequestId);
          setReferenceId(response.referenceId);
          setHppUrl(response.hppUrl);
        } else if (selected_payment_method.toLocaleLowerCase() == 'amole') {
          setReqMode(response.reqMode);
        } else return response;
      })
      .catch((err) => {
        // console.log(err);
        setLoadingDeposite(false);
      });
  };

  return (
    <div className=" relative flex w-full flex-col items-center pb-8 before:absolute before:mt-3 before:h-1 before:w-9   before:rounded-r-full before:rounded-l-full before:bg-white md:before:hidden">
      <div className="flex h-20 w-full items-center justify-center bg-header-container px-4">
        <img src={logo} className="h-12" />
      </div>
      <div className=" relative flex w-full flex-col items-center justify-center px-4 md:px-8">
        <div className="flex w-full flex-col items-center justify-center gap-2 py-2">
          <h2 className="m-0 p-0 text-xl font-semibold uppercase text-primary">
            {t('Deposite')}
          </h2>
        </div>
        {transferType != 'branch' && (
          <div className="mb-2 flex w-full flex-wrap gap-2">
            <a
              onClick={() => setAmountHC(amountHC + 10)}
              className=" flex h-6 items-center justify-center rounded-l-full rounded-r-full border-[1px] border-primary bg-white px-2 py-1 text-primary shadow-md hover:bg-primary-700 hover:text-white active:bg-primary-700 active:text-white "
            >
              +10
            </a>
            <a
              onClick={() => setAmountHC(amountHC + 50)}
              className=" flex h-6 items-center justify-center rounded-l-full rounded-r-full border-[1px] border-primary bg-white px-2 py-1 text-primary shadow-md hover:bg-primary-700 hover:text-white active:bg-primary-700 active:text-white "
            >
              +50
            </a>
            <a
              onClick={() => setAmountHC(amountHC + 100)}
              className=" flex h-6 items-center justify-center rounded-l-full rounded-r-full border-[1px] border-primary bg-white px-2 py-1 text-primary shadow-md hover:bg-primary-700 hover:text-white active:bg-primary-700 active:text-white "
            >
              +100
            </a>
            <a
              onClick={() => setAmountHC(amountHC + 500)}
              className=" flex h-6 items-center justify-center rounded-l-full rounded-r-full border-[1px] border-primary bg-white px-2 py-1 text-primary shadow-md hover:bg-primary-700 hover:text-white active:bg-primary-700 active:text-white "
            >
              +500
            </a>
            <a
              onClick={() => setAmountHC(amountHC + 1000)}
              className=" flex h-6 items-center justify-center rounded-l-full rounded-r-full border-[1px] border-primary bg-white px-2 py-1 text-primary shadow-md hover:bg-primary-700 hover:text-white active:bg-primary-700 active:text-white "
            >
              +1000
            </a>
          </div>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className=" relative flex  w-full flex-col gap-1">
            <h2 className="font-semibold">{t('SelectPaymentMethod')}</h2>

            <div className="relative">
              <Select.Root
                onValueChange={(value) => {
                  changeBankType(value);
                }}
                // defaultValue={transferType || ''}
                className="relative z-50"
              >
                <Select.Trigger
                  className="inline-flex h-[35px] w-full items-center justify-between gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-gray-600 outline-none ring-1 ring-slate-300 placeholder:text-blue-500 hover:bg-white focus:ring-slate-400 "
                  aria-label="payment method"
                >
                  <Select.Value
                    placeholder={t('SelectPaymentMethod')}
                    className="truncate"
                  />
                  <Select.Icon className="text-gray-400">
                    <BiChevronDown />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal className="relative z-50">
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg  shadow-black/30 ">
                    <Select.ScrollUpButton className="flex h-[25px] w-full cursor-default items-center justify-center bg-white text-gray-400">
                      <BiChevronUp />
                    </Select.ScrollUpButton>
                    <Select.Viewport className=" fixed z-50 p-[5px] ">
                      <Select.Group className="w-full">
                        <Select.Label className="px-[25px] text-xs leading-[25px] text-gray-300">
                          {t('PaymentMethods')}
                        </Select.Label>
                        {supportedSantimDepositBanks?.map((item, idx) => {
                          return (
                            <SelectItem
                              key={item.code}
                              value={item.code}
                              className="w-full flex-1"
                            >
                              <div className="flex w-52 flex-1 items-center justify-between gap-x-4">
                                <div className="flex items-center justify-start gap-x-2">
                                  {PAYMENT_TYPE_LOGOS[
                                    item.code
                                      .toLocaleLowerCase()
                                      .replace(/\s/g, '')
                                  ] && (
                                    <img
                                      src={
                                        PAYMENT_TYPE_LOGOS[
                                          item.code
                                            .toLocaleLowerCase()
                                            .replace(/\s/g, '')
                                        ]
                                      }
                                      width={20}
                                      height={20}
                                    />
                                  )}
                                  {item.name}
                                </div>
                                <span className="text-xs font-light text-primary">
                                  {t('ViaSantimPay')}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                        {configurations?.supported_payment_methods?.map(
                          (item, idx) => {
                            if (
                              item.key == 'santim' ||
                              item.enable_option == 4 ||
                              (item.enable_option == 2 && //  withdraw
                                item.enable_option != 3)
                            )
                              return null;
                            return (
                              <SelectItem key={idx} value={item.key}>
                                <div className="flex items-center justify-start gap-x-2">
                                  {supportedPaymentMethods[item.key]?.logo && (
                                    <img
                                      src={
                                        supportedPaymentMethods[item.key]?.logo
                                      }
                                      width={20}
                                      height={20}
                                    />
                                  )}
                                  {item.key == 'branch' && (
                                    <BsBank2 className="h-4 w-4 text-primary" />
                                  )}
                                  {item.name}
                                </div>
                              </SelectItem>
                            );
                          }
                        )}
                      </Select.Group>
                    </Select.Viewport>
                    {/* <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-400">
                        <BiChevronDown />
                      </Select.ScrollDownButton> */}
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
          {transferType != 'branch' ? (
            <div className=" relative mb-4 flex w-full flex-col flex-wrap justify-center md:w-80">
              <div className="m-0 flex w-full flex-col items-start justify-center gap-2">
                <div className="flex  w-full flex-col gap-1">
                  <p className="m-0 p-0">{t('Amount')}</p>
                  <InputNumber
                    value={amountHC}
                    style={{
                      width: '100%',
                      marginBottom: 10,
                      color:
                        amountHC > configurations?.maximum_deposit_amount ||
                        amountHC < configurations?.minimum_deposit_amount
                          ? 'red'
                          : '',
                    }}
                    // min={100}
                    // max={25000}
                    name="amountHC"
                    onChange={(e) => {
                      setAmountHC(e);
                    }}
                  />
                </div>
                {transferType == 'ebirr' ||
                transferType == 'telebirr' ||
                supportedSantimDepositBanks?.some(
                  (item) => item.code === transferType
                ) ||
                transferType == 'amole' ? (
                  <Input
                    value={
                      !configurations.useridentifier_deposit_editable
                        ? configurations.username
                        : reciverPhone
                    }
                    disabled={!configurations.useridentifier_deposit_editable}
                    style={{ width: '100%', marginBottom: 10 }}
                    placeholder={t('Phone')}
                    name="reciverPhone"
                    onChange={(e) => setReciverPhone(e.target.value)}
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="mt-4 flex flex-col items-start justify-center gap-y-2 gap-x-4">
                <button
                  className="flex h-8 w-28 items-center justify-center gap-x-1 rounded bg-secondary-button py-2 px-1 text-center font-semibold uppercase text-secondary-button-font"
                  disabled={loadingDeposite}
                  onClick={() => depHellocash()}
                >
                  {loadingDeposite && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 animate-spin fill-primary text-gray-200 dark:text-green-400"
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
          ) : (
            <div className="flex py-2 ">
              Please find a nearby {configurations.name} shop to deposit.
              <br /> Thank you.
            </div>
          )}
        </div>
      </div>
      {/* chapa Hidden Form */}
      <form
        name="submitDepositChappa"
        // target={'_blank'}
        rel="noopener noreferrer"
        type="hidden"
        action={chappaURL}
        method="GET"
      >
        <input type="hidden" id="checkoutId" name="checkoutId" value="1" />
      </form>

      {/* santim Hidden Form */}
      <form
        name="submitCheckout"
        target={'_self'}
        rel="noopener noreferrer"
        type="hidden"
        action={checkoutURL}
        method="GET"
      >
        <input
          type="hidden"
          name="data"
          value={checkoutURL?.split('data=')[1]}
        />
        {/* https://services.santimpay.com/?data=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eG5JZCI6ImMzOWUzNGZlLTgyNWItNDA5ZS05OTMxLTQyOWExODVlOTUyYSIsIm1lcklkIjoiOWUyZGFiNjQtZTJiYi00ODM3LTliODUtZDg1NWRkODc4ZDJiIiwibWVyTmFtZSI6IlNhbnRpbXBheSBUZXN0IENvbXBhbnkiLCJhZGRyZXNzIjoiQWRkaXMgQWJhYmEiLCJhbW91bnQiOiIxMDAuMDAiLCJjdXJyZW5jeSI6IkVUQiIsInJlYXNvbiI6IlNhbnQtRGVwb3NpdCIsImNvbW1pc3Npb25BbW91bnQiOiIxLjAwIiwidG90YWxBbW91bnQiOiIxMDEuMDAiLCJwaG9uZU51bWJlciI6IisyNTE5MDEwMDAwNTEiLCJleHAiOjE2ODMxMzA5MTMsImlzcyI6InNlcnZpY2VzLnNhbnRpbXBheS5jb20ifQ.P1o0ptSkZjtbqYjwqZIopeLS5Pg0VoMH6PKOSlHnKudFZWX9d1MxFKmnpDoeC_SYmMnBSG6h1KTIWPR4ot_Jgg */}
      </form>
    </div>
  );
}

const SelectItem = forwardRef(function SelectItem(
  { children, className, ...props },
  forwardedRef
) {
  return (
    <Select.Item
      className={classnames(
        'relative flex h-[25px] w-full select-none items-center gap-x-1 rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none text-gray-900 hover:bg-gray-200 hover:text-gray-700 hover:outline-none disabled:pointer-events-none disabled:text-gray-500',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center text-primary">
        <BiCheck />
      </Select.ItemIndicator>
      <Select.ItemText className="flex w-full flex-1">
        {children}
      </Select.ItemText>
    </Select.Item>
  );
});
