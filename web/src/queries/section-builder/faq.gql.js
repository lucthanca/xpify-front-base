import { gql } from '@apollo/client';

export const FAQS_QUERY = gql`
  query Get {
    getFaqs {
      entity_id
      is_enable
      title
      content
    }
  }
`;