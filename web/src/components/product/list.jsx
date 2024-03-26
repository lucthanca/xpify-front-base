import { memo, useMemo, useState } from 'react';
import { BlockStack, InlineGrid, Modal } from '@shopify/polaris';
import ProductCard from '~/components/product/card';
import ModalProduct from '~/components/product/modal';
import ModalInstall from '~/components/block/modal/install';
import EmptySections from '~/components/block/emptyState';

function ProductList({items, columns, isSimple = true}) {
  console.log('re-render-productList');
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isShowPopupInstall, setIsShowPopupInstall] = useState(false);
  const [section, setSection] = useState(undefined);
  const [sectionDetail, setSectionDetail] = useState(undefined);

  if (!items.length) {
    return (
      <EmptySections
        heading={"No result"}
        action={() => {}}
        content={"TEst"}
      />
    );
  }

  return (
    <InlineGrid columns={columns} gap={600}>
      {
        items.map(item => {
          if (sectionDetail?.entity_id == item.entity_id && item !== sectionDetail) {
            item = sectionDetail;
          }
          return <ProductCard key={item.entity_id} item={item} setSection={setSection} setIsShowPopup={setIsShowPopup} setIsShowPopupInstall={setIsShowPopupInstall} />
        })
      }

      <ModalProduct section={section} setSectionDetail={setSectionDetail} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
      <ModalInstall section={section} setSectionDetail={setSectionDetail} isShowPopup={isShowPopupInstall} setIsShowPopup={setIsShowPopupInstall} />
    </InlineGrid>
  );
}

export default memo(ProductList);