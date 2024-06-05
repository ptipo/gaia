import { inferConfigItem } from '@gaia/configurator';
import type { LogicalGroupItem } from '@gaia/configurator/items';
import { LogicalGroupAssociation } from '@gaia/configurator/items';

/**
 * Composes a flat list of logical expression items into a tree hierarchy
 * respecting association priority ("and" has higher priority than "or").
 */
export function composeLogicalGroupData(
    rows: Array<{ groupOperator?: 'and' | 'or'; left?: unknown; operator?: string; right?: unknown }>
) {
    let groupData: inferConfigItem<LogicalGroupItem> | undefined;
    let tail: LogicalGroupAssociation | undefined;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.left || !row.operator) {
            console.warn('Incomplete logical group item:', row);
            return undefined;
        }

        const rowExpr = { kind: 'expression', left: row.left, right: row.right, operator: row.operator } as const;

        if (i === 0) {
            // first row
            groupData = rowExpr;
            continue;
        }

        if (!row.groupOperator) {
            console.warn('Missing group operator:', row);
            return undefined;
        }

        if (
            // current row is an 'and'
            row.groupOperator === 'and' &&
            // there's a current tail to extend
            tail
        ) {
            // merge into the conjunction tail because 'and' operator has high association priority
            tail.second = {
                kind: 'association',
                groupOperator: 'and',
                first: tail.second,
                second: rowExpr,
            };
            tail = tail.second;
        } else {
            // form a new nested group
            groupData = {
                kind: 'association',
                groupOperator: row.groupOperator,
                first: groupData!,
                second: rowExpr,
            };
            tail = groupData;
        }
    }

    return groupData;
}
