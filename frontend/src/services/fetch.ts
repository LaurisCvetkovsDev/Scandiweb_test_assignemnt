import { ProductData } from "../types/ProductData";

// Use the WAMP server GraphQL endpoint
const GRAPHQL_ENDPOINT = "http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql";

// Helper function to make GraphQL requests
const graphqlRequest = async (query: string, variables?: any): Promise<any> => {
  try {
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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

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

// Fetch all products
export const fetchProducts = async (): Promise<ProductData[]> => {
  const query = `
    {
      products {
        id
        name
        description
        inStock
        category
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

// Fetch a single product by ID
export const fetchProduct = async (id: string): Promise<ProductData | null> => {
  const query = `
    query GetProduct($id: String!) {
      product(id: $id) {
        id
        name
        description
        inStock
        category
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

// Fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<ProductData[]> => {
  const query = `
    query GetProductsByCategory($category: String!) {
      productsByCategory(category: $category) {
        id
        name
        description
        inStock
        category
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

// Helper function to get available categories (optional)
export const getAvailableCategories = (): string[] => {
  return ['all', 'tech', 'clothes'];
};

// Helper function to format price display
export const formatPrice = (price: { amount: number; currencySymbol: string }): string => {
  return `${price.currencySymbol}${price.amount.toFixed(2)}`;
};

// Helper function to check if product is available
export const isProductAvailable = (product: ProductData): boolean => {
  return product.inStock;
};