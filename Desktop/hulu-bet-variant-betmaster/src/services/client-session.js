import store from 'store'; //local storage // per browser
import Cookies from 'universal-cookie';

class ClientSession {
  static authkey = 'Auth';
  static lngkey = 'Lang';
  static favkey = 'FAV_LEAGUES';
  static marketTypeFavKey = 'FAV_MARKETS';
  static slipKey = 'SPORT_SLIP';
  static slipUpdateKey = 'SLIP_LAST_UPDATE';
  static lastSelectedEvent = 'LAST_SELECTE_EVENT';
  static clearSlipKey = 'CLEAR_SLIP';
  static loggedin = null;
  static cookies = new Cookies();

  static storeAuth = (value, func) => {
    // session.put(ClientSession.authkey, value, (err) => func(err));
    const err = store.set(ClientSession.authkey, value);
    if (err) return func(err);
  };
  static storeLang = (value, func) => {
    // session.put(ClientSession.lngkey, value, (err) => func(err));
    const err = store.set(ClientSession.lngkey, value);
    if (err) return func(err);
  };

  static storeFav = (value, func) => {
    // session.put(ClientSession.favkey, value, (err) => func(err));
    const err = store.set(ClientSession.favkey, value);
    if (err) return func(err);
  };
  static storeMarketTypeFav = (value) => {
    const err = store.set(ClientSession.marketTypeFavKey, value);
    return err;
  };

  static storeSlip = (value, func) => {
    // session.put(ClientSession.slipKey, value, (err) => func(err));
    const err = store.set(ClientSession.slipKey, value);
    if (err) return func(err);
  };
  static storeSlipLastUpdate = (value, func) => {
    // session.put(ClientSession.slipUpdateKey, value, (err) => func(err));
    const err = store.set(ClientSession.slipUpdateKey, value);
    if (err) return func(err);
  };
  static storeLastSelectedEvent = (value) => {
    const err = store.set(ClientSession.lastSelectedEvent, value);
  };

  static getLastSelectedEvent = () => {
    let value = store.get(ClientSession.lastSelectedEvent);
    if (value) return value;
    return null;
  };
  static removeLastSelectedEvent = () => {
    store.remove(ClientSession.lastSelectedEvent);
  };

  static getAuth = (reciverfunc) => {
    let value = store.get(ClientSession.authkey);
    if (value) return reciverfunc(null, value);
    return reciverfunc('not stored ', null);
  };
  static getLang = (reciverfunc) => {
    let value = store.get(ClientSession.lngkey);
    if (value) return reciverfunc(null, value);
    return reciverfunc('not stored ', null);
  };

  static getFav = (reciverfunc) => {
    let value = store.get(ClientSession.favkey);
    if (value) return reciverfunc(null, value);
    return reciverfunc('not stored ', null);
  };
  static getMarketTypeFav = () => {
    let value = store.get(ClientSession.marketTypeFavKey);
    return value ? value : null;
  };

  static getSlips = (reciverfunc) => {
    let value = store.get(ClientSession.slipKey);
    if (value) return reciverfunc(null, value);
    return reciverfunc('not stored ', null);
  };
  static getSlipsLastUpdate = (reciverfunc) => {
    let value = store.get(ClientSession.slipUpdateKey);
    if (value) return reciverfunc(null, value);
    return reciverfunc('not stored ', null);
  };
  static updateAuthData = (newValue, func) => {
    let value = store.get(ClientSession.authkey);
    if (value) {
      value.data = newValue;
      const err = store.set(ClientSession.authkey, value);
      if (err) return func(err);
    }
    return func('not stored ');
  };

  static removeAuth = () => {
    store.remove(ClientSession.authkey);
  };

  static isLoggedIn = (func) => {
    return ClientSession.getAuth((err, value) => {
      if (err) {
        // console.error(err);
        func(false);
        // return false;
      } else {
        if (value == null) {
          ClientSession.removeAuth();
          func(false);
          // return false;
        } else if (
          new Date(value.createdDate).getTime() + value.ttl >=
          new Date().getTime()
        ) {
          func(true);
          // return true;
        } else {
          //expire
          //ClientSession.removeAuth();
          if (value.languages != null && value.languages.length > 0) {
            func(true, true);
            // return true;
          } else {
            func(true, false);
            // return true;
          }
        }
      }
    });
  };

  static getToken = () => {
    if (ClientSession.isAuth()) {
      ClientSession.getAuth((err, value) => {
        if (err) {
          console.error(err);
          return false;
        } else {
          return value.id;
        }
      });
    }
  };

  static isAuth = () => {
    let value = store.get(ClientSession.authkey);
    if (value === null || value === undefined) {
      ClientSession.removeAuth();
      return false;
    }
    return value?.token ? true : false;
  };

  static getAccessToken = (callback) => {
    if (ClientSession.isAuth()) {
      ClientSession.getAuth((err, value) => {
        if (err) {
          // console.error(err);
          callback(false, err);
        } else {
          callback(true, value);
        }
      });
    } else {
      callback(false, null);
    }
  };

  static storeClearPlace = (value) => {
    const result = store.set(ClientSession.clearSlipKey, value);
    return result;
  };
  static getClearPlace = () => {
    const result = store.get(ClientSession.clearSlipKey);
    return result;
  };
}

export default ClientSession;
