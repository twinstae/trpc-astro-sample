import { trpc } from '../trpc';
import React, { useState, Suspense } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';

function Signup(){
  const usersQuery = trpc.useQuery(['getUsers'], { suspense: true });
  const createUserMutation = trpc.useMutation(['createUser'], {
    onSuccess: () => queryClient.invalidateQueries('getUsers')
  });
  const clearUsersMutation = trpc.useMutation(['clearUsers'], {
    onSuccess: () => queryClient.invalidateQueries('getUsers')
  });
  const queryClient = useQueryClient();
  return (
    <>
      <button
        className="p-2 rounded-xl bg-red-300 shadow-lg"
        onClick={() => createUserMutation.mutateAsync({name: 'test' + Math.floor(Math.random()*1000)})}>
        add user
      </button>
      <button
        className="p-2 rounded-xl bg-red-300 shadow-lg ml-2"
        onClick={() =>clearUsersMutation.mutateAsync({})}
      >
        초기화
      </button>
      <ul>
        {usersQuery.data.map((item) => <li key={item.name}>{item.name}</li>)}
      </ul>
    </>
  );
}

function TrpcSignup(){
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
      trpc.createClient({
        url: 'http://localhost:5000/trpc',
      }),
    );

    return (
      <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}
        children={(
          <QueryClientProvider client={queryClient}>
            <Suspense>
              <Signup />
            </Suspense>
          </QueryClientProvider>
        )}
      />
    );
}

export default TrpcSignup;