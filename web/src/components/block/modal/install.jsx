import {useState, useCallback, memo, useEffect, useMemo} from 'react';
import {
  Badge,
  BlockStack,
  Box,
  Button,
  CalloutCard,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Modal,
  SkeletonBodyText,
  SkeletonDisplayText,
  Text,
  Tooltip
} from '@shopify/polaris';
import {
  PaymentIcon,
  BillIcon,
  CashDollarIcon,
  UploadIcon,
  WrenchIcon,
  ViewIcon,
  CheckIcon
} from '@shopify/polaris-icons';
import { useQuery, useMutation } from "@apollo/client";
import ModalInstallSection from '~/components/product/manage'
import GallerySlider from '~/components/splide/gallery';
import BannerDefault from '~/components/block/banner/alert';
import BadgeTag from '~/components/block/badge/tag';
import { SECTION_QUERY, SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { REDIRECT_BILLING_PAGE_MUTATION } from "~/queries/section-builder/other.gql";
import { useRedirectPlansPage, useRedirectSectionPage } from '~/hooks/section-builder/redirect';

function ModalInstall({section, url_key, setSectionDetail, isShowPopup, setIsShowPopup}) {
  const { data:sectionDetail, refetch:sectionDetailReload } = useQuery(SECTION_V2_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: url_key,
      skip: !url_key,
    }
  });
  const product = useMemo(() => {
    return sectionDetail?.[SECTION_V2_QUERY_KEY];
  }, [sectionDetail]);
  useEffect(() => {
    setSectionDetail(product);
  }, [product]);

  return (
    <Modal
        open={isShowPopup}
        onClose={() => {setIsShowPopup(prev => !prev)}}
        title={`Install "${product?.name ?? ''}" to theme`}
      >
        <Modal.Section>
          <BlockStack gap='400'>
            <ModalInstallSection section={product} reloadSection={sectionDetailReload} />
          </BlockStack>
        </Modal.Section>
      </Modal>
  );
}

export default memo(ModalInstall);
