import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    // any custom Vitest config you require
    test: {
        testTimeout: 20000,
    },
});
