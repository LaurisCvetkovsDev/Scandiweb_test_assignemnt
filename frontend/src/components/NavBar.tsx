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
      <nav
        style={{
          background: "white",
          padding: "20px 40px",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1999,
            }}
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Sidebar */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "400px",
              backgroundColor: "white",
              zIndex: 2000,
              transform: cartOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            <Cart onClose={() => setCartOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
