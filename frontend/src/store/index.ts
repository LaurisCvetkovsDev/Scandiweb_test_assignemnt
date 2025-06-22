import { create } from 'zustand';
import { ProductData } from '../types/ProductData';
import { fetchProducts, fetchProduct, fetchProductsByCategory } from '../services/fetch';

type DataStore = {
  cart: ProductData[];
  addToCart: (product: ProductData) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

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
  removeFromCart: (index: number) => {
    const { cart } = get();
    set({ cart: cart.filter((_, i) => i !== index) });
  },
  clearCart: () => {
    set({ cart: [] });
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
    const data = await fetchProduct(id); 
    set({ product: data });
    
  },
}));
