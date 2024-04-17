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
  Text,
  Link,
  Card,
  Spinner
} from '@shopify/polaris';
import { NoteIcon, WrenchIcon } from '@shopify/polaris-icons';
import { useToast } from '@shopify/app-bridge-react';
import { useQuery, useMutation } from "@apollo/client";
import ModalConfirm from '~/components/block/modal/confirm';
import BannerDefault from '~/components/block/banner/alert';
import { UPDATE_ASSET_MUTATION, DELETE_ASSET_MUTATION } from "~/queries/section-builder/asset.gql";
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { MY_SHOP } from '~/queries/section-builder/other.gql';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Trial',
  'development': 'Dev',
};

function ModalInstallSection({section, setCurrentThemeSelected,setConfirmAction, setIsShowConfirm, typeSelect = true, fullWith = true}) {
  const [selected, setSelected] = useState("");
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const [isShowConfirmSelect, setIsShowConfirmSelect] = useState(false);
  const [confirmActionSelect, setConfirmActionSelect] = useState(() => {});
  const toast = useToast();

  const { data:themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section?.entity_id),
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

  const { data: myShop } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });
  const urlEditTheme = useMemo(() => {
    if (myShop?.myShop?.domain && selected) {
      return 'https://' + myShop?.myShop?.domain + '/admin/themes/' + selected + '/editor';
    }
    return '#';
  }, [myShop, selected]);

  useMemo(() => {
    if (themes && themes.length) {
      setSelected(themes[0]['id'] ?? "");
    }
  }, [themes]);
  const options = useMemo(() => {
    if (!themes?.length
      || !section?.url_key
      || (section?.child_ids && !childSections?.length)
    ) {
      return {};
    }

    let result = themes.map(theme => {
      if (theme.role == 'demo') { // Demo theme không thể thêm section
        return false;
      }

      var status = 'Not install';
      const installedInTheme = section?.installed && section.installed.find(item => item.theme_id == theme.id);

      if (installedInTheme) {
        var content = [];
        if (childSections.length) {
          content = childSections.map(item => getUpdateMessage(item, theme.id, section))
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
        label: `${theme.name}(${titleRoleTheme[theme.role] ?? theme.role}) - ${status}`
      });
    });

    return result.filter(item => item?.value);
  }, [section, themes, childSections]);
  const installed = useMemo(() => {
    setBannerAlert(undefined);
    if (!section?.installed) {
      return false;
    }

    const installedInTheme = section?.installed && section.installed.find(item => item.theme_id == selected);

    if (installedInTheme) {
      var content = [];
      if (childSections.length) {
        content = childSections.map(item => getUpdateMessage(item, selected, section));
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

  const [updateAction, { data:dataUpdate, loading:dataUpdateL, error:dataUpdateE }] = useMutation(UPDATE_ASSET_MUTATION, {});
  const [deleteAction, { data:dataDelete, loading:dataDeleteL, error:dataDeleteE }] = useMutation(DELETE_ASSET_MUTATION, {});

  const handleUpdate = useCallback(() => {
    updateAction({
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
    toast.show('Deleted successfully');
  }, [selected]);

  const currentThemeSelected = useMemo(() => {
    return themes.find(item => item.id == selected);
  }, [selected]);

  const confirmDelete = useCallback(() => {
    if (!typeSelect) { // Is modal install list
      setConfirmAction(() => handleDelete);
      setIsShowConfirm(true);
      setCurrentThemeSelected(currentThemeSelected);
    } else {
      setConfirmActionSelect(() => handleDelete);
      setIsShowConfirmSelect(true);
    }
  });

  useEffect(() => {
    if (dataUpdate && dataUpdate.updateAsset) {
      const updateSuccess = dataUpdate.updateAsset;

      if (updateSuccess.length) {
        setBannerAlert({
          'urlSuccessEditTheme': urlEditTheme,
          'tone': 'success'
        });
      } else {
        setBannerAlert({
          'title': `Error. Try later`,
          'tone': 'critical'
        });
      }
    }
  }, [dataUpdate]);
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
    themes.length && options.length
    ? <BlockStack gap='200'>
      {bannerAlert &&
        fullWith
        ? <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
        : <Card padding={0}>
          <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />
        </Card>
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
              onClick={confirmDelete}
              variant='primary'
              tone="critical"
              disabled={section.installed ? !installed : true}
              loading={dataDeleteL}
              fullWidth
            >
              Delete from theme
            </Button>
            <Button
              onClick={handleUpdate}
              variant='primary'
              disabled={!section.actions?.install || !selected}
              loading={dataUpdateL}
              fullWidth
            >
              {installed ? 'Reinstall to theme' : 'Install to theme'}
            </Button>
          </InlineGrid>

          {typeSelect && <ModalConfirm section={section} theme={currentThemeSelected} isOpen={isShowConfirmSelect} setIsOpen={setIsShowConfirmSelect} onConfirm={confirmActionSelect} />}
        </div>
      </InlineGrid>
    </BlockStack>
    : <InlineStack align="center">
      <Spinner accessibilityLabel="loading" size="small" />
    </InlineStack>
  );
}

export default memo(ModalInstallSection);
