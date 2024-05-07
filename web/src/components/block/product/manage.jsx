import {useCallback, memo, useState} from 'react';
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
import { useManage } from '~/talons/section/useManage';

function ModalInstallSection({section, fullWith = true}) {
  const talonManageProps = useManage({ section: section, typeSelect: true });
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});

  const confirmDelete = useCallback(() => {
    setConfirmAction(() => talonManageProps.handleDelete);
    setIsShowConfirm(true);
  }, [talonManageProps.selected]);

  return (
    <BlockStack gap='200'>
      {talonManageProps.bannerAlert &&
        fullWith
        ? <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />
        : <Card padding={0}>
          <BannerDefault bannerAlert={talonManageProps.bannerAlert} setBannerAlert={talonManageProps.setBannerAlert} />
        </Card>
      }
      <Text variant='headingMd' as='h2'>Choose theme for installation:</Text>

      <InlineGrid columns={fullWith ? 1 : {sm: 1, md: ['twoThirds', 'oneThird']}} gap={200} alignItems='center'>
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
          <InlineGrid columns={2} gap={200}>
            <Button
              onClick={confirmDelete}
              variant='primary'
              tone="critical"
              disabled={section?.installed ? !talonManageProps.installed : true}
              loading={talonManageProps.dataDeleteLoading}
              fullWidth
            >
              Delete from theme
            </Button>
            <Button
              onClick={talonManageProps.handleUpdate}
              variant='primary'
              disabled={!section?.actions?.install || !talonManageProps.options.length}
              loading={talonManageProps.dataUpdateLoading}
              fullWidth
            >
              {talonManageProps.installed ? 'Reinstall to theme' : 'Install to theme'}
            </Button>
          </InlineGrid>

          <ModalConfirm section={section} theme={talonManageProps.currentThemeSelected} isOpen={isShowConfirm} setIsOpen={setIsShowConfirm} onConfirm={confirmAction} />
        </div>
      </InlineGrid>
    </BlockStack>
  );
}

export default memo(ModalInstallSection);
