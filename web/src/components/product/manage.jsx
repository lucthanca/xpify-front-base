import {useCallback, memo, useState, useMemo, useEffect} from 'react';
import {
  InlineGrid,
  ExceptionList,
  Modal,
  OptionList,
  Badge,
  BlockStack,
  Select,
  InlineStack,
  Button,
  Icon,
  Box
} from '@shopify/polaris';
import { NoteIcon, WrenchIcon } from '@shopify/polaris-icons';
import { useQuery, useMutation } from "@apollo/client";
import BannerDefault from '~/components/block/banner';
import { UPDATE_ASSET_MUTATION, DELETE_ASSET_MUTATION } from "~/queries/section-builder/asset.gql";
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Trial',
  'development': 'Dev',
};

function ModalInstallSection({section, reloadSection}) {
  const [selected, setSelected] = useState("");
  const [bannerAlert, setBannerAlert] = useState(undefined);

  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section.entity_id),
  });
  const themes = useMemo(() => themesData?.getThemes || [], [themesData]);
  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  useMemo(() => {
    if (themes && themes.length) {
      setSelected(themes[0]['id'] ?? "");
    }
  }, [themes]);
  const options = useMemo(() => {
    return themes
    ? themes.map(theme => {
      var prefix = {};
      var status = 'Not install';
      if (section?.installed) {
        var installVersion = section.installed.find(item => item.theme_id === theme.id)?.product_version;
        if (installVersion) {
          if (installVersion === section.version) {
            prefix = {
              'prefix': <Badge tone="success">v{installVersion}</Badge>
            };
            status = 'Installed';
          } else {
            prefix = {
              'prefix': <Badge tone="warning">v{installVersion}</Badge>
            };
            status = 'Should update';
          }
        }
      }
      return ({
        value: theme.id,
        label: `${theme.name}(${titleRoleTheme[theme.role]}) - ${status} `,
        ...prefix
      })
    })
    : [];
  }, [section, themes]);
  const installed = useMemo(() => {
    return section?.installed && section.installed.find(item => item.theme_id == selected)
  }, [section, selected]);

  const [updateAction, { data:dataUpdate, loading:dataUpdateL, error:dataUpdateE }] = useMutation(UPDATE_ASSET_MUTATION);
  const [deleteAction, { data:dataDelete, loading:dataDeleteL, error:dataDeleteE }] = useMutation(DELETE_ASSET_MUTATION);

  const handleUpdate = useCallback(async () => {
    await updateAction({ 
      variables: {
        theme_id: selected,
        asset: section?.src,
        value: ''
      }
    });
  }, [selected]);
  const handleDelete = useCallback(async () => {
    await deleteAction({ 
      variables: {
        theme_id: selected[0],
        asset: section?.src
      }
    });
  }, [selected]);

  useEffect(() => {
    if (dataUpdate) {
      if (!dataUpdate.updateAsset?.errors && dataUpdate.updateAsset?.key) {
        setBannerAlert({
          'title': 'This section has been successfully installed! 🎉',
          'tone': 'success',
          'action': {content: 'Customize', icon: WrenchIcon},
          'content': [{'message': 'Access theme ' + themes.find(item => item.id == selected).name + ' and add section ' + section?.name}]
        });
      } else {
        setBannerAlert({
          'title': dataUpdate.updateAsset?.errors ?? 'You can not install sections to a demo theme',
          'tone': 'critical'
        });
      }
      reloadSection();
    }
  }, [dataUpdate]);
  useEffect(() => {
    if (dataDelete) {
      if (dataDelete.deleteAsset?.message) {
        setBannerAlert({
          'title': dataDelete.deleteAsset.message.replace(section?.src, section?.name)
        });
      }
      reloadSection();
    }
  }, [dataDelete]);
  useEffect(() => {
    if (dataUpdateE) {
      setBannerAlert({
        'title': dataUpdateE.message,
        'tone': 'critical',
        'content': dataUpdateE.graphQLErrors ?? []
      });
    } else if (!section.actions?.install) {
      setBannerAlert({
        'title': 'Chua mua section nay',
        'tone': 'warning'
      });
    }
  }, [section, dataUpdateE]);

  return (
    themes &&
    <>
      <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
      <Select
        labelInline
        options={options}
        onChange={handleSelectChange}
        value={selected}
      />
      <InlineGrid columns={2} gap={200}>
        <Button
          onClick={handleUpdate}
          variant='primary'
          disabled={!section.actions?.install || !selected}
          loading={dataUpdateL}
        >
          {installed ? 'Re-install section' : 'Install section'}
        </Button>
        <Button
          onClick={handleDelete}
          tone="critical"
          disabled={section.installed ? !installed : true}
          loading={dataDeleteL}
        >
          Delete section
        </Button>
      </InlineGrid>
    </>
  );
}

export default memo(ModalInstallSection);