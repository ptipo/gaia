/* eslint-disable */
import type { Prisma, Publishing } from "@zenstackhq/runtime/models";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/vue-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { MaybeRefOrGetter, ComputedRef } from 'vue';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;

export function useCreatePublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingCreateArgs, unknown>> | ComputedRef<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingCreateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingCreateArgs, DefaultError, Publishing, true>('Publishing', 'POST', `${endpoint}/publishing/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingCreateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingCreateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingCreateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManyPublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingCreateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingCreateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('Publishing', 'POST', `${endpoint}/publishing/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingCreateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingCreateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingCreateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManyPublishing<TArgs extends Prisma.PublishingFindManyArgs, TQueryFnData = Array<Prisma.PublishingGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingFindManyArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/findMany`, args, options, fetch);
}

export function useInfiniteFindManyPublishing<TArgs extends Prisma.PublishingFindManyArgs, TQueryFnData = Array<Prisma.PublishingGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingFindManyArgs>>, options?: MaybeRefOrGetter<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>> | ComputedRef<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>>) {
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/findMany`, args, options, fetch);
}

export function useFindUniquePublishing<TArgs extends Prisma.PublishingFindUniqueArgs, TQueryFnData = Prisma.PublishingGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingFindUniqueArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingFindUniqueArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/findUnique`, args, options, fetch);
}

export function useFindFirstPublishing<TArgs extends Prisma.PublishingFindFirstArgs, TQueryFnData = Prisma.PublishingGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingFindFirstArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingFindFirstArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/findFirst`, args, options, fetch);
}

export function useUpdatePublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingUpdateArgs, unknown>> | ComputedRef<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingUpdateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingUpdateArgs, DefaultError, Publishing, true>('Publishing', 'PUT', `${endpoint}/publishing/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingUpdateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpdateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpdateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManyPublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingUpdateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingUpdateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('Publishing', 'PUT', `${endpoint}/publishing/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingUpdateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpdateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpdateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertPublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingUpsertArgs, unknown>> | ComputedRef<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingUpsertArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingUpsertArgs, DefaultError, Publishing, true>('Publishing', 'POST', `${endpoint}/publishing/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingUpsertArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpsertArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingUpsertArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeletePublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingDeleteArgs, unknown>> | ComputedRef<UseMutationOptions<(Publishing | undefined), DefaultError, Prisma.PublishingDeleteArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingDeleteArgs, DefaultError, Publishing, true>('Publishing', 'DELETE', `${endpoint}/publishing/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingDeleteArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingDeleteArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.PublishingDeleteArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Publishing, Prisma.PublishingGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManyPublishing(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingDeleteManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.PublishingDeleteManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.PublishingDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('Publishing', 'DELETE', `${endpoint}/publishing/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.PublishingDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.PublishingDeleteManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingDeleteManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.PublishingDeleteManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregatePublishing<TArgs extends Prisma.PublishingAggregateArgs, TQueryFnData = Prisma.GetPublishingAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingAggregateArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingAggregateArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/aggregate`, args, options, fetch);
}

export function useGroupByPublishing<TArgs extends Prisma.PublishingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.PublishingGroupByArgs['orderBy'] } : { orderBy?: Prisma.PublishingGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
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
    Array<PickEnumerable<Prisma.PublishingGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.PublishingGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.PublishingGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.PublishingGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.PublishingGroupByArgs, OrderByArg> & InputErrors>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.PublishingGroupByArgs, OrderByArg> & InputErrors>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/groupBy`, args, options, fetch);
}

export function useCountPublishing<TArgs extends Prisma.PublishingCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.PublishingCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.PublishingCountArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.PublishingCountArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Publishing', `${endpoint}/publishing/count`, args, options, fetch);
}

export function useCheckPublishing<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; assetId?: string; appVersion?: string }; }, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('Publishing', `${endpoint}/publishing/check`, args, options, fetch);
}
