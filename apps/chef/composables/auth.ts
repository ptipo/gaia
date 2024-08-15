import type { User } from 'lucia';
import { defaultLocale } from '~/i18n';
import { setDayJSLocale } from '~/lib/date';

/**
 * Composable for getting the current login user.
 */
export const useUser = () => {
    const user = useState<User | null>('user', () => null);

    watch(user, (value) => {
        setDayJSLocale(value?.locale || defaultLocale);
    });

    return user;
};
