import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '@shopify/app-bridge-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_ASSET_MUTATION, UPDATE_ASSET_MUTATION } from '~/queries/section-builder/asset.gql';
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Draft',
  'demo': 'Trial', // Không edit code được loại theme này
  'development': 'Dev',
};

export type ThemeData = {
  id: string;
  name: string;
  role: 'main' | 'unpublished' | 'demo' | 'development';
  previewable?: string;
  processing?: string;
  admin_graphql_api_id?: string;
};

interface BannerAlert {
  title?: string;
  tone?: string;
  content?: any;
  urlSuccessEditTheme?: string;
  isSimple?: boolean
}

type UseManageProps = {
  section: any;
  typeSelect: boolean;
};

type UseManageTalon = {
  section: any,
  installed: boolean,
  handleUpdate: () => void,
  handleDelete: () => void,
  dataUpdateLoading: boolean,
  dataDeleteLoading: boolean,
  bannerAlert: BannerAlert | undefined,
  setBannerAlert: any,
  options: object,
  selected: string,
  handleSelectChange: any,
  currentThemeSelected: ThemeData,
  executeSection: string
};

export const useManage = (props: UseManageProps): UseManageTalon => {
  const { section, typeSelect } = props;
  const [selected, setSelected] = useState("");
  const [bannerAlert, setBannerAlert] = useState<BannerAlert | undefined>(undefined);
  const [executeSection, setExecuteSection] = useState<string>('');
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

  const handleSelectChange = useCallback((value: any) => {
    setSelected(typeSelect ? value : value[0]);
  }, []);
  const getUpdateMessage = useCallback((item: any, currentTheme: any, parent: any = null) => {
    const installVersion = item?.installed && item.installed.find((item: any) => item.theme_id == currentTheme)?.product_version;
    if (installVersion) {
      if (installVersion != item.version) {
        return {message: `Update ${item.name} from v${installVersion} to v${item.version}`};
      } else {
        return '';
      }
    } else {
      if (parent?.child_ids) {
        return {message: `Install ${item.name}`};
      }
    }

    return '';
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

  const options = useMemo(() => {
    if (!themes?.length
      || !section?.url_key
      || (section?.child_ids && !childSections?.length)
    ) {
      return {};
    }

    let result = themes.map((theme: ThemeData) => {
      if (theme.role == 'demo') { // Demo theme không thể thêm section
        return false;
      }

      var status = 'Not installed';
      const installedInTheme = section?.installed && section.installed.find((item: any) => item.theme_id == theme.id);

      if (installedInTheme) {
        var content = [];
        if (childSections.length) {
          content = childSections.map((item: any) => getUpdateMessage(item, theme.id, section))
        } else {
          content = [getUpdateMessage(section, theme.id)];
        }

        content = content.filter((item: string) => item !== undefined);
        if (content.length) {
          status = 'Installed';
        }
        content = content.filter((item: string) => item !== "");
        if (content.length) {
          status = 'Should update';
        }
      }

      return ({
        value: theme.id,
        label: `${theme.name} (${titleRoleTheme[theme.role] ?? theme.role}) - ${status}`
      });
    });

    return result.filter((item: any) => item?.value);
  }, [section, themes, childSections]);
  useMemo(() => {
    if (themes && themes.length && section?.entity_id) {
      setSelected(themes[0]['id'] ?? "");
    }
  }, [themes, section?.entity_id]);
  const installed = useMemo(() => {
    setBannerAlert(undefined);
    if (!section?.installed) {
      return false;
    }

    const installedInTheme = section?.installed && section.installed.find((item: any) => item.theme_id == selected);

    if (installedInTheme) {
      var content = [];
      if (childSections.length) {
        content = childSections.map((item: any) => getUpdateMessage(item, selected, section));
      } else {
        content = [getUpdateMessage(section, selected)];
      }
      content = content.filter((item: any) => item !== undefined);
      const contentUpdate = content.filter((item: any) => item !== "");
      if (contentUpdate.length) {
        let title = "";
        if (childSections.length) {
          if (contentUpdate.length > 1) {
            title = "Re-install group to update these sections:";
          } else {
            title = "Re-install group to update this section:";
          }
        } else {
          title = "Re-install this section to update it to the latest version";
        }

        setBannerAlert({
          'title': title,
          'tone': 'info',
          'content': contentUpdate
        });
      }

      return content.length ? true : false;
    }
    return false;
  }, [selected, options]);

  const [updateAction, { data:dataUpdate, loading:dataUpdateLoading, error:dataUpdateError }] = useMutation(UPDATE_ASSET_MUTATION, {});
  const [deleteAction, { data:dataDelete, loading:dataDeleteLoading, error:dataDeleteError }] = useMutation(DELETE_ASSET_MUTATION, {});

  const handleUpdate = useCallback(async () => {
    setExecuteSection(section?.url_key);
    await updateAction({
      variables: {
        theme_id: selected,
        key: section?.url_key
      }
    });
    if (!dataUpdateError) {
      toast.show('Installed successfully');
    } else {
      toast.show('Installed fail', { isError: true });
    }
  }, [selected, section?.entity_id]);
  const handleDelete = useCallback(async () => {
    setExecuteSection(section?.url_key);
    await deleteAction({
      variables: {
        theme_id: selected,
        key: section?.url_key
      }
    });
    if (!dataDeleteError) {
      toast.show('Deleted successfully');
    } else {
      toast.show('Deleted fail', { isError: true });
    }
  }, [selected, section?.entity_id]);

  const currentThemeSelected = useMemo(() => {
    return themes.find((item: any) => item.id == selected);
  }, [selected]);

  useEffect(() => {
    if (dataUpdate && dataUpdate.updateAsset) {
      const updateSuccess = dataUpdate.updateAsset;

      if (updateSuccess.length) {
        setBannerAlert({
          'urlSuccessEditTheme': urlEditTheme,
          'isSimple': !section?.child_ids?.length,
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
    if (dataUpdateError) {
      setBannerAlert({
        'title': dataUpdateError.message,
        'tone': 'critical',
        'content': dataUpdateError.graphQLErrors ?? []
      });
    }
  }, [dataUpdateError]);

  return {
    section,
    installed,
    handleUpdate,
    handleDelete,
    dataUpdateLoading,
    dataDeleteLoading,
    bannerAlert,
    setBannerAlert,
    options,
    selected,
    handleSelectChange,
    currentThemeSelected,
    executeSection
  };
};
