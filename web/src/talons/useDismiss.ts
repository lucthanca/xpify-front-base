// @ts-ignore
import { useUserContext } from '~/context/user.tsx';
import { useMemo } from 'react';
import type { HomeBlock } from '~/@types';

export const useDismiss = (blockId: string) => {
  const [{ shop, loading }] = useUserContext();

  const { home_blocks } = shop;
  const isDismissed = useMemo(() => {
    if (!shop || loading) return false;
    return home_blocks.find((block: HomeBlock) => block.id === blockId)?.dismissed ?? true
  }, [shop, loading]);

  return {
    isDismissed,
    dismiss: () => {},
    loading,
    shop,
  };
};
