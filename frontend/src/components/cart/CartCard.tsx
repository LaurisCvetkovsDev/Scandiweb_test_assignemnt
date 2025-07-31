import React from "react";
import { ProductData } from "../../types/ProductData";

type Props = {
  product: ProductData;
  index: number;
  quantity: number;
  getQuantity: (index: number) => number;
  toKebabCase: (str: string) => string;
  updateQuantity: (index: number, quantity: number) => void;
  getSelectedAttributeValue: (index: number, attrName: string) => any;
  handleSelect: (index: number, attrName: string, itemId: string) => void;
};

const CartCard: React.FC<Props> = ({
  product,
  index,
  toKebabCase,
  updateQuantity,
  getSelectedAttributeValue,
  handleSelect,
  getQuantity,
}) => {
  return (
    <div key={`${product.id}-${index}`} className="cart-item">
      <div className="cart-item-content">
        <div className="cart-item-header">
          <h3 className="cart-item-title">{product.name}</h3>
        </div>

        <div className="cart-item-price">
          <span>
            {product.prices[0]?.currency.symbol}
            {product.prices[0]?.amount.toFixed(2)}
          </span>
        </div>

        {product.attributes.map((attr) => {
          const selectedItem = getSelectedAttributeValue(index, attr.name);
          return (
            <div
              key={attr.name}
              className="cart-attribute"
              data-testid={`cart-item-attribute-${toKebabCase(attr.name)}`}
            >
              <div className="cart-attribute-title">{attr.name}:</div>
              <div className="cart-attribute-options">
                {attr.items.map((item) => {
                  const isColor = attr.name.toLowerCase() === "color";
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      data-testid={
                        isSelected
                          ? `cart-item-attribute-${toKebabCase(
                              attr.name
                            )}-${toKebabCase(item.value)}-selected`
                          : `cart-item-attribute-${toKebabCase(
                              attr.name
                            )}-${toKebabCase(item.value)}`
                      }
                      onClick={() => handleSelect(index, attr.name, item.id)}
                      className={
                        isColor
                          ? `cart-color-option ${isSelected ? "selected" : ""}`
                          : `cart-text-option ${isSelected ? "selected" : ""}`
                      }
                      style={isColor ? { backgroundColor: item.value } : {}}
                    >
                      {!isColor && item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-quantity-controls">
        <button
          data-testid="cart-item-amount-decrease"
          onClick={() => updateQuantity(index, getQuantity(index) - 1)}
          className="cart-quantity-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 8H12"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span data-testid="cart-item-amount" className="cart-quantity-display">
          {getQuantity(index)}
        </span>

        <button
          data-testid="cart-item-amount-increase"
          onClick={() => updateQuantity(index, getQuantity(index) + 1)}
          className="cart-quantity-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 4V12M4 8H12"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="cart-item-image">
        <img src={product.gallery[0]} alt={product.name} />
      </div>
    </div>
  );
};

export default CartCard;
