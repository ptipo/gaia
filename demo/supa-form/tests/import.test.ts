import { describe, expect, it } from 'vitest';
import { Form } from '../src/config/form/form';
import { app } from '../src/app';

describe('Data import test', () => {
    it('should add missing $type', () => {
        let imported: any = Form.import?.(
            {
                $type: 'concept',
                $concept: 'Form',
                dataCollection: {},
            },
            { app, version: '1.0.0' }
        );
        expect(imported.model.dataCollection.$type).toBe('item-group');

        imported = Form.import?.(
            {
                $type: 'concept',
                $concept: 'Form',
                dataCollection: { $type: 'item-group', drip: {} },
            },
            { app, version: '1.0.0' }
        );
        expect(imported.model.dataCollection.drip.$type).toBe('item-group');

        imported = Form.import?.(
            {
                $type: 'concept',
                $concept: 'Form',
                contentPages: [{ $concept: 'ContentPage' }],
            },
            { app, version: '1.0.0' }
        );
        expect(imported.model.contentPages[0].$type).toBe('concept');

        imported = Form.import?.(
            {
                $type: 'concept',
                $concept: 'Form',
                contentPages: [{ $type: 'concept', $concept: 'ContentPage', nextButton: { $concept: 'NextButton' } }],
            },
            { app, version: '1.0.0' }
        );
        expect(imported.model.contentPages[0].nextButton.$type).toBe('concept');
    });
});
