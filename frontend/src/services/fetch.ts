import { ProductData } from "../types/ProductData";

//const GRAPHQL_ENDPOINT = "http://localhost/scandiFinal/NewBackend2/fullstack-test-starter/public/";
const GRAPHQL_ENDPOINT = "https://laucve1.dreamhosters.com/scandiFinal/NewBackend2/fullstack-test-starter/public/";

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

// Получить все категории
export const fetchProduct = async (id: string): Promise<ProductData | null> => {
  try {
    const products = await fetchProducts();
    const product = products.find(p => p.id === id);
    return product || null;
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
};

// Получить продукты по категории (фильтруем на фронтенде)
export const fetchProductsByCategory = async (category: string): Promise<ProductData[]> => {
  try {
    const products = await fetchProducts();
    if (category === 'all') {
      return products;
    }
    return products.filter(p => p.category === category);
  } catch (error) {
    console.error("Fetch products by category error:", error);
    return [];
  }
};

// Получить все продукты
export const fetchProducts = async (): Promise<ProductData[]> => {
  const query = `
    {
      products {
        id
        name
        brand
        description
        inStock
        category
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        gallery
        attributes {
          id
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

// Создать заказ
export const createOrder = async (orderData: {
  products: Array<{
    id: string;
    quantity: number;
    selectedAttributes: Array<{
      attributeId: string;
      value: string;
    }>;
  }>;
}): Promise<any> => {
  const mutation = `
    mutation PlaceOrder($input: OrderInput!) {
      placeOrder(input: $input) {
        success
        message
        orderId
      }
    }
  `;

  try {
    const data = await graphqlRequest(mutation, { input: orderData });
    return data.placeOrder;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};