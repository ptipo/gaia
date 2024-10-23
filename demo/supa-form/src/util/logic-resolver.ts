import { ConceptRef } from '@hayadev/configurator';
import { LogicalGroup } from '@hayadev/configurator/items';
import { FormModel } from '../app';
import { AllPageItemsTypesMap, ChoiceQuestion, EmailQuestion, QAQuestion } from '../config/page-items';
import { answerData } from '../state';
import { findPageItemConfigById } from './model-util';

export function validateLogic(model: FormModel, condition: LogicalGroup, data: answerData): boolean {
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
                const dataValue = answerData.data as string;
                return validateValue(operator, expectedData, dataValue);
            }
            case ChoiceQuestion.name: {
                const fieldId = field.$id;
                const answerData = data[fieldId];

                if (!answerData) return false;
                const choiceQuestion = findPageItemConfigById(model, fieldId) as AllPageItemsTypesMap['ChoiceQuestion'];

                const dataValue = answerData.data as Array<[string, string]>;
                if (choiceQuestion.kind == 'single') {
                    const expectedData = (condition.right as ConceptRef).$id;
                    return validateValue(operator, dataValue[0]?.[0], expectedData);
                } else {
                    const expectedData = (condition.right as ConceptRef[]).map((x) => x.$id);
                    return validateArrayValue(
                        operator,
                        dataValue.map((x) => x[0]),
                        expectedData
                    );
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
            return right.every((r) => left.includes(r));
        case ComparisonOperator.SelectedOne:
            return right.some((r) => left.includes(r));
        case ComparisonOperator.NotSelectedAll:
            return right.some((r) => !left.includes(r));
        case ComparisonOperator.NotSelectedAny:
            return right.every((r) => !left.includes(r));
        case ComparisonOperator.Empty:
            return left.length === 0;
        case ComparisonOperator.NotEmpty:
            return left.length !== 0;
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
