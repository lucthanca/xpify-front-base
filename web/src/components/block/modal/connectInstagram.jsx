import {BlockStack, InlineError, LegacyStack, Modal, Text, TextContainer, TextField} from '@shopify/polaris';
import {useCallback, useState} from "react";
import {connectInstagramGql, disconnectInstagramGql} from "~/queries/section-builder/connectInstagram.gql";
import {useMutation} from "@apollo/client";
import {useToast} from "@shopify/app-bridge-react";

const ConnectPopup = ({active, toggleModal, connected}) => {
    const toast = useToast();
    const [connectInst, {data: dataConnect, loading: loadingConncet}] = useMutation(connectInstagramGql)
    const [disconnectInst, {data: dataDisconnect, loading: loadingDisconncet}] = useMutation(disconnectInstagramGql)
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = useCallback((newValue) => {
        setValue(newValue);
        setErrorMessage('')
    }, [],);

    return (<Modal
        // activator={activator}
        open={active}
        onClose={toggleModal}
        title={connected ? "Disconnect" : "Connect with your Instagram"}
        primaryAction={!connected ? {
            loading: loadingConncet,
            content: 'Connect', onAction: () => {
                if (!value) {
                    setErrorMessage('Token is required!')
                } else {
                    connectInst({
                        variables: {
                            token: value
                        }
                    }).then(res => {
                        if (res.data?.addInstagramToken?.actions?.connected) {
                            toast.show('Connected')
                            toggleModal()
                        } else {
                            if (errorMessage.length === 0) setErrorMessage('It is not possible to connect to your instagram account with this token!')
                        }
                    })
                }
            },
        } : {
            loading: loadingDisconncet,
            destructive: true, content: 'Disconnect',
            onAction: () => {
                disconnectInst({
                    variables: {
                        key: 'instagram-feeds'
                    }
                }).then(res => {
                    toast.show('Disconnected')
                    toggleModal()
                })
            }
        }}
        secondaryActions={connected ? [
            {
                content: 'Cancel',
                onAction: () => {
                    toggleModal();
                }
            }
        ] : undefined}
    >
        <Modal.Section>
            {!connected ? (<LegacyStack vertical>
                <LegacyStack.Item>
                    <TextField
                        id="token"
                        label="Your token"
                        value={value}
                        onChange={handleChange}
                        requiredIndicator
                        autoComplete="off"
                    />
                </LegacyStack.Item>
                <div>
                    <InlineError message={errorMessage} fieldID="token"/>
                </div>
                <BlockStack gap='400'>
                    <BlockStack gap='100'>
                        <Text>To use our section Instagram Feeds and connect it to your Instagram account, please
                            provide your Instagram
                            token. The token is a unique string of characters that helps authenticate and protect your
                            account. Please enter the token in the "Your Token" field above to complete the connection
                            process.</Text>
                    </BlockStack>
                </BlockStack>
            </LegacyStack>) : (
                <BlockStack gap='400'>
                    <BlockStack gap='100'>
                        <Text>Do you really want to disconnect Instagram Feeds from your Instagram?</Text>
                        <Text>If you want to use the Instagram Feeds section, you need to connect to your Instagram
                            account.</Text>
                    </BlockStack>
                </BlockStack>
            )}
        </Modal.Section>
    </Modal>);
}

export default ConnectPopup;
