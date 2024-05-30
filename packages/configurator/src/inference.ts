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
    LogicalGroup,
    LogicalGroupItem,
    NumberItem,
    SelectItem,
    SwitchItem,
    TextItem,
} from './items';
import { GroupItem } from './items/group';
import { NonPrimitiveTypes, RGBA } from './types';
import { DeepPartial } from './utils';

/**
 * Infers the runtime type of a `Concept`.
 */
export type inferConcept<
    TConcept extends Concept,
    TPartial extends boolean = false,
    TDepth extends number = 8
> = TDepth extends -1
    ? unknown
    : BaseConceptModel & {
          [Key in keyof TConcept['items']]: inferConfigItem<
              TConcept['items'][Key],
              TPartial,
              TDepth
          >;
      };

/**
 * Infers a partial runtime type of a `Concept`.
 */
export type inferPartialConcept<TConcept extends Concept> = inferConcept<
    TConcept,
    true
>;

export type DeepPartialConcept<TConcept extends Concept> = DeepPartial<
    inferConcept<TConcept>
>;

/**
 * 基础`Concept`运行时类型
 */
export type BaseConceptModel = {
    $id: string;
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
 * Infers the runtime type of a `ConfigItem`.
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
    : TItem extends LogicalGroupItem
    ? LogicalGroup
    : never;
