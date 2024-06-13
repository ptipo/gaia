/**
 * Loads an app bundle.
 */
export async function loadAppBundle(bundle: string) {
    if (bundle.startsWith('@')) {
        switch (bundle) {
            case '@hayadev/supa-form':
                // import has to be a constant string for vite to work
                return import('@hayadev/supa-form');
            default:
                throw new Error(`Unknown bundle: ${bundle}`);
        }
    } else if (URL.canParse(bundle)) {
        return import(/* @vite-ignore */ bundle);
    } else {
        throw new Error(`Invalid bundle: ${bundle}`);
    }
}
