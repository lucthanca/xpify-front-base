import { createContext, useContext, useMemo } from 'react';

const ComplexSectionCollectionContext = createContext(undefined);

const ComplexSectionCollectionProvider = ({ children }) => {
  const state = useMemo(() => ({}), []);
  const api = useMemo(() => ({}), []);
  const contextValue = useMemo(() => ([
    state, api
  ]), [state, api]);
  return (
    <ComplexSectionCollectionContext.Provider value={contextValue} children={children} />
  )
};
export default ComplexSectionCollectionProvider;

export const useComplexSectionCollection = () => useContext(ComplexSectionCollectionContext)
