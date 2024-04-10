import { useQuery } from '@apollo/client';
import { GROUP_SECTION_QUERY, SECTIONS_QUERY, SECTION_V2_QUERY } from '~/queries/section-builder/product.gql';
import { useParams } from 'react-router-dom';
import { useSectionPurchase } from '~/hooks';
import { useCallback, useMemo } from 'react';

export const useGroupSection = () => {
  const { key } = useParams();
  const { purchaseSection, loading: purchaseLoading, error: purchaseError } = useSectionPurchase();
  const { data, loading: groupSectionLoading, error: groupSectionError } = useQuery(SECTION_V2_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { key }
  });
  const groupSection = useMemo(() => data?.section || {}, [data]);
  const { data: groupChildSections, loading: childSectionLoading, error: childSectionError } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {
        product_id: groupSection?.child_ids ?? []
      },
      pageSize: 99,
      currentPage: 1
    },
    skip: !Array.isArray(groupSection?.child_ids) || groupSection?.child_ids?.length === 0,
  });
  const childSections = useMemo(() => groupChildSections?.getSections?.items || [], [groupChildSections]);
  const handlePurchase = useCallback(async () => {
    if (!groupSection.entity_id) return;
    await purchaseSection(groupSection);
  }, [groupSection]);
  const loadingWithoutData = useMemo(() => {
    return groupSectionLoading && Object.keys(groupSection).length === 0;
  }, [groupSectionLoading, groupSection]);

  return {
    groupSection,
    groupSectionLoading,
    groupSectionError,
    childSections,
    handlePurchase,
    purchaseLoading,
    purchaseError,
    childSectionLoading,
    childSectionError,
    loadingWithoutData,
  };
}
