import { createContext, useContext } from 'react';
import { useQuery } from '@apollo/client';
import storage from '~/utils/storage';
import { AUTHENTICATE_SESSION_QUERY } from '~/queries/auth.gql';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const token = storage.get('token');
  const value = { token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
