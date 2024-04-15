import React from 'react';
import { useGroupSection } from '~/talons/groups/useGroupSection';
import Skeleton from '~/components/SectionDetails/GroupSection/skeleton';
const LazyGroupSection = React.lazy(() => import('./groupSectionDetails'));

const GroupSection = props => {
  const talonProps = useGroupSection();
  const {
    groupSectionLoading: sectionLoading,
    loadingWithoutData,
  } = talonProps;

  if (loadingWithoutData) return <Skeleton />;

  return (
    <React.Suspense fallback={<Skeleton />}>
      <LazyGroupSection {...talonProps} {...props} />
    </React.Suspense>
  );
};

export default React.memo(GroupSection);
