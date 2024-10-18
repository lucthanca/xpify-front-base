// @ts-ignore
import { useUserContext } from '~/context/user.tsx';
import { useCallback, useMemo, useState } from 'react';
import type { HomeBlock } from '~/@types';
import { DISMISS_HOME_BLOCK_MUTATION } from '~/queries/section-builder/other.gql';
import { useMutation } from '@apollo/client';
import storage from '~/utils/storage';

export const useDismiss = (blockId: string) => {
  const [dismissTriggered, setDismissTriggered] = useState<boolean>(false);
  const [{ shop, loading }] = useUserContext();
  const [dismissBlock, { loading: dismissLoading }] = useMutation(DISMISS_HOME_BLOCK_MUTATION);
  const [stateDismissed, setStateDismissed] = useState<boolean>(undefined as any);
  const [storageCached] = useState<boolean | undefined>(() => {
    // load from local storage
    const cached = storage.getItem(`dismissed_${blockId}`);
    if (cached !== undefined) return cached;
    return undefined;
  });

  const dismissBlockHandle = async (undo: boolean) => {
    storage.setItem(`dismissed_${blockId}`, !undo);
    await dismissBlock({ variables: { id: blockId, undo } });
  };

  const isDismissed = useMemo<boolean>(() => {
    if (stateDismissed !== undefined) return stateDismissed;
    if (storageCached !== undefined) return storageCached;
    if (!shop || loading) return false;
    const { home_blocks } = shop || {};
    return home_blocks.find((block: HomeBlock) => block.id === blockId)?.dismissed ?? true;
  }, [shop, loading, dismissTriggered, stateDismissed]);

  const handleDismiss = useCallback(async () => {
    setDismissTriggered(true);
    setStateDismissed(true);
    try {
      dismissBlockHandle(false).then(r => void 0);
    } catch (e) {
      setDismissTriggered(false);
      setStateDismissed(false);
    }
  }, [dismissLoading]);
  const handleUndo = useCallback(async () => {
    setDismissTriggered(false);
    setStateDismissed(false);

    try {
      dismissBlockHandle(true).then(r => void 0);
    } catch (e) {
      setDismissTriggered(true);
      setStateDismissed(true);
    }
  }, [dismissLoading]);

  return {
    isDismissed,
    dismiss: handleDismiss,
    undo: handleUndo,
    loading,
    shop,
    dismissTriggered,
    loadingWithoutCache: !shop?.home_blocks?.length && loading,
  };
};
