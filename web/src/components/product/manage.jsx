import {InlineGrid, ExceptionList, Modal, OptionList, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs, Text, Tooltip, Icon, Badge, BlockStack} from '@shopify/polaris';
import {useCallback, memo, useState, useMemo, useEffect} from 'react';
import {NoteIcon} from '@shopify/polaris-icons';
import {gql, useQuery, useMutation} from "@apollo/client";
import { WrenchIcon, StatusActiveIcon } from '@shopify/polaris-icons';

import BannerDefault from '~/components/banner/default';
import { UPDATE_ASSET_MUTATION, DELETE_ASSET_MUTATION } from "~/queries/section-builder/asset.gql";

function ModalInstallSection({currentProduct, themes, isShowPopup, setIsShowPopup, setBannerAlert, reloadProduct}) {
  const [selected, setSelected] = useState([]);
  const [updateAction, { data:dataUpdate, loading:dataUpdateL, error:dataUpdateE }] = useMutation(UPDATE_ASSET_MUTATION);
  const [deleteAction, { data:dataDelete, loading:dataDeleteL, error:dataDeleteE }] = useMutation(DELETE_ASSET_MUTATION);
  const [bannerAlertPopup, setBannerAlertPopup] = useState(undefined); 
  const handleChange = useCallback(() => {
    setIsShowPopup(!isShowPopup);
    setBannerAlertPopup(undefined);
  }, [isShowPopup]);

  const sections = useMemo(() => {
    return themes ? themes.reduce((acc, theme) => {
      var existingTitle = acc.find(item => item.title === `• ${theme.role}`);
      if (currentProduct?.installed) {
        var installVersion = currentProduct.installed.find(item => item.theme_id === theme.id)?.product_version;
        var media = installVersion ? {'media': <Badge tone={installVersion === currentProduct.version ? "success" : "warning"}>v{installVersion}</Badge>} : {};
      }
      if (!existingTitle) {
        acc.push({
          title: `• ${theme.role}`,
          options: [{
            value: theme.id,
            label: theme.name,
            ...media
          }]
        });
      } else {
        existingTitle.options.push({
          value: theme.id,
          label: theme.name,
          ...media
        });
      }
      return acc;
    }, []) : {};
  }, [currentProduct, themes]);

  useEffect(() => {
    if (dataUpdate) {
      if (!dataUpdate.updateAsset?.errors && dataUpdate.updateAsset?.key) {
        setBannerAlert({
          'title': 'This section has been successfully installed! 🎉',
          'tone': 'success',
          'action': {content: 'Customize', icon: WrenchIcon},
          'content': [{'message': 'Access theme ' + themes.find(item => item.id == selected[0]).name + ' and add section ' + currentProduct?.name}]
        });
      } else {
        setBannerAlert({
          'title': dataUpdate.updateAsset?.errors ?? 'You can not install sections to a demo theme',
          'tone': 'critical'
        });
      }
      reloadProduct();
    }
  }, [dataUpdate]);
  useEffect(() => {
    if (dataDelete) {
      if (dataDelete.deleteAsset?.message) {
        setBannerAlertPopup({
          'title': dataDelete.deleteAsset.message.replace(currentProduct?.src, currentProduct?.name)
        });
      }
      reloadProduct();
    }
  }, [dataDelete]);
  useEffect(() => {
    if (dataUpdateE) {
      setBannerAlertPopup({
        'title': dataUpdateE.message,
        'tone': 'critical',
        'content': dataUpdateE.graphQLErrors ?? []
      });
    } else if (!currentProduct.actions?.install) {
      setBannerAlertPopup({
        'title': 'Chua mua section nay',
        'tone': 'warning'
      });
    }
  }, [currentProduct, dataUpdateE]);

  const handleUpdate = useCallback(async () => {
    await updateAction({ 
      variables: {
        theme_id: selected[0],
        asset: currentProduct?.src,
        value: ''
      }
    });
    handleChange();
  }, [selected]);
  const handleDelete = useCallback(async () => {
    await deleteAction({ 
      variables: {
        theme_id: selected[0],
        asset: currentProduct?.src
      }
    });
  }, [selected]);

  return (
    themes &&
    <Modal
      open={isShowPopup}
      onClose={handleChange}
      title={"Themes in your Store"}
      primaryAction={{
        content: 'Reinstall section',
        onAction: () => handleUpdate(),
        disabled: !currentProduct.actions?.install || !selected.length,
        loading: dataUpdateL
      }}
      secondaryActions={[
        {
          content: 'Uninstall section',
          destructive: true,
          onAction: () => handleDelete(),
          disabled: currentProduct.installed ? !currentProduct.installed.find(item => item.theme_id === selected[0]) : true,
          loading: dataDeleteL
        },
      ]}
    >
    <Modal.Section>
      <InlineGrid>
        <BlockStack gap={400}>
          <ExceptionList items={[
            {
              icon: NoteIcon,
              description: "Theme marked (version) mean this section has been installed.",
            },
          ]} />
          <BannerDefault bannerAlert={bannerAlertPopup} setBannerAlert={setBannerAlertPopup} />
        </BlockStack>
        <OptionList
          onChange={setSelected}
          sections={sections}
          selected={selected}
        />
      </InlineGrid>
    </Modal.Section>
    </Modal>
  );
}

export default memo(ModalInstallSection);