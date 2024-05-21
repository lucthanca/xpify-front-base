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
  const { refetch = () => {} } = props;
  const talonProps = useInstallModal(refetch);
  const { show, handleCloseModal, activeSection } = talonProps;
  const sectionTalonProps = useSection({ key: activeSection?.url_key });
  const { section, loadingWithoutData } = sectionTalonProps;
  const talonManageProps = useManage({ section: section });
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [currentThemeSelected, setCurrentThemeSelected] = useState(undefined);

  const confirmDelete = useCallback(() => {
    setConfirmAction(() => talonManageProps.handleDelete);
    setIsShowConfirm(true);
    setCurrentThemeSelected(talonManageProps.currentThemeSelected);
  });

  return (
    !isShowConfirm
    ? <Modal
      open={show}
      onClose={handleCloseModal}
      title={`Install "${activeSection?.name ?? 'section'}" to theme`}
      primaryAction={{
        content: (!loadingWithoutData && talonManageProps.installed) ? 'Reinstall to theme' : 'Install to theme',
        disabled: loadingWithoutData || !talonManageProps.options.length || !section?.actions?.install,
        loading: talonManageProps.dataUpdateLoading,
        onAction: talonManageProps.handleUpdate
      }}
      secondaryActions={!talonManageProps?.section?.child_ids?.length
        ? [
          {
            destructive: true,
            content: 'Delete from theme',
            disabled: loadingWithoutData || (section?.installed ? !talonManageProps.installed : true),
            loading: talonManageProps.dataDeleteLoading,
            onAction: confirmDelete
          },
        ]
        : []
      }
    >
      <Modal.Section>
        <BlockStack gap='200'>
          {section?.url_key === activeSection?.url_key && <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />}
          <ThemeList options={section?.url_key === activeSection?.url_key ? talonManageProps.options : {}} selected={talonManageProps.selected} handleSelectChange={talonManageProps.handleSelectChange} />
        </BlockStack>
      </Modal.Section>
    </Modal>
    : <ModalConfirm section={section} theme={currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
  );
};

export default InstallModal;
