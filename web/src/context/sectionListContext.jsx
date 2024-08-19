import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SectionListContext = createContext(undefined);

const SectionListProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  /**
   * The currently active section for quick view or install
   */
  const [activeSection, setStateActiveSection] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(true);
  const setActiveSection = useCallback((section) => {
    if (!!section) setModalLoading(true);
    setStateActiveSection(section);
  }, [])
  const state = useMemo(() => ({
    activeSection,
    modalLoading,
    modal,
    canCloseModal,
  }), [modal, activeSection, modalLoading, canCloseModal]);
  const api = useMemo(() => ({
    setActiveSection,
    setModalLoading,
    setModal,
    lockModal: () => setCanCloseModal(false),
    releaseModal: () => setCanCloseModal(true),
  }), [setActiveSection]);
  const value = useMemo(() => [state, api], [state, api]);
  return (
    <SectionListContext.Provider value={value} children={children} />
  );
};
export default SectionListProvider;

export const useSectionListContext = () => useContext(SectionListContext);
