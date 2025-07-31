import React from "react";
import { useDataStore } from "../store";
import { ProductData } from "../types/ProductData";
import { Link } from "react-router-dom";
import "../styles/ProductGrid.css";

type itemData = {
  item: ProductData;
};

const ProductCard = ({ item }: itemData) => {
  const addToCart = useDataStore((state) => state.addToCart);

  const toKebabCase = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const cartItem = {
      ...product,
      attributes: product.attributes || [],
    };
    addToCart(cartItem);
  };

  return (
    <div
      key={item.id}
      data-testid={`product-${toKebabCase(item.name)}`}
      className={`product-card${!item.inStock ? " out-of-stock" : ""}`}
    >
      {item.inStock ? (
        <Link to={`/Detail/${item.id}`} className="product-card-link">
          <div className="product-card-image-wrapper">
            <img
              className="product-card-image"
              src={item.gallery[0]}
              alt={item.name}
            />
            <div className="product-cart-button">
              <button
                className="product-cart-btn"
                onClick={(e) => handleAddToCart(e, item)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="product-card-content">
            <h3 className="product-card-name">{item.name}</h3>
            <p className="product-card-price">
              {item.prices[0]?.currency.symbol}
              {item.prices[0]?.amount.toFixed(2)}
            </p>
          </div>
        </Link>
      ) : (
        <Link to={`/Detail/${item.id}`} className="product-card-link">
          <div className="product-card-image-wrapper">
            <img
              className="product-card-image"
              src={item.gallery[0]}
              alt={item.name}
            />
            <div className="product-card-out-of-stock-overlay">
              OUT OF STOCK
            </div>
          </div>
          <div className="product-card-content">
            <h3 className="product-card-name">{item.name}</h3>
            <p className="product-card-price">
              {item.prices[0]?.currency.symbol}
              {item.prices[0]?.amount.toFixed(2)}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ProductCard;
