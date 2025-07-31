type footerProps = {
  getTotalPrice: () => string;
  handlePlaceOrder: () => void;
  cart: any[];
  isPlacingOrder: boolean;
  allAttributesSelected: boolean;
};

const CartFooter = ({
  getTotalPrice,
  handlePlaceOrder,
  cart,
  isPlacingOrder,
  allAttributesSelected,
}: footerProps) => {
  return (
    <div className="cart-footer">
      <div className="cart-total-section">
        <span className="cart-total-label">Total</span>
        <span data-testid="cart-total" className="cart-total-amount">
          ${getTotalPrice()}
        </span>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={cart.length === 0 || isPlacingOrder || !allAttributesSelected}
        className="cart-place-order-button"
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CartFooter;
