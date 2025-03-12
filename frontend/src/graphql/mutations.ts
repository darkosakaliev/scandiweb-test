import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
  mutation PlaceOrder($order: [Order]!) {
    placeOrder(order: $order) {
      message
    }
  }
`;
