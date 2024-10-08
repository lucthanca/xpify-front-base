import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import type { UserContextType } from '~/@types';

const UserContext = createContext<[UserContextType]>(undefined as any);

const UserProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const { data, loading } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const contextValue = useMemo(() => ({
    shop: data?.shop,
    loading,
  }), [data, loading]);
  return (
    <UserContext.Provider value={[contextValue]}>{children}</UserContext.Provider>
  );
}

export default UserProvider;

export const useUserContext = () => useContext(UserContext);
