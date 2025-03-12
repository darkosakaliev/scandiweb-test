import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
      __typename
      products {
        id
        name
        inStock
        gallery
        attrs {
          id
          name
          type
          items {
            id
            value
            display_value
          }
        }
        prices {
          amount
          currency {
            label
            symbol
          }
        }
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      name
      products {
        id
        name
        inStock
        gallery
        attrs {
          id
          name
          type
          items {
            id
            value
            display_value
          }
        }
        prices {
          amount
          currency {
            label
            symbol
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      attrs {
        id
        name
        type
        items {
          id
          value
          display_value
        }
      }
      prices {
        amount
        currency {
          label
          symbol
        }
      }
    }
  }
`;
