import { useEffect } from "react";
import { useDataStore } from "../store";
import "../styles/ProductGrid.css";
import ProductGridCard from "../components/ProductGridCard";

const ProductGrid = () => {
  const setProduct = useDataStore((state) => state.setProduct);

  const products = useDataStore((state) => state.products);
  const setAllProducts = useDataStore((state) => state.setAllProducts);
  const Location = window.location.pathname;

  useEffect(() => {
    setProduct("");
  }, []);

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  const displayProducts =
    Location !== "/all"
      ? products.filter((product) => "/" + product.category === Location)
      : products;

  const getCategoryTitle = () => {
    if (Location === "/clothes") return "CLOTHES";
    if (Location === "/tech") return "TECH";
    if (Location === "/all") return "ALL";
    return "CATEGORY";
  };

  return (
    <div className="product-grid-root">
      <div className="product-grid-container">
        <h1 className="product-grid-title">{getCategoryTitle()}</h1>
        <div className="product-grid-list">
          {displayProducts.map((item) => (
            <ProductGridCard key={item.id} item={item}></ProductGridCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
