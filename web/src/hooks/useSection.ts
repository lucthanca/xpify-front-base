import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import type { ApolloError, DocumentNode } from '@apollo/client';
import { useMemo, useState, useEffect } from 'react';
import type { Section } from '~/@types';

type QueryData = {
  [key: string]: Section,
}

type UseSectionProps = {
  key: string | undefined;
  query?: DocumentNode;
  queryKey?: string;
};

export type UseSectionTalon = {
  section: Section | undefined,
  loadingWithoutData: boolean,
  loading: boolean,
  error: ApolloError | undefined,
};

export const useSection = (props: UseSectionProps): UseSectionTalon => {
  const {
    key,
    query = SECTION_V2_QUERY,
    queryKey = SECTION_V2_QUERY_KEY,
  } = props;
  const apolloClient = useApolloClient();
  const cache = apolloClient.cache;
  const [prevSection, setPrevSection] = useState<Section | undefined>(undefined);
  /**
   * SectionFragmets này được dùng để lưu data từ trong cache ngay khi networkStatus thay đổi
   */
  const [sectionFragments, setSectionFragments] = useState<Partial<Section>>();
  const { data, loading, error, networkStatus } = useQuery<QueryData>(query, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { key },
    skip: !key,
    onCompleted: (data) => {
      if (data?.[queryKey]) {
        setPrevSection(data[queryKey]);
      }
    },
    notifyOnNetworkStatusChange: true,
  });

  const section1: Section | undefined = useMemo(() => {
    return data?.[queryKey] || prevSection;
  }, [data]);

  /**
   * Khi networkStatus thay đổi thì sẽ đọc data từ cache và set vào sectionFragments
   * Phải hướng tới cách tiếp cận này là bởi data trả về từ useQuery không lấy theo data từ cache ngay lập tức (không hiểu tai sao)
   * Thế nên tạm thời ngay khi networkStatus thay đổi thì sẽ đọc data từ cache và set vào sectionFragments
   */
  useEffect(() => {
    if (!key || !section1?.__typename) return;
    const data =cache.readFragment<Partial<Section>>({
      id: cache.identify({ __typename: section1.__typename, url_key: key }),
      fragment: gql`
        fragment SectionFragment on Section {
          url_key
          actions {
            purchase
            install
          }
          installed {
            id
            theme_id
            product_version
          }
        }
      `
    });
    console.log('effect', { data });
    if (data) {
      setSectionFragments(data);
    }
  }, [networkStatus]);

  const section = useMemo<Section | undefined>(() => {
    if (!sectionFragments) return section1;
    if (!section1) return undefined;
    return { ...section1, ...sectionFragments };
  }, [section1, sectionFragments]);

  return {
    section,
    loadingWithoutData: loading && !data,
    loading,
    error,
  };
};
