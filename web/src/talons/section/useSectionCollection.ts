import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { PRICING_PLANS_QUERY, SORT_OPTIONS_QUERY } from '~/queries/section-builder/other.gql';
import { CATEGORIES_QUERY } from '~/queries/section-builder/category.gql';
import { TAGS_QUERY } from '~/queries/section-builder/tag.gql';
import { PricingPlan, SectionData } from '~/talons/section/useSection';

type SelectOption = {
  value: string;
  label: string;
}
type Category = {
  entity_id: string;
  name: string;
}
type Tag = {
  entity_id: string;
  name: string;
}

export const useSectionCollection = () => {
  const { t } = useTranslation();
  const [searchFilter, setSearchFilter] = useState('');
  const [sortSelected, setSortSelected] = useState(['main_table.name asc']);
  const [planFilter, setPlanFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [tagFilter, setTagFilter] = useState(undefined);
  const [priceFilter, setPriceFilter] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: sectionsData, loading:sectionsL, error:sectionsE } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      search: searchFilter,
      filter: {
        category_id: categoryFilter ?? [],
        tag_id: tagFilter ?? [],
        plan_id: planFilter ?? [],
        price: priceFilter ? {
          min: priceFilter[0],
          max: priceFilter[1]
        } : {}
      },
      sort: sortSelected ? (([column, order]) => ({ column, order }))(sortSelected[0].split(' ')) : {},
      pageSize: 12,
      currentPage: currentPage
    }
  });
  const { data: pricingPlans, loading: loadingPricingPlans, error: errorPricingPlans } = useQuery(PRICING_PLANS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: tags, loading: loadingTags, error: errorTags } = useQuery(TAGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: sortOptionsdt, loading: loadingSortOptions, error: errorSortOptions } = useQuery(SORT_OPTIONS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const pricingPlanOptions: SelectOption[] = useMemo(() => {
    return pricingPlans?.getPricingPlans?.plan ? pricingPlans.getPricingPlans.plan.map((item: PricingPlan) => ({
      value: item.id,
      label: item.name
    })) : [];
  }, [pricingPlans]);
  const categoriesOptions: SelectOption[] = useMemo(() => {
    return categories?.getCategories ? categories.getCategories.map((item: Category) => ({
      value: item.entity_id,
      label: item.name
    })) : [];
  }, [categories]);
  const tagOptions: SelectOption[] = useMemo(() => {
    return tags?.getTags ? tags.getTags.map((item: Tag) => ({
      value: item.entity_id,
      label: item.name
    })) : [];
  }, [tags]);
  const sortOptions: SelectOption[] = useMemo(() => {
    return sortOptionsdt?.getSortOptions ?? [];
  }, [sortOptionsdt]);
  const sections: SectionData[] | null | undefined = useMemo(() => {
    return sectionsData?.getSections?.items;
  }, [sectionsData]);
  const sectionCollectionPageInfo = useMemo(() => {
    return sectionsData?.getSections?.page_info;
  }, [sectionsData]);
  return {
    searchFilter,
    setSearchFilter,
    planFilter,
    setPlanFilter,
    categoryFilter,
    setCategoryFilter,
    tagFilter,
    setTagFilter,
    priceFilter,
    setPriceFilter,
    sortSelected,
    setSortSelected,
    pricingPlanOptions,
    categoriesOptions,
    tagOptions,
    sortOptions,
    sections,
    currentPage,
    setCurrentPage,
    sectionCollectionPageInfo,
  };
};
