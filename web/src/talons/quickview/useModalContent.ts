import { useCallback, useEffect, useState } from 'react';
import { useSectionListContext } from '~/context';
import type { SectionListContext } from '~/talons/quickview/useQuickViewSlider';
import { useApolloClient } from '@apollo/client';
import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { SectionData } from '~/talons/section/useSection';

type SectionQueryData = {
  [key: string]: SectionData;
}

export const useModalContent = (keys: string[], onIndexChange: any) => {
  const client = useApolloClient();
  const [{ activeSection }, { setActiveSection }] = useSectionListContext() as unknown as SectionListContext;
  const startIndex = keys.indexOf(activeSection?.url_key ?? '');
  const [movedIndex, setMovedIndex] = useState(startIndex);
  const sliderOpts = {
    perPage: 1,
    pagination: false,
    gap: '1rem',
    start: startIndex,
    drag: false,
    dragAngleThreshold: 0 // Disable drag tránh conflict drag gallery
  };
  const handleSliderMoved = useCallback((_: any, currentIndex: number) => {
    setMovedIndex(currentIndex);
    const activeSection = client.cache.readQuery<SectionQueryData>({
      query: SECTION_V2_QUERY,
      variables: { key: keys[currentIndex] },
    });
    if (activeSection?.[SECTION_V2_QUERY_KEY]) {
      setActiveSection(activeSection[SECTION_V2_QUERY_KEY]);
    }
  }, []);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange({ index: movedIndex, key: activeSection?.url_key });
    }
  }, [movedIndex]);

  return {
    sliderOpts,
    handleSliderMoved,
    movedIndex,
  };
};
