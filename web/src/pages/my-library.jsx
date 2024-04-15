import { Box, Button, InlineGrid, InlineStack, Layout, OptionList, Page, Popover, Text } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SectionCollection from '~/components/SectionCollection';
import GroupCollection from '~/components/GroupCollection';
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';

const defaultSelected = 'simple';
const options = [
  {value: 'simple', label: 'Simple Sections'},
  {value: 'group', label: 'Group Sections'}
];

function MyLibrary() {
  const [selected, setSelected] = useState([defaultSelected]);
  const [popoverActive, setPopoverActive] = useState(false);
  const [pageActive, setPageActive] = useState(undefined);
  const navigate = useNavigate();

  const togglePopoverActive = useCallback(() => {
    setPopoverActive((popoverActive) => !popoverActive);
  }, []);

  useEffect(() => {
    const nav = {
      pathname: '/my-library',
      search: `?${createSearchParams({type: selected})}`,
    };
    navigate(nav, { replace: true });

    if (selected == defaultSelected) {
      setPageActive(<SectionCollection />);
    } else {
      setPageActive(<GroupCollection />);
    }

    setPopoverActive(false);
  }, [selected]);

  const activator = useMemo(() => {
    return <Button onClick={togglePopoverActive} variant='tertiary' size='large' disclosure>
      {options.find(item => item.value === selected[0])?.label}
    </Button>;
  }, [selected]);

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Box>
            <Popover
              active={popoverActive}
              activator={activator}
              onClose={togglePopoverActive}
            >
              <OptionList
                onChange={setSelected}
                options={options}
                selected={selected}
              />
            </Popover>
          </Box>
        </Layout.Section>

        {pageActive}
      </Layout>
    </Page>
  );
}

export default MyLibrary;
