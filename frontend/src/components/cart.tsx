import { useDataStore } from "../store";
import { useState } from "react";
import { createOrder } from "../services/fetch";

interface CartProps {
  onClose: () => void;
}

const Cart = ({ onClose }: CartProps) => {
  const cart = useDataStore((state) => state.cart);
  const removeFromCart = useDataStore((state) => state.removeFromCart);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getQuantity = (index: number) => quantities[index] || 1;

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
            const selectedItem = attr.items[0];
            return {
              attributeId: attr.name,
              value: selectedItem.value,
            };
          }) || [],
      }));

      const order = await createOrder({
        products: orderItems,
      });

      removeFromCart(0);
      setQuantities({});

      alert("Order placed successfully! Order ID: " + order.id);
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

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "700",
            color: "#333",
          }}
        >
          My Bag
          <span style={{ fontWeight: "500", marginLeft: "8px" }}>
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
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

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#666",
            }}
          >
            Your bag is empty
          </div>
        ) : (
          cart.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              style={{
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "20px",
                marginBottom: "20px",
                display: "flex",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    {product.name}
                  </h3>

                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    data-testid={`cart-btn`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      marginLeft: "8px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
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

                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#333",
                    }}
                  >
                    {product.prices[0]?.currency.symbol}
                    {product.prices[0]?.amount.toFixed(2)}
                  </span>
                </div>

                {product.attributes.map((attr) => (
                  <div
                    key={attr.name}
                    style={{ marginBottom: "12px" }}
                    data-testid={`cart-item-attribute-${toKebabCase(
                      attr.name
                    )}`}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        marginBottom: "8px",
                        color: "#333",
                      }}
                    >
                      {attr.name}:
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {attr.items.map((item) => {
                        const isColor = attr.name.toLowerCase() === "color";
                        const isSelected = true;
                        return (
                          <div
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
                            style={{
                              ...(isColor
                                ? {
                                    width: "32px",
                                    height: "32px",
                                    backgroundColor: item.value,
                                    border: "1px solid #ccc",
                                    borderRadius: "3px",
                                  }
                                : {
                                    padding: "8px 16px",
                                    border: "1px solid #333",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    backgroundColor: "#333",
                                    color: "white",
                                  }),
                            }}
                          >
                            {!isColor && item.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <button
                    data-testid="cart-item-amount-decrease"
                    onClick={() =>
                      updateQuantity(index, getQuantity(index) - 1)
                    }
                    style={{
                      border: "1px solid #333",
                      borderRadius: "4px",
                      width: "32px",
                      height: "32px",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
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
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {getQuantity(index)}
                  </span>

                  <button
                    data-testid="cart-item-amount-increase"
                    onClick={() =>
                      updateQuantity(index, getQuantity(index) + 1)
                    }
                    style={{
                      border: "1px solid #333",
                      borderRadius: "4px",
                      width: "32px",
                      height: "32px",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
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

              <div
                style={{
                  width: "120px",
                  height: "120px",
                  flexShrink: 0,
                }}
              >
                <img
                  src={product.gallery[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Total
          </span>
          <span
            data-testid="cart-total"
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#333",
            }}
          >
            ${getTotalPrice()}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={cart.length === 0 || isPlacingOrder}
          style={{
            width: "100%",
            backgroundColor:
              cart.length > 0 && !isPlacingOrder ? "#4ade80" : "#ccc",
            color: "white",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "uppercase",
            borderRadius: "4px",
            border: "none",
            cursor:
              cart.length > 0 && !isPlacingOrder ? "pointer" : "not-allowed",
          }}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
