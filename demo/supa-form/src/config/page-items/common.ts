import { ConfigGroups, ConfigItem, t } from '@hayadev/configurator';
import { DynamicSelectOption } from '@hayadev/configurator/items';

/**
 * 问题通用配置项
 */
export const QuestionCommonItems = {
    /**
     * 表单项名称
     */
    name: { type: 'text', name: t`itemName`, required: true, groupKey: 'basic' },

    /**
     * 问题
     */
    question: { type: 'text', name: t`question`, groupKey: 'basic' },

    /**
     * 描述信息
     */
    description: {
        type: 'text',
        guarded: true,
        name: t`description1`,
        groupKey: 'basic',
    },

    /**
     * 是否必填
     */
    required: { type: 'switch', name: t`required`, default: false, groupKey: 'basic' },

    /**
     * 是否保存为用户标签
     */
    saveAsUserTag: {
        type: 'dynamic-select',
        guarded: true,
        name: t`saveAsUserTag`,
        multiple: true,
        allowCreate: true,
        groupKey: 'data',

        provider: async () => {
            // TODO: 调用API获取用户标签列表
            return [] as DynamicSelectOption<string>[];
        },
    },
} satisfies Record<string, ConfigItem>;

export const getAlignConfig = (align?: string) => {
    return {
        align: {
            type: 'select',
            name: t`alignment`,
            default: align,
            options: {
                center: t`centerAlign`,
                left: t`leftAlign`,
                right: t`rightAlign`,
            },
        },
    } as const;
};
/**
 * 问题通用分组
 */
export const QuestionCommonGroups = {
    basic: { name: t`basicSettings`, aspect: 'content' },
    answer: { name: t`answer`, aspect: 'content' },
    data: { name: t`data`, aspect: 'content' },
} satisfies ConfigGroups;

export const AlignmentItems = {
    ...getAlignConfig('left'),
    maxWidth: { type: 'number', name: t`maxWidth%`, default: 100 },
} satisfies Record<string, ConfigItem>;

export const Font = {
    type: 'select',
    name: t`font`,
    options: {
        alba: 'alba',
        'alba matter': 'alba matter',
        'alba super': 'alba super',
        'Apple Braille': 'Apple Braille',
        'Apple Symbols': 'Apple Symbols',
        AppleSDGothicNeo: 'AppleSDGothicNeo',
        AquaKana: 'AquaKana',
        ArialHB: 'ArialHB',
        Avenir: 'Avenir',
        'Avenir Next': 'Avenir Next',
        'Avenir Next Condensed': 'Avenir Next Condensed',
        'baby kruffy': 'baby kruffy',
        Batang: 'Batang',
        BatangChe: 'BatangChe',
        'Book Antiqua': 'Book Antiqua',
        'Bookman Old Style': 'Bookman Old Style',
        Century: 'Century',
        'Century Gothic': 'Century Gothic',
        Chick: 'Chick',
        'Comic Sans MS': 'Comic Sans MS',
        Courier: 'Courier',
        'Courier New': 'Courier New',
        Croobie: 'Croobie',
        Dotum: 'Dotum',
        DotumChe: 'DotumChe',
        'Droid Sans': 'Droid Sans',
        'Estrangelo Edessa': 'Estrangelo Edessa',
        Fat: 'Fat',
        'Franklin Gothic Medium': 'Franklin Gothic Medium',
        Freshbot: 'Freshbot',
        Frosty: 'Frosty',
        Garamond: 'Garamond',
        Gautami: 'Gautami',
        GeezaPro: 'GeezaPro',
        Geneva: 'Geneva',
        Georgia: 'Georgia',
        GlimChe: 'GlimChe',
        GlooGun: 'GlooGun',
        Gulim: 'Gulim',
        Gungsuh: 'Gungsuh',
        GungsuhChe: 'GungsuhChe',
        Haettenschweiler: 'Haettenschweiler',
        HelveLTMM: 'HelveLTMM',
        Helvetica: 'Helvetica',
        HelveticaNeue: 'HelveticaNeue',
        HelveticaNeueDeskInterface: 'HelveticaNeueDeskInterface',
        HGP行書体: 'HGP行書体',
        'HG正楷書体-PRO': 'HG正楷書体-PRO',
        HG行書体: 'HG行書体',
        'Hiragino Sans GB': 'Hiragino Sans GB',
        Impact: 'Impact',
        'Jenkins v2.0': 'Jenkins v2.0',
        Jokewood: 'Jokewood',
        Keyboard: 'Keyboard',
        Kohinoor: 'Kohinoor',
        Latha: 'Latha',
        'Lucida Console': 'Lucida Console',
        LucidaGrande: 'LucidaGrande',
        'Ludica Sans Unicode': 'Ludica Sans Unicode',
        Mangal: 'Mangal',
        MarkerFelt: 'MarkerFelt',
        'Meiryo UI': 'Meiryo UI',
        Menlo: 'Menlo',
        'Microsoft Sans Serif': 'Microsoft Sans Serif',
        MingLiU: 'MingLiU',
        Modern: 'Modern',
        Monaco: 'Monaco',
        'Monotype Corsiva': 'Monotype Corsiva',
        'MS Sans Serif': 'MS Sans Serif',
        'MS Serif': 'MS Serif',
        'MS UI Gothic': 'MS UI Gothic',
        'MV Boil': 'MV Boil',
        'New Gulim': 'New Gulim',
        Noteworthy: 'Noteworthy',
        NotoNastaliq: 'NotoNastaliq',
        OCRB: 'OCRB',
        Optima: 'Optima',
        Osaka: 'Osaka',
        'Osaka－等幅,Osaka-Mono': 'Osaka－等幅,Osaka-Mono',
        Palatino: 'Palatino',
        'Palatino Linotype': 'Palatino Linotype',
        PingFang: 'PingFang',
        PMingLiU: 'PMingLiU',
        Poornut: 'Poornut',
        'Pussycat Snickers': 'Pussycat Snickers',
        Raavi: 'Raavi',
        Roboto: 'Roboto',
        Roman: 'Roman',
        Script: 'Script',
        Shruti: 'Shruti',
        SimHei: 'SimHei',
        SimSun: 'SimSun',
        'Small Fonts': 'Small Fonts',
        Sylfaen: 'Sylfaen',
        Symbol: 'Symbol',
        Tahoma: 'Tahoma',
        Terminal: 'Terminal',
        Thonburi: 'Thonburi',
        Times: 'Times',
        'Times New Roman': 'Times New Roman',
        TimesLTMM: 'TimesLTMM',
        Trebuchet: 'Trebuchet',
        Tunga: 'Tunga',
        Verdana: 'Verdana',
        'Weltron Urban': 'Weltron Urban',
        ZapfDingbats: 'ZapfDingbats',
        'ヒラギノ丸ゴ Pro W4,Hiragino Maru Gothic Pro': 'ヒラギノ丸ゴ Pro W4,Hiragino Maru Gothic Pro',
        'ヒラギノ丸ゴ ProN W4': 'ヒラギノ丸ゴ ProN W4',
        'ヒラギノ丸ゴ ProN W4,Hiragino Maru Gothic ProN': 'ヒラギノ丸ゴ ProN W4,Hiragino Maru Gothic ProN',
        'ヒラギノ明朝 Pro W3,Hiragino Mincho Pro': 'ヒラギノ明朝 Pro W3,Hiragino Mincho Pro',
        'ヒラギノ明朝 Pro W6,HiraMinPro-W6': 'ヒラギノ明朝 Pro W6,HiraMinPro-W6',
        'ヒラギノ明朝 ProN': 'ヒラギノ明朝 ProN',
        'ヒラギノ明朝 ProN W3,Hiragino Mincho ProN,HiraMinProN-W3':
            'ヒラギノ明朝 ProN W3,Hiragino Mincho ProN,HiraMinProN-W3',
        'ヒラギノ明朝 ProN W6,HiraMinProN-W6,HiraMinProN-W6': 'ヒラギノ明朝 ProN W6,HiraMinProN-W6,HiraMinProN-W6',
        'ヒラギノ角ゴ Pro W3,Hiragino Kaku Gothic Pro': 'ヒラギノ角ゴ Pro W3,Hiragino Kaku Gothic Pro',
        'ヒラギノ角ゴ Pro W6,HiraKakuPro-W6': 'ヒラギノ角ゴ Pro W6,HiraKakuPro-W6',
        'ヒラギノ角ゴ ProN W3,Hiragino Kaku Gothic ProN,HiraKakuProN-W3':
            'ヒラギノ角ゴ ProN W3,Hiragino Kaku Gothic ProN,HiraKakuProN-W3',
        'ヒラギノ角ゴ ProN W6,HiraKakuProN-W6,HiraKakuProN-W6': 'ヒラギノ角ゴ ProN W6,HiraKakuProN-W6,HiraKakuProN-W6',
        'ヒラギノ角ゴ Std W8,Hiragino Kaku Gothic Std': 'ヒラギノ角ゴ Std W8,Hiragino Kaku Gothic Std',
        'ヒラギノ角ゴ StdN W8,Hiragino Kaku Gothic StdN': 'ヒラギノ角ゴ StdN W8,Hiragino Kaku Gothic StdN',
        'ヒラギノ角ゴシック W3': 'ヒラギノ角ゴシック W3',
        'メイリオ,Meiryo': 'メイリオ,Meiryo',
        '游ゴシック,Yu Gothic': '游ゴシック,Yu Gothic',
        '游ゴシック体,YuGothic': '游ゴシック体,YuGothic',
        '游明朝,Yu Mincho': '游明朝,Yu Mincho',
        '游明朝体,YuMincho': '游明朝体,YuMincho',
        'ＭＳ ゴシック': 'ＭＳ ゴシック',
        'ＭＳ ゴシック,MS Gothic': 'ＭＳ ゴシック,MS Gothic',
        'ＭＳ 明朝': 'ＭＳ 明朝',
        'ＭＳ 明朝,MS Mincho': 'ＭＳ 明朝,MS Mincho',
        'ＭＳ Ｐゴシック,MS PGothic': 'ＭＳ Ｐゴシック,MS PGothic',
        'ＭＳ Ｐ明朝,MS PMincho': 'ＭＳ Ｐ明朝,MS PMincho',
    },
} satisfies ConfigItem;

export const FullRange = {
    xs: t`extraSmall`,
    sm: t`small`,
    base: t`medium`,
    lg: t`large`,
    xl: t`extraLarge`,
};

export const { sm, lg, ...PartialRange } = FullRange;

export const FontSize = {
    type: 'select',
    name: t`fontSize`,
    options: FullRange,
} satisfies ConfigItem;

export const FontColor = {
    type: 'color',
    name: t`fontColor`,
} satisfies ConfigItem;

export const BackgroundColor = {
    type: 'color',
    name: t`backgroundColor`,
} satisfies ConfigItem;

export const BorderColor = {
    type: 'color',
    name: t`borderColor`,
} satisfies ConfigItem;

export const Gap = {
    type: 'select',
    name: t`gap`,
    options: PartialRange,
} satisfies ConfigItem;

export const TextCommonItems = {
    color: FontColor,
    fontSize: FontSize,
} satisfies Record<string, ConfigItem>;
