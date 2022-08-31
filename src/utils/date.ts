import moment from 'moment';
import 'moment/locale/ko';

export function getTimestamp(): number {
  const timestamp = moment().toDate().getTime();

  return timestamp;
}

export function getFormatTime(timestamp: number, isYear?: boolean): string {
  const formated = moment(timestamp).format(isYear ? 'YYYY-MM-DD' : 'MM-DD');

  return formated;
}
