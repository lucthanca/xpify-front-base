// @ts-ignore
import { useUserContext } from '~/context/user.tsx';
import { useCallback, useMemo, useState } from 'react';
import type { HomeBlock } from '~/@types';
import { DISMISS_HOME_BLOCK_MUTATION } from '~/queries/section-builder/other.gql';
import { useMutation } from '@apollo/client';

export const useDismiss = (blockId: string) => {
  const [dismissTriggered, setDismissTriggered] = useState<boolean>(false);
  const [{ shop, loading }] = useUserContext();
  const [dismissBlock, { loading: dismissLoading }] = useMutation(DISMISS_HOME_BLOCK_MUTATION);
  const [stateDismissed, setStateDismissed] = useState<boolean>(undefined as any);

  const isDismissed = useMemo<boolean>(() => {
    if (stateDismissed !== undefined) return stateDismissed;
    if (!shop || loading) return false;
    const { home_blocks } = shop || {};
    return home_blocks.find((block: HomeBlock) => block.id === blockId)?.dismissed ?? true;
  }, [shop, loading, dismissTriggered, stateDismissed]);

  const handleDismiss = useCallback(async () => {
    setDismissTriggered(true);
    setStateDismissed(true);
    try {
      await dismissBlock({
        variables: {
          id: blockId,
          undo: false,
        }
      });
    } catch (e) {
      setDismissTriggered(false);
      setStateDismissed(false);
    }
  }, [dismissLoading]);
  const handleUndo = useCallback(async () => {
    setDismissTriggered(false);
    setStateDismissed(false);

    try {
      await dismissBlock({
        variables: {
          id: blockId,
          undo: true
        }
      });
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
