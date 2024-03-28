import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { ApolloError, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { SectionData } from '~/talons/section/useSection';
import { usePurchase } from '~/hooks/section-builder/purchase';
import { useRedirectSectionPage } from '~/hooks/section-builder/redirect';

type UseQuickViewProps = {
  key: string;
};

type UseQuickViewTalon = {
  section: SectionData | undefined,
  loadingWithoutData: boolean,
  loading: boolean,
  error: ApolloError | undefined,
  handlePurchase: () => void,
  handleRedirectProductPage: () => void,
  bannerAlert: any,
  setBannerAlert: any,
  purchaseLoading: boolean,
};
type QueryData = {
  [SECTION_V2_QUERY_KEY]: SectionData;
};

export const useQuickView = (props: UseQuickViewProps): UseQuickViewTalon => {
  const { key } = props;
  const { data, loading, error } = useQuery<QueryData>(SECTION_V2_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: { key },
    skip: !key,
  });

  const section: SectionData | undefined = useMemo(() => {
    return data?.[SECTION_V2_QUERY_KEY];
  }, [data]);

  const [bannerAlert, setBannerAlert] = useState(undefined);
  const { handlePurchase: purchase, purchaseLoading} = usePurchase();

  const handlePurchase = useCallback(() => {
    if (!section) return;
    purchase(section);
  }, [section, purchase])
  const handleRedirectProductPage = useRedirectSectionPage();
  const loadingWithoutData = loading && !data;
  return {
    section,
    loadingWithoutData,
    loading,
    error,
    handlePurchase,
    handleRedirectProductPage,
    bannerAlert,
    setBannerAlert,
    purchaseLoading,
  };
};
