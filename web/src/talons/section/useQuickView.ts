import { useCallback, useState } from 'react';
import { usePurchase } from '~/hooks/section-builder/purchase';
import { useRedirectSectionPage } from '~/hooks/section-builder/redirect';
import { useSection, UseSectionTalon } from '~/hooks/useSection';

type UseQuickViewProps = {
  key: string;
  onClose: () => void
};

type UseQuickViewTalon = UseSectionTalon & {
  handlePurchase: () => void,
  navigateToSectionPage: () => void,
  bannerAlert: any,
  setBannerAlert: any,
  purchaseLoading: boolean,
};

export const useQuickView = (props: UseQuickViewProps): UseQuickViewTalon => {
  const { key, onClose } = props;
  const { section, loadingWithoutData, loading, error } = useSection({ key });

  console.log('Run useQuickView:  + ' + key + '| error: ' + error);
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const { handlePurchase: purchase, purchaseLoading} = usePurchase();

  const handlePurchase = useCallback(() => {
    if (!section) return;
    purchase(section);
  }, [section, purchase])
  const handleRedirectProductPage = useRedirectSectionPage();
  const navigateToSectionPage = useCallback(async () => {
    if (!key) return;
    await onClose();
    handleRedirectProductPage(key);
  }, [handleRedirectProductPage, key])
  return {
    section,
    loadingWithoutData,
    loading,
    error,
    handlePurchase,
    navigateToSectionPage,
    bannerAlert,
    setBannerAlert,
    purchaseLoading,
  };
};
