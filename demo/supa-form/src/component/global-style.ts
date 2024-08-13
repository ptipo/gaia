import { FontSize } from '../config/page-items/common';
import { model } from './pt-form';

type FontSize = keyof typeof FontSize.options;
type CSSVariableList = Record<string, string | number>;

const fontSizeRatio: Record<FontSize, number> = {
    xs: 0.8,
    sm: 0.9,
    base: 1,
    lg: 1.2,
    xl: 1.5,
};

function getQuestionStyle(question: typeof model.questionStyle) {
    const result: CSSVariableList = {};

    result[CSS_VARIABLES.question_font_size] = fontSizeRatio[question.question.fontSize!];
    result[CSS_VARIABLES.question_text_align] = question.question.align!;
    result[CSS_VARIABLES.question_description_font_size] = fontSizeRatio[question.description.fontSize!];
    result[CSS_VARIABLES.question_description_text_align] = question.description.align!;

    return result;
}

const CSS_VARIABLES = {
    question_font_size: '--pt-form-question-font-size',
    question_text_align: '--pt-form-question-text-align',
    question_description_font_size: '--pt-form-question-description-font-size',
    question_description_text_align: '--pt-form-question-description-text-align',
};

export function getCSSVariableValues(config: typeof model) {
    let result: CSSVariableList = {};

    result = { ...getQuestionStyle(config.questionStyle) };

    return Object.entries(result)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');
}
