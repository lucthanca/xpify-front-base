import { useSectionListContext } from '~/context';
import { useCallback } from 'react';
import { SectionData } from '~/talons/section/useSection';

type SectionListContextState = {
  activeSection: SectionData | null;
};
type SectionListContextApi = {
  setActiveSection: (section: SectionData | null) => void;
  setQuickViewModalLoading: (loading: boolean) => void;
};
type SectionListContext = [SectionListContextState, SectionListContextApi];
export const useQuickViewSlider = () => {
  const [{ activeSection }, { setActiveSection, setQuickViewModalLoading }] = useSectionListContext() as unknown as SectionListContext;
  const onCloseQuickViewModal = useCallback(() => {
    setQuickViewModalLoading(false);
    setActiveSection(null);
  }, [setActiveSection]);
  const show = !!activeSection;
  return {
    activeSection,
    show,
    onCloseQuickViewModal,
  };
};
