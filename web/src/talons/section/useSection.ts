import { useParams } from 'react-router-dom';
import { useSectionPurchase } from '~/hooks/useSectionPurchase';
import { useCallback, useMemo } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import { SECTION_QUERY, SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { THEMES_QUERY } from '~/queries/section-builder/theme.gql';
import type { ApolloQueryResult } from '@apollo/client/core/types';

type SectionImage = {
  src: string;
  alt: string;
}
type SectionActions = {
  install: boolean;
  purchase: boolean;
  plan: boolean;
};
export type Install = {
  theme_id: string;
  product_version: string
}
export type Interval = {
  interval: string;
  amount: number;
}
export interface PricingPlan {
  id: string;
  status: boolean;
  code: string;
  name: string;
  prices: Interval[];
  currency: string;
  description: string;
  sort_order: number;
}
type Category = {
  id: string;
  name: string;
};
export interface SectionDataInterface {
  __typename: string;
  id: string;
  entity_id: string;
  name: string;
  description: string;
  price: number;
  version: string;
  is_enable: boolean;
  plan_id: string;
  demo_link: string;
  images: SectionImage[];
  url_key: string;
  categories: string[] | null;
  categoriesV2: Category[] | null;
  tags: string[] | null;
}
export type SectionData = SectionDataInterface & {
  actions: SectionActions;
  installed: Install[];
  pricing_plan: PricingPlan | null | undefined;
  version: String;
  release_note: String;
  src: String
};
export type GroupSection = SectionDataInterface & {
  child_ids: string[];
}
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
  themes: ThemeData[] | [];
  section: SectionData | {};
  sectionError: ApolloError | undefined;
  loadingWithoutData: boolean;
};

export const useSection = (): SectionTalon => {
  const { key } = useParams();
  const { purchaseSection, loading: purchaseLoading, error: purchaseError } = useSectionPurchase();

  const { data:loadedSection, loading: sectionLoading, error: sectionError } = useQuery(SECTION_V2_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: key
    }
  });
  const section = useMemo(() => {
    return loadedSection?.[SECTION_V2_QUERY_KEY];
  }, [loadedSection]);
  // const { data: loadedSection, loading: sectionLoading, error: sectionError } = useQuery(SECTION_QUERY, {
  //   fetchPolicy: "cache-and-network",
  //   variables: { key }
  // });
  // const section = useMemo(() => {
  //   return loadedSection?.getSection || {};
  // }, [loadedSection]);
  const { data:themesData, loading:themesL, error:themesE } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: Boolean(!section?.entity_id),
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
    themes,
    section,
    sectionError,
    loadingWithoutData: sectionLoading && !loadedSection,
  };
};