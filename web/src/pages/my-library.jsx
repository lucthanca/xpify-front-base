import { Box, Button, InlineGrid, InlineStack, Layout, OptionList, Page, Popover, Text } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionCollection from '~/components/SectionCollection';
import GroupCollection from '~/components/GroupCollection';
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import Footer from '~/components/block/footer';

const defaultSelected = 'simple';
const options = [
  {value: 'simple', label: 'Sections'},
  {value: 'group', label: 'Groups'}
];

function MyLibrary() {
  const initialized = useRef(false);
  const [popoverActive, setPopoverActive] = useState(false);
  const [pageActivea, setPageActive] = useState(undefined);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const togglePopoverActive = useCallback(() => {
    setPopoverActive((popoverActive) => !popoverActive);
  }, []);
  const [selected, setSelected] = useState(() => {
    // If the type is in the search params, and it's a valid type, use it.
    if (searchParams.has('type') && options.some(option => option.value === searchParams.get('type'))) {
      return [searchParams.get('type')];
    }
    return [defaultSelected];
  });
  const handleChangeViewType = useCallback((type) => {
    if (!type?.[0]) return;
    setSelected(type);

    searchParams.set('type', type[0]);
    setSearchParams(searchParams);
  }, [searchParams])

  useEffect(() => {
    setPopoverActive(false);
  }, [selected]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    const type = searchParams.get('type');
    if (!type && selected?.[0] !== undefined) {
      setSelected([defaultSelected]);
      return;
    }
    if (type != selected[0]) {
      setSelected([type]);
    }
  }, [searchParams]);

  const pageActive = useMemo(() => {
    if (selected == 'simple') {
      return <SectionCollection />;
    } else {
      return <GroupCollection />;
    }
  }, [selected]);

  const activator = useMemo(() => {
    return <Button onClick={togglePopoverActive} variant='tertiary' size='large' disclosure>
      {options.find(item => item.value === selected[0])?.label}
    </Button>;
  }, [selected, togglePopoverActive]);

  return (
    <Page
      title='My library:'
      titleMetadata={
        <div className='popover-header'>
          <Popover
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
          >
            <OptionList
              onChange={handleChangeViewType}
              options={options}
              selected={selected}
            />
          </Popover>
        </div>
      }
      fullWidth
    >
      <Layout>
        {pageActive}
      </Layout>
      <Footer />
    </Page>
  );
}

export default MyLibrary;
