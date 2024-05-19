import { ConfigItemType } from '..';

/**
 * 配置项通用属性
 */
export interface ConfigItemBase {
    /**
     * 类型
     */
    type: ConfigItemType;

    /**
     * 显示名称
     */
    name?: string;

    /**
     * 必填
     */
    required?: boolean;

    /**
     * 帮助信息
     */
    help?: string;

    /**
     * 是否通过开关控制开启
     */
    guarded?: boolean;

    /**
     * 分组key
     */
    groupKey?: string;
}

/**
 * 用于计算动态配置项的上下文
 */
export type ProviderContext = {
    rootModel: any;
    currentModel: any;
};
