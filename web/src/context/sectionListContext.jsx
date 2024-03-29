import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SectionListContext = createContext(undefined);

const SectionListProvider = ({ children }) => {
  /**
   * The currently active section for quick view
   */
  const [activeSection, setStateActiveSection] = useState(null);
  const [isQuickViewModalLoading, setQuickViewModalLoading] = useState(false);
  const setActiveSection = useCallback((section) => {
    if (!!section) setQuickViewModalLoading(true);
    setStateActiveSection(section);
  }, [])
  const state = useMemo(() => ({
    activeSection,
    isQuickViewModalLoading,
  }), [activeSection, isQuickViewModalLoading]);
  const api = useMemo(() => ({
    setActiveSection,
    setQuickViewModalLoading,
  }), [setActiveSection]);
  const value = useMemo(() => [state, api], [state, api]);
  return (
    <SectionListContext.Provider value={value} children={children} />
  );
};
export default SectionListProvider;

export const useSectionListContext = () => useContext(SectionListContext);
