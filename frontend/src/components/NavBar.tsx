import { Link } from "react-router-dom";
import Cart from "./cart.tsx";
import { useDataStore } from "../store";

const NavBar = () => {
  const cart = useDataStore((state) => state.cart);
  const cartOpen = useDataStore((state) => state.cartOpen);
  const setCartOpen = useDataStore((state) => state.setCartOpen);

  // Подсчет общего количества товаров (для badge)
  const getTotalItemsCount = () => {
    return cart.length; // Для простоты показываем количество уникальных товаров
  };

  return (
    <>
      <nav>
        <div>
          {/* Left Navigation */}
          <div>
            <Link to="/" data-testid="category-link">
              ALL
            </Link>
            <Link to="/clothes" data-testid="category-link">
              CLOTHES
            </Link>
            <Link to="/tech" data-testid="category-link">
              TECH
            </Link>
          </div>

          {/* Right Cart */}
          <div>
            <button data-testid="cart-btn" onClick={() => setCartOpen(true)}>
              Cart ({getTotalItemsCount()})
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      {cartOpen && (
        <div data-testid="cart-overlay">
          {/* Backdrop */}
          <div onClick={() => setCartOpen(false)} />

          {/* Cart Sidebar */}
          <div>
            <Cart onClose={() => setCartOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
