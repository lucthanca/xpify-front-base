import { useCallback, memo, useState, useMemo } from 'react';
import {
  InlineGrid,
  BlockStack,
  Select,
  InlineStack,
  Button,
  Text,
  Card,
  Spinner
} from '@shopify/polaris';
import ModalConfirm from '~/components/block/modal/confirm';
import BannerDefault from '~/components/block/banner/alert';
import { STEP_COMPLETE, useManage } from '~/talons/section/useManage';
import { SECTION_TYPE_SIMPLE } from '~/constants/index.js';

function ModalInstallSection({section, fullWith = true}) {
  const talonManageProps = useManage({ section: section, typeSelect: true });
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});

  const {
    updateNotes,
    dataDeleteLoading,
    dataUpdateLoading,
    primaryActionContent,
    primaryActionHandle,
  } = talonManageProps;
  const isLoading = dataDeleteLoading || dataUpdateLoading;
  const confirmDelete = useCallback(() => {
    setConfirmAction(() => talonManageProps.handleDelete);
    setIsShowConfirm(true);
  }, [talonManageProps.selected]);

  const isSimpleSection = parseInt(section?.type_id) === SECTION_TYPE_SIMPLE;

  return (
    <BlockStack gap='200'>
      {talonManageProps.bannerAlert &&
        fullWith
        ? <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />
        : <Card padding='0'>
          <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />
        </Card>
      }
      {
        updateNotes && fullWith ? <BannerDefault bannerAlert={updateNotes} noDismiss={true} /> : <Card padding='0'><BannerDefault bannerAlert={updateNotes} noDismiss={true} /></Card>
      }
      <Text variant='headingMd' as='h2'>Choose theme for installation:</Text>

      <div className={fullWith ? 'grid gap-2' : (isSimpleSection ? 'grid-template-section-simple' : 'grid-template-section-group')}>
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
            {isSimpleSection &&
            <Button
              onClick={confirmDelete}
              variant='primary'
              tone="critical"
              disabled={section?.installed ? !talonManageProps.installed : true}
              loading={isLoading}
              fullWidth
            >Uninstall</Button>
            }

            <Button
              onClick={primaryActionHandle}
              variant='primary'
              disabled={!talonManageProps.options.length || !section?.actions?.install}
              loading={isLoading}
              fullWidth
            >
              {primaryActionContent}
            </Button>
          </InlineGrid>

          <ModalConfirm section={section} theme={talonManageProps.currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
        </div>
      </div>
    </BlockStack>
  );
}

export default memo(ModalInstallSection);
