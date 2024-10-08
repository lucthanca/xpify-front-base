import { useCallback, memo, useState, useEffect, useMemo } from 'react';
import {
  InlineGrid,
  BlockStack,
  Select,
  InlineStack,
  Button,
  Text,
  Spinner
} from '@shopify/polaris';
import ModalConfirm from '~/components/block/modal/confirm';
import BannerDefault from '~/components/block/banner/alert';
import { useManage } from '~/talons/section/useManage';
import { SECTION_TYPE_SIMPLE } from '~/constants/index.js';
import { useSectionListContext } from '~/context/index.js';
import './manage.scss';

function ModalInstallSection({section, fullWith = true}) {
  const talonManageProps = useManage({ section: section, typeSelect: true });
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const ctxListing = useSectionListContext();

  const {
    updateNotes,
    dataDeleteLoading,
    dataUpdateLoading,
    primaryActionContent,
    primaryActionHandle,
    handleUninstall,
    selected,
  } = talonManageProps;
  const isLoading = dataDeleteLoading || dataUpdateLoading;
  const confirmDelete = useCallback(() => {
    if (typeof ctxListing?.[1]?.lockModal === 'function') {
      ctxListing[1].lockModal();
    }
    setConfirmAction(() => handleUninstall);
    setIsShowConfirm(true);
  }, [selected]);

  const isSimpleSection = parseInt(section?.type_id) === SECTION_TYPE_SIMPLE;
  useEffect(() => {
    const shouldLockModal = dataDeleteLoading || dataUpdateLoading;
    if (typeof ctxListing?.[1]?.lockModal === 'function') {
      if (shouldLockModal) {
        ctxListing[1].lockModal();
      } else {
        ctxListing[1].releaseModal();
      }
    }
  }, [dataDeleteLoading, dataUpdateLoading]);

  const dropdownOptionsClass = useMemo(() => {
  const baseClass = 'otsb__install_theme_dropdown';
  const additionalClasses = fullWith
    ? 'grid gap-2'
    : isSimpleSection
    ? 'grid-template-section-simple'
    : 'grid-template-section-group';
  return `${baseClass} ${additionalClasses}`;
}, [isSimpleSection, fullWith]);
  return (
    <BlockStack gap='200'>
      {talonManageProps.bannerAlert && <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />}
      {updateNotes && <BannerDefault bannerAlert={updateNotes} noDismiss={true} />}
      <Text variant='headingMd' as='h2'>Choose theme for installation:</Text>

      <div className={dropdownOptionsClass}>
        {talonManageProps.options.length
        ? <div>
          <Select
            labelInline
            options={talonManageProps.options}
            onChange={talonManageProps.handleSelectChange}
            value={talonManageProps.selected}
          />
        </div>
        : <InlineStack align="center">
          <Spinner accessibilityLabel="loading" size="small" />
        </InlineStack>
        }

        <div>
          <InlineGrid columns={isSimpleSection ? 2 : 1} gap='200'>
            <Button
              onClick={primaryActionHandle}
              variant='primary'
              disabled={!talonManageProps.options.length || !section?.actions?.install}
              loading={isLoading}
              fullWidth
            >
              {primaryActionContent}
            </Button>
            {isSimpleSection &&
            <Button
              onClick={confirmDelete}
              variant='secondary'
              disabled={section?.installed ? !talonManageProps.installed : true}
              loading={isLoading}
              fullWidth
            >
              Uninstall
            </Button>
            }
          </InlineGrid>

          <ModalConfirm section={section} theme={talonManageProps.currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
        </div>
      </div>
    </BlockStack>
  );
}

export default memo(ModalInstallSection);
