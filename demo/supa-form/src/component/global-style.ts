import { buttonStyles, ProgressHeight } from '../config/design/progress-button-style';
import { FontSize, Gap } from '../config/page-items/common';
import { model } from './pt-form';

//#region utility types
type PathsToProperties<T> = T extends object
    ? {
          [K in keyof T & string]: T[K] extends object ? `${K}.${PathsToProperties<T[K]>}` : K;
      }[keyof T & string]
    : never;

type PropertyType<T, P extends string> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? PropertyType<T[K], R>
        : never
    : never;

type ConverterDictionary<T> = {
    [P in PathsToProperties<T extends infer U & Record<string, unknown> ? U : T>]?: (value: PropertyType<T, P>) => any;
};

function convertValue<T>(obj: T, converters: ConverterDictionary<T>): any {
    if (!obj) return {};

    return Object.keys(converters).reduce((result, path) => {
        const keys = path.split('.');
        let value: any = obj;
        for (const key of keys) {
            value = value[key];
        }

        if (value) {
            // @ts-ignore
            const data = converters[path](value);
            if (data) {
                return { ...result, ...data };
            }
        }

        return result;
    }, {});
}

type FontSize = keyof typeof FontSize.options;
const fontSizeRatio: Record<FontSize, number> = {
    xs: 0.8,
    sm: 0.9,
    base: 1,
    lg: 1.2,
    xl: 1.5,
};

type GapSize = keyof typeof Gap.options;

const gapSizeRatio: Record<GapSize, number> = {
    loose: 1.2,
    normal: 1,
    tight: 0.8,
};

type progressHeight = keyof typeof ProgressHeight.options;
const progressHeightRatio: Record<progressHeight, number> = {
    small: 0.8,
    medium: 1,
    large: 1.2,
};

//#endregion

type question = typeof model.questionStyle.question;

const questionConverter: ConverterDictionary<question> = {
    align: (value) => ({
        '--pt-form-question-text-align': value,
    }),
    fontSize: (value) =>
        value && {
            '--pt-form-question-font-size': fontSizeRatio[value],
        },
    color: (value) => ({
        '--pt-form-question-color': value,
    }),
    BackgroundColor: (value) => ({
        '--pt-form-question-background-color': value,
    }),
};

type description = typeof model.questionStyle.description;

const descriptionConverter: ConverterDictionary<description> = {
    align: (value) => ({
        '--pt-form-question-description-text-align': value,
    }),
    fontSize: (value) =>
        value && {
            '--pt-form-question-description-font-size': fontSizeRatio[value],
        },
    color: (value) => ({
        '--pt-form-question-description-color': value,
    }),
};

function getQuestionStyle(question: typeof model.questionStyle) {
    return {
        ...convertValue(question?.question, questionConverter),
        ...convertValue(question?.description, descriptionConverter),
    };
}

type questionAnswer = typeof model.answerChoiceStyle.answer;
const answerConverter: ConverterDictionary<questionAnswer> = {
    fontSize: (value) =>
        value && {
            '--pt-form-question-answer-font-size': fontSizeRatio[value],
        },
    color: (value) => ({
        '--pt-form-question-answer-color': value,
    }),
    BackgroundColor: (value) => ({
        '--pt-form-question-answer-background-color': value,
    }),
    BorderColor: (value) => ({
        '--pt-form-question-answer-border-color': value,
    }),
    placeHolderColor: (value) => ({
        '--pt-form-question-answer-placeholder-color': value,
    }),
};

type choice = typeof model.answerChoiceStyle.choice;

const choiceConverter: ConverterDictionary<choice> = {
    fontSize: (value) =>
        value && {
            '--pt-form-choice-answer-font-size': fontSizeRatio[value],
        },
    color: (value) => ({
        '--pt-form-choice-label-color': value,
    }),
    BackgroundColor: (value) => ({
        '--pt-form-choice-answer-background-color': value,
    }),
    BorderColor: (value) => ({
        '--pt-form-choice-answer-border-color': value,
    }),
    Gap: (value) =>
        value && {
            '--pt-form-choice-gap': gapSizeRatio[value],
        },
};

function getAnswerChoiceStyle(answerChoice: typeof model.answerChoiceStyle) {
    return {
        ...convertValue(answerChoice?.answer, answerConverter),
        ...convertValue(answerChoice?.choice, choiceConverter),
    };
}

type floating = typeof model.progressButtonStyle.floating;
const floatingConverter: ConverterDictionary<floating> = {
    topBarColor: (value) => ({
        '--pt-form-top-bar-background-color': value,
    }),
    bottomBarColor: (value) => ({
        '--pt-form-bottom-bar-background-color': value,
    }),
};

type progress = typeof model.progressButtonStyle.progress;

const progressConverter: ConverterDictionary<progress> = {
    progressColor: (value) => ({
        '--pt-form-progress-color': value,
    }),
    progressRemainColor: (value) => ({
        '--pt-form-progress-remain-color': value,
    }),
    progressHeight: (value) =>
        value && {
            '--pt-form-progress-height': progressHeightRatio[value],
        },
};

type button = typeof model.progressButtonStyle.nextButton;

type buttonSize = keyof typeof buttonStyles.buttonSize.options;

const buttonSizeRatio: Record<buttonSize, number> = {
    small: 0.8,
    medium: 1,
    large: 1.2,
};

const nextButtonConverter: ConverterDictionary<button> = {
    buttonSize: (value) => value && { '--pt-form-next-button-size': buttonSizeRatio[value] },

    buttonTextColor: (value) => ({
        '--pt-form-next-button-text-color': value,
    }),
    buttonBackgroundColor: (value) => ({
        '--pt-form-next-button-background-color': value,
    }),
    buttonBorderColor: (value) => ({
        '--pt-form-next-button-border-color': value,
    }),
};

function getProgressButtonStyle(progressButton: typeof model.progressButtonStyle) {
    return {
        ...convertValue(progressButton?.floating, floatingConverter),
        ...convertValue(progressButton?.progress, progressConverter),
        ...convertValue(progressButton?.nextButton, nextButtonConverter),
    };
}

type general = typeof model.generalStyle;

const generalConverter: ConverterDictionary<general> = {
    font: (value) => ({
        '--pt-form-font-family': value,
    }),
    fontSize: (value) =>
        value && {
            '--pt-form-font-size': fontSizeRatio[value],
        },
};

function getGeneralStyle(general: typeof model.generalStyle) {
    return convertValue(general, generalConverter);
}

type CSSVariableList = Record<string, string | number | undefined>;

export function getCSSVariableValues(config: typeof model) {
    const result: CSSVariableList = {
        ...getGeneralStyle(config.generalStyle),
        ...getQuestionStyle(config.questionStyle),
        ...getAnswerChoiceStyle(config.answerChoiceStyle),
        ...getProgressButtonStyle(config.progressButtonStyle),
    };

    return Object.entries(result)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');
}
