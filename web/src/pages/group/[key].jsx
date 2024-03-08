import { memo } from 'react';
import GroupSectionDetails from '~/components/SectionDetails/GroupSection';

const GroupView = props => {
  return <GroupSectionDetails {...props} />;
};

export default memo(GroupView);
