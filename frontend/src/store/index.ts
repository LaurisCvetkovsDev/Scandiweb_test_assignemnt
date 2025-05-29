import { create } from 'zustand';
import { ProductData } from '../types/ProductData';
import { fetchProducts, fetchProduct, fetchProductsByCategory } from '../services/fetch';

type DataStore = {
  cart: ProductData[];
  addToCart: (product: ProductData) => void;

  products: ProductData[];
  setAllProducts: () => Promise<void>;
  setProductsByCategory: (category: string) => Promise<void>;

  product: ProductData | null;
  setProduct: (id: string) => Promise<void>;
};

export const useDataStore = create<DataStore>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const { cart } = get();
    set({ cart: [...cart, product] });
  },

  products: [],
  setAllProducts: async () => {
    const data = await fetchProducts();
    set({ products: data });
  },

  setProductsByCategory: async (category: string) => {
    const data = await fetchProductsByCategory(category);
    set({ products: data });
  },

  product: null,
  setProduct: async (id: string) => {
    console.log(id)
    const data = await fetchProduct(id); 
    set({ product: data });
    
  },
}));
