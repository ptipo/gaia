import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Generates a human-friendly representing the given date relative to now.
 */
export function fromNow(date: Date) {
    return dayjs(date).fromNow();
}
