import { createContext, useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { ENSURE_INSTALLED_QUERY } from '~/queries/auth.gql';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const location = useLocation();
  /**
   * Sử dụng state query chỉ đọc để đảm bảo rằng query chỉ chạy 1 lần khi app load ngay cả khi người dùng điều hướng đến trang khác
   * bởi vì khi người dùng điều hướng đến trang khác, query sẽ thay đổi và query sẽ chạy lại
   */
  const [query] = useState(() => location.search);
  const { data, loading, error } = useQuery(ENSURE_INSTALLED_QUERY, {
    fetchPolicy: 'no-cache',
    context: { noAuth: true } ,
    variables: { query },
  });
  const hasInstalled = useMemo(() => {
    return data?.ensureShopifyAppInstalled?.installed === true;
  }, [data]);
  const redirectQuery = useMemo(() => {
    return data?.ensureShopifyAppInstalled?.redirectQuery;
  }, [data]);
  const state = useMemo(() => {
    return { data, hasInstalled, loading, redirectQuery, error };
  }, [data, hasInstalled, loading, redirectQuery, error]);
  const contextValue = useMemo(() => {
    return [state];
  }, [state]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
