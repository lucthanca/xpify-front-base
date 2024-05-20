import { useState, useCallback, memo, useEffect, useMemo, useRef } from 'react';
import {
  BlockStack,
  Modal,
  Text
} from '@shopify/polaris';

function ModalConfirm({section, theme, isOpen, setIsOpen, onConfirm}) {
  const [loadingPrimary, setLoadingPrimary] = useState(false);
  const cfModalRef = useRef();

  const handleConfirm = async () => {
    setLoadingPrimary(true);
    await onConfirm();
    setLoadingPrimary(false);
    handleCloseModal();
  }

  const handleCloseModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => { // Overlay modal section
    if (cfModalRef.current) {
      const diagContainer = cfModalRef.current.closest('.Polaris-Modal-Dialog__Container');

      if (diagContainer) {
        diagContainer.style.zIndex = `calc(var(--p-z-index-11) + 1)`;
        const divParent = diagContainer.parentElement;
        if (!divParent) return;
        const backdrop = divParent.nextElementSibling;
        if (!backdrop) return;
        backdrop.style.zIndex = `calc(var(--p-z-index-10) + 1)`;
      }
    }
  }, [isOpen]);

  const type = useMemo(() => {
    return section?.child_ids ? 'group' : 'section';
  }, [section]);

  if (!section?.name || !theme?.name) return null;
  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      title={`Delete ${type}`}
      primaryAction={{
        destructive: true,
        content: 'Delete',
        onAction: () => handleConfirm(),
        loading: loadingPrimary
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => handleCloseModal()
        },
      ]}
    >
      <div className='Xpify__ConfirmModal__content' ref={cfModalRef}>
        <Modal.Section>
          <BlockStack gap='400'>
            <BlockStack gap='100'>
              <Text>Do you really want to delete {type} {section.name} from theme {theme.name}?</Text>
              <Text>If you want to use {section.name} on {theme.name} again, you will have to reinstall section to theme.</Text>
            </BlockStack>
            <Text tone='subdued'>
              Note: This action won't affect other themes.
            </Text>
          </BlockStack>
        </Modal.Section>
      </div>
    </Modal>
  );
}

export default memo(ModalConfirm);
