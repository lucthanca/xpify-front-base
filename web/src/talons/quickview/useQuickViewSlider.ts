import { useSectionListContext } from '~/context';
import { useCallback } from 'react';
import { SectionData } from '~/talons/section/useSection';

type SectionListContextState = {
  activeSection: SectionData | null;
  modal: string;
};
type SectionListContextApi = {
  setActiveSection: (section: SectionData | null) => void;
  setModalLoading: (loading: boolean) => void;
  setModal: (modalName: string | null) => void;
};
export type SectionListContext = [SectionListContextState, SectionListContextApi];
export const useQuickViewSlider = () => {
  const [{ activeSection, modal }, { setActiveSection, setModalLoading, setModal }] = useSectionListContext() as unknown as SectionListContext;
  const onCloseQuickViewModal = useCallback(() => {
    setModalLoading(false);
    setActiveSection(null);
    setModal(null);
  }, [setActiveSection]);
  const show = modal === 'quickView' && !!activeSection;
  return {
    activeSection,
    show,
    onCloseQuickViewModal,
  };
};
