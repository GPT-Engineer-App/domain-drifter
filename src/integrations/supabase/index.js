import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### user

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | uuid                     | string | true     |
| created_at | timestamp with time zone | string | true     |
| domain_def | uuid                     | string | false    |

### perspectives

| name             | type                     | format  | required |
|------------------|--------------------------|---------|----------|
| id               | bigint                   | integer | true     |
| created_at       | timestamp with time zone | string  | true     |
| perspective_name | text                     | string  | true     |

### domains

| name        | type                     | format | required |
|-------------|--------------------------|--------|----------|
| id          | uuid                     | string | true     |
| created_at  | timestamp with time zone | string | true     |
| description | text                     | string | false    |
| domain_name | text                     | string | true     |

*/

// User hooks
export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('user').select('*'))
});

export const useUser = (id) => useQuery({
    queryKey: ['users', id],
    queryFn: () => fromSupabase(supabase.from('user').select('*').eq('id', id).single())
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('user').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

// Perspectives hooks
export const usePerspectives = () => useQuery({
    queryKey: ['perspectives'],
    queryFn: () => fromSupabase(supabase.from('perspectives').select('*'))
});

export const usePerspective = (id) => useQuery({
    queryKey: ['perspectives', id],
    queryFn: () => fromSupabase(supabase.from('perspectives').select('*').eq('id', id).single())
});

export const useAddPerspective = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPerspective) => fromSupabase(supabase.from('perspectives').insert([newPerspective])),
        onSuccess: () => {
            queryClient.invalidateQueries('perspectives');
        },
    });
};

export const useUpdatePerspective = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('perspectives').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('perspectives');
        },
    });
};

export const useDeletePerspective = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('perspectives').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('perspectives');
        },
    });
};

// Domains hooks
export const useDomains = () => useQuery({
    queryKey: ['domains'],
    queryFn: () => fromSupabase(supabase.from('domains').select('*'))
});

export const useDomain = (id) => useQuery({
    queryKey: ['domains', id],
    queryFn: () => fromSupabase(supabase.from('domains').select('*').eq('id', id).single())
});

export const useAddDomain = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDomain) => fromSupabase(supabase.from('domains').insert([newDomain])),
        onSuccess: () => {
            queryClient.invalidateQueries('domains');
        },
    });
};

export const useUpdateDomain = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('domains').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('domains');
        },
    });
};

export const useDeleteDomain = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('domains').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('domains');
        },
    });
};