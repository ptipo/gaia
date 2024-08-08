/* eslint-disable */
import type { Prisma, Session } from "@zenstackhq/runtime/models";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/vue-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { MaybeRefOrGetter, ComputedRef, UnwrapRef } from 'vue';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/vue';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;

export function useCreateSession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionCreateArgs, unknown>> | ComputedRef<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionCreateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionCreateArgs, DefaultError, Session, true>('Session', 'POST', `${endpoint}/session/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionCreateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionCreateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionCreateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManySession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionCreateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionCreateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('Session', 'POST', `${endpoint}/session/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionCreateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionCreateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionCreateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManySession<TArgs extends Prisma.SessionFindManyArgs, TQueryFnData = Array<Prisma.SessionGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionFindManyArgs>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/findMany`, args, options, fetch);
}

export function useInfiniteFindManySession<TArgs extends Prisma.SessionFindManyArgs, TQueryFnData = Array<Prisma.SessionGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionFindManyArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionFindManyArgs>>, options?: MaybeRefOrGetter<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>> | ComputedRef<Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>>) {
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/findMany`, args, options, fetch);
}

export function useFindUniqueSession<TArgs extends Prisma.SessionFindUniqueArgs, TQueryFnData = Prisma.SessionGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionFindUniqueArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionFindUniqueArgs>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/findUnique`, args, options, fetch);
}

export function useFindFirstSession<TArgs extends Prisma.SessionFindFirstArgs, TQueryFnData = Prisma.SessionGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionFindFirstArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionFindFirstArgs>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/findFirst`, args, options, fetch);
}

export function useUpdateSession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionUpdateArgs, unknown>> | ComputedRef<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionUpdateArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionUpdateArgs, DefaultError, Session, true>('Session', 'PUT', `${endpoint}/session/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionUpdateArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpdateArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpdateArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManySession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionUpdateManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionUpdateManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('Session', 'PUT', `${endpoint}/session/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionUpdateManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpdateManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpdateManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertSession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionUpsertArgs, unknown>> | ComputedRef<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionUpsertArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionUpsertArgs, DefaultError, Session, true>('Session', 'POST', `${endpoint}/session/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionUpsertArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpsertArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionUpsertArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteSession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionDeleteArgs, unknown>> | ComputedRef<UseMutationOptions<(Session | undefined), DefaultError, Prisma.SessionDeleteArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionDeleteArgs, DefaultError, Session, true>('Session', 'DELETE', `${endpoint}/session/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionDeleteArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionDeleteArgs>, unknown>> | ComputedRef<UseMutationOptions<(CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.SessionDeleteArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, Session, Prisma.SessionGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManySession(options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionDeleteManyArgs, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SessionDeleteManyArgs, unknown>> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.SessionDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('Session', 'DELETE', `${endpoint}/session/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.SessionDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.SessionDeleteManyArgs>,
            options?: Omit<(MaybeRefOrGetter<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionDeleteManyArgs>, unknown>> | ComputedRef<UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.SessionDeleteManyArgs>, unknown>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateSession<TArgs extends Prisma.SessionAggregateArgs, TQueryFnData = Prisma.GetSessionAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionAggregateArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionAggregateArgs>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/aggregate`, args, options, fetch);
}

export function useGroupBySession<TArgs extends Prisma.SessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.SessionGroupByArgs['orderBy'] } : { orderBy?: Prisma.SessionGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
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
    Array<PickEnumerable<Prisma.SessionGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.SessionGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.SessionGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.SessionGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.SessionGroupByArgs, OrderByArg> & InputErrors>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.SessionGroupByArgs, OrderByArg> & InputErrors>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/groupBy`, args, options, fetch);
}

export function useCountSession<TArgs extends Prisma.SessionCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.SessionCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: MaybeRefOrGetter<Prisma.SelectSubset<TArgs, Prisma.SessionCountArgs>> | ComputedRef<Prisma.SelectSubset<TArgs, Prisma.SessionCountArgs>>, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<TQueryFnData, TError, TData>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('Session', `${endpoint}/session/count`, args, options, fetch);
}

export function useCheckSession<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; userId?: string }; }, options?: (MaybeRefOrGetter<Omit<UnwrapRef<UseQueryOptions<boolean, TError, boolean>>, 'queryKey'>> | ComputedRef<Omit<UnwrapRef<UseQueryOptions<boolean, TError, boolean>>, 'queryKey'>> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('Session', `${endpoint}/session/check`, args, options, fetch);
}
