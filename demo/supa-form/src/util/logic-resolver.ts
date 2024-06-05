import { LogicalGroup } from '@gaia/configurator/items';
import { answerData } from '../state';
import { ConceptRef } from '@gaia/configurator';
import { AllPageItemsTypesMap, ChoiceQuestion, EmailQuestion, QAQuestion } from '../config/page-items';
import { app } from '../app';
import { findPageItemConfigById } from './model-util';

export function validateLogic(model: typeof app.model, condition: LogicalGroup, data: answerData): boolean {
    if ('groupOperator' in condition) {
        const { groupOperator, first, second } = condition;

        if (groupOperator === 'and') {
            return validateLogic(model, first, data) && validateLogic(model, second, data);
        } else {
            return validateLogic(model, first, data) || validateLogic(model, second, data);
        }
    } else {
        const field = condition.left as ConceptRef;
        const operator = condition.operator as ComparisonOperator;

        switch (field.$concept) {
            case QAQuestion.name:
            case EmailQuestion.name: {
                const answerData = data[field.$id];
                const expectedData = condition.right as string;
                return validateValue(operator, expectedData, answerData);
            }
            case ChoiceQuestion.name: {
                const fieldId = field.$id;
                const answerData = data[fieldId];
                const choiceQuestion = findPageItemConfigById(model, fieldId) as AllPageItemsTypesMap['ChoiceQuestion'];

                if (choiceQuestion.kind == 'single') {
                    const expectedData = (condition.right as ConceptRef).$id;
                    return validateValue(operator, expectedData, answerData);
                } else {
                    const expectedData = (condition.right as ConceptRef[]).map((x) => x.$id);
                    return validateArrayValue(operator, expectedData, answerData);
                }
            }
        }
    }

    return true;
}

function validateValue(op: ComparisonOperator, left: string, right: string) {
    switch (op) {
        case ComparisonOperator.Contains:
            return left.includes(right);
        case ComparisonOperator.NotContains:
            return !left.includes(right);
        case ComparisonOperator.Empty:
            return left === '';
        case ComparisonOperator.NotEmpty:
            return left !== '';
        case ComparisonOperator.Selected:
            return left === right;
        case ComparisonOperator.NotSelected:
            return left !== right;
    }
    throw new Error(`Invalid operator ${op}`);
}

export function validateArrayValue(op: ComparisonOperator, left: string[], right: string[]) {
    switch (op) {
        case ComparisonOperator.SelectedAll:
            return left === right;
        case ComparisonOperator.SelectedOne:
            return right.every((r) => left.includes(r));
        case ComparisonOperator.NotSelectedAll:
            return right.some((r) => !left.includes(r));
        case ComparisonOperator.NotSelectedAny:
            return right.some((r) => !left.includes(r));
        case ComparisonOperator.Empty:
            return right.length === 0;
        case ComparisonOperator.NotEmpty:
            return right.length !== 0;
    }
    throw new Error(`Invalid operator ${op}`);
}

enum ComparisonOperator {
    Contains = 'contains',
    NotContains = 'notContains',
    Empty = 'empty',
    NotEmpty = 'notEmpty',
    Selected = 'selected',
    NotSelected = 'notSelected',
    SelectedAll = 'selectedAll',
    SelectedOne = 'selectedOne',
    NotSelectedAll = 'notSelectedAll',
    NotSelectedAny = 'notSelectedAny',
}
