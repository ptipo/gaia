import * as fs from 'fs';
import * as path from 'path';

function extractI18nKeys(filePath: string): Set<string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const pattern = /t`(.*?)`/g;
    const matches = content.matchAll(pattern);
    return new Set(Array.from(matches, (m) => m[1]));
}

function loadExistingKeys(filePath: string): Set<string> {
    if (!fs.existsSync(filePath)) {
        return new Set();
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return new Set(Object.keys(data));
}

function updateJsonFile(filePath: string, newKeys: Set<string>): void {
    const existingKeys = loadExistingKeys(filePath);

    // Only add keys that don't already exist
    const keysToAdd = new Set([...newKeys].filter((x) => !existingKeys.has(x)));

    if (keysToAdd.size === 0) {
        return; // No new keys to add
    }

    // Load existing data or create new object
    let data: { [key: string]: string } = {};
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // Add new keys with empty string values
    keysToAdd.forEach((key) => {
        data[key] = '';
    });

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function processDirectory(directory: string, locales: string[], localeFolder: string): void {
    const allKeys = new Set<string>();

    // Recursively walk through the directory
    function walkDir(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.ts')) {
                const keys = extractI18nKeys(filePath);
                keys.forEach((key) => allKeys.add(key));
            }
        }
    }

    walkDir(directory);

    console.log(`Found ${allKeys.size} unique keys in ${directory}`);

    //Update each locale file
    for (const locale of locales) {
        const jsonFile = path.join(localeFolder, `${locale}.json`);
        updateJsonFile(jsonFile, allKeys);
    }
}

// Usage
const locales = ['ja', 'zh', 'en'];
processDirectory('./src/config', locales, './src/locales');
