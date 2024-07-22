import { useSection } from '~/hooks/useSection';
import { BlockStack, Modal } from '@shopify/polaris';
import BannerDefault from '~/components/block/banner/alert';
import ModalConfirm from '~/components/block/modal/confirm';
import { useSectionListContext } from '~/context';
import { useCallback, useState } from 'react';
import { useManage } from '~/talons/section/useManage';
import ThemeList from './themeList';

const useInstallModal = (refetch) => {
  const [{ activeSection, modal }, { setActiveSection, setModalLoading, setModal }] = useSectionListContext();
  const show = !!activeSection && modal === 'install';
  const handleCloseModal = useCallback(() => {
    setModalLoading(false);
    setActiveSection(null);
    setModal(null);
    // Reload item sau khi uninstall khỏi toàn bộ theme và sau khi đóng popup
    if (location.pathname === '/my-library') {
      refetch();
    }
  }, []);
  return {
    show,
    handleCloseModal,
    activeSection,
  };
};

const InstallModal = props => {
  const { refetch = () => {}, splide = undefined } = props;
  const talonProps = useInstallModal(refetch);
  const { show, handleCloseModal, activeSection } = talonProps;
  const sectionTalonProps = useSection({ key: activeSection?.url_key });
  const { section, loadingWithoutData } = sectionTalonProps;
  const talonManageProps = useManage({ section: section });
  const {
    dataUpdateLoading,
    dataDeleteLoading
  } = talonManageProps;
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [currentThemeSelected, setCurrentThemeSelected] = useState(undefined);

  // Stop auto scroll if modal is active
  if (splide?.current?.splide && !!activeSection?.url_key) {
    splide.current.splide.Components.Autoplay.pause();
  }

  const confirmDelete = useCallback(() => {
    setConfirmAction(() => talonManageProps.handleDelete);
    setIsShowConfirm(true);
    setCurrentThemeSelected(talonManageProps.currentThemeSelected);
  });

  const handleClose = useCallback(() => {
    handleCloseModal();
    if (splide?.current?.splide) {
      splide.current.splide.Components.Autoplay.play();
    }
  }, []);

  return (
    !isShowConfirm
    ? <Modal
      open={show}
      onClose={handleClose}
      title={`Install "${activeSection?.name ?? 'section'}" to theme`}
      primaryAction={{
        content: (!loadingWithoutData && talonManageProps.installed) ? 'Reinstall to theme' : 'Install to theme',
        disabled: dataDeleteLoading || dataUpdateLoading || loadingWithoutData || !talonManageProps.options.length || !section?.actions?.install,
        loading: talonManageProps?.executeSection === activeSection?.url_key ? talonManageProps.dataUpdateLoading : false,
        onAction: talonManageProps.handleUpdate
      }}
      secondaryActions={
        activeSection?.type_id == '1' // Simple section
        ? [
          {
            destructive: true,
            content: 'Delete from theme',
            disabled: dataDeleteLoading || dataUpdateLoading || loadingWithoutData || (section?.installed ? !talonManageProps.installed : true),
            loading: talonManageProps?.executeSection === activeSection?.url_key ? talonManageProps.dataDeleteLoading : false,
            onAction: confirmDelete
          },
        ]
        : []
      }
    >
      <Modal.Section>
        <BlockStack gap='200'>
          {section?.url_key === activeSection?.url_key
          && activeSection?.url_key === talonManageProps?.executeSection
          && <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />}
          <ThemeList options={section?.url_key === activeSection?.url_key ? talonManageProps.options : {}} selected={talonManageProps.selected} handleSelectChange={talonManageProps.handleSelectChange} />
        </BlockStack>
      </Modal.Section>
    </Modal>
    : <ModalConfirm section={section} theme={currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
  );
};

export default InstallModal;
