import { useParams } from 'react-router-dom';
import { useSectionPurchase } from '~/hooks/useSectionPurchase';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { SECTION_QUERY } from '~/queries/section-builder/product.gql';
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';
import type { ApolloQueryResult } from '@apollo/client/core/types';
import { useRelatedProducts } from '~/talons/relatedProducts/useRelatedProducts';

export type SectionData = {
  entity_id: string;
  name: string;
  description: string;
  price: number;
  version: string;
  is_enable: string;
};
export type ThemeData = {
  id: string;
  name: string;
  role: string;
  previewable: string;
  processing: string;
  admin_graphql_api_id: string;
};

export type SectionTalon = {
  handlePurchase: () => Promise<void>;
  purchaseLoading: boolean;
  sectionLoading: boolean;
  reloadSection: () => Promise<ApolloQueryResult<SectionData>>;
  themes: ThemeData[] | [];
  section: SectionData | {};
  relatedProducts: SectionData[];
};

export const useSection = (): SectionTalon => {
  const { key } = useParams();
  const { purchaseSection, loading: purchaseLoading, error: purchaseError } = useSectionPurchase();
  const { products: relatedProducts } = useRelatedProducts();

  const { data: loadedSection, loading: sectionLoading, error: sectionE, refetch: reloadSection } = useQuery(SECTION_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { key }
  });
  const section = useMemo(() => {
    return loadedSection?.getSection || {};
  }, [loadedSection]);
  const { data:themesData, loading:themesL, error:themesE } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const themes = useMemo(() => themesData?.getThemes || [], [themesData]);
  const handlePurchase = useCallback(async () => {
    if (!section.entity_id) return;
    await purchaseSection(section);
  }, [section]);

  return {
    handlePurchase,
    purchaseLoading,
    sectionLoading,
    reloadSection,
    themes,
    section,
    relatedProducts,
  };
};
