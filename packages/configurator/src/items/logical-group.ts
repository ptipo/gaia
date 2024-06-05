import { ProviderContext } from '@/types';
import { z } from 'zod';
import { ConfigItemBase } from './common';

/**
 * Left operand candidates of a logical group.
 */
export type LogicalLeftOperandCandidates = Array<{
    key: string | number;
    label: string;
    value: any;
    group?: string;
}>;

/**
 * Right operand candidates of a logical group.
 */
export type LogicalRightOperandCandidates =
    | { kind: 'input' }
    | {
          kind: 'select';
          multiple?: boolean;
          items: {
              key: string | number;
              label: string;
              value: any;
              group?: string;
          }[];
      }
    | { kind: 'none' };

/**
 * Logical operator.
 */
export type LogicalOperator = { key: string; name: string };

/**
 * Config item representing a group of logical conditions.
 */
export interface LogicalGroupItem extends ConfigItemBase {
    type: 'logical-group';

    /**
     * Callback for providing left operand candidates
     */
    leftProvider: (context: ProviderContext) => LogicalLeftOperandCandidates | Promise<LogicalLeftOperandCandidates>;

    /**
     * Callback for providing logical operators candidates
     */
    operatorProvider: (
        context: ProviderContext,
        leftOperandValue: any
    ) => LogicalOperator[] | Promise<LogicalOperator[]>;

    /**
     * Callback for providing right operand candidates
     */
    rightProvider: (
        context: ProviderContext,
        leftOperandValue: any,
        operator: string
    ) => LogicalRightOperandCandidates | Promise<LogicalRightOperandCandidates>;
}

export const LogicalItemSchema = z.object({
    kind: z.literal('expression'),
    left: z.unknown(),
    right: z.unknown().optional(),
    operator: z.string(),
});

export type LogicalGroupAssociation = {
    kind: 'association';

    /**
     * Boolean operator for combining the two groups
     */
    groupOperator: 'and' | 'or';

    /**
     * The first group
     */
    first: LogicalGroup;

    /**
     * The second group
     */
    second: LogicalGroup;
};

/**
 * Logical group.
 */
export type LogicalGroup = z.infer<typeof LogicalItemSchema> | LogicalGroupAssociation;

const getGroupSchema = (): z.ZodType<LogicalGroup> =>
    z.union([
        LogicalItemSchema,
        z.object({
            kind: z.literal('association'),
            groupOperator: z.union([z.literal('and'), z.literal('or')]),
            first: z.lazy(() => getGroupSchema()),
            second: z.lazy(() => getGroupSchema()),
        }),
    ]);

export const getSchema = () => getGroupSchema();
