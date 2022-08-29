import moment from 'moment';
import 'moment/locale/ko';

export function getTimestamp(): number {
  const timestamp = moment().toDate().getTime();

  return timestamp;
}

export function getFormatTime(timestamp: number): string {
  const formated = moment(timestamp).format('MM-DD');

  return formated;
}
