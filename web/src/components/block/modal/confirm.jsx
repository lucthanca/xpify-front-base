import {useState, useCallback, memo, useEffect, useMemo} from 'react';
import {
  BlockStack,
  Modal,
  Text
} from '@shopify/polaris';

function ModalConfirm({section, theme, isOpen, setIsOpen, onConfirm}) {
  const [loadingPrimary, setLoadingPrimary] = useState(false);

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
    const splideModal = document.querySelector('.splide-modal-section');
    if (splideModal) {
      const parentEle = splideModal.closest('.Polaris-Modal-Dialog__Container')
      if (parentEle) {
        if (isOpen) {
          parentEle.classList.add('z-index10');
        } else {
          parentEle.classList.remove('z-index10');
        }
      }
    }
  }, [isOpen]);

  return (
    section?.name && theme?.name
    ? <Modal
      open={isOpen}
      onClose={handleCloseModal}
      title={`Confirm`}
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
      <Modal.Section>
        <BlockStack gap='400'>
          <BlockStack gap='100'>
          <Text>Do you really want to delete section {section.name} from theme {theme.name}?</Text>
          <Text>If you want to use {section.name} on {theme.name} again, you will have to reinstall section to theme.</Text>
          </BlockStack>
          <Text>
            Note: This action won't affect other themes.
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
    : <></>
  );
}

export default memo(ModalConfirm);
