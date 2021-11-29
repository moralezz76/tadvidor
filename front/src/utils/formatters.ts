import moment from 'moment';
import { t } from '../config/i18n';

export class Formatters {
  static DATETIME = (value: any) => moment.utc(value, 'X').format('YYYY/MM/DD - H:mm:ss');
  static NOEMPTY = (value: any) => (value ? value : '—');
  static TIMEDIFF_SEC = (value: any) => {
    if (value === 0) return '—';
    const secs = value % 60;
    const mins = Math.trunc(value / 60);
    //const min = mins % 60;
    const hours = Math.trunc(mins / 60);
    //const hour = hours % 24;
    const days = Math.trunc(hours / 24);
    //const day = days % 30;
    const months = Math.trunc(days / 30);
    //const month = months % 12;
    const years = Math.trunc(months / 12);
    if (years) return t('timeYearsAgo', { years, s: years === 1 ? '' : 's' });
    if (months) return t('timeMonthsAgo', { months, s: months === 1 ? '' : 's' });
    if (days) return t('timeDaysAgo', { days, s: days === 1 ? '' : 's' });
    if (hours) return t('timeHoursAgo', { hours, s: hours === 1 ? '' : 's' });
    if (mins) return t('timeMinsAgo', { mins, s: mins === 1 ? '' : 's' });
    return t('timeSecsAgo', { secs, s: secs === 1 ? '' : 's' });
  };

  static TIMEDIFF_MS = (value: any) => {
    if (value === 0) return '—';
    const secs = value % 60;
    const mins = Math.trunc(value / 60);
    return `0${mins}`.slice(-2) + ':' + `0${secs}`.slice(-2);
  };
}
