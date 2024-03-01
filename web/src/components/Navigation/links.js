import { useTranslation } from "react-i18next";

export const useNavigationLinks = () => {
  const { t } = useTranslation();
  return [
    {
      label: t('NavigationMenu.sections'),
      destination: '/sections',
    },
    {
      label: t('NavigationMenu.group'),
      destination: '/group',
    },
    {
      label: t('NavigationMenu.plan'),
      destination: '/plan',
    },
    {
      label: t('NavigationMenu.faq'),
      destination: '/faq',
    }
  ];
};
