import { ref, onMounted, onBeforeUnmount } from 'vue';
import type {
    RouteLocationNormalizedGeneric,
    RouteLocationNormalizedLoadedGeneric,
    NavigationGuardNext,
} from 'vue-router';
import { useRouter, useRoute } from 'vue-router';

export function useUnsavedChangesWarning() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const isUnsaved = ref(false);
    let removeRouteGuard: (() => void) | null = null;

    const checkUnsavedChanges = (event: { preventDefault: () => void; returnValue: string }) => {
        if (isUnsaved.value) {
            event.preventDefault();
            event.returnValue = ''; // This is required for some browsers
        }
    };

    const confirmLeaveRoute = (
        to: RouteLocationNormalizedGeneric,
        from: RouteLocationNormalizedLoadedGeneric,
        next: NavigationGuardNext
    ) => {
        if (isUnsaved.value) {
            ElMessageBox.confirm(t('unsavedMessage'), t('confirmExit'), {
                confirmButtonText: t('confirm'),
                cancelButtonText: t('cancel'),
                type: 'warning',
            })
                .then(() => next())
                .catch(() => next(false));
        } else {
            next();
        }
    };

    onMounted(() => {
        window.addEventListener('beforeunload', checkUnsavedChanges);
        removeRouteGuard = router.beforeEach((to, from, next) => {
            if (route.path !== to.path) {
                confirmLeaveRoute(to, from, next);
            } else {
                next();
            }
        });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('beforeunload', checkUnsavedChanges);
        if (removeRouteGuard) {
            removeRouteGuard();
        }
    });

    return {
        isUnsaved,
    };
}
