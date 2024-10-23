import { FullRange, PartialRange } from '../config/page-items/common';
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
    [P in PathsToProperties<T extends infer U & Record<string, unknown> ? U : T>]?: (
        value: PropertyType<T, P>,
        root: T
    ) => any;
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
            const data = converters[path](value, obj);
            if (data) {
                return { ...result, ...data };
            }
        }

        return result;
    }, {});
}

const RangeRatio: Record<keyof typeof FullRange, number> = {
    xs: 0.8,
    sm: 0.9,
    base: 1,
    lg: 1.1,
    xl: 1.5,
};

const ProgressRatio: Record<keyof typeof PartialRange, number> = {
    xs: 0.5,
    base: 1,
    xl: 1.5,
};

const pxToRem = (px: number) => `${px / 16}rem`;

//#endregion

type question = typeof model.questionStyle.question;

const questionConverter: ConverterDictionary<question> = {
    align: (value) => ({
        '--pt-form-question-text-align': value,
    }),
    fontSize: (value) =>
        value && {
            '--pt-form-question-font-size': RangeRatio[value],
        },
    color: (value) => ({
        '--pt-form-question-color': value,
    }),
    backgroundColor: (value) => ({
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
            '--pt-form-question-description-font-size': RangeRatio[value],
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
            '--pt-form-question-answer-font-size': RangeRatio[value],
        },
    color: (value) => ({
        '--pt-form-question-answer-color': value,
    }),
    backgroundColor: (value) => ({
        '--pt-form-question-answer-background-color': value,
    }),
    borderColor: (value) => ({
        '--pt-form-question-answer-border-color': value,
    }),
    placeHolderColor: (value) => ({
        '--pt-form-question-answer-placeholder-color': value,
    }),
    borderWidth: (value, root) =>
        root.style == 'box'
            ? {
                  '--pt-form-question-answer-border-width': `${value}px`,
                  '--pt-form-question-answer-border-bottom-width': `${value}px`,
              }
            : {
                  '--pt-form-question-answer-border-bottom-width': `${value}px`,
              },
    borderRadius: (value) =>
        value && {
            '--pt-form-question-answer-border-radius': `${pxToRem(value)}`,
        },
};

type choice = typeof model.answerChoiceStyle.choice;

const choiceConverter: ConverterDictionary<choice> = {
    fontSize: (value) =>
        value && {
            '--pt-form-choice-answer-font-size': RangeRatio[value],
        },
    color: (value) => ({
        '--pt-form-choice-label-color': value,
    }),
    backgroundColor: (value) => ({
        '--pt-form-choice-answer-background-color': value,
    }),
    borderColor: (value) => ({
        '--pt-form-choice-answer-border-color': value,
    }),
    selectIconColor: (value) => ({
        '--pt-form-choice-answer-input-color': value,
    }),
    borderWidth: (value) => ({
        '--pt-form-choice-answer-border-width': `${value}px`,
    }),
    borderRadius: (value) => value && { '--pt-form-choice-answer-border-radius': `${pxToRem(value)}` },
    gap: (value) =>
        value && {
            '--pt-form-choice-gap': RangeRatio[value],
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
            '--pt-form-progress-height': ProgressRatio[value],
        },
};

type NextButton = typeof model.progressButtonStyle.nextButton;

const nextButtonConverter: ConverterDictionary<NextButton> = {
    buttonSize: (value) => value && { '--pt-form-next-button-size': RangeRatio[value] },

    buttonTextColor: (value) => ({
        '--pt-form-next-button-text-color': value,
    }),
    buttonBackgroundColor: (value) => ({
        '--pt-form-next-button-background-color': value,
    }),
    buttonBorderColor: (value) => ({
        '--pt-form-next-button-border-color': value,
    }),
    buttonShadow: (value, root) =>
        value && {
            '--pt-form-next-button-shadow': `${root.shadowOffsetX || '0'}px ${root.shadowOffsetY || '0'}px ${
                root.shadowBlur || '0'
            }px ${root.shadowSpread || '0'}px ${root.shadowColor || ''}`,
        },
};

type BackButton = typeof model.progressButtonStyle.backButton;

const backButtonConverter: ConverterDictionary<BackButton> = {
    buttonSize: (value) => value && { '--pt-form-back-button-size': RangeRatio[value] },

    buttonTextColor: (value) => ({
        '--pt-form-back-button-text-color': value,
    }),
    buttonBackgroundColor: (value) => ({
        '--pt-form-back-button-background-color': value,
    }),
    buttonBorderColor: (value) => ({
        '--pt-form-back-button-border-color': value,
    }),
    buttonShadow: (value, root) =>
        value && {
            '--pt-form-back-button-shadow': `${root.shadowOffsetX || '0'}px ${root.shadowOffsetY || '0'}px ${
                root.shadowBlur || '0'
            }px ${root.shadowSpread || '0'}px ${root.shadowColor || ''}`,
        },
};

function getProgressButtonStyle(progressButton: typeof model.progressButtonStyle) {
    return {
        ...convertValue(progressButton?.floating, floatingConverter),
        ...convertValue(progressButton?.progress, progressConverter),
        ...convertValue(progressButton?.nextButton, nextButtonConverter),
        ...convertValue(progressButton?.backButton, backButtonConverter),
    };
}

type background = typeof model.backgroundStyle;

const backgroundConverter: ConverterDictionary<background> = {
    backgroundColor: (value) => ({
        '--pt-form-background-color': value,
    }),
    backgroundImageFill: (value) => ({
        '--pt-form-background-size': value,
    }),
};

function getBackgroundStyle(background: typeof model.BackgroundStyle) {
    return convertValue(background, backgroundConverter);
}

type layout = typeof model.layoutStyle;
const layoutConverter: ConverterDictionary<layout> = {
    marginHorizontal: (value) => value && { '--pt-form-margin-x': `${RangeRatio[value]}` },
    marginVertical: (value) => value && { '--pt-form-margin-y': `${RangeRatio[value]}` },
    contentGap: (value) => value && { '--pt-form-content-gap': `${RangeRatio[value]}` },
};

function getLayoutStyle(layout: typeof model.layoutStyle) {
    return convertValue(layout, layoutConverter);
}

type general = typeof model.generalStyle;

const generalConverter: ConverterDictionary<general> = {
    font: (value) => ({
        '--pt-form-font-family': value,
    }),
    fontSize: (value) =>
        value && {
            '--pt-form-font-size': RangeRatio[value],
        },
    lineHeight: (value) => value && { '--pt-form-line-height': RangeRatio[value] },
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
        ...getBackgroundStyle(config.backgroundStyle),
        ...getLayoutStyle(config.layoutStyle),
    };

    return Object.entries(result)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');
}
