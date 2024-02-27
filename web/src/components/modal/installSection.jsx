import {InlineGrid, ExceptionList, Modal, OptionList, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs, Text, Tooltip} from '@shopify/polaris';
import {useCallback, memo, useState, useMemo} from 'react';
import {NoteIcon} from '@shopify/polaris-icons';
import {gql, useQuery, useMutation} from "@apollo/client";
import { WrenchIcon } from '@shopify/polaris-icons';

const graphQlUpdate = gql`
  mutation Update($theme_id: String!, $asset: String!, $value: String!) {
    updateAsset(theme_id: $theme_id, asset: $asset, value: $value) {
      key
      value
      errors
    }
  }
`;
const graphQlDelete = gql`
  mutation Delete($theme_id: String!, $asset: String!) {
    deleteAsset(theme_id: $theme_id, asset: $asset) {
      message
    }
  }
`;

function ModalInstallSection({currentProduct, themes, isShowPopup, setIsShowPopup, setBannerAlert}) {
  const [selected, setSelected] = useState([]);
  const [updateAction, { data:data1, loading:loading1, error:error1 }] = useMutation(graphQlUpdate);
  const [deleteAction, { data:data2, loading:loading2, error:error2 }] = useMutation(graphQlDelete);
  const handleChange = useCallback(() => setIsShowPopup(!isShowPopup), [isShowPopup]);

  var result = useMemo(() => {
    return themes.reduce((acc, theme) => {
      var existingTitle = acc.find(item => item.title == 'Role: ' + theme.role);
      if (!existingTitle) {
        acc.push({
          title: 'Role: ' + theme.role,
          options: [{ value: theme.id, label: theme.name }]
        });
      } else {
        existingTitle.options.push({ value: theme.id, label: theme.name });
      }
      return acc;
    }, []);
  }, [themes]);

  const handleUpdate = useCallback(async () => {
    await updateAction({ 
      variables: {
        theme_id: selected[0],
        asset: currentProduct?.src,
        value: ''
      }
    });

    handleChange();
    if (data1?.updateAsset?.errors) {
      setBannerAlert({
        'title': 'Error! An error occurred. Please try again later',
        'tone': 'critical',
        'content': data1.updateAsset.errors
      });
    } else {
      setBannerAlert({
        'title': 'This section has been successfully installed! 🎉',
        'tone': 'success',
        'action': {content: 'Customize', icon: WrenchIcon}
      });
    }
  }, [selected]);

  const handleDelete = useCallback(async () => {
    await deleteAction({ 
      variables: {
        theme_id: selected[0],
        asset: currentProduct?.src
      }
    });

    handleChange();
    if (data2?.updateAsset?.errors) {
      setBannerAlert({
        'title': 'Error! An error occurred. Please try again later',
        'tone': 'critical',
        'content': data2.updateAsset.errors
      });
    }
  }, [selected]);

  return (
    themes &&
    <Modal
      open={isShowPopup}
      onClose={handleChange}
      title={"All themes in your Store"}
      primaryAction={{
        content: 'Reinstall section',
        onAction: () => handleUpdate(),
        disabled: !selected.length,
        loading: loading1
      }}
      secondaryActions={[
        {
          content: 'Uninstall section',
          destructive: true,
          onAction: () => handleDelete(),
          disabled: !selected.length,
          loading: loading2
        },
      ]}
    >
    <Modal.Section>
      <InlineGrid>
        <ExceptionList
          items={[
            {
              icon: NoteIcon,
              description:
                'This customer is awesome. Make sure to treat them right!',
            },
          ]}
        />
        <OptionList
          onChange={setSelected}
          sections={result}
          selected={selected}
        />
      </InlineGrid>
    </Modal.Section>
    </Modal>
  );
}

export default memo(ModalInstallSection);