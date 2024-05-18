import { Concept } from './concept';
import { ConfigItem } from './config-item';
import {
    ColorItem,
    DynamicSelectItem,
    HasItem,
    HasManyItem,
    IfItem,
    ImageInfo,
    ImageItem,
    LogicGroupItem,
    LogicalGroup,
    NumberItem,
    SelectItem,
    SwitchItem,
    TextItem,
} from './items';
import { GroupItem } from './items/group';
import { RGBA } from './types';

/**
 * 推断`Concept`的运行时配置类型
 */
export type inferConceptModel<TConcept extends Concept> = {
    $concept: string;
} & {
    [Key in keyof TConcept['items']]: inferConfigItem<TConcept['items'][Key]>;
};

/**
 * 推断配置项的运行时配置类型
 */
export type inferConfigItem<TItem extends ConfigItem | undefined> =
    TItem extends undefined
        ? never
        : TItem extends SwitchItem
        ? boolean
        : TItem extends TextItem
        ? string
        : TItem extends DynamicSelectItem<infer TValue>
        ? TValue
        : TItem extends SelectItem<infer TKey>
        ? TKey
        : TItem extends NumberItem
        ? number
        : TItem extends ColorItem
        ? RGBA
        : TItem extends ImageItem
        ? ImageInfo
        : TItem extends HasItem<infer TChild>
        ? inferConceptModel<TChild>
        : TItem extends HasManyItem<infer TCandidate>
        ? Array<inferConceptModel<TCandidate>>
        : TItem extends IfItem
        ? inferConfigItem<TItem['child']> | undefined
        : TItem extends GroupItem
        ? {
              [Key in keyof TItem['items']]: inferConfigItem<
                  TItem['items'][Key]
              >;
          }
        : TItem extends LogicGroupItem
        ? LogicalGroup
        : never;
