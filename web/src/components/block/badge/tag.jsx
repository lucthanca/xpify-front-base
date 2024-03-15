import { memo } from "react";
import { Badge, InlineStack } from "@shopify/polaris";

function BadgeTag({tags}) {
  return (
    <InlineStack gap={200} blockAlign='start'>
      {
        tags.map(tag => (
          <Badge key={tag}><div className='pointer'>#{tag}</div></Badge>
        ))
      }
    </InlineStack>
  );
}

export default memo(BadgeTag);