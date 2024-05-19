import { describe } from '@jest/globals';
import { app } from './config/supa-form';

describe('supa-form', () => {
    it('should work', () => {
        const model = app.createModel();
        console.log(model);
    });
});
