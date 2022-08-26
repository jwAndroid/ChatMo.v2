import moment from 'moment';
import 'moment/locale/ko';

// moment.locale('ko');

export function getTimestamp(): number {
  const timestamp = moment().toDate().getTime();

  // const format = moment(timestamp).format('YYYY-MM-DD');

  return timestamp;
}

export function getFormatTime(): string {
  const timestamp = moment().toDate().getTime();

  const formated = moment(timestamp).format('YYYY-MM-DD');

  return formated;
}
