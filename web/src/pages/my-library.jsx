import { Box, Button, InlineGrid, InlineStack, Layout, OptionList, Page, Popover, Text } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import SectionCollection from '~/components/SectionCollection';
import GroupCollection from '~/components/GroupCollection';
import { useNavigate, createSearchParams } from 'react-router-dom';

const defaultSelected = 'simple';
const options = [
  {value: 'simple', label: 'Simple Sections'},
  {value: 'group', label: 'Group Sections'}
];

function MyLibrary() {
  const [selected, setSelected] = useState([defaultSelected]);
  const [popoverActive, setPopoverActive] = useState(false);
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
  }, [selected]);

  const activator = (
    <Button onClick={togglePopoverActive} variant='tertiary' size='large' disclosure>
      {selected}
    </Button>
  );

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

        {
          selected == defaultSelected
          ? <SectionCollection />
          : <GroupCollection />
        }
      </Layout>
    </Page>
  );
}

export default MyLibrary;
