import { create } from 'zustand';
import { ProductData } from '../types/ProductData';
import { fetchProducts, fetchProduct, fetchProductsByCategory } from '../services/fetch';

type DataStore = {
  cart: ProductData[];
  addToCart: (product: ProductData) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  products: ProductData[];
  loading: boolean;
  setAllProducts: () => Promise<void>;
  setProductsByCategory: (category: string) => Promise<void>;

  product: ProductData | null;
  setProduct: (id: string) => Promise<void>;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
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
  loading: false,
  setAllProducts: async () => {
    set({ loading: true });
    const data = await fetchProducts();
    set({ products: data, loading: false });
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

  cartOpen: false,
  setCartOpen: (open: boolean) => {
    set({ cartOpen: open });
  },
}));
