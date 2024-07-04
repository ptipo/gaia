/* eslint-disable */
import type { Prisma, App } from "@zenstackhq/runtime/models";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/vue-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { MaybeRefOrGetter, ComputedRef } from 'vue';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;

export function useCreateApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppCreateArgs, unknown>> | ComputedRef<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppCreateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppCreateArgs, DefaultError, App, true>('App', 'POST', `${endpoint}/app/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppCreateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppCreateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppCreateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManyApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppCreateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppCreateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('App', 'POST', `${endpoint}/app/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppCreateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppCreateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppCreateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManyApp<TArgs extends Prisma.AppFindManyArgs, TQueryFnData = Array<Prisma.AppGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppFindManyArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/findMany`, args, options, fetch);
}

export function useInfiniteFindManyApp<TArgs extends Prisma.AppFindManyArgs, TQueryFnData = Array<Prisma.AppGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppFindManyArgs>>, options?: MaybeRefOrGetter<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>> | ComputedRef<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>>) {
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/findMany`, args, options, fetch);
}

export function useFindUniqueApp<TArgs extends Prisma.AppFindUniqueArgs, TQueryFnData = Prisma.AppGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppFindUniqueArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppFindUniqueArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/findUnique`, args, options, fetch);
}

export function useFindFirstApp<TArgs extends Prisma.AppFindFirstArgs, TQueryFnData = Prisma.AppGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppFindFirstArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppFindFirstArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/findFirst`, args, options, fetch);
}

export function useUpdateApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppUpdateArgs, unknown>> | ComputedRef<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppUpdateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppUpdateArgs, DefaultError, App, true>('App', 'PUT', `${endpoint}/app/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppUpdateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppUpdateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppUpdateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManyApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppUpdateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppUpdateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('App', 'PUT', `${endpoint}/app/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppUpdateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppUpdateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppUpdateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppUpsertArgs, unknown>> | ComputedRef<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppUpsertArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppUpsertArgs, DefaultError, App, true>('App', 'POST', `${endpoint}/app/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppUpsertArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppUpsertArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppUpsertArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppDeleteArgs, unknown>> | ComputedRef<UseMutationOptions<(App | undefined), DefaultError, Prisma.AppDeleteArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppDeleteArgs, DefaultError, App, true>('App', 'DELETE', `${endpoint}/app/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppDeleteArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppDeleteArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.AppDeleteArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, App, Prisma.AppGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManyApp(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppDeleteManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.AppDeleteManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.AppDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('App', 'DELETE', `${endpoint}/app/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.AppDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.AppDeleteManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppDeleteManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.AppDeleteManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateApp<TArgs extends Prisma.AppAggregateArgs, TQueryFnData = Prisma.GetAppAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppAggregateArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppAggregateArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/aggregate`, args, options, fetch);
}

export function useGroupByApp<TArgs extends Prisma.AppGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.AppGroupByArgs['orderBy'] } : { orderBy?: Prisma.AppGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
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
    Array<PickEnumerable<Prisma.AppGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.AppGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.AppGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.AppGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.AppGroupByArgs, OrderByArg> & InputErrors>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.AppGroupByArgs, OrderByArg> & InputErrors>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/groupBy`, args, options, fetch);
}

export function useCountApp<TArgs extends Prisma.AppCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.AppCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.AppCountArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.AppCountArgs>>, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('App', `${endpoint}/app/count`, args, options, fetch);
}

export function useCheckApp<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; ownerId?: string; name?: string; bundle?: string; htmlTagName?: string; ptCodeMode?: string }; }, options?: (MaybeRefOrGetter<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> | ComputedRef<Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('App', `${endpoint}/app/check`, args, options, fetch);
}
