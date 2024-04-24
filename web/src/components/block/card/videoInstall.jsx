import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import { memo } from 'react';

function VideoGuideInstall() {
  const handleThumbnailClick = () => {
    window.open('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', '_blank');
  };

  return (
    <MediaCard
      size='small'
      title="Add sections and groups to your theme"
    >
      <VideoThumbnail
        videoLength={62}
        thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
        onClick={handleThumbnailClick}
      />
    </MediaCard>
  );
}

export default memo(VideoGuideInstall);