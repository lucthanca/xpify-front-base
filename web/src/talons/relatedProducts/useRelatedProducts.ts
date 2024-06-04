import { useMemo, useState } from 'react';
import type { Options } from '@splidejs/react-splide';

type RelatedProductsTalonProps = {
  pageSize?: number;
  currentPage?: number;
};

export type RelatedProductsTalon = {
  slideOptions: Options;
  slidePerPage: number;
};

export const useRelatedProducts = (props: RelatedProductsTalonProps = {}): RelatedProductsTalon => {
  const wInner = window.innerWidth;
  const slidePerPage = useMemo(() => {
    if (wInner < 425) return 1;
    if (wInner < 768) return 2;
    return 2;
  }, [wInner])
  const [slideOptions] = useState(() => ({
    perPage: 2,
    gap: '1rem',
    pagination: false,
    breakpoints:{
      425: { perPage: 1 },
      768: { perPage: 2 }
    },
    autoplay: true,
    interval: 3000,
    rewind: true,
    rewindByDrag: true
  }));

  return {
    slideOptions,
    slidePerPage,
  };
};
