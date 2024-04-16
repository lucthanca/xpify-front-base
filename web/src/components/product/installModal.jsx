import { useSection } from '~/hooks/useSection';
import { BlockStack, Modal, SkeletonBodyText } from '@shopify/polaris';
import ModalInstallSection from '~/components/product/manage';
import ModalConfirm from '~/components/block/modal/confirm';
import { useSectionListContext } from '~/context';
import { useCallback, useState } from 'react';

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
  const { section } = sectionTalonProps;
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [currentThemeSelected, setCurrentThemeSelected] = useState(undefined);

  return (
    !isShowConfirm
    ? <Modal
      open={show}
      onClose={handleCloseModal}
      title={`Install "${activeSection?.name ?? 'section'}" to theme`}
    >
      <Modal.Section>
        <BlockStack gap='400'>
          {section && <ModalInstallSection section={section} typeSelect={false} setCurrentThemeSelected={setCurrentThemeSelected} setConfirmAction={setConfirmAction} setIsShowConfirm={setIsShowConfirm} />}
        </BlockStack>
      </Modal.Section>
    </Modal>
    : <ModalConfirm section={section} theme={currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
  );
};

export default InstallModal;
