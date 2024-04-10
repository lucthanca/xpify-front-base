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
  Box,
  Text
} from '@shopify/polaris';
import { NoteIcon, WrenchIcon } from '@shopify/polaris-icons';
import { useToast } from '@shopify/app-bridge-react';
import { useQuery, useMutation } from "@apollo/client";
import BannerDefault from '~/components/block/banner/alert';
import { UPDATE_ASSET_MUTATION, DELETE_ASSET_MUTATION } from "~/queries/section-builder/asset.gql";
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Trial',
  'development': 'Dev',
};

function ModalInstallSection({section, typeSelect = true, fullWith = true}) {
  const [selected, setSelected] = useState("");
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const toast = useToast();

  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section.entity_id),
  });
  const themes = useMemo(() => themesData?.getThemes || [], [themesData]);
  const { data: groupChildSections, loading: groupChildSectionsLoad } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {
        product_id: section?.child_ids ?? []
      },
      pageSize: 99,
      currentPage: 1
    },
    skip: !Array.isArray(section?.child_ids) || section?.child_ids?.length === 0,
  });
  const childSections = useMemo(() => groupChildSections?.getSections?.items || [], [groupChildSections]);

  const handleSelectChange = useCallback((value) => {
    setSelected(typeSelect ? value : value[0]);
  }, []);
  const getUpdateMessage = useCallback((item, currentTheme, parent = null) => {
    const installVersion = item?.installed && item.installed.find(item => item.theme_id == currentTheme)?.product_version;
    if (installVersion) {
      if (installVersion != item.version) {
        return {message: `Update ${item.name} v${installVersion} to v${item.version}`};
      } else {
        return '';
      }
    } else {
      if (parent?.child_ids) {
        return {message: `Add ${item.name} v${item.version}`};
      }
    }
  }, []);

  useMemo(() => {
    if (themes && themes.length) {
      setSelected(themes[0]['id'] ?? "");
    }
  }, [themes]);
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
        label: `${theme.name}(${titleRoleTheme[theme.role]}) - ${status}`
      })
    })
    : {
      value: 0,
      label: `Loading...`
    };
  }, [section, themes, groupChildSectionsLoad]);

  const options1 = useMemo(() => {
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

  const installed = useMemo(() => {
    setBannerAlert(undefined);
    if (!section?.installed) {
      return false;
    }

    const installedInTheme = section?.installed && section.installed.find(item => item.theme_id == selected);

    if (installedInTheme) {
      var content = [];
      if (childSections.length) {
        if (!groupChildSectionsLoad) {
          content = childSections.map(item => getUpdateMessage(item, selected, section));
        }
      } else {
        content = [getUpdateMessage(section, selected)];
      }
      content = content.filter(item => item !== undefined);
      const contentUpdate = content.filter(item => item !== "");
      if (contentUpdate.length) {
        setBannerAlert({
          'title': 'You should update section to laster version!',
          'tone': 'info',
          'content': contentUpdate
        });
      }

      return content.length ? true : false;
    }
    return false;
  }, [selected, options]);

  const [updateAction, { data:dataUpdate, loading:dataUpdateL, error:dataUpdateE }] = useMutation(UPDATE_ASSET_MUTATION, {

  });
  const [deleteAction, { data:dataDelete, loading:dataDeleteL, error:dataDeleteE }] = useMutation(DELETE_ASSET_MUTATION, {

  });

  const handleUpdate = useCallback(async () => {
    await updateAction({
      variables: {
        theme_id: selected,
        key: section?.url_key
      }
    });
  }, [selected]);
  const handleDelete = useCallback(async () => {
    await deleteAction({
      variables: {
        theme_id: selected,
        key: section?.url_key
      }
    });
  }, [selected]);

  useEffect(() => {
    if (dataUpdate && dataUpdate.updateAsset) {
      const updateSuccess = dataUpdate.updateAsset;

      if (updateSuccess.length) {
        setBannerAlert({
          'title': `Section installed successfully. Go to theme editor to use this section.`,
          'tone': 'success',
          'action': {content: 'Customize', icon: WrenchIcon},
          'content': updateSuccess.map(item => {
            return {message: 'Add successfully the section ' + item.name};
          })
        });
      } else {
        setBannerAlert({
          'title': `Error`,
          'tone': 'critical'
        });
      }
    }
  }, [dataUpdate]);
  useEffect(() => {
    if (dataDelete) {
      toast.show('Deleted');
    }
  }, [dataDelete]);
  useEffect(() => {
    if (dataUpdateE) {
      setBannerAlert({
        'title': dataUpdateE.message,
        'tone': 'critical',
        'content': dataUpdateE.graphQLErrors ?? []
      });
    }
  }, [dataUpdateE]);

  return (
    themes &&
    <BlockStack gap='200'>
      {bannerAlert &&
        <Box>
          <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
        </Box>
      }

      <Text variant='bodySm' fontWeight='bold'>Choose theme for installation:</Text>

      <InlineGrid columns={fullWith ? 1 : {sm: 1, md: ['twoThirds', 'oneThird']}} gap={200} alignItems='center'>
        <div>
          {
            typeSelect
            ? <Select
              labelInline
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            : <OptionList
              onChange={handleSelectChange}
              options={options}
              selected={selected}
            />
          }
        </div>
        <div>
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
              variant='primary'
              tone="critical"
              disabled={section.installed ? !installed : true}
              loading={dataDeleteL}
              fullWidth
            >
              Delete from theme
            </Button>
          </InlineGrid>
        </div>
      </InlineGrid>
    </BlockStack>
  );
}

export default memo(ModalInstallSection);
