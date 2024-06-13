/* eslint-disable */
import type { Prisma, Asset } from "@zenstackhq/runtime/models";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/vue-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { MaybeRefOrGetter, ComputedRef } from 'vue';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;

export function useCreateAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetCreateArgs, unknown>> | ComputedRef<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetCreateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetCreateArgs, DefaultError, Asset, true>('Asset', 'POST', `${endpoint}/asset/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetCreateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetCreateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetCreateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManyAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetCreateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetCreateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('Asset', 'POST', `${endpoint}/asset/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetCreateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetCreateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetCreateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManyAsset<TArgs extends Prisma.AssetFindManyArgs, TQueryFnData = Array<Prisma.AssetGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetFindManyArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/findMany`, args, options, fetch);
}

export function useInfiniteFindManyAsset<TArgs extends Prisma.AssetFindManyArgs, TQueryFnData = Array<Prisma.AssetGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetFindManyArgs>>, options?: MaybeRefOrGetter<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>> | ComputedRef<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>>) {
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/findMany`, args, options, fetch);
}

export function useFindUniqueAsset<TArgs extends Prisma.AssetFindUniqueArgs, TQueryFnData = Prisma.AssetGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetFindUniqueArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetFindUniqueArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/findUnique`, args, options, fetch);
}

export function useFindFirstAsset<TArgs extends Prisma.AssetFindFirstArgs, TQueryFnData = Prisma.AssetGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetFindFirstArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetFindFirstArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/findFirst`, args, options, fetch);
}

export function useUpdateAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetUpdateArgs, unknown>> | ComputedRef<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetUpdateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetUpdateArgs, DefaultError, Asset, true>('Asset', 'PUT', `${endpoint}/asset/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetUpdateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpdateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpdateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManyAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetUpdateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetUpdateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('Asset', 'PUT', `${endpoint}/asset/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetUpdateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpdateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpdateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetUpsertArgs, unknown>> | ComputedRef<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetUpsertArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetUpsertArgs, DefaultError, Asset, true>('Asset', 'POST', `${endpoint}/asset/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetUpsertArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpsertArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetUpsertArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetDeleteArgs, unknown>> | ComputedRef<UseMutationOptions<(Asset | undefined), DefaultError, Prisma.AssetDeleteArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetDeleteArgs, DefaultError, Asset, true>('Asset', 'DELETE', `${endpoint}/asset/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetDeleteArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetDeleteArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AssetDeleteArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Asset, Prisma.AssetGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManyAsset(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetDeleteManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AssetDeleteManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AssetDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('Asset', 'DELETE', `${endpoint}/asset/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AssetDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AssetDeleteManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetDeleteManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AssetDeleteManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateAsset<TArgs extends Prisma.AssetAggregateArgs, TQueryFnData = Prisma.GetAssetAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetAggregateArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetAggregateArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/aggregate`, args, options, fetch);
}

export function useGroupByAsset<TArgs extends Prisma.AssetGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.AssetGroupByArgs['orderBy'] } : { orderBy?: Prisma.AssetGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.AssetGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.AssetGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.AssetGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.AssetGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.AssetGroupByArgs, OrderByArg> & InputErrors>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.AssetGroupByArgs, OrderByArg> & InputErrors>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/groupBy`, args, options, fetch);
}

export function useCountAsset<TArgs extends Prisma.AssetCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.AssetCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AssetCountArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AssetCountArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Asset', `${endpoint}/asset/count`, args, options, fetch);
}

export function useCheckAsset<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; ownerId?: string; name?: string; appId?: string; publishUrl?: string }; }, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('Asset', `${endpoint}/asset/check`, args, options, fetch);
}
