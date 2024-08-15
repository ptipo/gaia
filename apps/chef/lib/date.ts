import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Sets the locale for Day.js.
 */
export function setDayJSLocale(locale: string) {
    dayjs.locale(locale);
}

/**
 * Generates a human-friendly representing the given date relative to now.
 */
export function fromNow(date: Date) {
    return dayjs(date).fromNow();
}
