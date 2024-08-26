import { gql } from "@apollo/client";

export const connectInstagramGql = gql`
    mutation connectInstagramGql($token: String) {
        addInstagramToken(token: $token) {
            id
            actions {
                connected
            }
        }
    }
`
export const disconnectInstagramGql = gql`
    mutation disconnectInstagramGql($key: String) {
        disconnectInstagram(key: $key) {
            id
            actions {
                connected
            }
        }
    }
`
