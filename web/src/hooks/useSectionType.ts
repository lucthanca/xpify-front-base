import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const SECTION_TYPE_SIMPLE = 1;
const SECTION_TYPE_GROUP = 2;

export const useSectionType = () => {
  const [searchParams] = useSearchParams();
  const sectionType = useMemo(() => {
    const isMyLibrary = location.pathname === '/my-library';
    const isGroup = searchParams.get('type') === 'group';
    const isGroups = location.pathname === '/groups';

    return {
      sectionType: (isGroup || isGroups) ? SECTION_TYPE_GROUP : SECTION_TYPE_SIMPLE,
      isOwned: isMyLibrary,
    };
  }, [searchParams]);

  return {
    sectionType,
  };
};
