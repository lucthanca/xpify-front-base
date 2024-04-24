import { useTranslation } from "react-i18next";

export const useNavigationLinks = () => {
  const { t } = useTranslation();
  return [
    {
      label: t('NavigationMenu.sections'),
      destination: '/sections',
    },
    {
      label: t('NavigationMenu.groups'),
      destination: '/groups',
    },
    {
      label: t('NavigationMenu.myLibrary'),
      destination: '/my-library',
    },
    // {
    //   label: t('NavigationMenu.plans'),
    //   destination: '/plans',
    // },
    // {
    //   label: t('NavigationMenu.helpCenter'),
    //   destination: '/help-center',
    // }
  ];
};
