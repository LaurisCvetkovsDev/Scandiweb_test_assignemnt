import { ProductData } from "../types/ProductData";

// Use the working GraphQL endpoint
const GRAPHQL_ENDPOINT = "http://localhost/scandiFinal/NewBackend/working_graphql.php";

// Helper function to make GraphQL requests
const graphqlRequest = async (query: string, variables?: any): Promise<any> => {
  try {
    console.log("Making GraphQL request to:", GRAPHQL_ENDPOINT);
    console.log("Query:", query);
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("GraphQL result received");

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL error");
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<ProductData[]> => {
  const query = `
    {
      products {
        id
        name
        description
        inStock
        category {
          id
          name
        }
        prices {
          currencyLabel
          currencySymbol
          amount
        }
        gallery {
          url
        }
        attributes {
          name
          type
          items {
            id
            value
            displayValue
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest(query);
    return data.products || [];
  } catch (error) {
    console.error("Fetch products error:", error);
    return [];
  }
};

export const fetchProduct = async (id: string): Promise<ProductData | null> => {
  const query = `
    query GetProduct($id: String!) {
      product(id: "${id}") {
        id
        name
        description
        inStock
        category {
          id
          name
        }
        prices {
          currencyLabel
          currencySymbol
          amount
        }
        gallery {
          url
        }
        attributes {
          name
          type
          items {
            id
            value
            displayValue
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest(query, { id });
    return data.product || null;
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
};

// GraphQL category filtering - now working!
export const fetchProductsByCategory = async (category: string): Promise<ProductData[]> => {
  const query = `
    query GetProductsByCategory($category: String!) {
      productsByCategory(category: "${category}") {
        id
        name
        description
        inStock
        category {
          id
          name
        }
        prices {
          currencyLabel
          currencySymbol
          amount
        }
        gallery {
          url
        }
        attributes {
          name
          type
          items {
            id
            value
            displayValue
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest(query, { category });
    return data.productsByCategory || [];
  } catch (error) {
    console.error("Fetch products by category error:", error);
    return [];
  }
};

// Place order mutation
export const placeOrder = async (orderData: ProductData[], totalAmount: number): Promise<any> => {
  const mutation = `
    mutation PlaceOrder($orderData: String!, $totalAmount: Float!) {
      placeOrder(orderData: $orderData, totalAmount: $totalAmount) {
        id
        success
        message
      }
    }
  `;

  try {
    const data = await graphqlRequest(mutation, { orderData, totalAmount });
    return data.placeOrder;
  } catch (error) {
    console.error("Place order error:", error);
    throw error;
  }
};