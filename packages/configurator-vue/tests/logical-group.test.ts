import { describe, expect, it } from '@jest/globals';
import { composeLogicalGroupData } from '../src/lib/logical-group-utils';

describe('Logical group items', () => {
    it('should build correct group data', () => {
        const expr1 = { left: 'a', right: 'b', operator: '>' };
        const expr2 = { left: 'c', right: 'd', operator: '<' };
        const expr3 = { left: 'e', right: 'f', operator: '==' };
        const expr4 = { left: 'g', right: 'h', operator: '!=' };

        // expr1
        expect(composeLogicalGroupData([expr1])).toEqual({
            kind: 'expression',
            ...expr1,
        });

        // expr1 && expr2
        expect(composeLogicalGroupData([expr1, { groupOperator: 'and', ...expr2 }])).toEqual({
            kind: 'association',
            groupOperator: 'and',
            first: { kind: 'expression', ...expr1 },
            second: { kind: 'expression', ...expr2 },
        });

        // expr1 || expr2
        expect(composeLogicalGroupData([expr1, { groupOperator: 'or', ...expr2 }])).toEqual({
            kind: 'association',
            groupOperator: 'or',
            first: { kind: 'expression', ...expr1 },
            second: { kind: 'expression', ...expr2 },
        });

        // expr1 && expr2 && expr3 => expr1 && (expr2 && expr3)
        expect(
            composeLogicalGroupData([expr1, { groupOperator: 'and', ...expr2 }, { groupOperator: 'and', ...expr3 }])
        ).toEqual({
            kind: 'association',
            groupOperator: 'and',
            first: { kind: 'expression', ...expr1 },
            second: {
                kind: 'association',
                groupOperator: 'and',
                first: { kind: 'expression', ...expr2 },
                second: { kind: 'expression', ...expr3 },
            },
        });

        // expr1 && expr2 && expr3 && expr4 => expr1 && (expr2 && (expr3 && expr4))
        expect(
            composeLogicalGroupData([
                expr1,
                { groupOperator: 'and', ...expr2 },
                { groupOperator: 'and', ...expr3 },
                { groupOperator: 'and', ...expr4 },
            ])
        ).toEqual({
            kind: 'association',
            groupOperator: 'and',
            first: { kind: 'expression', ...expr1 },
            second: {
                kind: 'association',
                groupOperator: 'and',
                first: { kind: 'expression', ...expr2 },
                second: {
                    kind: 'association',
                    groupOperator: 'and',
                    first: {
                        kind: 'expression',
                        ...expr3,
                    },
                    second: { kind: 'expression', ...expr4 },
                },
            },
        });

        // expr1 || expr2 || expr3 => (expr1 || expr2) || expr3
        expect(
            composeLogicalGroupData([expr1, { groupOperator: 'or', ...expr2 }, { groupOperator: 'or', ...expr3 }])
        ).toEqual({
            kind: 'association',
            groupOperator: 'or',
            first: {
                kind: 'association',
                groupOperator: 'or',
                first: { kind: 'expression', ...expr1 },
                second: { kind: 'expression', ...expr2 },
            },
            second: { kind: 'expression', ...expr3 },
        });

        // expr1 || expr2 && expr3 || expr4 => (expr1 || (expr2 && expr3)) || expr4
        expect(
            composeLogicalGroupData([
                expr1,
                { groupOperator: 'or', ...expr2 },
                { groupOperator: 'and', ...expr3 },
                { groupOperator: 'or', ...expr4 },
            ])
        ).toEqual({
            kind: 'association',
            groupOperator: 'or',
            first: {
                kind: 'association',
                groupOperator: 'or',
                first: { kind: 'expression', ...expr1 },
                second: {
                    kind: 'association',
                    groupOperator: 'and',
                    first: { kind: 'expression', ...expr2 },
                    second: { kind: 'expression', ...expr3 },
                },
            },
            second: { kind: 'expression', ...expr4 },
        });
    });
});
