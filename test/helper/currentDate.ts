import moment from 'moment-timezone';

const userTimezone = 'America/Sao_Paulo';
export const currentDateTimeUserTimezone = moment().tz(userTimezone);
