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
 * 推断`Concept`的运行时类型
 */
export type inferConcept<
    TConcept extends Concept,
    TPartial extends boolean = false,
    TDepth extends number = 8
> = TDepth extends -1
    ? unknown
    : {
          $type: NonPrimitiveTypes.concept;
          $concept: string;
      } & {
          [Key in keyof TConcept['items']]: inferConfigItem<
              TConcept['items'][Key],
              TPartial,
              TDepth
          >;
      };

/**
 * 推断`Concept`的运行时类型，支持不完整配置
 */
export type inferPartialConcept<TConcept extends Concept> = inferConcept<
    TConcept,
    true
>;

/**
 * 基础`Concept`运行时类型
 */
export type BaseConceptModel = {
    $type: NonPrimitiveTypes.concept;
    $concept: string;
} & Record<string, unknown>;

type Optional<T> = T | undefined;

type CheckPartial<TItem, TPartial extends boolean, TData> = TItem extends {
    guarded: true;
}
    ? Optional<TData>
    : TPartial extends true
    ? TItem extends { default: unknown }
        ? TData
        : Optional<TData>
    : TData;

/**
 * 推断配置项的运行时类型
 */
export type inferConfigItem<
    TItem extends ConfigItemBase | undefined,
    TPartial extends boolean = false,
    TDepth extends number = 8,
    // limit recursion depth to avoid infinite recursion type-checking error
    // https://stackoverflow.com/questions/68891915/typescript-type-max-recursion-limited-to-9
    TDepthNext extends number = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][TDepth]
> = TDepth extends -1
    ? unknown
    : TItem extends undefined
    ? never
    : TItem extends SwitchItem
    ? CheckPartial<TItem, TPartial, boolean>
    : TItem extends TextItem
    ? CheckPartial<TItem, TPartial, string>
    : TItem extends DynamicSelectItem<infer TValue>
    ? CheckPartial<TItem, TPartial, TValue>
    : TItem extends SelectItem<infer TKey>
    ? CheckPartial<TItem, TPartial, TKey>
    : TItem extends NumberItem
    ? CheckPartial<TItem, TPartial, number>
    : TItem extends ColorItem
    ? CheckPartial<TItem, TPartial, RGBA>
    : TItem extends ImageItem
    ? CheckPartial<TItem, TPartial, ImageInfo>
    : TItem extends HasItem<infer TChild>
    ? inferConcept<TChild, TPartial, TDepthNext>
    : TItem extends HasManyItem<infer TCandidate>
    ? Array<
          inferConcept<TCandidate, TPartial, TDepthNext> &
              Record<string, unknown>
      >
    : TItem extends IfItem
    ? Optional<inferConfigItem<TItem['child'], false, TDepthNext>>
    : TItem extends GroupItem<infer TChild>
    ? { $type: NonPrimitiveTypes.itemGroup } & {
          [Key in keyof TChild]: inferConfigItem<
              TChild[Key],
              TPartial,
              TDepthNext
          >;
      }
    : TItem extends LogicGroupItem
    ? CheckPartial<TItem, TPartial, LogicalGroup>
    : never;
