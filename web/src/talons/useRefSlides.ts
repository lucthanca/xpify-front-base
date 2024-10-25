import { useState } from 'react';
import { useDismiss } from '~/talons/useDismiss';

export const useRefSlides = () => {
  const [blockId] = useState('home_ref_slides');
  const dismissTalon = useDismiss(blockId);

  return {
    ...dismissTalon,
  };
};
