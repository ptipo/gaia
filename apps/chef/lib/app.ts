import { match } from 'ts-pattern';

/**
 * App bundle
 */
export type AppBundle = {
    module: any;
    version: string;
};

/**
 * Loads an app bundle.
 */
export async function loadAppBundle(bundle: string, entry: 'main' | 'config' | 'locales'): Promise<AppBundle> {
    if (bundle.startsWith('@')) {
        let result: AppBundle;
        switch (bundle) {
            case '@hayadev/supa-form':
                let module: any;
                // import has to be a constant string for vite to work
                module = await match(entry)
                    .with('main', () => import('@hayadev/supa-form'))
                    .with('config', () => import('@hayadev/supa-form/config'))
                    .with('locales', () => import('@hayadev/supa-form/locales'))
                    .exhaustive();
                const pkgJson = await import('@hayadev/supa-form/package.json');
                if (!pkgJson.default.version) {
                    throw new Error(`No version find in package.json: ${pkgJson}`);
                }
                result = { module, version: pkgJson.default.version };
                break;
            default:
                throw new Error(`Unknown bundle: ${bundle}`);
        }
        console.log(`Loaded bundle: ${bundle}@${result.version}`);
        return result;
    } else if (URL.canParse(bundle)) {
        throw new Error(`URL bundles are not supported yet: ${bundle}`);
    } else {
        throw new Error(`Invalid bundle: ${bundle}`);
    }
}
