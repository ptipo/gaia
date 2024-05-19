import { Concept } from './concept';
import {
    ColorItem,
    ConfigItemBase,
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
import { NonPrimitiveTypes, RGBA } from './types';

/**
 * 推断`Concept`的运行时配置类型
 */
export type inferConceptModel<
    TConcept extends Concept,
    TDepth extends number = 8
> = TDepth extends -1
    ? unknown
    : {
          $type: NonPrimitiveTypes.concept;
          $concept: string;
      } & {
          [Key in keyof TConcept['items']]: inferConfigItem<
              TConcept['items'][Key],
              TDepth
          >;
      };

export type BaseConceptModel = {
    $type: NonPrimitiveTypes.concept;
    $concept: string;
} & Record<string, unknown>;

/**
 * 推断配置项的运行时配置类型
 */
export type inferConfigItem<
    TItem extends ConfigItemBase | undefined,
    TDepth extends number,
    // limit recursion depth to avoid infinite recursion type-checking error
    // https://stackoverflow.com/questions/68891915/typescript-type-max-recursion-limited-to-9
    TDepthNext extends number = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][TDepth]
> = TDepth extends -1
    ? unknown
    : TItem extends undefined
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
    ? inferConceptModel<TChild, TDepthNext>
    : TItem extends HasManyItem<infer TCandidate>
    ? Array<inferConceptModel<TCandidate, TDepthNext>>
    : TItem extends IfItem
    ? inferConfigItem<TItem['child'], TDepthNext> | undefined
    : TItem extends GroupItem
    ? { $type: NonPrimitiveTypes.itemGroup } & {
          [Key in keyof TItem['items']]: inferConfigItem<
              TItem['items'][Key],
              TDepthNext
          >;
      }
    : TItem extends LogicGroupItem
    ? LogicalGroup
    : never;
