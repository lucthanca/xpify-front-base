import {useCallback, memo, useState, useMemo, useEffect} from 'react';
import {
  InlineGrid,
  ExceptionList,
  Modal,
  OptionList,
  Badge,
  BlockStack,
  Button
} from '@shopify/polaris';
import { NoteIcon, WrenchIcon } from '@shopify/polaris-icons';
import BannerDefault from '~/components/block/banner/alert';
import { UPDATE_ASSET_MUTATION, DELETE_ASSET_MUTATION } from "~/queries/section-builder/asset.gql";
import { useQuery, useMutation } from "@apollo/client";
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Trial',
  'development': 'Dev',
};

function PopupInstall({section}) {
  const [selected, setSelected] = useState([]);
  const [bannerAlertPopup, setBannerAlertPopup] = useState(undefined);

  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section.entity_id),
  });
  const themes = useMemo(() => themesData?.getThemes || [], [themesData]);

  const [updateAction, { data:dataUpdate, loading:dataUpdateL, error:dataUpdateE }] = useMutation(UPDATE_ASSET_MUTATION);
  const [deleteAction, { data:dataDelete, loading:dataDeleteL, error:dataDeleteE }] = useMutation(DELETE_ASSET_MUTATION);

  const sections = useMemo(() => {
    return themes ? themes.reduce((acc, theme) => {
      var existingTitle = acc.find(item => item.title === `Role: ${theme.role}`);
      if (section?.installed) {
        var installVersion = section.installed.find(item => item.theme_id === theme.id)?.product_version;
        var media = installVersion ? {'media': <Badge tone={installVersion === section.version ? "success" : "warning"}>v{installVersion}</Badge>} : {};
      }
      if (!existingTitle) {
        acc.push({
          title: `Role: ${theme.role}`,
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
  }, [section, themes]);

  const options = useMemo(() => {
    return themes
    ? themes.map(theme => {
      var status = 'Not install';
      const installedInTheme = section?.installed && section.installed.find(item => item.theme_id == theme.id);

      if (installedInTheme) {
        var content = [];
        if (childSections.length) {
          if (!groupChildSectionsLoad) {
            content = childSections.map(item => getUpdateMessage(item, theme.id, section))
          }
        } else {
          content = [getUpdateMessage(section, theme.id)];
        }

        content = content.filter(item => item !== undefined);
        if (content.length) {
          status = 'Installed';
        }
        content = content.filter(item => item !== "");
        if (content.length) {
          status = 'Should update';
        }
      }

      return ({
        value: theme.id,
        label: `${theme.name} (${titleRoleTheme[theme.role]}) - ${status}`
      })
    })
    : {
      value: 0,
      label: `Loading...`
    };
  }, [section, themes]);

  const installed = true;

  useEffect(() => {
    if (dataUpdate) {
      if (!dataUpdate.updateAsset?.errors && dataUpdate.updateAsset?.key) {
        setBannerAlert({
          'title': 'This section has been successfully installed! 🎉',
          'tone': 'success',
          'action': {content: 'Customize', icon: WrenchIcon},
          'content': [{'message': 'Access theme ' + themes.find(item => item.id == selected[0]).name + ' and add section ' + section?.name}]
        });
      } else {
        setBannerAlert({
          'title': dataUpdate.updateAsset?.errors ?? 'You can not install sections to a demo theme',
          'tone': 'critical'
        });
      }
    }
  }, [dataUpdate]);
  useEffect(() => {
    if (dataDelete) {
      if (dataDelete.deleteAsset?.message) {
        setBannerAlertPopup({
          'title': dataDelete.deleteAsset.message.replace(section?.src, section?.name)
        });
      }
    }
  }, [dataDelete]);
  useEffect(() => {
    if (dataUpdateE) {
      setBannerAlertPopup({
        'title': dataUpdateE.message,
        'tone': 'critical',
        'content': dataUpdateE.graphQLErrors ?? []
      });
    } else if (!section.actions?.install) {
      setBannerAlertPopup({
        'title': 'Chua mua section nay',
        'tone': 'warning'
      });
    }
  }, [section, dataUpdateE]);

  const handleUpdate = useCallback(async () => {
    await updateAction({ 
      variables: {
        theme_id: selected[0],
        asset: section?.src,
        value: ''
      }
    });
    handleChange();
  }, [selected]);
  const handleDelete = useCallback(async () => {
    await deleteAction({ 
      variables: {
        theme_id: selected[0],
        asset: section?.src
      }
    });
  }, [selected]);

  return (
    themes &&
    <InlineGrid>
      <BlockStack gap={400}>
        <BannerDefault bannerAlert={bannerAlertPopup} setBannerAlert={setBannerAlertPopup} />
      </BlockStack>
      <OptionList
        onChange={setSelected}
        options={options}
        selected={selected}
      />

      <InlineGrid columns={2} gap={200}>
        <Button
          onClick={handleUpdate}
          variant='primary'
          disabled={!section.actions?.install || !selected}
          loading={dataUpdateL}
          fullWidth
        >
          {installed ? 'Reinstall to theme' : 'Install to theme'}
        </Button>
        <Button
          onClick={handleDelete}
          tone="critical"
          disabled={section.installed ? !installed : true}
          loading={dataDeleteL}
          fullWidth
        >
          Delete from theme
        </Button>
      </InlineGrid>
    </InlineGrid>
  );
}

export default memo(PopupInstall);