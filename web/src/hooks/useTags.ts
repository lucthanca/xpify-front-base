import { useQuery } from '@apollo/client';
import { TAGS_QUERY, TAGS_QUERY_KEY } from '~/queries/section-builder/tag.gql';
import { useMemo } from 'react';

export const useTags = () => {
  const { data: tags } = useQuery(TAGS_QUERY, { fetchPolicy: "cache-and-network" });
  const tagOptions = useMemo(() => {
    return tags?.[TAGS_QUERY_KEY] ? tags[TAGS_QUERY_KEY].map((item) => ({
      value: item.id,
      label: item.name
    })) : [];
  }, [tags]);
  return {
    tags: tags?.[TAGS_QUERY_KEY] ?? [],
    tagOptions,
  };
};
