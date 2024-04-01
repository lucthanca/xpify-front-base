import { useSection } from '~/hooks/useSection';
import { BlockStack, Modal } from '@shopify/polaris';
import ModalInstallSection from '~/components/product/manage';
import { useSectionListContext } from '~/context';
import { useCallback } from 'react';

const useInstallModal = () => {
  const [{ activeSection, modal }, { setActiveSection, setModalLoading, setModal }] = useSectionListContext();
  const show = !!activeSection && modal === 'install';
  const handleCloseModal = useCallback(() => {
    setModalLoading(false);
    setActiveSection(null);
    setModal(null);
  }, []);
  return {
    show,
    handleCloseModal,
    activeSection,
  };
};

const InstallModal = props => {
  const talonProps = useInstallModal();
  const { show, handleCloseModal, activeSection } = talonProps;
  const sectionTalonProps = useSection({ key: activeSection?.url_key });
  const { refetch } = sectionTalonProps;
  return (
    <Modal
      open={show}
      onClose={handleCloseModal}
      title={`Install "${activeSection?.name ?? 'section'}" to theme`}
    >
      <Modal.Section>
        <BlockStack gap='400'>
          <ModalInstallSection section={activeSection} reloadSection={refetch} />
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default InstallModal;
