import path from 'path';
import { app } from '../app';
import fs from 'fs';

const output = path.join(__dirname, '../../dist/schema.json');
fs.writeFileSync(output, JSON.stringify(app.jsonSchema, null, 2));

console.log('JSON schema generated at', path.resolve(output));
