import API from '@services/API';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export const useWallet = () => {
  const { t } = useTranslation();

  const getTransaction = (type) => {
    if (type == 'branch') {
      return new Promise((resolve, reject) =>
        API.find(`user.transactions.branch/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ branchTransaction: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    } else if (type == 'bank') {
      return new Promise((resolve, reject) =>
        API.find(`user.transactions.bank/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ bankT: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    } else if (type == 'sent') {
      return new Promise((resolve, reject) =>
        API.find(`user.transactions.sent/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ sentT: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    } else if (type == 'recived') {
      return new Promise((resolve, reject) =>
        API.find(`user.transactions.recieved/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ recivedT: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            // this.getCoreData();
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    } else if (type == 'awarded') {
      return new Promise((resolve, reject) =>
        API.find(`user.transactions.awarded/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ awardedT: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    } else if (type == 'betForMeTransactions') {
      return new Promise((resolve, reject) =>
        API.find(`online-agent/transactions/`, null, null)
          .then((response) => {
            if (response.data) {
              resolve({ betForMeData: response.data });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response?.data[Object.keys(err.response?.data)[0]][0]
              )
            );
          })
      );
    }
  };

  const requestWithdrow = (withdrowAmmount) => {
    return new Promise((resolve, reject) =>
      API.createPayment(
        `online/withdrawrequest/`,
        { amount: withdrowAmmount },
        null
      )
        .then((response) => {
          if (response.data) {
            resolve({
              showCode: true,
              wCode: response.data.code,
              net_pay: response.data.net_pay,
              transaction_fee: response.data.transaction_fee,
            });
          }
        })
        .catch((err) => {
          if (!err.response.data) {
            reject(message.error('Error While Loading Data'));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const withdrowHellocash = (
    transferType,
    amountWD,
    reciverPhone,
    bank = null,
    accountName = null,
    accountNumber = null
  ) => {
    if (transferType.toLocaleLowerCase() == 'amole') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `amole/withdraw/`,
          {
            amount: amountWD,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve({
                showAmoleOTP: true,
                transaction_id: response.data.transaction_id,
                reqMode: 'withdrow',
              });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'ebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `ebirr/withdraw/`,
          {
            amount: amountWD,
            useridentifier: reciverPhone,
            bank: 'lion',
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve(
                {
                  reqMode: 'withdrow',
                  hppRequestId: response.data.hppRequestId,
                  hppUrl: response.data.hppUrl,
                  referenceId: response.data.referenceId,
                },
                () => {
                  // submit hidden form
                  document.forms.submitDeposit.submit();
                }
              );
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'cbebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `cbebirr/withdraw/`,
          {
            amount: amountWD,
            useridentifier: reciverPhone, // reciverPhoneHC,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              // this.getProfile();
              resolve(message.success(t('TransferSuccessfull')));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'telebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `telebirr/withdraw/`,
          {
            amount: amountWD,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve({ teleBirrURL: response.data.url });
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.response.status == 500) {
              reject(message.error('Internal Server Error'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'hellocash') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `hellocash/withdraw/`,
          { amount: amountWD, bank: 'lion' },
          null
        )
          .then((response) => {
            if (response.data) {
              // this.getProfile();
              resolve(message.success(t('TransferSuccessfull')));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'hellocashwegagen') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `hellocash/withdraw/`,
          { amount: amountWD, bank: 'wegagen' },
          null
        )
          .then((response) => {
            if (response.data) {
              // this.getProfile();
              resolve(message.success(t('TransferSuccessfull')));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'chappa') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `chappa/withdraw/`,
          {
            amount: amountWD,
            bank: bank,
            account_name: accountName,
            account_number: accountNumber,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve(message.success('Withdraw successful! '));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.response.status == 500) {
              reject(message.error('Internal Server Error'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'santim') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `santimpay/withdraw/`,
          {
            amount: amountWD,
            bank: bank,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve(message.success('Withdraw successful! '));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.response.status == 500) {
              reject(message.error('Internal Server Error'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'mpesa_ke') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `ke-asepm/withdraw/`,
          {
            amount: parseInt(amountWD),
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              resolve(message.success('Withdraw successful! '));
            }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.response.status == 500) {
              reject(message.error('Internal Server Error'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'yo_uganda') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `yo-uganda/withdraw/`,
          {
            amount: parseInt(amountWD),
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response) {
              message.success('Withdraw successful! ');
              resolve();
            }
          })
          .catch((err) => {
            if (!err.response) {
              message.error('Error While Loading Data');
              reject();
            }
            if (err.response.status == 500) {
              message.error('Internal Server Error');
              reject();
            }
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            );
            reject();
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'unayo') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `yo-uganda/withdraw`,
          {
            amount: parseInt(amountWD),
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            if (response.data) {
              message.success('Withdraw successful! ');
              resolve();
            }
          })
          .catch((err) => {
            if (!err.response) {
              message.error('Error While Loading Data');
              reject();
            }
            if (err.response.status == 500) {
              message.error('Internal Server Error');
              reject();
            }
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            );
            reject();
          })
      );
    }
  };

  const depositHellocash = (
    transferType,
    amountHC,
    reciverPhone,
    bank = null
  ) => {
    if (transferType.toLocaleLowerCase() == 'amole') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `amole/deposit/`,
          {
            amount: amountHC,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({
              transaction_id: response.data.transaction_id,
              reqMode: 'deposite',
            });
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'ebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `ebirr/deposit/`,
          {
            amount: amountHC,
            useridentifier: reciverPhone,
            bank: 'lion',
          },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({
              reqMode: 'deposite',
              hppRequestId: response.data.hppRequestId,
              hppUrl: response.data.hppUrl,
              referenceId: response.data.referenceId,
            });
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'cbebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `cbebirr/deposit/`,
          {
            amount: amountHC,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({
              showCBEBirrOTP: true,
              reqMode: 'deposite',
              billReferenceNumber: response.data?.billreferencenumber,
            });
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'telebirr') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `telebirr/deposit/`,
          {
            amount: amountHC,
            useridentifier: reciverPhone,
          },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({ teleBirrURL: response.data.url });
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.response.status == 500) {
              reject(message.error('Internal Server Error'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'hellocash') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `hellocash/deposit/`,
          { amount: amountHC, bank: 'lion' },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve(
              message.success(
                t('PleaseAuthorizeTheTransactionFromHellocashAccount')
              )
            );
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'hellocashwegagen') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `hellocash/deposit/`,
          { amount: amountHC, bank: 'wegagen' },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve(
              message.success(
                t('PleaseAuthorizeTheTransactionFromHellocashAccount')
              )
            );
            // }
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'chappa') {
      return new Promise((resolve, reject) =>
        API.createPayment(`chappa/deposit/`, { amount: amountHC }, null)
          .then((response) => {
            // if (response.data) {
            resolve({ chappaURL: response.data.checkout_url });
            // }
            resolve(response);
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'santim') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `santimpay/deposit/`,
          { amount: amountHC, useridentifier: reciverPhone, bank: bank },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({ checkoutURL: response.data.checkout_url });
            // }
            resolve(response);
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'mpesa_ke') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `ke-asepm/deposit/`,
          { amount: parseInt(amountHC), useridentifier: reciverPhone },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({ checkoutURL: response.data.checkout_url });
            // }
            resolve(response);
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'yo_uganda') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `yo-uganda/deposit/`,
          { amount: parseInt(amountHC), useridentifier: reciverPhone },
          null
        )
          .then((response) => {
            // if (response.data) {
            // resolve({ checkoutURL: response.data.checkout_url });
            // }
            message.success('Deposit successful! ');
            resolve();
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    } else if (transferType.toLocaleLowerCase() == 'unayo') {
      return new Promise((resolve, reject) =>
        API.createPayment(
          `yo-uganda/deposit`,
          { amount: parseInt(amountHC), useridentifier: reciverPhone },
          null
        )
          .then((response) => {
            // if (response.data) {
            resolve({ checkoutURL: response.data.checkout_url });
            // }
            resolve(response);
          })
          .catch((err) => {
            if (!err.response) {
              reject(message.error('Error While Loading Data'));
            }
            if (err.code === 'ECONNABORTED') {
              reject(message.error(err.message));
            }
            reject(
              message.error(
                err.response.data[Object.keys(err.response.data)[0]][0]
              )
            );
          })
      );
    }
  };
  const depositeBetForMe = (amount, phone) => {
    return new Promise((resolve, reject) =>
      API.createPayment(
        `online-agent/deposit/`,
        {
          amount: amount,
          useridentifier: phone,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code === 'ECONNABORTED') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };
  const withdrawBetForMe = (amount, phone) => {
    return new Promise((resolve, reject) =>
      API.createPayment(
        `online-agent/initiate-withdraw/`,
        {
          amount: amount,
          useridentifier: phone,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code === 'ECONNABORTED') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const withdrawBetForMeConfirm = (transaction_id, otp, phone) => {
    return new Promise((resolve, reject) =>
      API.create(
        `online-agent/confirm-withdraw/${transaction_id}/`,
        {
          otp: otp,
          useridentifier: phone,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code === 'ECONNABORTED') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const transferToWallet = (amount, phone) => {
    return new Promise((resolve, reject) =>
      API.create(
        `transfer/`,
        {
          amount: amount,
          reciever_username: phone,
        },
        null
      )
        .then((response) => {
          console.log(response);
          if (response.data) {
            resolve(response.data);
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          if (err.code === 'ECONNABORTED') {
            reject(message.error(err.message));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const amoleConfirm = (
    reqMode,
    amountHC,
    otp,
    reciverPhone,
    transaction_id
  ) => {
    const confirmData = {
      amount: amountHC,
      otp: otp,
      useridentifier: reciverPhone,
      transaction_id: transaction_id,
    };
    let url = `amole/deposit/finalize/`; //otp.confirm
    if (reqMode == 'withdrow') {
      url = `amole/withdraw/finalize/`;
    }
    return new Promise((resolve, reject) =>
      API.createPayment(url, confirmData, null)
        .then((response) => {
          if (response.data) {
            // this.getProfile();
            resolve(message.success(t('TransferSuccessfull')));
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const cbeConfirm = (reqMode, otp, amountHC) => {
    let url = `cbe/deposit/otp.confirm/`;
    if (reqMode == 'withdrow') {
      url = `cbe/withdraw/otp.confirm/`;
    }
    return new Promise((resolve, reject) =>
      API.createPayment(url, { amount: amountHC, otp: otp }, null)
        .then((response) => {
          if (response.data) {
            // this.getProfile();
            resolve(message.success(t('TransferSuccessfull')));
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  const transfer = (reciverPhone, amount) => {
    return new Promise((resolve, reject) =>
      API.createPayment(
        `transfer/`,
        {
          reciever_username: reciverPhone,
          amount: amount,
        },
        null
      )
        .then((response) => {
          if (response.data) {
            resolve(message.success(t('TransferSuccessfull')));
          }
        })
        .catch((err) => {
          if (!err.response) {
            reject(message.error('Error While Loading Data'));
          }
          reject(
            message.error(
              err.response.data[Object.keys(err.response.data)[0]][0]
            )
          );
        })
    );
  };

  return {
    getTransaction,
    requestWithdrow,
    amoleConfirm,
    transfer,
    withdrowHellocash,
    depositHellocash,
    depositeBetForMe,
    withdrawBetForMe,
    withdrawBetForMeConfirm,
    cbeConfirm,
    transferToWallet,
  };
};
