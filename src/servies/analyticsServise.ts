import { AnalyticsVariables, Vendor } from "@/app/abstraction/types";
import { $getFromLocal } from "@/app/helpers/helpers";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "https://analyticsapi.menasa.io/",
    cache: new InMemoryCache(),

    headers: {
      Authorization: "Bearer " + ($getFromLocal("vendor") as Vendor).apiKey,
    },
  });
};

function fetchData(query: any, variables: AnalyticsVariables): Promise<any> {
  const client = createApolloClient();
  return new Promise((resolve, reject) => {
    client
      .query({ query, variables })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.error({ AnalyticsErr: err });

        reject({ err });
      });
  });
}

export function _getProducts(variables: AnalyticsVariables) {
  return fetchData(ORDERS_QUERY, variables);
}

const ORDERS_QUERY = gql`
  query Docs(
    $limit: Int
    $page: Int
    $sortBy: [OrderSortByInput]
    $query: OrderQueryInput
    $interval: String
  ) {
    orders(limit: $limit, page: $page, sortBy: $sortBy, query: $query, interval: $interval) {
      totalDocs
      docs {
        deliveryFee
        origin
        orderType
        subTotal
        createdAt
        paymentMethod
        status
        total
        orderRef
        id
        source

        paid
        extraFees {
          name
          amount
        }

        customer {
          image
          id
          email
          phone
          name
        }

        address {
          country
          street

          province
          floor
          building
          block
          avenue
          area
        }

        cart {
          quantity
          total
          cartItems {
            image
            name
            cost
            originalPrice
            price
            category {
              name
            }
          }
        }

        campaign {
          id
        }
      }
    }
  }
`;
