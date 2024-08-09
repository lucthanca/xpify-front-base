import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { useToast } from '@shopify/app-bridge-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  UNINSTALL_SECTION_MUTATION,
  UPDATE_ASSET_MUTATION,
} from '~/queries/section-builder/asset.gql';
import { MY_SHOP } from '~/queries/section-builder/other.gql';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import { THEMES_QUERY, THEMES_QUERY_KEY } from '~/queries/section-builder/theme.gql';
import type { ShopifyTheme, Section, Install } from '~/@types';
import { SECTION_TYPE_SIMPLE } from '~/constants';

const titleRoleTheme = {
  'main': 'Live',
  'unpublished': 'Draft',
  'demo': 'Trial', // Không edit code được loại theme này
  'development': 'Dev',
};

interface BannerAlert {
  title?: string;
  tone?: string;
  content?: any;
  urlSuccessEditTheme?: string;
  isSimple?: boolean
}

type UseManageProps = {
  section: Section;
  typeSelect: boolean;
};
type SelectOption = {
  value: string;
  label: string;
};
type UseManageTalon = {
  section: any,
  installed: boolean,
  handleUpdate: () => void,
  handleDelete: () => void,
  dataUpdateLoading: boolean,
  dataDeleteLoading: boolean,
  bannerAlert: BannerAlert | undefined,
  setBannerAlert: (alert: BannerAlert | undefined) => void,
  options?: SelectOption[],
  selected: string,
  handleSelectChange: any,
  currentThemeSelected: ShopifyTheme | undefined,
  executeSection: string,
  step: number,
  getThemeEditUrl: () => string | undefined,
  setStep: (step: number) => void,
  updateNotes: BannerAlert | null,
  primaryActionContent: string,
  primaryActionHandle: () => void,
};


export const STEP_INIT = 1;
export const STEP_COMPLETE = 2;

export const useManage = (props: UseManageProps): UseManageTalon => {
  const { section, typeSelect } = props;
  const interaction = useRef(false);
  const [selected, setSelected] = useState("");
  const [bannerAlert, setBannerAlert] = useState<BannerAlert | undefined>(undefined);
  const [executeSection, setExecuteSection] = useState<string>('');
  // const [urlEditTheme, setUrlEditTheme] = useState<string>('#');
  const toast = useToast();
  const [step, setStep] = useState(STEP_INIT);

  const { data: themesData } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section?.entity_id),
  });
  const themes = useMemo<ShopifyTheme[]>(() => themesData?.[THEMES_QUERY_KEY] || [], [themesData]);
  const childIds = section && 'child_ids' in section && section.child_ids || [];
  const { data: groupChildSections, loading: groupChildrenLoading } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {
        product_id: childIds,
      },
      pageSize: 99,
      currentPage: 1
    },
    skip: !Array.isArray(childIds) || childIds.length === 0,
  });
  const childSections = useMemo(() => groupChildSections?.[QUERY_SECTION_COLLECTION_KEY]?.items || [], [groupChildSections]);

  const handleSelectChange = useCallback((value: any) => {
    setBannerAlert(undefined);
    setSelected(typeSelect ? value : value[0]);
    interaction.current = true;
  }, []);
  const getUpdateMessage = (item: Section, themeId: string | null = null) => {
    if (!item) return;
    if (!Array.isArray(item.installed)) return;
    let targetThemeId = themeId || selected;
    const theme: Install | undefined = item.installed.find((item: Install) => item.theme_id == targetThemeId);
    if (!theme) return;
    if (theme.product_version) {
      if (theme.product_version != item.version) {
        return {message: `Update ${item.name} from v${theme.product_version} to v${item.version}`};
      } else {
        return '';
      }
    } else {
      if (childIds) {
        return {message: `Install ${item.name}`};
      }
    }

    return '';
  };

  const { data: myShop } = useQuery(MY_SHOP, {
    fetchPolicy: "cache-and-network",
  });

  const options = useMemo(() => {
    if (!themes?.length
      || !section?.url_key
      || (childIds.length > 0 && !childSections?.length)
    ) {
      return [];
    }

    return themes.map((theme) => {
      if (theme.role == 'demo') { // Demo theme không thể thêm section
        return null;
      }

      var status = 'Not installed';
      const hasInstalled = Array.isArray(section?.installed);
      const installedInTheme = hasInstalled && section.installed.find((item: Install) => item.theme_id == theme.id);

      if (installedInTheme) {
        var content = [];
        if (childSections.length) {
          content = childSections.map((item: any) => getUpdateMessage(item, theme.id))
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

      return {
        value: theme.id,
        label: `${theme.name} (${titleRoleTheme[theme.role] ?? theme.role}) - ${status}`
      };
    }).filter((item): item is SelectOption => item !== null);
  }, [section, themes, childSections, childIds]);

  const installed = useMemo(() => {
    if (!section?.installed) {
      return false;
    }

    const installedInTheme = section?.installed && section.installed.find((item: any) => item.theme_id == selected);

    if (installedInTheme) {
      var content = [];
      if (childSections.length) {
        content = childSections.map((item: Section) => getUpdateMessage(item));
      } else {
        content = [getUpdateMessage(section)];
      }
      content = content.filter((item: any) => item !== undefined);

      return !!content.length;
    }
    return false;
  }, [selected, options]);

  const updateNotes = useMemo(() => {
    if (!section || groupChildrenLoading || !installed) return null;
    let content = [];
    if (parseInt(section.type_id) === SECTION_TYPE_SIMPLE) {
      content = [getUpdateMessage(section)];
    } else if (childSections.length) {
      content = childSections.map((item: Section) => getUpdateMessage(item))
    } else {
      content = [getUpdateMessage(section)];
    }
    // remove item empty or undefined
    content = content.filter((item: any) => item !== undefined && item !== '');
    if (content.length > 0) {
      let title = 'Re-install this section to update it to the latest version';
      if (childSections.length > 0) {
        title = 'Re-install group to update this section:';
        if (content.length > 1) {
          title = 'Re-install group to update these sections:';
        }
      }
      return {
        'title': title,
        'tone': 'info',
        'content': content,
      };
    }
    return null;
  }, [section, childSections, groupChildrenLoading, installed]);

  const [updateAction, { loading: dataUpdateLoading }] = useMutation(UPDATE_ASSET_MUTATION, {});
  const [deleteAction, { loading: dataDeleteLoading }] = useMutation(UNINSTALL_SECTION_MUTATION, {});

  const getThemeEditUrl= useCallback(() => {
    if (!myShop?.myShop?.domain) return undefined;
    return 'https://' + myShop?.myShop?.domain + '/admin/themes/' + selected + '/editor'
  }, [myShop, selected]);

  const handleUpdate = useCallback(async () => {
    setBannerAlert(undefined);
    setExecuteSection(section?.url_key);
    // setUrlEditTheme('https://' + myShop?.myShop?.domain + '/admin/themes/' + selected + '/editor');
    let alert: BannerAlert;
    try {
      await updateAction({
        variables: {
          theme_id: selected,
          key: section?.url_key
        }
      });
      setStep(STEP_COMPLETE);
      const themeEditorUrl = getThemeEditUrl();
      if (!themeEditorUrl) {
        alert = {
          'title': `Install section to theme successfully.`,
          'tone': 'success'
        };
      } else {
        alert = {
          'urlSuccessEditTheme': themeEditorUrl,
          'isSimple': !childIds.length,
          'tone': 'success'
        };
      }
      toast.show('Installed successfully');
    } catch (e) {
      if (e instanceof ApolloError) {
        alert = {
          'title': e.message,
          'tone': 'critical',
          'content': e.graphQLErrors ?? []
        };
      } else {
        alert = {
          'title': `Something went wrong. Try again later.`,
          'tone': 'critical'
        };
      }
      toast.show('Installed failed', { isError: true });
    }
    Object.keys(alert).length > 0 && setBannerAlert(alert);
  }, [selected, section?.entity_id]);
  const handleDelete = useCallback(async () => {
    try {
      setBannerAlert(undefined);
      setExecuteSection(section?.url_key);
      const result = await deleteAction({
        variables: {
          theme_id: selected,
          key: section?.url_key
        },
      });
      setStep(STEP_COMPLETE);
      if (result.data?.deleteAsset?.length > 0) {
        toast.show('Deleted successfully');
        return;
      }
      throw new Error('Can not delete this section by some reason');
    } catch (e) {
      let alert: BannerAlert;
      if (e instanceof ApolloError) {
        alert = {
          'title': e.message,
          'tone': 'critical',
          'content': e.graphQLErrors ?? []
        };
      } else {
        alert = {
          'title': `Something went wrong. Try again later.`,
          'tone': 'critical'
        };
      }
      Object.keys(alert).length > 0 && setBannerAlert(alert);
    }
  }, [selected, section?.entity_id]);

  const currentThemeSelected = useMemo(() => {
    return themes.find((item: any) => item.id == selected);
  }, [selected]);

  useEffect(() => {
    if (interaction.current) return;
    if (themes && themes.length && section?.entity_id) {
      setSelected(themes[0]['id'] ?? "");
    }
  }, [themes, section?.entity_id]);

  const primaryActionContent = useMemo(() => {
    if (step === STEP_COMPLETE && installed) {
      return 'Go to theme editor';
    }
    if (installed) return 'Reinstall';
    return 'Install'
  }, [step, installed]);

  const primaryActionHandle = () => {
    if (step === STEP_COMPLETE) {
      window.open(getThemeEditUrl(), '_blank');
      return;
    }
    handleUpdate();
  }

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
    executeSection,
    step,
    getThemeEditUrl,
    setStep,
    updateNotes,
    primaryActionContent,
    primaryActionHandle,
  };
};
