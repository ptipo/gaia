import { answerData } from '../state';

type StorageType = 'localstorage' | 'sessionstorage';

export class StorageWrapper {
    constructor(private storageType?: StorageType, readonly ttl?: number) {}

    set(key: string, value: answerData) {
        if (this.storageType === 'localstorage') {
            localStorage.setItem(key, JSON.stringify({ value, ttl: Date.now() + this.ttl! }));
        } else {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }

    get(key: string): answerData | null {
        let item;

        if (this.storageType) {
            item = this.storageType === 'localstorage' ? localStorage.getItem(key) : sessionStorage.getItem(key);
        } else {
            item = sessionStorage.getItem(key);

            if (!item) {
                item = localStorage.getItem(key);
                this.storageType = 'localstorage';
            }
        }

        if (!item) return null;

        const parsed = JSON.parse(item);
        if (this.storageType === 'localstorage' && parsed.ttl < Date.now()) {
            localStorage.removeItem(key);
            return null;
        }

        return parsed;
    }
}
