import { useSection } from '~/hooks/useSection';
import { BlockStack, Modal, Link } from '@shopify/polaris';
import BannerDefault from '~/components/block/banner/alert';
import ModalConfirm from '~/components/block/modal/confirm';
import { useSectionListContext } from '~/context';
import { useCallback, useState, useMemo } from 'react';
import { STEP_INIT, STEP_COMPLETE, useManage } from '~/talons/section/useManage';
import ThemeList from './themeList';
import { SECTION_TYPE_SIMPLE } from '~/constants';

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
  const { refetch = () => {}, splide = undefined } = props;
  const talonProps = useInstallModal();
  const { show, handleCloseModal, activeSection } = talonProps;
  const sectionTalonProps = useSection({ key: activeSection?.url_key });
  const { section, loadingWithoutData } = sectionTalonProps;
  const talonManageProps = useManage({ section: section });
  const {
    dataUpdateLoading,
    dataDeleteLoading,
    handleDelete: uninstallSectionFromTheme,
    currentThemeSelected: selectedTheme,
    installed,
    step,
    setStep,
    setBannerAlert,
    updateNotes,
    primaryActionContent,
    primaryActionHandle,
  } = talonManageProps;
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  // const [confirmAction, setConfirmAction] = useState(() => {});
  // const [currentThemeSelected, setCurrentThemeSelected] = useState(undefined);

  // Stop auto scroll if modal is active
  if (splide?.current?.splide && !!activeSection?.url_key) {
    splide.current.splide.Components.Autoplay.pause();
  }

  // const confirmDelete = () => {
  //   // setConfirmAction(() => talonManageProps.handleDelete);
  //   setIsShowConfirm(true);
  //   // setCurrentThemeSelected(talonManageProps.currentThemeSelected);
  // };

  const handleClose = () => {
    setBannerAlert(undefined);
    handleCloseModal();
    if (splide?.current?.splide) {
      splide.current.splide.Components.Autoplay.play();
    }
    setStep(STEP_INIT);

    // Reload item sau khi uninstall khỏi toàn bộ theme và sau khi đóng popup
    if (location.pathname === '/my-library' && !installed && step === STEP_COMPLETE) {
      refetch();
    }
  };

  if (isShowConfirm) {
    return <ModalConfirm section={section} theme={selectedTheme} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={uninstallSectionFromTheme} />
  }

  if (!show || !activeSection) return null;
  return (
    <Modal
      open={show}
      onClose={handleClose}
      title={`Install "${activeSection?.name ?? 'section'}" to theme`}
      primaryAction={{
        content: primaryActionContent,
        disabled: dataDeleteLoading || dataUpdateLoading || loadingWithoutData || !talonManageProps.options.length || !section?.actions?.install,
        loading: talonManageProps?.executeSection === activeSection?.url_key ? talonManageProps.dataUpdateLoading : false,
        onAction: primaryActionHandle,
      }}
      secondaryActions={
        activeSection && parseInt(activeSection.type_id) === SECTION_TYPE_SIMPLE ?
          [{
            destructive: true,
            content: 'Uninstall',
            disabled: dataDeleteLoading || dataUpdateLoading || loadingWithoutData || (section?.installed ? !talonManageProps.installed : true),
            loading: talonManageProps?.executeSection === activeSection?.url_key ? talonManageProps.dataDeleteLoading : false,
            onAction: () => setIsShowConfirm(true),
          }]
        : []
      }
    >
      <Modal.Section>
        <BlockStack gap='200'>
          {section?.url_key === activeSection?.url_key
          && activeSection?.url_key === talonManageProps?.executeSection
          && <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />}
          {updateNotes && <BannerDefault bannerAlert={updateNotes} noDismiss={true} />}
          <ThemeList options={section?.url_key === activeSection?.url_key ? talonManageProps.options : {}} selected={talonManageProps.selected} handleSelectChange={talonManageProps.handleSelectChange} />
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default InstallModal;
