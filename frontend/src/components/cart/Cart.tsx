import { useDataStore } from "../../store";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/fetch";
import "../../styles/cart.css";
import CartCard from "./CartCard";
import CartFooter from "./CartFooter";

const Cart = () => {
  const cart = useDataStore((state) => state.cart);
  const removeFromCart = useDataStore((state) => state.removeFromCart);
  const clearCart = useDataStore((state) => state.clearCart);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const getQuantity = (index: number) => quantities[index] || 1;

  useEffect(() => {
    console.log("Cart at this moment:");
    console.log(cart);
  }, [cart]);

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
    if (quantity < 1) {
      removeFromCart(index);
    }
    setQuantities((prev) => ({
      ...prev,
      [index]: quantity,
    }));
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
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="cart-empty">Your bag is empty</div>
        ) : (
          cart.map((product, index) => (
            <CartCard
              key={`${product.id}-${index}`}
              product={product}
              index={index}
              quantity={getQuantity(index)}
              toKebabCase={toKebabCase}
              updateQuantity={updateQuantity}
              getSelectedAttributeValue={getSelectedAttributeValue}
              handleSelect={handleSelect}
              getQuantity={getQuantity}
            />
          ))
        )}
      </div>

      <CartFooter
        cart={cart}
        getTotalPrice={getTotalPrice}
        handlePlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
        allAttributesSelected={allAttributesSelected}
      ></CartFooter>
    </div>
  );
};

export default Cart;
