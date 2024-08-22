import { FontSize } from '../config/page-items/common';
import { model } from './pt-form';

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
        ...convertValue(question.question, questionConverter),
        ...convertValue(question.description, descriptionConverter),
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

export function getCSSVariableValues(config: typeof model) {
    const result = { ...getGeneralStyle(config.generalStyle), ...getQuestionStyle(config.questionStyle) };

    return Object.entries(result)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');
}
