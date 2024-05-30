import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import { memo } from 'react';

function VideoGuideInstall() {
  const handleThumbnailClick = () => {
    window.open('https://www.loom.com/share/a48d694ef7ab4f0a93b8b5e9e45d6989', '_blank');
  };

  return (
    <MediaCard
      size='small'
      title="Add sections and groups to your theme"
      description='Follow this quick guide to select your missing parts to complete your store by using our sections and groups.'
    >
      <VideoThumbnail
        videoLength={155}
        thumbnailUrl="https://api.omnithemes.com/media/section_builder/image/welcome.jpg"
        onClick={handleThumbnailClick}
      />
    </MediaCard>
  );
}

export default memo(VideoGuideInstall);