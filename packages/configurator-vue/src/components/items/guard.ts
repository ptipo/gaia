import { ref, watch } from 'vue';

/**
 * Composable for maintaining a boolean guard.
 */
export function useGuard(
    enabled: boolean,
    options?: {
        onChange?: (value: boolean) => void;
        onSetOn?: () => void;
        onSetOff?: () => void;
    }
) {
    const state = ref(enabled);

    watch(state, (value) => {
        options?.onChange?.(value);
        if (value) {
            options?.onSetOn?.();
        } else {
            options?.onSetOff?.();
        }
    });

    return { enabled: state };
}
