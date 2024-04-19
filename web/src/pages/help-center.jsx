import { memo } from "react";
import {
  Page,
  Layout,
  BlockStack
} from "@shopify/polaris";
import { useQuery } from "@apollo/client";
import SkeletonFaq from "~/components/skeleton/faq";
import CollapsibleDefault from "~/components/block/collapsible/faq";
import { FAQS_QUERY } from "~/queries/section-builder/faq.gql";
import { useBackPage } from "~/hooks/section-builder/redirect";
import Footer from "~/components/block/footer";

function Faq() {
  const { data:faqs } = useQuery(FAQS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const handleBackPage = useBackPage();

  return (
    <Page
      title="Frequently asked questions"
      backAction={{onAction: handleBackPage}}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={200}>
            {
              faqs?.getFaqs !== undefined
              ? faqs.getFaqs.map((item, key) => {
                return <CollapsibleDefault key={key} {...item} />;
              })
              : <SkeletonFaq total={5} />
            }
          </BlockStack>
        </Layout.Section>
      </Layout>

      <Footer />
    </Page>
  );
}

export default memo(Faq);