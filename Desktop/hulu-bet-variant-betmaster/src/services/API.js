/**
 * Created by pc on 4/7/18.
 */
import axios from 'axios';
import ClientSession from './client-session.js';

let API_BASE_URL = process.env.API_BASE_URL;
let API_TRANS_BASE_URL = process.env.API_TRANS_BASE_URL;
let API_TELEGRAM_BOT_URL = process.env.API_TELEGRAM_BOT_URL;

export default class API {
  static API_BASE_URL = API_BASE_URL;
  static HOME_URL = process.env.HOME_URL;

  static create(pluralName, data, filter = null) {
    let url = API_BASE_URL + pluralName;
    if (filter) url += +filter;

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        let token = authData != null ? authData.token : '';
        axios
          .post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + token,
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }

  static createPayment(pluralName, data, filter = null) {
    let url = API_TRANS_BASE_URL + pluralName;
    if (filter) url += +filter;

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        let token = authData != null ? authData.token : '';

        axios
          .post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + token,
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }

  static createNoToken(pluralName, data, filter = null) {
    let url = API_BASE_URL + pluralName;
    if (filter) url += +filter;

    return new Promise(function (resolve, reject) {
      axios
        .post(url, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  static createBot(pluralName, data, filter = null) {
    let url = API_TELEGRAM_BOT_URL + pluralName;
    if (filter) url += +filter;

    return new Promise(function (resolve, reject) {
      axios
        .post(url, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  static find(pluralName, id, filter) {
    let url = API_BASE_URL + pluralName;

    if (id) url += '/' + id;
    if (filter) url += '?' + filter;

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        let token = authData != null ? authData.token : '';
        let lang =
          authData != null &&
          authData.languages &&
          authData.languages[0] &&
          authData.languages[0]
            ? authData.languages[0].id
            : 0;

        axios
          .get(url, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + token,
              // "HTTP-LANGUAGE-KEY":lang
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }

  static findWithNoToken(pluralName, id, filter) {
    let url = API_BASE_URL + pluralName;
    if (id) url += '/' + id;
    if (filter) url += '?' + filter;

    return new Promise(function (resolve, reject) {
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  static findJackpotWithNoToken(pluralName, id, filter) {
    let url = API_BASE_URL + pluralName;

    if (id) url += '/' + id;
    if (filter) url += '?' + filter;

    return new Promise(function (resolve, reject) {
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  static findJackpot(pluralName, id, filter) {
    let url = API_BASE_URL + pluralName;

    if (id) url += '/' + id;
    if (filter) url += '?' + filter;

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        let token = authData != null ? authData.token : '';
        axios
          .get(url, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + token,
              //"HTTP-LANGUAGE-KEY":authData.languages[0] && authData.languages[0].language?authData.languages[0].language.id:0
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }

  static createJackpot(pluralName, data, filter = null) {
    let url = API_BASE_URL + pluralName;
    if (filter) url += +filter;

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        let token = authData != null ? authData.token : '';
        axios
          .post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + token,
            },
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }

  static update(pluralName, data) {
    let url = API_BASE_URL + pluralName;

    return new Promise(function (resolve, reject) {
      axios({
        method: 'put',
        url: url,
        data: data,
      })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  static upload(container, files, progressCallback) {
    let url = API_BASE_URL + 'upload/' + container;

    let config = {
      onUploadProgress: progressCallback,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    let data = new FormData();
    for (let i in files) data.append(container + 's', files[i]);

    return new Promise(function (resolve, reject) {
      ClientSession.getAccessToken(function (isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += '?access_token=' + authData.id;
        }

        axios
          .post(url, data, config)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    });
  }
}
