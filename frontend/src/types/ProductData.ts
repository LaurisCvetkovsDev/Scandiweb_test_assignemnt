export type ProductData = {
    id: string;
    name: string;
    description: string;
    inStock: boolean;
    category: string;
    prices: {
      amount: number;
      currency: {
        label: string;
        symbol: string;
      };
    }[];
    gallery: string[];
    attributes: {
      name: string;
      type: string;
      items: {
        id: string;
        value: string;
        displayValue?: string;
      }[];
    }[];
    selectedAttributes?: {
      [key: string]: string;
    };
  };
  