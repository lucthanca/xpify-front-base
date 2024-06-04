import { memo } from "react";
import {
  Page,
  Layout,
  BlockStack,
  Card
} from "@shopify/polaris";
import { useQuery } from "@apollo/client";
import SkeletonFaq from "~/components/block/skeleton/faq";
import CollapsibleFaq from "~/components/block/collapsible/faq";
import { FAQS_QUERY } from "~/queries/section-builder/faq.gql";
import { useBackPage } from "~/hooks/section-builder/redirect";
import Footer from "~/components/block/footer";
import { Splide, SplideSlide } from "@splidejs/react-splide";

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
          <Splide options={{
            perPage: 2,
            gap: '1rem',
            pagination: false,
            autoplay: true,
            interval: 3000,
            rewind: true,
            type: "loop"
          }}>
            <SplideSlide>
              <div className='sliderItemCardRoot'>
                <Card>
                  111
                </Card>
              </div>
            </SplideSlide>
            <SplideSlide>
              <div className='sliderItemCardRoot'>
                <Card>
                  222
                </Card>
              </div>
            </SplideSlide>
            <SplideSlide>
              <div className='sliderItemCardRoot'>
                <Card>
                  333
                </Card>
              </div>
            </SplideSlide>
            <SplideSlide>
              <div className='sliderItemCardRoot'>
                <Card>
                  444
                </Card>
              </div>
            </SplideSlide>
          </Splide>
        </Layout.Section>
      </Layout>

      <Footer />
    </Page>
  );
}

export default memo(Faq);