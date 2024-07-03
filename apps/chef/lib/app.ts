/**
 * Loads an app bundle.
 */
export async function loadAppBundle(bundle: string) {
    if (bundle.startsWith('@')) {
        switch (bundle) {
            case '@hayadev/supa-form':
                // import has to be a constant string for vite to work
                const module = await import('@hayadev/supa-form');
                const pkgJson = await import('@hayadev/supa-form/package.json');
                if (!pkgJson.version) {
                    throw new Error(`No version find in package.json: ${pkgJson}`);
                }
                return { module, version: pkgJson.version };
            default:
                throw new Error(`Unknown bundle: ${bundle}`);
        }
    } else if (URL.canParse(bundle)) {
        throw new Error(`URL bundles are not supported yet: ${bundle}`);
    } else {
        throw new Error(`Invalid bundle: ${bundle}`);
    }
}
