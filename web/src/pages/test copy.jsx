import { Page, Button, Link, Text, Card, Box } from "@shopify/polaris";
import {gql, useQuery, useMutation} from "@apollo/client";
import { useEffect, useCallback } from "react";
import {useNavigate} from '@shopify/app-bridge-react';

const graphQlGet = gql`
    query Get($name: String!) {
        getSection(name: $name) {
            name
            price
            src
            plan_need_subscribe
            is_show_install
            is_show_purchase
            is_show_plan
        }
    }
`;

const graphQlUpdate = gql`
    mutation Update($theme_id: String!, $asset: String!, $value: String!) {
        updateAsset(theme_id: $theme_id, asset: $asset, value: $value) {
            key
            value
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

const graphQlRedirectPurchase = gql`
    mutation Purchase($name: String!, $amount: Float) {
        redirectBillingUrl(name: $name, amount: $amount) {
            message
            status
        }
    }
`;

const graphQlCancelPlan = gql`
    mutation Cancel($name: String!) {
        cancelPlan(name: $name) {
            message
            status
        }
    }
`;

function Test() {
    const themeId = 139041046779;
    const { data, loading, error } = useQuery(graphQlGet, {
        fetchPolicy: "cache-and-network",
        variables: {
            name: 'About 02'
        }
    });

    const [updateAction, { data:data1, loading:loading1, error:error1 }] = useMutation(graphQlUpdate);
    const [deleteAction, { data:data2, loading:loading2, error:error2 }] = useMutation(graphQlDelete);
    const [redirectPlan, { data:data3, loading:loading3, error:error3 }] = useMutation(graphQlRedirectPurchase);
    const [redirectPurchase, { data:data4, loading:loading4, error:error4 }] = useMutation(graphQlRedirectPurchase);
    const [cancelPlan, { data:data5, loading:loading5, error:error5 }] = useMutation(graphQlCancelPlan);

    const handleUpdate = useCallback(async () => {
        await updateAction({ 
            variables: {
                theme_id: themeId,
                asset: data.getSection?.src,
                value: ''
            }
         });
    }, [data]);

    const handleDelete = useCallback(async () => {
        await deleteAction({ 
            variables: {
                theme_id: themeId,
                asset: data.getSection?.src
            }
         });
    }, [data]);

    const handlePlan = useCallback(async () => {
        await redirectPlan({ 
            variables: {
                name: data.getSection?.plan_need_subscribe
            }
         });
    }, [data]);

    const handlePurchase = useCallback(async () => {
        await redirectPurchase({ 
            variables: {
                name: data.getSection?.name,
                amount: data.getSection?.price
            }
         });
    }, [data]);

    const handleCancel = useCallback(async () => {
        await cancelPlan({ 
            variables: {
                name: data.getSection?.plan_need_subscribe
            }
         });
    }, [data]);

    return (
        <Page>
            <Card>
                {!loading && <Text>{data.getSection?.name} -- {data.getSection?.price}$</Text>}
            </Card>

            {!loading && 
                <Box>
                    <Button onClick={handleUpdate} loading={loading1} tone={!data.getSection?.is_show_install ? "critical" : ""}>Install</Button>
                    <Button onClick={handleDelete} loading={loading2}>Uninstall</Button>

                    <Button onClick={handlePlan} loading={loading3} tone={!data.getSection?.is_show_plan ? "critical" : ""}>Plan</Button>
                    <Button onClick={handlePurchase} loading={loading4} tone={!data.getSection?.is_show_purchase ? "critical" : ""}>Purchase</Button>
                    <Button onClick={handleCancel} loading={loading5} tone={data.getSection?.is_show_plan ? "critical" : ""}>Cancel</Button>
                </Box>
            }
        </Page>
    );
}

export default Test;