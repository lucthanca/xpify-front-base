import { Page, Button, Link, Text, Card, Box } from "@shopify/polaris";
import {gql, useQuery, useMutation} from "@apollo/client";
import { useEffect, useCallback } from "react";
import {useNavigate} from '@shopify/app-bridge-react';
import Gallery from '~/components/splide/gallery';

const graphQlGet = gql`
    query Get($theme_id: String!, $asset: String!) {
        getAsset(theme_id: $theme_id, asset: $asset) {
            key
            value
        }
    }
`;

const graphQlGetSection = gql`
    query Get($key: String!) {
        getSection(key: $key) {
            name
            url_key
            price
            src
            images {
                src
            }
        }
    }
`;

const graphQlGetTheme = gql`
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
                name
                price
                src
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

const graphQlRedirectPurchase = gql`
    mutation Purchase($name: String!, $interval: PricingPlanInterval!, $is_plan: Boolean!) {
        redirectBillingUrl(name: $name, interval: $interval, is_plan: $is_plan) {
            message
            status
        }
    }
`;

const graphQlCancelPlan = gql`
    mutation Cancel($name: String!) {
        cancelPlan(name: $name) {
            message
            tone
        }
    }
`;

function Test() {
    const themeId = 139041046779;
    const { data, loading, error } = useQuery(graphQlGetSection, {
        fetchPolicy: "cache-and-network",
        variables: {
            key: 'about-03' 
        }
    });
    // const { data:themes, loading:themeLoading, error:themeError } = useQuery(graphQlGetTheme, {
    //     fetchPolicy: "cache-and-network",
    //     variables: {
    //         filter: {
    //             category_id: [1]
    //         }
    //     }
    // });
    
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
                name: 'pro',
                interval: 'EVERY_30_DAYS',
                is_plan: true
            }
         });
    }, [data]);

    const handlePurchase = useCallback(async () => {
        await redirectPurchase({ 
            variables: {
                name: data.getSection?.url_key,
                interval: 'ONE_TIME',
                is_plan: false
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

                    <Button onClick={handlePlan} loading={loading3} tone={!data.getSection?.is_show_plan ? "critical" : ""}>Plan {data.getSection?.plan_need_subscribe}</Button>
                    <Button onClick={handlePurchase} loading={loading4} tone={!data.getSection?.is_show_purchase ? "critical" : ""}>Purchase</Button>
                    <Button onClick={handleCancel} loading={loading5} tone={data.getSection?.is_show_plan ? "critical" : ""}>Cancel Plan {data.getSection?.plan_need_subscribe}</Button>
                </Box>
            }

            <Gallery />
        </Page>
    );
}

export default Test;