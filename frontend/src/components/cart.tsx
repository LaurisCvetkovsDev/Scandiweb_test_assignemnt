import { useDataStore } from "../store";
import { useState } from "react";
import { createOrder } from "../services/fetch";
import "./cart.css";

interface CartProps {
  onClose: () => void;
}

const Cart = ({ onClose }: CartProps) => {
  const cart = useDataStore((state) => state.cart);
  const removeFromCart = useDataStore((state) => state.removeFromCart);
  const clearCart = useDataStore((state) => state.clearCart);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const getQuantity = (index: number) => quantities[index] || 1;

  const allAttributesSelected = cart.every((product, index) => {
    return product.attributes.every((attr) => {
      const localSelection = selectedAttributes[index]?.[attr.name];
      if (localSelection) {
        return true;
      }

      if (product.selectedAttributes) {
        const selectedAttr = product.selectedAttributes.find(
          (selectedAttr) => selectedAttr.name === attr.name
        );
        return selectedAttr && selectedAttr.items.length > 0;
      }

      return false;
    });
  });

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setQuantities((prev) => ({
      ...prev,
      [index]: quantity,
    }));
  };

  const handleRemoveFromCart = (index: number) => {
    removeFromCart(index);
    setQuantities((prev) => {
      const newQuantities: { [key: number]: number } = {};
      Object.keys(prev).forEach((key) => {
        const keyIndex = parseInt(key);
        if (keyIndex < index) {
          newQuantities[keyIndex] = prev[keyIndex];
        } else if (keyIndex > index) {
          newQuantities[keyIndex - 1] = prev[keyIndex];
        }
      });
      return newQuantities;
    });

    setSelectedAttributes((prev) => {
      const newSelectedAttributes = { ...prev };
      delete newSelectedAttributes[index];
      return newSelectedAttributes;
    });
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, product, index) => {
        const quantity = getQuantity(index);
        const price = product.prices[0]?.amount || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      setIsPlacingOrder(true);

      const orderItems = cart.map((item, index) => ({
        id: item.id,
        quantity: getQuantity(index),
        selectedAttributes:
          item.attributes?.map((attr) => {
            const selectedItemId =
              selectedAttributes[index]?.[attr.name] || attr.items[0]?.id;
            const selectedItem =
              attr.items.find((item) => item.id === selectedItemId) ||
              attr.items[0];
            return {
              attributeId: attr.name,
              value: selectedItem.value,
            };
          }) || [],
      }));

      const order = await createOrder({
        products: orderItems,
      });
      console.log("order Items: " + orderItems);
      console.log("cart items: " + cart);
      console.log(cart.length);

      clearCart();

      setQuantities({});
      setSelectedAttributes({});

      alert("Order placed successfully! Order ID: " + order.orderId);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const toKebabCase = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSelect = (index: number, attrName: string, itemId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [attrName]: itemId,
      },
    }));
  };

  const getSelectedAttribute = (index: number, attrName: string) => {
    const localSelection = selectedAttributes[index]?.[attrName];
    if (localSelection) {
      return localSelection;
    }

    const product = cart[index];
    if (product.selectedAttributes) {
      const selectedAttr = product.selectedAttributes.find(
        (attr) => attr.name === attrName
      );
      if (selectedAttr && selectedAttr.items.length > 0) {
        return selectedAttr.items[0].id;
      }
    }

    return null;
  };

  const getSelectedAttributeValue = (index: number, attrName: string) => {
    const selectedId = getSelectedAttribute(index, attrName);
    if (!selectedId) return null;

    const product = cart[index];
    const attr = product.attributes.find((a) => a.name === attrName);
    if (attr) {
      const item = attr.items.find((item) => item.id === selectedId);
      return item || attr.items[0];
    }
    return null;
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">
          My Bag
          <span className="cart-item-count">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </h2>
        <button onClick={onClose} className="cart-close-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 8L3 3M8 8L13 13M8 8L13 3M8 8L3 13"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="cart-empty">Your bag is empty</div>
        ) : (
          cart.map((product, index) => (
            <div key={`${product.id}-${index}`} className="cart-item">
              <div className="cart-item-content">
                <div className="cart-item-header">
                  <h3 className="cart-item-title">{product.name}</h3>

                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    data-testid={`cart-btn`}
                    className="cart-remove-button"
                    title="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 8L3 3M8 8L13 13M8 8L13 3M8 8L3 13"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="cart-item-price">
                  <span>
                    {product.prices[0]?.currency.symbol}
                    {product.prices[0]?.amount.toFixed(2)}
                  </span>
                </div>

                {product.attributes.map((attr) => {
                  const selectedItem = getSelectedAttributeValue(
                    index,
                    attr.name
                  );
                  return (
                    <div
                      key={attr.name}
                      className="cart-attribute"
                      data-testid={`cart-item-attribute-${toKebabCase(
                        attr.name
                      )}`}
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
                              onClick={() =>
                                handleSelect(index, attr.name, item.id)
                              }
                              className={
                                isColor
                                  ? `cart-color-option ${
                                      isSelected ? "selected" : ""
                                    }`
                                  : `cart-text-option ${
                                      isSelected ? "selected" : ""
                                    }`
                              }
                              style={
                                isColor ? { backgroundColor: item.value } : {}
                              }
                            >
                              {!isColor && item.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="cart-quantity-controls">
                  <button
                    data-testid="cart-item-amount-decrease"
                    onClick={() =>
                      updateQuantity(index, getQuantity(index) - 1)
                    }
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

                  <span
                    data-testid="cart-item-amount"
                    className="cart-quantity-display"
                  >
                    {getQuantity(index)}
                  </span>

                  <button
                    data-testid="cart-item-amount-increase"
                    onClick={() =>
                      updateQuantity(index, getQuantity(index) + 1)
                    }
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
              </div>

              <div className="cart-item-image">
                <img src={product.gallery[0]} alt={product.name} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total-section">
          <span className="cart-total-label">Total</span>
          <span data-testid="cart-total" className="cart-total-amount">
            ${getTotalPrice()}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={
            cart.length === 0 || isPlacingOrder || !allAttributesSelected
          }
          className="cart-place-order-button"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
