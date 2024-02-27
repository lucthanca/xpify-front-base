import { useTranslation } from "react-i18next";

export const useNavigationLinks = () => {
  const { t } = useTranslation();
  return [
    {
      label: t('NavigationMenu.sections'),
      destination: '/sections',
    },
    {
      label: t('NavigationMenu.section'),
      destination: '/section',
    },
    {
      label: t('NavigationMenu.faq'),
      destination: '/faq',
    },
    {
      label: "Test",
      destination: '/test',
    }
  ];
};
