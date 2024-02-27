import {
  Page,
  Layout,
  Text
} from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {gql, useQuery, useMutation} from "@apollo/client";

import '~/assets/style.css';
import Search from '~/components/input/search';
import MediaTutorial from '~/components/media/tutorial';
import ProductList from '~/components/product/list';
import ModalProduct from '~/components/modal/product';
import Card from "~/components/product/card";

const graphQlGetSections = gql`
  query GET(
    $search: String,
    $filter: SectionFilterInput,
    $pageSize: Int = 20,
    $currentPage: Int = 1
  ) {
    getSections(
      search: $search,
      filter: $filter,
      pageSize: $pageSize,
      currentPage: $currentPage
    ) {
      items {
        entity_id
        is_enable
        plan_id
        name
        images {
          src
        }
        url_key
        price
        src
        version
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;

function HomePage() {
  const { t } = useTranslation();
  const [filterSearch, setFilterSearch] = useState('');
  const { data, loading, error } = useQuery(graphQlGetSections, {
    fetchPolicy: "cache-and-network",
    variables: {
      search: filterSearch,
      pageSize: 8,
      currentPage: 1
    }
  });

  const [isShowPopup, setIsShowPopup] = useState(false);
  const handleShowModal = useCallback(() => {
    setIsShowPopup(!isShowPopup);
  }, []);

  console.log('re-render-homePage');
  return (
    <Page fullWidth>
      <Layout>
        {/* <Layout.Section>
          <Text variant="headingLg" as="h2">{t("HomePage.tutorialTitle")}</Text>
          <MediaTutorial />
        </Layout.Section> */}

        <Layout.Section>
          <Text variant="headingLg" as="h2">{t("HomePage.sectionTitle")}</Text>

          <Card>
            <Search filterSearch={filterSearch} setFilterSearch={setFilterSearch} />
            <br></br>
            {(!loading || data?.getSections) && <ProductList items={data.getSections?.items ?? []} handleShowModal={handleShowModal} />}
          </Card>
        </Layout.Section>

        <ModalProduct isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
      </Layout>
    </Page>
  );
}

export default HomePage;
