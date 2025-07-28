export type OrderData = {
    products: Array<{
      id: string;
      quantity: number;
      selectedAttributes: Array<{
        attributeId: string;
        value: string;
      }>;
    }>}