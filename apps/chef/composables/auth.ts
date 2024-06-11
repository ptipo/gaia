import type { User } from 'lucia';

/**
 * Composable for getting the current login user.
 */
export const useUser = () => {
    const user = useState<User | null>('user', () => null);
    return user;
};
