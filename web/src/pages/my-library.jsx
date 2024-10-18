import { Button, Layout, OptionList, Page, Popover } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionCollection from '~/components/SectionCollection';
import { useSearchParams } from 'react-router-dom';
import { SECTION_TYPE_SIMPLE, SECTION_TYPE_GROUP } from '~/constants';

const defaultSelected = 'simple';
const options = [
  {value: 'simple', label: 'Sections'},
  {value: 'group', label: 'Groups'}
];
const TYPE_MAPPING = {
  simple: SECTION_TYPE_SIMPLE,
  group: SECTION_TYPE_GROUP,
}

function MyLibrary() {
  const initialized = useRef(false);
  const [popoverActive, setPopoverActive] = useState(false);
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
    >
      <Layout>
        <SectionCollection type={TYPE_MAPPING[selected]} owned={true} pageSize={null} />
      </Layout>
    </Page>
  );
}

export default MyLibrary;
