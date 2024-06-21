import moment from 'moment';
// import etdate from 'ethiopic-date';
import { EthDateTime } from 'ethiopian-calendar-date-converter';

export default class Utils {
  static currencyCommaFormat(number) {
    return String(number).replace(/^\d+/, (number) =>
      [...number]
        .map(
          (digit, index, digits) =>
            (!index || (digits.length - index) % 3 ? '' : ',') + digit
        )
        .join('')
    );
  }

  static newCurrencyFormat(number) {
    return Number(number)
      ?.toFixed(2)
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static localizeBetTypes(bet_types, value, lang = 'En') {
    if (lang == 'Am') {
      if (bet_types.locales.filter((l) => l.locale == 1)[0]) {
        return bet_types.locales.filter((l) => l.locale == 1)[0].translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  }
  static replaceName(
    nameString,
    params,
    home,
    away,
    hometeam_locale,
    awayteam_locale,
    lang = 'En'
  ) {
    if (lang == 'Am') {
      let s = nameString
        .replace(/{\$competitor2}/g, awayteam_locale)
        .replace(/{\$competitor1}/g, hometeam_locale)
        .replace(/draw/g, 'አቻ');
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    } else {
      let s = nameString
        .replace(/{\$competitor2}/g, away)
        .replace(/{\$competitor1}/g, home)
        .replace(/draw/g, 'DRAW');
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    }
  }

  static replaceNameShort(
    nameString,
    params,
    home,
    away,
    hometeam_locale,
    awayteam_locale,
    lang = 'En'
  ) {
    if (lang == 'Am') {
      let s = nameString
        .replace(/{\$competitor2}/g, 2)
        .replace(/{\$competitor1}/g, 1)
        .replace(/draw/g, 'X');
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    } else {
      let s = nameString
        .replace(/{\$competitor2}/g, 2)
        .replace(/{\$competitor1}/g, 1)
        .replace(/draw/g, 'X');
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    }
  }

  static displayTime(time, lang = 'En') {
    if (time == undefined) return '';
    if (lang.toLocaleUpperCase() == 'AM') {
      let check = moment(time).format('hh:mm A').toString();
      let clock = '';
      if (parseInt(check.split(':')[0]) <= 6 && check.split(' ')[1] == 'AM') {
        clock = moment(time).add(6, 'hours').format('hh:mm').toString() + ' ማታ';
      } else if (
        parseInt(check.split(':')[0]) >= 6 &&
        check.split(' ')[1] == 'PM'
      ) {
        clock =
          moment(time).subtract(6, 'hours').format('hh:mm').toString() + ' ማታ';
      } else if (
        parseInt(check.split(':')[0]) > 6 &&
        check.split(' ')[1] == 'AM'
      ) {
        clock =
          moment(time).subtract(6, 'hours').format('hh:mm').toString() + ' ቀን';
      } else {
        clock = moment(time).add(6, 'hours').format('hh:mm').toString() + ' ቀን';
      }
      // etdate.convert(time).slice(0, -5)
      // return etdate.convert(time) + ' ' + clock;
      return moment(time).format(' HH:mm DD/MM/YY').toString();
    } else {
      return moment(time).format(' HH:mm DD/MM/YY').toString();
    }
  }

  static displayTimeOnly(time, lang = 'En') {
    if (time == undefined) return '';
    if (lang.toLocaleUpperCase() == 'AM') {
      const ethDateTime = EthDateTime.fromEuropeanDate(
        new Date(moment(time).subtract(6, 'hours'))
      );
      // console.log(ethDateTime);
      const clock_et = ethDateTime.toTimeString().split(' ')[0];
      const am_pm = ethDateTime.toTimeString().split(' ')[1];
      const splited = clock_et.split(':');
      const et_am_pm = am_pm == 'a.m.' ? 'ቀ' : 'ማ';
      const time_et = splited[0] + ':' + splited[1] + et_am_pm;
      return time_et;
    } else {
      return moment(time).format('HH:mm').toString();
    }
  }

  static displayDate(time, lang = 'En', format = 'DD/MM/YY') {
    if (time == undefined) return '';
    if (lang.toLocaleUpperCase() == 'AM') {
      const ethDateTime = EthDateTime.fromEuropeanDate(new Date(time));
      // console.log(ethDateTime.toTimeString());
      // return etdate.convert(time);
      return (
        ethDateTime.date + '/' + ethDateTime.month + '/' + ethDateTime.year
      );
    } else {
      return moment(time).format(format).toString();
    }
  }

  static replaceMarketName(
    nameString,
    params,
    home,
    away,
    hometeam_locale,
    awayteam_locale,
    lang = 'En'
  ) {
    if (lang == 'Am') {
      let s = nameString
        .replace(
          /{\$competitor2}/g,
          awayteam_locale != null ? awayteam_locale : away
        )
        .replace(
          /{\$competitor1}/g,
          hometeam_locale != null ? hometeam_locale : home
        );
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    } else {
      let s = nameString
        ?.replace(/{\$competitor2}/g, away)
        ?.replace(/{\$competitor1}/g, home);
      params?.split(',')?.forEach((p) => {
        s = s?.replace('{' + p?.split('=')[0] + '}', p?.split('=')[1]);
      });
      return s;
    }
  }

  static replaceMarketNameShort(
    nameString,
    params,
    home,
    away,
    hometeam_locale,
    awayteam_locale,
    lang = 'En'
  ) {
    if (lang == 'Am') {
      let s = nameString
        .replace(/{\$competitor2}/g, 2)
        .replace(/{\$competitor1}/g, 1);
      params.split(',').forEach((p) => {
        s = s.replace('{' + p.split('=')[0] + '}', p.split('=')[1]);
      });
      return s;
    } else {
      let s = nameString
        ?.replace(/{\$competitor2}/g, 2)
        ?.replace(/{\$competitor1}/g, 1);
      params?.split(',')?.forEach((p) => {
        s = s?.replace('{' + p?.split('=')[0] + '}', p?.split('=')[1]);
      });
      return s;
    }
  }

  static capitalizePicks(s) {
    return s
      .replace(/Yes/g, 'YES')
      .replace(/No/g, 'NO')
      .replace(/Under/g, 'UNDER')
      .replace(/Over/g, 'OVER')
      .replace(/yes/g, 'YES')
      .replace(/no/g, 'NO')
      .replace(/under/g, 'UNDER')
      .replace(/over/g, 'OVER');
  }

  static capitalizePicksShort(s) {
    return s
      .replace(/Yes/g, 'YES')
      .replace(/No/g, 'NO')
      .replace(/Under/g, 'U')
      .replace(/Over/g, 'O')
      .replace(/yes/g, 'YES')
      .replace(/no/g, 'NO')
      .replace(/under/g, 'U')
      .replace(/over/g, 'O');
  }

  static validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }
}
