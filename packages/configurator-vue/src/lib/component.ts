import type { ConfigItem } from '@hayadev/configurator';
import capitalize from 'capitalize';
import { defineAsyncComponent } from 'vue';

/**
 * Gets the component for editing the given item.
 */
export function getItemComponent(item: ConfigItem) {
    return defineAsyncComponent(
        () =>
            import(
                `@components/items/${item.type
                    .split('-')
                    .map((word) => capitalize(word))
                    .join('')}Item.vue`
            )
    );
}
