import { useDispatch, useSelector } from 'react-redux';
import {
  updateUser,
  updateUserStatus,
  updateUserAuth,
} from '@ReduxStore/userSlice';
import { updateConfigurationsMinStake } from '@ReduxStore/configurationSlice';
import UserService from '@services/users.service';
import ClientSession from '@services/client-session';
import { message } from 'antd';
import API from '../services/API';
import { useTranslation } from 'react-i18next';
import { MIN_STAKE_OFFLINE, MIN_STAKE_ONLINE } from '@services/constants';

export const useUser = () => {
  const telegramData = useSelector((state) => state.user.telegramData);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user.userDetail);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  const getUser = () => {
    return ClientSession.getAccessToken(function (isLoggedIn, authData) {
      if (isLoggedIn) return authData;
      else return {};
    });
  };

  const login = (phone, password) => {
    return UserService.login(phone, password)
      .then((response) => {
        if (response.success) {
          changeLoginStatus();
          getProfile();
          if (telegramData?.cid) {
            API.createBot('/login', {
              chat_id: Number(telegramData.cid),
              message_id: Number(telegramData.mid),
              token: response?.user?.token,
            });
          }
          message.success(response.message);
          return;
        } else {
          if (response.data.result[0] == 'verify') {
            return response.data['verify-id'][0];
          }
          message.error(response.message);
          return;
        }
      })
      .catch((err) => {
        if (!err.response) {
          message.error('Error While Loading Data');
          return;
        }
        message.error(
          err.response?.data[Object.keys(err.response?.data)[0]][0]
        );
        return;
      });
  };

  const changeLoginStatus = () => {
    ClientSession.getAccessToken((isLoggedIn, authData) => {
      if (isLoggedIn) {
        dispatch(updateUserStatus({ isLoggedIn }));
        dispatch(updateUserAuth({ authData: authData }));
        dispatch(updateConfigurationsMinStake({ minStake: MIN_STAKE_ONLINE }));
      } else {
        dispatch(updateUserStatus({ isLoggedIn: false }));
        dispatch(updateConfigurationsMinStake({ minStake: MIN_STAKE_OFFLINE }));
      }
    });
  };

  const getProfile = () => {
    return API.find(`online/user-detail/`, null, null)
      .then((response) => {
        if (response.data) {
          let d = response.data;

          let wallet = {
            balance: 0.0,
            payable: 0.0,
          };
          if (d.member.wallet == null) {
            d.member.wallet = wallet;
          }
          dispatch(
            updateUser({
              userDetail: d,
              reciverPhoneHC: response.data.username,
              reciverPhone: response.data.username,
              data: {
                first_name: response.data.first_name,
                phone: response.data.username,
                balance:
                  d.member.wallet && d.member.wallet.balance
                    ? d.member.wallet.balance
                    : 0.0,
              },
            })
          );
        }
      })
      .catch((err) => {
        if (err.code == 'ERR_NETWORK') {
          message.error(err.message);
          return;
        }
        if (!err.response) {
          message.error('Error While Loading Data');
          return;
        }
        if (err?.response?.data)
          message.error(
            err?.response?.data[Object.keys(err.response?.data)[0]]
          );
        if (err.response?.status == 403) {
          UserService.logout();
          window.location.reload();
        }
      });
  };

  const registerOnTgSuccessfull = (cid, mid, token, uid) => {
    API.createBot('/register', {
      chat_id: cid,
      message_id: mid,
      token: token,
      id: uid,
    });
  };

  const register = (data, otp) => {
    return API.createNoToken(`register/`, data, null)
      .then((response) => {
        if (response.data) {
          // sendRegisterOTP(response.data.id);
          otp(response.data.id);
          // window.registrationCompleteWrapper(response.data.id);
          if (telegramData.cid) {
            registerOnTgSuccessfull(
              Number(telegramData.cid),
              Number(telegramData.mid),
              response.data.token || '',
              response.data.id
            );
          }
          message.success(t('RegisterationSucessfull'));
          return;
        }
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response) {
          message.error('Error While Loading Data');
          return;
        } else {
          message.error(
            err.response?.data[Object.keys(err.response?.data)[0]][0]
          );
        }
        return;
      });
  };

  const updateProfile = (userDetail) => {
    if (userDetail.username == '') {
      return message.error(t('PhoneCanNotbeBlank'));
    } else {
      return new Promise((resolve, reject) => {
        API.create(`user.save/`, userDetail, null)
          .then((response) => {
            resolve(t('ProfileUpdatedSuccessfully'));
          })
          .catch((err) => {
            if (!err.response) {
              reject('Error While Loading Data');
            }
            err.response.data[Object.keys(err.response.data)[0]][0];
            reject();
          });
      });
    }
  };

  const sendOTP = (phone) => {
    let data = { member: phone };
    return new Promise((resolve, reject) => {
      API.createNoToken(`forgotpassword.code.send/`, data, null)
        .then((response) => {
          if (response.data) {
            message.success(t('OTPsent'));
            resolve();
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          } else if (err.response?.status == 403) {
            message.error(
              err.response?.data[Object.keys(err.response?.data)[0]]
            );
            reject();
          } else {
            message.error(
              err.response?.data[Object.keys(err.response?.data)[0]][0]
            );
            reject();
          }
        });
    });
  };

  const verifyOTP = (otp, phone) => {
    if (otp == '') {
      message.error(t('OTPCannotBeEmpty'));
      return;
    }

    let data = { member: phone, code: otp };
    return new Promise((resolve, reject) => {
      API.createNoToken(`forgotpassword.code.verify/`, data, null)
        .then((response) => {
          if (response.data) {
            // message.success(t('OTPValid'));
            // resolve(message.success(t('OTPValid')));
            resolve();
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          }
          message.error(
            err.response?.data[Object.keys(err.response?.data)[0]][0]
          );
          reject();
        });
    });
  };

  const sendRegisterOTP = (registeredUser) => {
    if (registeredUser == '') {
      return message.error(t('UnKnownUser'));
    } else {
      let data = { user: registeredUser };
      return API.createNoToken(`register-conf/`, data, null)
        .then((response) => {
          if (response.data) {
            message.success(t('OTPsent'));
            return;
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            return;
          } else if (err.response?.status == 403) {
            message.error(
              err.response?.data[Object.keys(err.response?.data)[0]]
            );
            return;
          } else {
            message.error(
              err.response?.data[Object.keys(err.response?.data)[0]][0]
            );
            return;
          }
        });
    }
  };

  const verifyRegisterOTP = (registerOTP, registeredUser) => {
    if (registerOTP == '') {
      return message.error(t('OTPCannotBeEmpty'));
    } else {
      let data = { code: registerOTP, user: registeredUser };
      return new Promise((resolve, reject) => {
        API.createNoToken(`register-verify/`, data, null)
          .then((response) => {
            if (response.data) {
              // return message.success(t('OTPValid'));
              // resolve(message.success(t('OTPValid')));
              resolve();
            }
          })
          .catch((err) => {
            if (!err.response) {
              message.error('Error While Loading Data');
              reject();
            }
            message.error(
              err.response?.data[Object.keys(err.response?.data)[0]][0]
            );
            reject();
          });
      });
    }
  };

  const resetPassword = ({ password, phone, otp }) => {
    var data = {
      member: phone,
      code: otp,
      newpassword: password,
    };
    return new Promise((resolve, reject) => {
      API.createNoToken(`forgotpassword.reset/`, data, null)
        .then((response) => {
          if (response.data) {
            message.success(t('PasswordResetSuccessfully'));
            resolve();
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          }
          message.error(
            err.response?.data[Object.keys(err.response?.data)[0]][0]
          );
          reject();
        });
    });
  };

  const changePassword = ({ currentPassword, password, confirmPassword }) => {
    let data = {
      old_password: currentPassword,
      new_password: password,
      confirm_password: confirmPassword,
    };
    return new Promise((resolve, reject) => {
      API.create(`user.setpassword/`, data, null)
        .then((response) => {
          if (response.data) {
            message.success(t('PasswordResetSuccessfully'));
            resolve();
          }
        })
        .catch((err) => {
          if (!err.response) {
            message.error('Error While Loading Data');
            reject();
          }
          message.error(
            err.response?.data[Object.keys(err.response?.data)[0]][0]
          );
          reject();
        });
    });
  };

  const isLoggedIn = () => {
    let loggedin = false;
    ClientSession.getAccessToken((isLoggedIn, authData) => {
      loggedin = isLoggedIn;
      return isLoggedIn;
    });
    return loggedin;
  };

  const isBalanceValid = () => {
    return (
      userDetail.member &&
      userDetail.member?.wallet?.balance >= 0 &&
      userDetail.member?.wallet?.nonwithdrawable >= 0 &&
      userDetail.member?.wallet?.payable >= 0 &&
      userDetail.member?.wallet?.points >= 0
    );
  };

  const useAuth = () => {
    //  TODO: implement
  };

  const logOut = () => {
    UserService.logout();
    changeLoginStatus();
    if (telegramData?.cid && telegramData.logged_in) {
      return API.createBot('/logout', {
        chat_id: Number(telegramData.cid),
        message_id: Number(telegramData.mid),
      });
    }
  };

  return {
    getUser,
    getProfile,
    isLoggedIn,
    isBalanceValid,
    login,
    logOut,
    sendOTP,
    verifyOTP,
    sendRegisterOTP,
    verifyRegisterOTP,
    resetPassword,
    changePassword,
    useAuth,
    register,
    updateProfile,
    changeLoginStatus,
  };
};
