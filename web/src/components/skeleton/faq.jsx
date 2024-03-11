import { memo } from "react";
import {
  Card,
  InlineStack,
  SkeletonBodyText
} from "@shopify/polaris";

function SkeletonFaq({ total }) {
  const skeleton = [];
  for (let i = 1; i <= total; i++) {
    skeleton.push(
      <Card key={i}>
        <InlineStack>
          <SkeletonBodyText lines={1}></SkeletonBodyText>
        </InlineStack>
      </Card>
    );
  }

  return skeleton;
}

export default memo(SkeletonFaq);